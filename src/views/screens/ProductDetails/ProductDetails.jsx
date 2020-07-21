import React from "react";
import "./ProductDetails.css";
import ButtonUI from "../../components/ButtonUI/ButtonUI";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";
import Axios from "axios";
import { connect } from "react-redux";
import { API_URL } from "../../../constants/API";
import { cartUpdate } from "../../../redux/actions";
// import {addToCartFunction,addToWishListFunction} from "../SuppportFunction"
import SizeBoxBtn from "../../components/ButtonUI/SizeBoxBtn";

class ProductDetails extends React.Component {
  state = {
    productData: {
      image: "",
      productName: "",
      price: 0,
      sizeAvailable: "",
      id: 0,
    },
    stockAvailableEach: {},
    stockAvailable: 0,

    selectedSize: "",
    cartDataNow: [],
  };

  testFunc = () => {
    alert(this.props.user.id);
  };
  componentDidMount() {
    this.getProductData();
  }

  getProductData = () => {
    const { productData,stockAvailableEach } = this.state;
    Axios.get(`${API_URL}/products/${this.props.match.params.productId}`)
      .then((res) => {
        this.setState({ productData: { ...productData, ...res.data } });
        if (res.data.sizeAvailable == "All Size") {
          this.setState({ selectedSize: "AllSize" });
        }
        let numberOfStock = 0;
        Axios.get(
          `${API_URL}/stocks/product_id/${this.props.match.params.productId}`
        )
          .then((res) => {
            let objPush ={}

            let arrStockSize = []
            res.data.forEach((val) => {
              let {size,stock} = val
               objPush = { ...objPush,
                [size]:stock,
              }
            });
            this.setState({stockAvailableEach:objPush})
          console.log("ini stock product");

          console.log(res.data);
          
          })
          .catch((err) => {
            console.log(err);
          });
          // this.setState({thisProductStock:res.data.stock})

        this.props.cartUpdate(this.props.user.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addToWishListHandler = () => {
    if (this.props.user.id < 1) {
      swal(
        "Sorry :(",
        "You have not login yet, please login before add your item",
        "error"
      );
    } else {
      Axios.get(`${API_URL}/wishlist/user_wishlist/${this.props.user.id}`)
        .then((res) => {
          let cekDuplicate = res.data.findIndex((val) => {
            return val.productId == this.state.productData.id;
          });

          if (cekDuplicate == -1) {
            console.log(this.state.productData.id);
            Axios.post(
              `${API_URL}/wishlist/add_wishlist/${this.props.user.id}/${this.state.productData.id}`
            )
              .then((res) => {
                console.log(res);
                swal(
                  "Add to Wishlist",
                  "Your item has been added to your wishlist",
                  "success"
                );
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

  addToCartHandler = () => {

    let cartDataNow = [];

    if (this.props.user.id < 1) {
      swal(
        "Sorry :(",
        "You have not login yet, please login before add your item",
        "error"
      );
    } else if (this.state.selectedSize == false) {
      swal(
        "Select Size First",
        "Please select items size to add to cart",
        "error"
      );
    } else {
      Axios.get(`${API_URL}/carts/user/${this.props.user.id}`).then((res) => {
        console.log(res);
        cartDataNow = res.data;
        let cekDuplicate = cartDataNow.findIndex((val) => {
          return (
            val.product.id == this.state.productData.id &&
            val.size == this.state.selectedSize
          );
        });

        if (cekDuplicate == -1) {
          console.log(this.state.productData.id);
          Axios.post(
            `${API_URL}/carts/add_to_cart/${this.props.user.id}/${this.state.productData.id}`,
            {
              size: this.state.selectedSize,
              quantity: 1,
            }
          )
            .then((res) => {
              console.log(res.data);
              swal(
                "Add to cart",
                "New item has been added to your cart",
                "success"
              );
              this.props.cartUpdate(this.props.user.id);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log(cartDataNow[cekDuplicate].id);
          Axios.put(
            `${API_URL}/carts/update_qty/${cartDataNow[cekDuplicate].cartId}`
          )
            .then((resSameData) => {
              swal(
                "Add to cart",
                "Quantity item has been added to your cart",
                "success"
              );
              console.log(resSameData);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  };

  selectSize = (sizePick) => {
    this.setState({ selectedSize: sizePick });
  };

  renderSize = () => {
    let arr = this.state.productData.sizeAvailable.split(",");
    return arr.map((val) => {
      if (val == "All Size") {
        return <></>;
      } else {
        if (this.state.selectedSize && val === this.state.selectedSize) {
          return (
            <>
              <SizeBoxBtn
                className="m-1 active"
                onClick={() => this.selectSize(val)}
              >
                {val}
              </SizeBoxBtn>
            </>
          );
        } else {
          return (
            <>
              <SizeBoxBtn className="m-1" onClick={() => this.selectSize(val)}>
                {val}
              </SizeBoxBtn>
            </>
          );
        }
      }
    });
  };

  render() {
    const {
      productName,
      price,
      category,
      image,
      sizeAvailable,
      id,
    } = this.state.productData;
    return (
      <div className="container border">
        <div className="container test"></div>
        <div className="row py-4 border">
          <div className="col-6 text-center overflow-auto">
            <img
              style={{
                minWidth: "100%",
                objectFit: "contain",
                height: "500px",
              }}
              src={image}
              alt=""
            />
          </div>
          <div
            className="col-5 border text-nowrap p-3"
            style={{ borderRadius: "5px" }}
          >
            <h3> {productName}</h3>
            <div style={{ color: "red" }}>
              <h4>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(price)}
              </h4>
            </div>
            <div style={{ color: "grey" }}>
              {this.state.productData.sizeAvailable == "All Size" ? (
                <h6>Selected Size{"  "}: All Size</h6>
              ) : (
                <h6>Selected Size : {this.state.selectedSize}</h6>
              )}
             <h6>Stock available : {this.state.stockAvailableEach[this.state.selectedSize]}</h6> 
            </div>
            {this.state.productData.sizeAvailable == "" ? null : (
              <div className="d-flex">{this.renderSize()}</div>
            )}

            <div className="d-flex mt-4">
              <ButtonUI onClick={() => this.addToCartHandler()}>
                Add To Cart
              </ButtonUI>
              {/* <ButtonUI onClick={this.props.fungsi}>Add To Cart</ButtonUI> */}

              <ButtonUI
                className="ml-4"
                type="outlined"
                onClick={() => this.addToWishListHandler()}
              >
                Add To Wishlist
              </ButtonUI>
            </div>
            <div className="col border text-wrap mt-4">
              <caption>Description</caption>
              <p>
                This item designed with top qualified fabrics with super soft
                plain dyed fleece make you very comfortable and warm while
                wearing it. Fashionable but classic design help to look much
                moreconfident You can do your logo print on it or customded
                printing picture is OK.
              </p>
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
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
