import React from "react";
import { connect } from "react-redux";

import swal from "sweetalert";
import { Table, Alert } from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/ButtonUI/ButtonUI";
import { cartUpdate } from "../../../redux/actions";
// import { addToCartFunction, deleteWishListFunction } from "../SuppportFunction";
import SizeBoxBtn from "../../components/ButtonUI/SizeBoxBtn";
import { Link } from "react-router-dom";

class Wishlist extends React.Component {
  state = {
    selectedSize: "",
    wishListData: [],
    isCheckOut: false,
    totalCartPrice: 0,
    cartDataNow: [],
  };

  componentDidMount() {
    this.getWishListData();
    this.props.cartUpdate(this.props.user.id);
  }

  getWishListData = () => {
    Axios.get(`${API_URL}/wishlist/user_wishlist/${this.props.user.id}`)
      .then((res) => {
        console.log(res.data.products);
        this.setState({ wishListData: res.data.products });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteWishList = (userIdActive, productToDelete) => {
    Axios.put(
      `${API_URL}/wishlist/${userIdActive}/delete_wishlist/${productToDelete}`
    )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    this.getWishListData();
  };

  renderWishListData = () => {
    return this.state.wishListData.map((val, index) => {
      const { id, productName, price, image, sizeAvailable } = val;

      return (
        <tr key={`beda-${id}`}>
          <td>{index + 1}</td>
          <td>{productName}</td>
          <td>{price}</td>
          <td>{sizeAvailable}</td>
          <td>
            <img
              src={`${image}`}
              style={{ objectFit: "contain", height: "150px" }}
            />
          </td>
          <td className="text-nowrap">
            <Link to={`/product/${id}`}>
              <button className="btn btn-primary">Add To Cart</button>
            </Link>
            <button
              className="btn btn-danger ml-2"
              onClick={() => {
                this.deleteWishList(this.props.user.id, val.id);
              }}
            >
              DELETE
            </button>
          </td>
          <td></td>
        </tr>
      );
    });
  };

  render() {
    if (this.state.wishListData.length < 1) {
      return (
        <div style={{ minHeight: "600px" }} className="text-center">
          <div className="pt-5">
            <h2>No Wishlist</h2>
          </div>
          <img
            src="http://localhost:8080/users/profile_picture/nowishlist.png"
            width="500px"
          />
        </div>
      );
    } else {
      return (
        <div className="container" style={{ minHeight: "600px" }}>
          <div className="text-center">
            <h1>Wish List</h1>
          </div>
          <div>
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Size Available</th>
                  <th>Image</th>
                  <th> Action</th>
                </tr>
              </thead>
              <tbody>{this.renderWishListData()}</tbody>
            </Table>

            {/* {this.state.isCheckOut ? (
              <>
                <div className="card p-3">
                  <h4>
                    {" "}
                    Total Price :{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(this.state.totalCartPrice)}{" "}
                  </h4>
                  <div className="d-flex mt-3">
                    <ButtonUI type="contained" onClick={this.onConfirmBtn}>
                      {" "}
                      Confirm
                    </ButtonUI>
                    <ButtonUI
                      type="outlined"
                      onClick={this.onCheckOutBtnHandler}
                      className="ml-3"
                    >
                      {" "}
                      Cancel
                    </ButtonUI>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="d-flex justify-content-start">
                  <ButtonUI
                    type="contained"
                    onClick={this.onCheckOutBtnHandler}
                  >
                    Add To Cart
                  </ButtonUI>
                </div>
              </>
            )} */}
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  cartUpdate,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
