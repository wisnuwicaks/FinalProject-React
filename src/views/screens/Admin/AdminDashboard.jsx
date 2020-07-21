import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import Axios from "axios";
import Swal from "sweetalert2";
import {
  Col,
  Form,
  FormGroup,
  InputGroup,
  Navbar,
  Button,
  FormControl,
  ListGroup,
  Pagination,
  Badge,
  Nav,
} from "react-bootstrap";
import Table from "react-bootstrap/Table";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/ButtonUI/ButtonUI";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faShoppingCart,
  faCartPlus,
  faSignInAlt,
  faBorderAll,
  faSearch,
  faSort,
  faRemoveFormat,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons/";

class AdminDashboard extends React.Component {
  state = {
    allSizeIs: ["S", "M", "L", "XL", "XXL"],
    tabPaket: false,
    productList: [],
    sortAsc: true,
    sorted: [],
    arrOfAppStock: [],
    arrOfGudangStock: [],
    indexProductActive: 0,
    arrSizeActive: [],
    checkedbox: {},
    editedIsAllSize: false,
    sizeFormApp: {},
    sizeFormGudang: {},
    reloadIndicator: {
      prevPage: false,
      nextPage: false,
      firstPage: false,
      lastPage: false,
    },
    activePage: 1,
    initPageRange: [1, 2, 3, 4, 5],
    nowPageRange: [1, 2, 3, 4, 5],
  
    editProductEntity: {
      id: 0,
      productName: "",
      price: 0,
      image: "",
    },
    activeProducts: [],
    modalOpen: false,
  };

  onClickCheckBox = (e, field, form) => {
    let { checked } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: checked,
      },
    });
  };

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  sortingProduct = (sortBy) => {
    const { productList, sortAsc } = this.state;
    this.setState({ sortAsc: !this.state.sortAsc });

    let tempArr = [...productList];
    if (sortAsc) {
      tempArr.sort((a, b) =>
        a[sortBy] > b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0
      );
      this.setState({ productList: tempArr });
    } else {
      tempArr.sort((a, b) =>
        a[sortBy] < b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0
      );
      this.setState({ productList: tempArr });
    }
  };
  getProductList = (changeActivePage) => {
    let start = 0;
    let stockAppTemp = [];
    let stockGudangTemp = [];

    if (changeActivePage) {
      start = changeActivePage;
    } else {
      start = this.state.activePage;
    }
    Axios.get(`${API_URL}/products/limit/${start * 10 - 10}/${10}`)
      .then((res) => {
        this.setState({ productList: [...res.data] });
        res.data.forEach((val, indexProduct) => {
          // let objAppStock = {};
          // let objGudangStock = {};
          Axios.get(`${API_URL}/stocks/product_id/${val.id}`)
            .then((resp) => {
              resp.data.forEach((valStock, idx) => {
                let { size, stock } = valStock;
                stockAppTemp[indexProduct] = {
                  ...stockAppTemp[indexProduct],
                  [size]: stock,
                };
              });
            })
            .catch((err) => {
              console.log(err);
            });

          this.setState({ arrOfAppStock: stockAppTemp });

          Axios.get(`${API_URL}/gudang/product_id/${val.id}`)
            .then((resp) => {
           
              resp.data.forEach((valStock, idx) => {
                let { size, stockGudang } = valStock;
                stockGudangTemp[indexProduct] = {
                  ...stockGudangTemp[indexProduct],
                  [size]: stockGudang,
                };
                
              });
            })
            .catch((err) => {
              console.log(err);
            });
          this.setState({ arrOfGudangStock: stockGudangTemp });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteProductHandler = (product) => {
    Axios.get(`${API_URL}/carts/product/${product.id}`)
      .then((res) => {
        if (res.data.length == 0) {
          this.deleteProductNoCart(product);
        } else {
          swal("Error!", "Product has cart active", "error");
        }
        console.log(res);
      })
      .catch((err) => {
        alert("error delete ");

        console.log(err);
      });
  };

  deleteProductNoCart = (product) => {
    const { categories } = product;
    let categoryId = 0;
    if (categories[0]["category"] == "Men") {
      categoryId = 1;
    } else if (categories[0]["category"] == "Women") {
      categoryId = 2;
    } else {
      categoryId = 3;
    }

    Axios.delete(`${API_URL}/products/delete/${product.id}`)
      .then((res) => {
        // alert("Berhasil delete");
        Swal.fire({
          title: "Success Delete Product",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
        console.log(res);
        this.getProductList();
      })
      .catch((err) => {
        alert("error delete ");

        console.log(err);
      });

  };

  renderProductList = () => {
    if (this.state.productList.length == 0) {
      return (
        <td colSpan="6" className="text-center">
          <h5>The End of Product</h5>
        </td>
      );
    }
    return this.state.productList.map((val, idx) => {
      const { id, productName, price, categories, image, sizeAvailable } = val;
      return (
        <>
          <tr
            onClick={() => {
              if (this.state.activeProducts.includes(idx)) {
                this.setState({
                  activeProducts: [
                    ...this.state.activeProducts.filter((item) => item !== idx),
                  ],
                });
              } else {
                this.setState({
                  activeProducts: [...this.state.activeProducts, idx],
                });
              }
            }}
          >
            <td> {idx + 1} </td>
            <td> {productName} </td>
            <td>
              {" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(price)}{" "}
            </td>
            <td>{sizeAvailable}</td>
            <td>
              <img src={image} width="50px" alt="" />
            </td>
            <td>
              <div className="text-center">
                <Button onClick={() => this.editBtnHandler(idx)}>Edit</Button>
                <Button
                  onClick={() => this.deleteProductHandler(val)}
                  className="btn btn-danger ml-1"
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        </>
      );
    });
  };

  sizeInputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getProductList();
  }

  reloadPage = (field, changeActivePage) => {
    if (field) {
      this.setState({
        reloadIndicator: {
          ...this.state.reloadIndicator,
          [field]: !this.state.reloadIndicator[field],
        },
      });
    } else if (changeActivePage) {
      this.setState({ activePage: changeActivePage });
      this.getProductList(changeActivePage);
    }
  };

  renderActivePage = () => {
    const {
      activePage,
      nowPageRange,
      initPageRange,
      reloadIndicator,
    } = this.state;
    const { nextPage, prevPage, firstPage, lastPage } = reloadIndicator;

    let temp = [];
    let lastVal = nowPageRange[nowPageRange.length - 1];
    let firstVal = nowPageRange[0];
    let subtractor = firstVal - 1;
    if (nextPage) {
      nowPageRange.forEach((val) => {
        temp.push(val + lastVal);
      });
      this.setState({ nowPageRange: temp });
      this.reloadPage("nextPage");
      this.reloadPage(null, lastVal + 1);
    } else if (prevPage) {
      nowPageRange.forEach((val) => {
        temp.push(val - subtractor);
      });
      this.setState({ nowPageRange: temp });
      this.reloadPage("prevPage");
      this.reloadPage(null, firstVal - 1);
    } else if (firstPage) {
      this.setState({ nowPageRange: initPageRange });
      this.reloadPage("firstPage");
      this.reloadPage(null, 1);
    }
    // this.getProductList()
    return nowPageRange.map((val) => {
      return val == activePage ? (
        <Pagination.Item active>{val}</Pagination.Item>
      ) : (
        <Pagination.Item onClick={() => this.reloadPage(null, val)}>
          {val}
        </Pagination.Item>
      );
    });
  };

  editBtnHandler = (idx) => {
    let {
      productList,
      arrOfAppStock,
      arrOfGudangStock,
      arrSizeActive,
      editProductEntity,
      indexProductActive,
      editedIsAllSize,
      sizeFormApp,
      sizeFormGudang,
    } = this.state;
    this.setState({ indexProductActive: idx });

    // let thisEditStock = { ...arrOfAppStock[idx] };

    this.setState({ sizeFormApp: {} });
    this.setState({ sizeFormGudang: {} });
    this.setState({
      sizeFormApp: {
        ...arrOfAppStock[idx],
      },
    });

    let arrCheck = [];
    for (let keys in arrOfAppStock[idx]) {
      arrCheck.push(keys);
    }
    this.setState({ arrSizeActive: arrCheck });

    this.setState({
      editProductEntity: {
        id: productList[idx].id,
        image: productList[idx].image,
        price: productList[idx].price,
        productName: productList[idx].productName,
        sizeAvailable: productList[idx].sizeAvailable,
        // category: productList[idx].categories,
        category: productList[idx].categories[0]["category"],

      },
      modalOpen: true,
    });

    // console.log(sizeForm);
  };

  editProductPost = () => {
    const {
      sizeFormApp,
      editProductEntity,
      productList,
      arrOfAppStock,
      indexProductActive,
    } = this.state;
    let sizeAvailable = "";
    let arrSizeAv = [];

    let oldStock = arrOfAppStock[indexProductActive]
    let dataChange = { ...editProductEntity };
    console.log(oldStock);
    
    for (let size in sizeFormApp) {
      if (size == "S") {
        arrSizeAv[0] = size;
      } else if (size == "M") {
        arrSizeAv[1] = size;
      } else if (size == "L") {
        arrSizeAv[2] = size;
      } else if (size == "XL") {
        arrSizeAv[3] = size;
      } else if (size == "XXL") {
        arrSizeAv[4] = size;
      }
      else if (size == "AllSize") {
        arrSizeAv[5] = size;
      }
      
      
    }
    sizeAvailable = arrSizeAv.toString()
    while(sizeAvailable[0] == ","){
      sizeAvailable = sizeAvailable.slice(1);
    }
    // if (arrSizeAv.toString()[0] == ",") {
    // } else {
    //   sizeAvailable = arrSizeAv.toString();
    // }

    if(sizeAvailable=="AllSize"){
      sizeAvailable = "All Size"
    }

   
    let oriProductData = { ...productList[indexProductActive] };
    // sizeAvailable = sizeAvailable.slice(1);
    // alert(sizeAvailable)

    let putData = { ...editProductEntity, sizeAvailable };
   
    console.log(sizeAvailable);

    
    // putData = { ...oriProductData, ...putData };

    console.log("put data");
    console.log(putData);

    console.log("old cate");
    console.log(oriProductData.categories[0]["category"]);

    console.log("new cate");
    console.log(putData.category);

    // alert(oriProductData.categories[0]["category"])
    // alert(putData.category)
   alert(oriProductData.categories[0]["id"]);
    let newCategoryId
   if (putData.category == "Men") {
    newCategoryId = 1;
  } else if (putData.category == "Women") {
    newCategoryId = 2;
  } else {
    newCategoryId = 3;
  }
    
    
    Axios.put(`${API_URL}/products/edit_product/${oriProductData.categories[0]["id"]}`, putData)  
    .then((res) => {
      Axios.get(`${API_URL}/products/${putData.id}/category/${newCategoryId}`)
      .then(res=>{
        console.log(res.data)
        
      })
      .catch(err=>{
        console.log(err);
        
      })
        Axios.put(`${API_URL}/stocks/delete_stock/${putData.id}`)
          .then((res) => {
            console.log(res);
            for (let size in oldStock) {
              if(sizeFormApp.hasOwnProperty(size)){
                Axios.put(
                  `${API_URL}/stocks/edit_stock/${oriProductData.id}/${size}/${sizeFormApp[size]}`
                )
                  .then((res) => {
                    console.log(res);
                    let selisih = sizeFormApp[size]-oldStock[size]
                    Axios.put(
                      `${API_URL}/gudang/reduce_stock/${putData.id}/${size}/${selisih}`
                    )
                    .then(res=>{
                      console.log(res);
                    })
                    .catch((err) => {});
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                  
              }else{
                Axios.put(
                  `${API_URL}/gudang/add_stock/${putData.id}/${size}/${oldStock[size]}`
                )
                .then(res=>{
                  console.log(res);
                })
                .catch((err) => {});
              }
         
                
              
            }
            this.getProductList();
          })
          .catch((err) => {});

        swal("Success!", "Your item has been edited", "success");

        this.setState({ modalOpen: false });
        this.getProductList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be edited", "error");
        console.log(err);
      });
  };

  removeSizeFormApp = (sizeToRemove) => {
    const { sizeFormApp, arrOfAppStock, indexProductActive } = this.state;
    let arrSizeOriStock = { ...sizeFormApp };

    delete arrSizeOriStock[sizeToRemove];

    this.setState({ sizeFormApp: arrSizeOriStock });
  };
  renderSize = (indexProductActive) => {
    // alert(indexProductActive)
    const {
      arrOfAppStock,
      sizeFormApp,
      allSizeIs,
      editedIsAllSize,
      checkedbox,
      arrSizeActive,
    } = this.state;
    let arrRenderSize = [];
    let arrAllSize = [];

    for (let size in sizeFormApp) {
      arrRenderSize.push(
        <>
          <div className="d-flex mb-1 ">
            <div size="sm" className="col-5 m-0 p-0 border">
              <h8>
                Size <Badge variant="secondary">{size}</Badge>
              </h8>
            </div>

            <Form.Control
              size="sm"
              value={sizeFormApp[size]}
              onChange={(e) => this.inputHandler(e, size, "sizeFormApp")}
              type="number"
              className="w-50"
              placeholder="App Stock"
            />

            <div size="sm" className="col-1 pl-1 pt-1">
              <FontAwesomeIcon
                onClick={() => this.removeSizeFormApp(size)}
                className=""
                style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
                icon={faTimes}
              />
            </div>
          </div>
        </>
      );
    }

    return arrRenderSize;
  };

  tabHandler = (val) => {
    this.setState({ tabPaket: val });
  };
  render() {
    return (
      <div
        className="col-10 border border-primary"
        style={{ minHeight: "650px" }}
      >
        <div className="dashboard">
          <caption className="p-3">
            <h2>Products</h2>
          </caption>

          <Table>
            <thead>
              <tr>
                <th>No</th>
                <th onClick={() => this.sortingProduct("productName")}>
                  Product Name{"  "}
                  <FontAwesomeIcon
                    icon={faSort}
                    style={{ fontSize: 20, color: "black" }}
                  />
                </th>
                <th onClick={() => this.sortingProduct("price")}>
                  Price{"  "}
                  <FontAwesomeIcon
                    icon={faSort}
                    style={{ fontSize: 20, color: "black" }}
                  />
                </th>
                <th>Size </th>
                <th>Image</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>{this.renderProductList()}</tbody>
          </Table>
          <div className="d-flex justify-content-center border pt-3">
            <Pagination>
              <Pagination.First onClick={() => this.reloadPage("firstPage")} />
              <Pagination.Prev onClick={() => this.reloadPage("prevPage")} />
              {this.renderActivePage()}

              <Pagination.Next onClick={() => this.reloadPage("nextPage")} />
              <Pagination.Last onClick={() => this.reloadPage("lastPage")} />
            </Pagination>
          </div>
        </div>

        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
          size="md"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption style={{ marginBottom: "-30px" }}>
              <h3>Edit Product</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-8">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  value={this.state.editProductEntity.productName}
                  onChange={(e) =>
                    this.inputHandler(e, "productName", "editProductEntity")
                  }
                  placeholder="Enter Product Name"
                />
              </div>
              <div className="col-4">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  value={this.state.editProductEntity.price}
                  onChange={(e) =>
                    this.inputHandler(e, "price", "editProductEntity")
                  }
                  placeholder="Enter Price"
                />
              </div>

              <div className="col-6 mt-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    this.inputHandler(e, "category", "editProductEntity")
                  }
                  as="select"
                  value={this.state.editProductEntity.category}
                  className="mb-2"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Accessories">Accessories</option>
                </Form.Control>
                <div className="text-center">
                  <img src={this.state.editProductEntity.image} alt="" />
                </div>
              </div>
              <div className="col-6 my-3">
                <Form.Label>Product Stock</Form.Label>
                {this.renderSize(this.state.indexProductActive)}
              </div>
            </div>

            <div className="row">
              <div className="col-6 mt-3">
                <ButtonUI
                  className="w-100"
                  onClick={this.toggleModal}
                  type="outlined"
                >
                  Cancel
                </ButtonUI>
              </div>
              <div className="col-6 mt-3">
                <ButtonUI
                  className="w-100"
                  onClick={this.editProductPost}
                  type="contained"
                >
                  Save
                </ButtonUI>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default AdminDashboard;
