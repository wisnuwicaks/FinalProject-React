import React from "react";
import swal from "sweetalert";
import Axios from "axios";
import { API_URL } from "../../constants/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faGrinHearts } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as heartSolid,
  faKissWinkHeart,
  faShoppingCart,
  faLuggageCart,
  faCartPlus,
  faCheck,
  faUpload,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export const addToCartFunction = (
  userIdActive,
  selectedSize,
  productData,
  fungsi
) => {
  // let cartDataNow = [];

  // if (userIdActive < 1) {
  //   swal(
  //     "Sorry :(",
  //     "You have not login yet, please login before add your item",
  //     "error"
  //   );
  // } else if (selectedSize == false) {
  //   swal(
  //     "Select Size First",
  //     "Please select items size to add to cart",
  //     "error"
  //   );
  // } else {
  //   Axios.get(`${API_URL}/carts/user/${userIdActive}`).then((res) => {
  //     console.log(res);
  //     cartDataNow = res.data;
  //     let cekDuplicate = cartDataNow.findIndex((val) => {
  //       return val.product.id == productData.id && val.size == selectedSize;
  //     });

  //     if (cekDuplicate == -1) {
  //       console.log(productData.id);
  //       Axios.post(
  //         `${API_URL}/carts/add_to_cart/${userIdActive}/${productData.id}`,
  //         {
  //           size: selectedSize,
  //           quantity: 1,
  //         }
  //       )
  //         .then((res) => {
  //           console.log(res.data);
  //           swal(
  //             "Add to cart",
  //             "New item has been added to your cart",
  //             "success"
  //           );
  //           // this.props.cartUpdate(userIdActive);
  //           fungsi();
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     } else {
  //       console.log(cartDataNow[cekDuplicate].id);
  //       Axios.put(
  //         `${API_URL}/carts/update_qty/${cartDataNow[cekDuplicate].id}`
  //       )
  //         .then((resSameData) => {
  //           swal(
  //             "Add to cart",
  //             "Quantity item has been added to your cart",
  //             "success"
  //           );
  //           console.log(resSameData);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   });
  // }
  alert(this.props.user.id);
};

export const addToWishListFunction = (userIdActive, productData) => {
  console.log("prod: " + productData);

  if (userIdActive < 1) {
    swal(
      "Sorry :(",
      "You have not login yet, please login before add your item",
      "error"
    );
  } else {
    Axios.get(`${API_URL}/wishlist/user_wishlist/${userIdActive}`)
      .then((res) => {
        let cekDuplicate = res.data.products.findIndex((val) => {
          return val.id == productData.id;
        });

        if (cekDuplicate == -1) {
          console.log(productData.id);
          Axios.post(
            `${API_URL}/wishlist/add_wishlist/${userIdActive}/${productData.id}`
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

export const deleteWishListFunction = (userIdActive, idToDelete) => {
  Axios.put(`${API_URL}/wishlist/${userIdActive}/delete_wishlist/${idToDelete}`)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const idrFormat = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};

export const paidnotpaid = (text, bg, check) => {
  return (
    <>
      <div
        className="py-2 mx-2 d-flex justify-content-center"
        style={{
          color: "white",
          backgroundColor: bg,
          width: "100px",
          borderRadius: "5px",
        }}
      >
        {text}
        {check ? (
          <FontAwesomeIcon
            style={{ color: "white" }}
            className="mx-2"
            size="lg"
            icon={faCheck}
          />
        ) : (
          <FontAwesomeIcon
            style={{ color: "white" }}
            className="mx-2"
            size="lg"
            icon={faTimes}
          />
        )}
      </div>
    </>
  );
};
