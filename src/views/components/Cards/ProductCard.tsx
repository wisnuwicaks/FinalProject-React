import React from "react";
import "./ProductCard.css";
import ButtonUI from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar,faGrinHearts } from "@fortawesome/free-regular-svg-icons";
import { faHeart} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

interface ProductCardData {
  id?: number;
  productName?: string;
  price?: number;
  review?: number;
  image?: string;
}

type ProductCardProps = {
  data?: ProductCardData;
  className?: string;
};

class ProductCard extends React.Component<ProductCardProps> {
  render() {
    const { id, productName, price, review, image } = this.props.data;

    return (
      <div className={`product-card d-inline-block ${this.props.className}`}>
        <div className="text-right">
        <FontAwesomeIcon style={{ fontSize: "30px" }} icon={faHeart}/>
        </div>
        <div className="row justify-content-center border-bottom p-2">
          <img
            src={image}
            alt={this.props.data.productName}
            style={{ width: "224px", height: "250px", objectFit: "contain" }}
          />
        </div>
        <div>
          <p className="mt-3">{productName}</p>
          <h5 style={{ fontWeight: "bolder" }}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(price)}
          </h5>
          <p className="small">Jakarta Selatan</p>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-between mt-2">
          <div>
            <div className="d-flex flex-row align-items-center justify-content-between">
              {/* Render stars dynamically */}
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <small className="ml-2">4.5</small>
            </div>
          </div>
         
        </div>
        <div className="row justify-content-center pt-2">
        <ButtonUI
            type="outlined"
            style={{ fontSize: "12px", padding: "4px 8px" }}
          > ADD TO CART
          </ButtonUI>
        </div>
      
      </div>
    );
  }
}

export default ProductCard;
