import React from "react";
import "./Report.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { Bar } from "react-chartjs-2";

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

class Report extends React.Component {
  state = {
    tabSales: true,
    tabStock: false,
    tabChart: false,

    productList: [],
    sortAsc: true,
    sorted: [],
    settes: 1,

    arrOfStockApp: [],
    arrOfStocGudang: [],
    indexProductActive: 0,
    sizeForm: {},
    reloadIndicator: {
      prevPage: false,
      nextPage: false,
      firstPage: false,
      lastPage: false,
    },

    activePage: 1,
    initPageRange: [1, 2, 3, 4, 5],
    nowPageRange: [1, 2, 3, 4, 5],
    createForm: {
      productName: "",
      price: 0,
      category: "",
      image: "",
      desc: "",
    },
    editForm: {
      id: 0,
      productName: "",
      price: 0,
      image: "",
    },
    activeProducts: [],
    modalOpen: false,

    dataCart: {
    
    },
  };

  sortingProduct = (sortBy) => {
    const { productList, sortAsc } = this.state;
    this.setState({ sortAsc: !this.state.sortAsc });
    let tempArrProduct = [];
    let tempArrSold = [];
    tempArrProduct = [...productList];

    if (sortAsc) {
      var mapped = tempArrProduct.map(function (el, i) {
        return { index: i, value: el };
      });
      tempArrProduct.sort((a, b) => {
        if (a[sortBy] > b[sortBy]) return 1;
        if (a[sortBy] < b[sortBy]) return -1;
        // a must be equal to b
      });
      console.log(mapped);

      this.setState({ productList: tempArrProduct });
    } else {
      tempArrProduct.sort((b, a) => {
        if (a[sortBy] > b[sortBy]) return 1;
        if (a[sortBy] < b[sortBy]) return -1;
        // a must be equal to b
      });

      this.setState({ productList: tempArrProduct });
    }
  };

  componentDidMount() {
    this.getProductList();
  }

  getProductList = (changeActivePage) => {
    let { dataChart, dataCart } = this.state;
    let start = 0;
    let arrayStockApp = [];
    let arrayStockGudang = [];
    let arrProductName = [];
    let arrSoldProduct = [];
    let arrQuantitySold = [];

    if (changeActivePage) {
      start = changeActivePage;
    } else {
      start = this.state.activePage;
    }
    Axios.get(`${API_URL}/products/all_products`)
      .then((res) => {
        res.data.forEach((valProduct, indexProduct) => {
          arrProductName.push(valProduct.productName);
          arrSoldProduct.push(valProduct.soldQty);

          let stockApp = {};
          Axios.get(`${API_URL}/stocks/product_id/${valProduct.id}`)
            .then((resp) => {
              console.log(resp.data);
              resp.data.forEach((valStock, idx) => {
                let { size, stock } = valStock;
                stockApp = { ...stockApp, [size]: stock };
              });

              arrayStockApp[indexProduct] = stockApp;
            })
            .catch((err) => {
              console.log(err);
            });

          let stockGudangObj = {};
          Axios.get(`${API_URL}/gudang/product_id/${valProduct.id}`)
            .then((respGudang) => {
              console.log(respGudang.data);
              respGudang.data.forEach((valStock, idx) => {
                let { size, stockGudang } = valStock;
                stockGudangObj = { ...stockGudangObj, [size]: stockGudang };
              });

              arrayStockGudang[indexProduct] = stockGudangObj;
            })
            .catch((err) => {
              console.log(err);
            });
        });

        let insertDataCart = {
          labels: arrProductName,
          datasets: [
            {
              label: "Product",
              backgroundColor: "rgba(255,0,0,1)",
              borderColor: "rgba(255,0,0,1)",
              borderWidth: 1,
              data: arrSoldProduct,
            },
          ],
        };
        this.setState({ dataCart: insertDataCart });
        this.setState({ arrOfStockApp: arrayStockApp });
        this.setState({ arrOfStockGudang: arrayStockGudang });
        this.setState({ productList: [...res.data] });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderProductList = () => {
    let { productList } = this.state;
    if (this.state.productList.length == 0) {
      return (
        <td colSpan="6" className="text-center">
          <h5>The End of Product</h5>
        </td>
      );
    }
    return productList.map((val, idx) => {
      const {
        id,
        productName,
        price,
        categories,
        image,
        sizeAvailable,
        soldQty,
      } = val;
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

            <td>{soldQty}</td>

            <td>
              <img src={image} width="50px" alt="" />
            </td>
          </tr>
        </>
      );
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

  renderSize = (indexProductActive) => {
    // alert(indexProductActive)
    const { arrOfStockApp } = this.state;
    let arrRenderSize = [];
    for (const key in arrOfStockApp[indexProductActive]) {
      arrRenderSize.push(
        <div className="d-flex mb-1 ">
          <div size="sm" className="col-4  paddingNol text-left">
            <h8>
              Size <Badge variant="secondary">{key}</Badge>
            </h8>
          </div>

          <div size="sm" className="col-4 m-0 p-0">
            <Form.Control
              size="sm"
              value={arrOfStockApp[indexProductActive][key]}
              // className="w-25"
              type="number"
              placeholder="Enter Stock"
            />
          </div>
          <div size="sm" className="col-1 pl-1 pt-1">
            <FontAwesomeIcon
              className=""
              style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
              icon={faTimes}
            />
          </div>
        </div>
      );
    }
    return arrRenderSize;
  };

  stockAppRender = (idxProd) => {
    const { arrOfStockApp } = this.state;
    let arrSizeStock = [];
    for (let eachSize in arrOfStockApp[idxProd]) {
      arrSizeStock.push(
        <tr>
          {eachSize}:{arrOfStockApp[idxProd][eachSize]}
        </tr>
      );
    }
    return arrSizeStock;
  };

  stockGudangRender = (idxProd) => {
    const { arrOfStockGudang } = this.state;
    let arrSizeStock = [];
    for (let eachSize in arrOfStockGudang[idxProd]) {
      arrSizeStock.push(
        <tr>
          {eachSize}:{arrOfStockGudang[idxProd][eachSize]}
        </tr>
      );
    }
    return arrSizeStock;
  };
  renderProductListStock = () => {
    let { productList, arrOfStockGudang } = this.state;
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
            <td>{this.stockGudangRender(idx)}</td>
            <td>{this.stockAppRender(idx)}</td>
            <td>
              <img src={image} width="50px" alt="" />
            </td>
          </tr>
        </>
      );
    });
  };

  tabHandler = (tab) => {
    let { tabChart, tabSales, tabStock } = this.state;
    if (tab == "sales") {
      this.setState({ tabSales: true });
      this.setState({ tabStock: false });
      this.setState({ tabChart: false });
    } else if (tab == "stock") {
      this.setState({ tabSales: false });
      this.setState({ tabStock: true });
      this.setState({ tabChart: false });
    } else {
      this.setState({ tabSales: false });
      this.setState({ tabStock: false });
      this.setState({ tabChart: true });
    }
  };
  renderPageTab = () => {
    const { tabChart, tabSales, tabStock } = this.state;
    if (tabSales) {
      return (
        <>
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
                <th onClick={() => this.sortingProduct("soldQty")}>
                  Product Sold{" "}
                  <FontAwesomeIcon
                    icon={faSort}
                    style={{ fontSize: 20, color: "black" }}
                  />
                </th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>{this.renderProductList()}</tbody>
          </Table>
        </>
      );
    } else if (tabStock) {
      return (
        <>
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
                <th>Stock Gudang</th>
                <th>Stock App</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>{this.renderProductListStock()}</tbody>
          </Table>
        </>
      );
    } else {
      return (
        <>
          <Bar
            data={this.state.dataCart}
            options={{
              title: {
                display: true,
                text: "Number of Sold Product",
                fontSize: 20,
              },
              legend: {
                display: true,
                position: "right",
              },
            }}
          />
        </>
      );
    }
  };
  render() {
    let {} = this.state;
    return (
      <div
        className="col-10 border border-primary"
        style={{ minHeight: "650px" }}
      >
        <div className="dashboard">
          <caption className="p-3">
            <h2>Product Statistic</h2>
          </caption>
          <Nav className="mt-2 ml-0 " variant="tabs" defaultActiveKey="/home">
            <Nav.Item className={`${this.state.tabSales ? "tabActive" : null}`}>
              <Nav.Link onClick={() => this.tabHandler("sales")}>
                Sales Report
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className={`${this.state.tabStock ? "tabActive" : null}`}>
              <Nav.Link onClick={() => this.tabHandler("stock")}>
                Stock Report
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className={`${this.state.tabChart ? "tabActive" : null}`}>
              <Nav.Link onClick={() => this.tabHandler("chart")}>
                Chart Product Sales
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {this.renderPageTab()}
          {this.state.tabChart?
          null
          :
          <div className="d-flex justify-content-center border pt-3">
          <Pagination>
            <Pagination.First onClick={() => this.reloadPage("firstPage")} />
            <Pagination.Prev onClick={() => this.reloadPage("prevPage")} />
            {this.renderActivePage()}

            <Pagination.Next onClick={() => this.reloadPage("nextPage")} />
            <Pagination.Last onClick={() => this.reloadPage("lastPage")} />
          </Pagination>
        </div>
          }
       
        </div>
      </div>
    );
  }
}

export default Report;
