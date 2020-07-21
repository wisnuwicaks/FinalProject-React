import React from "react";
import "./AddProduct.css";
import { Badge } from "react-bootstrap";
import Axios from "axios";
import Swal from "sweetalert2";
import {
  ListGroup,
  Table,
  Col,
  Form,
  FormGroup,
  InputGroup,
  Button,
  Navbar,
  FormControl,
  NavItem,
  NavLink,
  Nav,
} from "react-bootstrap";

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
  faSortDown,
  faSortAmountUp,
  faSortNumericUp,
  faSortNumericUpAlt,
} from "@fortawesome/free-solid-svg-icons/";

class AddProduct extends React.Component {
  state = {
    allProductData: [],
    sizeAvailable: ["S", "M", "L", "XL", "XXL"],
    paketAvailable: [],
    paketActive: "",
    selectedFileLocal: null,
    selectedFileUpload: null,
    tabPaket: false,
    formPaket: {
      paket: "",
    },

    arrProductPaket: [],
    productData: {
      productName: "",
      price: 0,
      sizeAvailable: "",
    },
    checkbox: {
      allSizeChecked: false,
    },
    allSizeStock: 0,
    allSizeStockGudang: 0,
    category: "",
    sizeStockForm: {},
    sizeStockGudangForm: {},

    activeProducts: [],
    modalOpen: false,
  };

  componentDidMount() {
    this.getpaketAvailable();
    this.getAllProduct();
  }

  getAllProductPaket = (paketName) => {
    Axios.get(`${API_URL}/products/paket_name/${paketName}`)
      .then((res) => {
        this.setState({ arrProductPaket: res.data });
      })
      .catch((err) => console.log(err));
  };

  changePaket = (e) => {
    this.setState({ paketActive: e.target.value });
    this.getAllProductPaket(e.target.value);
  };

  getAllProduct = () => {

    Axios.get(`${API_URL}/products/size/All`)
      .then((res) => {
        this.setState({ allProductData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getpaketAvailable = () => {
    Axios.get(`${API_URL}/paket/all_paket`)
      .then((res) => {
        this.setState({ paketAvailable: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addPaket = () => {
    const { formPaket } = this.state;
    const { paket } = formPaket;
    Axios.post(`${API_URL}/paket/add_paket/${paket}`)
      .then((res) => {
        console.log(res.data);
        swal("New Paket Has been Added", "Good Job", "success");
        this.getpaketAvailable();
      })
      .catch((err) => {
        swal("Error System", "Sorry Admin", "error");
        this.getpaketAvailable();
        console.log(err);
      });
  };

  setSelectedImage = (e) => {
    this.setState({
      selectedFileLocal: URL.createObjectURL(e.target.files[0]),
    });
    this.setState({ selectedFileUpload: e.target.files[0] });
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

  tabHandler = (val) => {
    this.setState({ tabPaket: val });
  };

  renderpaketAvailable = () => {
    const { paketAvailable } = this.state;
    return paketAvailable.map((val) => {
      return (
        <>
          <ListGroup.Item> {val.paket}</ListGroup.Item>
        </>
      );
    });
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

  renderCheckBox = () => {
    const { sizeAvailable } = this.state;
    return sizeAvailable.map((val) => {
      return (
        <div className="d-flex mb-1 ">
          <div className="col-4 border paddingNol">
            <h8>
              Size <Badge variant="secondary">{val}</Badge>
            </h8>
          </div>

          <Form.Check
            custom
            onClick={(e) => this.onClickCheckBox(e, `${val}`, "checkbox")}
            type="checkbox"
            id={val}
            label=""
          />
          {this.state.checkbox[`${val}`] ? (
            <>
              <Form.Control
                onChange={(e) =>
                  this.inputHandler(e, `${val}`, "sizeStockForm")
                }
                size="sm"
                className="w-50"
                type="number"
                placeholder="App Stock"
              />
              <Form.Control
                onChange={(e) =>
                  this.inputHandler(e, `${val}`, "sizeStockGudangForm")
                }
                size="sm"
                className="w-50"
                type="number"
                placeholder="Gudang "
              />
            </>
          ) : (
            <Form.Control
              disabled
              size="sm"
              className="w-50"
              type="number"
              placeholder="App Stock"
            />
          )}
        </div>
      );
    });
  };

  postProduct = () => {
    const {
      allSizeStock,
      sizeStockForm,
      category,
      checkbox,
      productData,
      selectedFileUpload,
    } = this.state;
    let { productName, price } = productData;
    let formData = new FormData();
    Object.check = function (obj) {
      for (let key in obj) {
        if (obj[key] == 0) {
          return true;
        }
      }
      return false;
    };

    let stockUnQualified = false;

    if (Object.entries(sizeStockForm).length !== 0) {
      stockUnQualified = Object.check(sizeStockForm);
    }
    if (
      category == "" ||
      (allSizeStock <= 0 && stockUnQualified) ||
      productName == "" ||
      price <= 0 ||
      selectedFileUpload == null
    ) {
      return alert("Input data tidak lengkap");
      // console.log(category);
      // console.log(allSizeStock);
      // console.log(stockUnQualified);
      // console.log(productName);
      // console.log(price);
    }
    // console.log(stockUnQualified)

    if (this.state.selectedFileUpload) {
      formData.append(
        "file",
        this.state.selectedFileUpload,
        this.state.selectedFileUpload.name
      );
      let sizeAvailable = "";
      if (allSizeStock) {
        sizeAvailable = "All Size";
      } else {
        let arr = [];
        for (let key in sizeStockForm) {
          if (key == "S") {
            arr[0] = key;
          } else if (key == "M") {
            arr[1] = key;
          } else if (key == "L") {
            arr[2] = key;
          } else if (key == "XL") {
            arr[3] = key;
          } else if (key == "XXL") {
            arr[4] = key;
          }
        }
        if (arr.toString()[0] == ",") {
          sizeAvailable = arr.toString().slice(1);
        } else {
          sizeAvailable = arr.toString();
        }
      }

      price = parseInt(price);
      let productDataUpload = { ...productData, price, sizeAvailable };
      console.log(productDataUpload);

      formData.append("productData", JSON.stringify(productDataUpload));
      Axios.post(`${API_URL}/products/add_product`, formData)
        .then((res) => {
          console.log("berhasil upload res data");
          // alert("berhasil");

          console.log(res.data);
          this.setState({ selectedFileUpload: null });
          // alert("berhasil tambah product");

          this.addProductToCategory(res.data, category);
        })
        .catch((err) => {
          alert("gagal");
          console.log(err);
        });
    }
  };

  addProductToCategory = (productData, category) => {
    let categoryId = 0;
    if (category == "Men") {
      categoryId = 1;
    } else if (category == "Women") {
      categoryId = 2;
    } else {
      categoryId = 3;
    }
    Axios.get(`${API_URL}/products/${productData.id}/category/${categoryId}`)
      .then((res) => {
        console.log("berhasil tambah product ke category");
        this.addProductToStock(productData.id);
      })
      .catch((err) => {
        alert("gagal add category");
        console.log(err);
      });
  };

  addProductToStock = (productId) => {
    let {
      sizeStockForm,
      sizeStockGudangForm,
      allSizeStock,
      allSizeStockGudang,
    } = this.state;
    let stockTypeHandling = {};
    let stockGudangTypeHandling = {};
    if (allSizeStock) {
      stockTypeHandling = {
        "AllSize": parseInt(allSizeStock),
      };
      stockGudangTypeHandling = {
        "AllSize": parseInt(allSizeStockGudang),
      };
    } else {
      stockTypeHandling = { ...sizeStockForm };
      stockGudangTypeHandling = { ...sizeStockGudangForm };
    }
    for (let key in stockTypeHandling) {
      let stockData = {
        size: key,
        stock: stockTypeHandling[key],
      };

      let stockDataGudang = {
        size: key,
        stockGudang: stockGudangTypeHandling[key],
      };

      console.log("ini data dikirim ke be");

      console.log(stockData);
      console.log(stockDataGudang);

      
      Axios.post(`${API_URL}/stocks/add_stock/${productId}`, stockData)
        .then((res) => {
          console.log("berhasil tambah stock");
          console.log(res.data);
          
          Swal.fire({
            title: "Success Add Product",
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            },
          });
        })
        .catch((err) => {
          alert("gagal add stock app");
          console.log(err);
        });

      Axios.post(
        `${API_URL}/gudang/add_stock_gudang/${productId}`,
        stockDataGudang
      )
        .then((res) => {
          console.log("berhasil tambah stock gudang");
          console.log(res.data);
          
          Swal.fire({
            title: "Success Add Product",
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            },
          });
        })
        .catch((err) => {
          alert("gagal add stock gudang");
          console.log(err);
        });
    }
  };

  renderOptionPaket = () => {
    return this.state.paketAvailable.map((val) => {
      return (
        <>
          <option value={val.paket}>{val.paket}</option>
        </>
      );
    });
  };

  addProductToPaket = (productId)=>{
    const {paketActive,arrProductPaket}= this.state
    if(!paketActive){
      return swal("Error Add Product to Paket","Choose Paket First","error")
    }
    let findDuplicate = arrProductPaket.findIndex(val=>{
      return val.id==productId
    })
    if(findDuplicate !==-1){
      return swal("Error Add Product to Paket","Product Already Exist","error")
    }
    Axios.post(`${API_URL}/paket/add_product_to_paket/${productId}/${paketActive}`)
    .then(res=>{
      swal("Success Add to Paket","","success")
      this.getAllProductPaket(paketActive)
    })
    .catch(err=>
      console.log(err)
    )
  }

  renderTableOverFlow = () => {
    const { allProductData } = this.state;
    return allProductData.map((val, idx) => {
      return (
        <>
          <tr>
            <td>{idx + 1}</td>

            <td>{val.productName}</td>
            <td>
              <img src={val.image} width="30px" />
            </td>
            <td>
              <Button
              style={{fontSize:"12px", padding:"2px"}}
              onClick={()=>this.addProductToPaket(val.id)}
              >ADD to Paket</Button>
            </td>
          </tr>
        </>
      );
    });
  };

  deleteProductFromPaket=(productId)=>{
    const {paketActive}= this.state
   
    Axios.put(`${API_URL}/paket/delete_product_from_paket/${productId}/${paketActive}`)
    .then(res=>{
      swal("Success Delete Product from Paket","","success")
      this.getAllProductPaket(paketActive)
    })
    .catch(err=>
      console.log(err)
    )
  }
  renderTableProductOfPaket=()=>{
    const { arrProductPaket } = this.state;
    return arrProductPaket.map((val, idx) => {
      return (
        <>
          <tr>
            <td>{idx + 1}</td>
            <td>{val.productName}</td>
            <td>
              <img src={val.image} width="30px" />
            </td>
            <td>
              <Button
              style={{fontSize:"12px", padding :"2px"}}
              onClick={()=>this.deleteProductFromPaket(val.id)}
              >Delete from Paket</Button>
            </td>
          </tr>
        </>
      );
    });
  }
  render() {
    return (
      <div className="col-10 border border-primary" style={{ height: "650px" }}>
        <div className="dashboard-form-container px-4">
          <caption className="mb-4 w-100">
            <h2>Add Product and Paket</h2>
          </caption>
          <Nav className="mt-2 ml-0 " variant="tabs" defaultActiveKey="/home">
            <Nav.Item className={`${this.state.tabPaket ? null : "tabActive"}`}>
              <Nav.Link onClick={() => this.tabHandler(false)}>
                ADD PRODUCT
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className={`${this.state.tabPaket ? "tabActive" : null}`}>
              <Nav.Link onClick={() => this.tabHandler(true)}>
                ADD PAKET
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {this.state.tabPaket ? (
            //form add paket
            <div className="row border">
              {/* <div className="col-4 border p-3">
                <h6>Paket List :</h6>
                <div className="mt-3">
                  <ButtonUI onClick={this.addPaket} type="contained">
                    Add Paket
                  </ButtonUI>
                </div>
              </div> */}
              <div className="col-4">
                <Form.Group>
                <h6 className="pt-2">
                Choose Which Paket to Add
                </h6>
                  <Form.Control
                    custom
                    onChange={(e) => this.changePaket(e)}
                    as="select"
                    defaultValue=""
                  >
                    <option value="">Select Category...</option>
                    {this.state.paketAvailable.length
                      ? this.renderOptionPaket()
                      : null}
                  </Form.Control>
                </Form.Group>
                <div>
                  <Table className="headingcustom">
                    <tr>
                      <th>No</th>
                      <th>Prod Name</th>
                      <th>Action</th>
                    </tr>
                  </Table>
                </div>
                <div style={{ height: "300px", overflow: "auto" }}>
                  <Table>
                    <tbody>{this.renderTableOverFlow()}</tbody>
                  </Table>
                </div>
              </div>
              {/* =====list product with paket... */}
              <div className="col-4 border">

                {this.state.paketActive ? (
                  <>
                    <ListGroup size="sm" className="pt-2 w-100">
                      <ListGroup.Item>{this.state.paketActive}</ListGroup.Item>
                    </ListGroup>
                    <div style={{ height: "300px", overflow: "auto" }}>
                      <Table>
                        <tbody>{this.renderTableProductOfPaket()}</tbody>
                      </Table>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            //form add product
            <div className="row border pt-3">
              <div className="col-4">
                <Form.Group>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      this.inputHandler(e, "productName", "productData")
                    }
                    placeholder="Enter Product Name"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      this.inputHandler(e, "price", "productData")
                    }
                    type="number"
                    placeholder="Enter Price"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    custom
                    onChange={(e) =>
                      this.setState({ category: e.target.value })
                    }
                    as="select"
                    defaultValue=""
                  >
                    <option value="" selected>
                      Select Category...
                    </option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Accessories">Accessories</option>
                  </Form.Control>
                </Form.Group>
              </div>

              <div className="col-6">
                <div className="row ">
                  <div className="col-5">
                    <Form.Group className="w-100">
                      <Form.Label>Input Stock</Form.Label>
                      <Form>
                        <div className="d-flex mb-1">
                          <div className="col-4 border w-25">
                            <h7 className="pt-1">
                              <Badge
                                className="allSizeBadge"
                                variant="secondary"
                              >
                                {" "}
                                All Size{" "}
                              </Badge>
                            </h7>
                          </div>
                          <Form.Check
                            custom
                            className=""
                            onClick={(e) =>
                              this.onClickCheckBox(
                                e,
                                "allSizeChecked",
                                "checkbox"
                              )
                            }
                            type="checkbox"
                            id={`custom-checkbox`}
                            label=""
                          />
                          {this.state.checkbox.allSizeChecked ? (
                            <>
                              <Form.Control
                                onChange={(e) =>
                                  this.setState({
                                    allSizeStock: e.target.value,
                                  })
                                }
                                size="sm"
                                className="w-50"
                                type="number"
                                placeholder="App Stock"
                              />
                              <Form.Control
                                onChange={(e) =>
                                  this.setState({
                                    allSizeStockGudang: e.target.value,
                                  })
                                }
                                size="sm"
                                className="w-50"
                                type="number"
                                placeholder="Gudang"
                              />
                            </>
                          ) : (
                            <Form.Control
                              disabled
                              size="sm"
                              className="w-50"
                              type="number"
                              placeholder="App Stock"
                            />
                          )}
                        </div>

                        {this.state.checkbox.allSizeChecked
                          ? null
                          : this.renderCheckBox()}
                      </Form>
                    </Form.Group>
                    <Form.Group>
                      <Form>
                        <Form.File
                          id="custom-file"
                          label="Input Image Product"
                          custom
                          onChange={(e) => this.setSelectedImage(e)}
                        />
                      </Form>
                    </Form.Group>
                  </div>
                  <div className="col-2"></div>
                  <div className="col-5 border ">
                    <img
                      src={
                        this.state.selectedFileLocal
                          ? this.state.selectedFileLocal
                          : "https://quantum-inti.co.id/home/wp-content/uploads/2020/04/No-Image-Available.png"
                      }
                      height="300px"
                      width="200px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-3 mt-3">
                <ButtonUI onClick={this.postProduct} type="contained">
                  Create Product
                </ButtonUI>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AddProduct;
