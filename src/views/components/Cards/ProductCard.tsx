import React from "react";
import "./ProductCard.css";
import ButtonUI from "../ButtonUI/ButtonUI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faGrinHearts } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as heartSolid,
  faKissWinkHeart,
  faShoppingCart,
  faLuggageCart,
  faCartPlus,
} from "@fortawesome/free-solid-svg-icons";

interface ProductCardData {
  id?: number;
  productName?: string;
  price?: number;
  sizeAvailable?: string;
  image?: string;
  soldQty?:number;
}

type ProductCardProps = {
  data?: ProductCardData;
  className?: string;
};

class ProductCard extends React.Component<ProductCardProps> {
  render() {
    const { id, productName, price, sizeAvailable, image, soldQty } = this.props.data;

    return (
      <div className={`product-card d-inline-block ${this.props.className} `}>
        <div
          className="border-bottom text-center"
          style={{

            width:"250px",
            backgroundColor: "white",
            borderTopRightRadius: "8px",
            borderTopLeftRadius: "8px",
          }}
        >
          <img
            src={`${image}`}
            style={{
              // float: "left",
              // minHeight:"100px",
            
              height: "345px",
              width: "250px",
              // maxHeight: "250px",
              // maxWidth: "200",
              objectFit: "fill",
              // minHeight: "250px",
              // minWidth: "200",
              padding: "5px",
              borderTopRightRadius: "8px",
              borderTopLeftRadius: "8px",
             
            }}
          />
        </div>
        <div
          className="p-2"
          style={{
            backgroundColor: "white",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <div>
            <p className="mt-1" style={{ fontWeight: "bolder", color:"black" }}>{productName}</p>
            <h5 style={{ fontWeight: "bolder", color:"red" }}>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(price)}

            </h5>
            <div className="d-flex inline-block">
              <p className="small">
                Size Available : {
                sizeAvailable == "AllSize" ? (
                  "All Size"
                ) : (
                  sizeAvailable 
                  
                )

                }
              </p>
            </div>
            
          
          </div>
          <div className="d-flex flex-row align-items-center justify-content-between mt-1"></div>
          <div className="row justify-content-center pt-2">
            <ButtonUI
              type="outlined"
              style={{ fontSize: "12px", padding: "4px 8px" }}
            >
              {" "}
              ADD TO CART
              <FontAwesomeIcon
                style={{ fontSize: "20px" }}
                icon={faShoppingCart}
              />
            </ButtonUI>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductCard;
