import React from "react";
import ProductCard from "../../components/Cards/ProductCard";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faGrinHearts,
  faHeart as heartOutlined,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as heartSolid,
  faKissWinkHeart,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import {
  Dropdown,
  Form,
  Row,
  Col,
  FormControl,
  Button,
  InputGroup,
  Badge,
} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {
  cartUpdate,
  wishlistUpdate,
  onCategoryChange,
  onGanti,
} from "../../../redux/actions";

// import {
//   addToCartFunction,
//   addToWishListFunction,
//   deleteWishListFunction,
// } from "../SuppportFunction";
import swal from "sweetalert";
import "./AllProduct.css";
const CircleBg = ({ children }) => {
  return <div className="lingkaran">{children}</div>;
};

class AllProduct extends React.Component {
  state = {
    liked: false,
    paket2in1: [],
    paket3in1: [],

    paketAvailable: ["3in1", "2in1"],
    productData: [],
    cate: "",
    wishlist: [],
    dataFiltered: [],
    inputFilterForm: {
      minPrice: "",
      maxPrice: "",
    },
    sortingType: "priceAsc",
    applyFilter: false,
    searchInFilter: "",
  };

  componentDidMount() {
    console.log("wish: " + this.props.user.id);
    this.props.wishlistUpdate(this.props.user.id);
    this.getProductOfPaket();
    this.getProductData();
  }

  componentDidUpdate() {
    let { inputFilterForm, applyFilter } = this.state;
    let { minPrice, maxPrice } = inputFilterForm;

    if (this.state.cate !== this.props.user.catNow) {
      this.setState({ cate: this.props.user.catNow });
      this.getProductData();
    }
  }

  getProductOfPaket = () => {
    const { paketAvailable } = this.state;
    let paket3 = [];
    let paket2 = [];
    for (let paket of paketAvailable) {
      Axios.get(`${API_URL}/products/paket_name/${paket}`)
        .then((res) => {
          for (let prod of res.data) {
            if (paket == "3in1") {
              paket3.push(prod.id);
            } else if (paket == "2in1") {
              paket2.push(prod.id);
            }
          }
        })
        .catch((err) => console.log(err));
    }
    this.setState({ paket2in1: paket2 });
    this.setState({ paket3in1: paket3 });
  };

  getProductData = () => {
    let linkCate = `products/all_products`;
    if (this.props.user.catNow) {
      linkCate = `products/filter_category/${this.props.user.catNow}`;
    }
    if (this.props.user.catNow && this.props.user.catNow == 4) {
      linkCate = `products/filter_paket`;
    }
    Axios.get(`${API_URL}/${linkCate}`)
      .then((res) => {
        this.setState({ productData: res.data });
        console.log("hasil prod");

        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderBadge = (prodId) => {
    const { paket2in1, paket3in1 } = this.state;
    if (paket2in1.includes(prodId) && paket3in1.includes(prodId)) {
      return (
        <>
          <div className="d-flex flex-column">
            <Badge variant="danger" className="mb-1">
              2in1
            </Badge>

            <Badge variant="primary">3in1</Badge>
          </div>
        </>
      );
    } else if (paket2in1.includes(prodId)) {
      return <Badge variant="danger">2in1</Badge>;
    } else if (paket3in1.includes(prodId)) {
      return <Badge variant="primary"> 3in1</Badge>;
    }
    return null;
  };

  inputFilter = (e, field, form) => {
    let { inputFilterForm } = this.state;
    let { minPrice, maxPrice } = inputFilterForm;
    let { value } = e.target;
    if (field == "minPrice" || field == "maxPrice") {
      // value = parseFloat(value);
    }

    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  onApplyBtnHandler = () => {
    this.setState({ applyFilter: false });

    let { inputFilterForm } = this.state;
    let { minPrice, maxPrice } = inputFilterForm;
    if (
      (minPrice > maxPrice && maxPrice !== "") ||
      minPrice < 0 || maxPrice < 0
    ) {
      return swal("Input not valid", "Price range not valid", "error");
    }
    this.setState({ applyFilter: true });
  };

  onClearBtnHandler = () => {
    let { inputFilterForm } = this.state;
    let { minPrice, maxPrice } = inputFilterForm;
    this.setState({
      inputFilterForm: {
        minPrice: "",
        maxPrice: "",
      },
    });
    this.setState({ applyFilter: false });
    this.setState({ searchInFilter: "" });
  };

  searchInFilterPress = (e) => {
    if (e.key == "Enter") {
      this.setState({ searchInFilter: e.target.value });
      // alert(e.target.value);
    }
  };
  addToWishListHandler = (product) => {
    if (this.props.user.id < 1) {
      swal(
        "Sorry :(",
        "You have not login yet, please login before add your item",
        "error"
      );
    } else {
      Axios.get(`${API_URL}/wishlist/user_wishlist/${this.props.user.id}`)
        .then((res) => {
          let cekDuplicate = res.data.products.findIndex((val) => {
            return val.id == product.id;
          });

          if (cekDuplicate == -1) {
            console.log(product.id);
            Axios.post(
              `${API_URL}/wishlist/add_wishlist/${this.props.user.id}/${product.id}`
            )
              .then((res) => {
                console.log(res);
                swal(
                  "Add to Wishlist",
                  "Your item has been added to your wishlist",
                  "success"
                );
                this.props.wishlistUpdate(this.props.user.id);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            swal(
              "Add to wishlist",
              "This item already saved in your wishlist",
              "error"
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  deleteWishListHandler = (idToDelete) => {
    Axios.put(
      `${API_URL}/wishlist/${this.props.user.id}/delete_wishlist/${idToDelete}`
    )
      .then((res) => {
        console.log(res.data);
        this.props.wishlistUpdate(this.props.user.id);
      })
      .catch((err) => {
        console.log(err);
      });
    this.getProductData();
  };

  renderProducts = () => {
    const {
      productData,
      inputFilterForm,
      applyFilter,
      searchInFilter,
      sortingType,
    } = this.state;
    const { minPrice, maxPrice } = inputFilterForm;
    // alert(minPrice)
    let dataFilter = [];

    if (this.props.search.searchProduct) {
      dataFilter = productData.filter((val) => {
        return val.productName
          .toLowerCase()
          .startsWith(this.props.search.searchProduct.toLowerCase());
      });
    } else if (applyFilter) {
      // alert(this.state.inputFilterForm.minPrice)
      dataFilter = productData.filter((val) => {
        if (minPrice && maxPrice == 0) {
          return val.price > minPrice;
        } else if (maxPrice && minPrice == 0) {
          return val.price < maxPrice;
        } else if (minPrice && maxPrice) {
          return val.price < maxPrice && val.price > minPrice;
        } else {
          return val;
        }
      });
    } else {
      dataFilter = [...productData];
    }
    if (sortingType == "priceAsc") {
      dataFilter.sort((a, b) =>
        a["price"] > b["price"] ? 1 : b["price"] > a["price"] ? -1 : 0
      );
    } else if (sortingType == "priceDsc") {
      dataFilter.sort((b, a) =>
        a["price"] > b["price"] ? 1 : b["price"] > a["price"] ? -1 : 0
      );
    } else if (sortingType == "terlaris") {
      dataFilter.sort((b, a) =>
        a["soldQty"] > b["soldQty"] ? 1 : b["soldQty"] > a["soldQty"] ? -1 : 0
      );
    }
    if (searchInFilter) {
      let tempArr = [...dataFilter];
      dataFilter = [];
      dataFilter = tempArr.filter((val) => {
        return val.productName
          .toLowerCase()
          .includes(searchInFilter.toLowerCase());
      });
    }

    // this.setState({dataFiltered:dataFilter})
    if (dataFilter.length == 0) {
      return (
        <div style={{ minHeight: "660px" }}>
          <div className="text-center border" style={{ paddingTop: "40px" }}>
            <img
              src="http://localhost:8080/users/profile_picture/noproduct.png"
              width="600px"
            />
          </div>
        </div>
      );
    }
    return dataFilter.map((val) => {
      return (
        <>
          <div key={`all-product${val.id}`}>
            <div
              style={{
                position: "absolute",
                zIndex: "2",
                marginTop: "25px",
                marginLeft: "25px",
                color: "red",
              }}
            >
              {this.props.user.wishListItems.includes(val.id) ? (
                <CircleBg>
                  <FontAwesomeIcon
                    style={{ fontSize: "20px" }}
                    icon={heartSolid}
                    onClick={() => this.deleteWishListHandler(val.id)}
                  />
                </CircleBg>
              ) : (
                <CircleBg>
                  <FontAwesomeIcon
                    style={{ fontSize: "20px" }}
                    icon={heartOutlined}
                    onClick={() => this.addToWishListHandler(val)}
                  />
                </CircleBg>
              )}
            </div>
            <div
              style={{
                position: "absolute",
                zIndex: "2",
                marginTop: "25px",
                marginLeft: "210px",
                color: "red",
              }}
            >
              {this.renderBadge(val.id)}
            </div>
            {val.soldQty ? (
              <div
                style={{
                  position: "absolute",
                  zIndex: "2",
                  marginTop: "325px",
                  marginLeft: "25px",
                  color: "grey",
                }}
              >
                <h6>
              <Badge variant="secondary">{val.soldQty} 
              Sold 
              
              </Badge>
                </h6>
              </div>
            ) : null}
            <div style={{ zIndex: "1", position: "relative" }}>
              <Link to={`/product/${val.id}`}>
                <ProductCard data={val} className="m-2" />
              </Link>
            </div>
          </div>
        </>
      );
    });
  };

  setSorting = (e) => {
    const { value } = e.target;
    this.setState({ sortingType: value });
  };
  render() {
    let {
      inputFilterForm,
      applyFilter,
      productData,
      dataFiltered,
    } = this.state;
    let { minPrice, maxPrice } = inputFilterForm;
    return (
      <div
        className="container-fluid bg-color pb-5"
        style={{ minHeight: "650px" }}
      >
        <div className="row">
          <div className="col-2 text-center" style={{ top: "100px" }}>
            <caption className="w-100"> Filter Price</caption>
            {applyFilter ? (
              <div
                className="d-flex justify-content-end"
                style={{
                  position: "absolute",
                  top: 20,
                  right: 15,
                }}
              >
                <Badge variant="danger" className="">
                  Filter Active
                </Badge>
              </div>
            ) : (
              <div className="d-flex justify-content-end">
                <Badge variant="danger" className=""></Badge>
              </div>
            )}
            <InputGroup className="mb-1">
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2">Rp</InputGroup.Text>
              </InputGroup.Append>
              <FormControl
                value={this.state.inputFilterForm["minPrice"]}
                onChange={(e) =>
                  this.inputFilter(e, "minPrice", "inputFilterForm")
                }
                placeholder="Min Price"
              ></FormControl>
            </InputGroup>

            <InputGroup className="mb-2">
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2">Rp</InputGroup.Text>
              </InputGroup.Append>
              <FormControl
                value={this.state.inputFilterForm["maxPrice"]}
                onChange={(e) =>
                  this.inputFilter(e, "maxPrice", "inputFilterForm")
                }
                placeholder="Max Price"
              ></FormControl>
            </InputGroup>
            <Button
              onClick={() => this.onApplyBtnHandler()}
              className="btn btn-danger w-100 mb-2"
            >
              Apply
            </Button>
            <Button
              onClick={() => this.onClearBtnHandler()}
              className="btn btn-danger w-100"
            >
              Clear Filter
            </Button>
            <InputGroup className="mt-4">
              <FormControl
                onKeyPress={(e) => this.searchInFilterPress(e)}
                placeholder="Search in filter"
                aria-label="Search in filter"
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <div className="col-10">
            <div className="container-fluid">
              <h2 className="text-center font-weight-bolder pt-3">
                All Product Available
              </h2>
              <div className="d-flex justify-content-end">
                <caption className="pr-2"> Sorting : </caption>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control
                    custom
                    size="sm"
                    as="select"
                    onChange={(e) => this.setSorting(e)}
                  >
                    <option value="priceAsc">Termurah-Termahal</option>
                    <option value="priceDsc">Termahal-Termurah</option>
                    <option value="terlaris">Terlaris</option>
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="row d-flex flex-wrap justify-content-center">
                {this.renderProducts()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    category: state.category,
    search: state.search,
  };
};

const mapDispatchToProps = {
  cartUpdate,
  wishlistUpdate,
  onCategoryChange,
  onGanti,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllProduct);
