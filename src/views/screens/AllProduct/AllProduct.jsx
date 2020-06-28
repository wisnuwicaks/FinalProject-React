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
} from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { Dropdown, Form, Row, Col, FormControl, Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { cartUpdate, wishlistUpdate } from "../../../redux/actions";
import swal from "sweetalert";
import "./AllProduct.css";
const CircleBg = ({ children }) => {
  return <div className="lingkaran">{children}</div>;
};

class AllProduct extends React.Component {
  state = {
    liked: false,
    productData: [],
    wishtlistProductId: [],
  };

  componentDidMount() {
    this.getProductData();
  }

  getProductData = () => {
    Axios.get(`${API_URL}/products/allproducts`)
      .then((res) => {
        let filterProduct = []
        res.data.map((val)=>{
          if (val.categories[0]["category"]=="Women"){
            filterProduct = [...filterProduct,val]
          }
        })
        this.setState({ productData: filterProduct });
        this.props.wishlistUpdate(this.props.user.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addToWishListHandler = (id) => {
    if (this.props.user.id > 0) {
      Axios.post(`${API_URL}/wishlist`, {
        userId: this.props.user.id,
        productId: id,
      })
        .then((res) => {
          console.log(res);
          swal(
            "Add to Wishlist",
            "Your item has been added to your wishlist",
            "success"
          );
          this.getProductData();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    swal("Error", "Pelase login first", "error");
  };

  deleteWishList = (idToDelete) => {
    Axios.get(`${API_URL}/wishlist/`, {
      params: {
        userId: this.props.user.id,
        productId: idToDelete,
      },
    })
      .then((res) => {
        console.log(res.data);
        Axios.delete(`${API_URL}/wishlist/${res.data[0].id}`)
          .then((res) => {
            swal(
              "Add to cart",
              "Your item has been deleted from your wishlist",
              "success"
            );
            this.getProductData();
            console.log(res);
          })
          .catch((err) => {
            alert("sad");
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  renderProducts = () => {
    const { productData } = this.state;
    // console.log(this.state.bestSellerData)
    return productData.map((val) => {
      return (
        <>
          <div key={`all-product${val.id}`}>
            <div
              style={{
                position: "absolute",
                zIndex: "2",
                marginTop: "15px",
                marginLeft: "20px",
                color: "red",
              }}
            >
              {this.props.user.wishListItems.includes(val.id) ? (
                <CircleBg>
                  <FontAwesomeIcon
                    style={{ fontSize: "20px" }}
                    icon={heartSolid}
                    onClick={() => this.deleteWishList(val.id)}
                  />
                </CircleBg>
              ) : (
                <CircleBg>
                  <FontAwesomeIcon
                    style={{ fontSize: "20px" }}
                    icon={heartOutlined}
                    onClick={() => this.addToWishListHandler(val.id)}
                  />
                </CircleBg>
              )}
            </div>
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
  render() {
    return (
      <div className="container-fluid bg-color border">
        <div className="row">
          <div className="col-2 border border-primary p-2">
            <caption className="border w-100"> Filter Price </caption>
            
              <FormControl type="number" placeholder="min price" className="inputCustom" style={{height:"25px"}}></FormControl>
              <FormControl type="number" placeholder="max price" className="inputCustom mt-1" style={{height:"25px"}}></FormControl>
              <Button size="sm" className="btn btn-danger mt-2">Apply</Button>
          </div>
          <div className="col-10">
            <div className="container-fluid border border-primary">
              <h2 className="text-center font-weight-bolder pt-3">
                All Product Available
              </h2>
              <div className="d-flex justify-content-end border">
                {/* <Dropdown>
              <Dropdown.Toggle variant="danger" id="dropdown-basic">
                Sorting
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>Termurah</Dropdown.Item>
                <Dropdown.Item>Termahal</Dropdown.Item>
                <Dropdown.Item>Terlaris</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
                <caption className="pr-2"> Sorting : </caption>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control size="sm" as="select">
                    <option>Termurah-Termahal</option>
                    <option>Termahal-Termurah</option>
                    <option>Terlaris</option>
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
  };
};

const mapDispatchToProps = {
  cartUpdate,
  wishlistUpdate,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllProduct);
