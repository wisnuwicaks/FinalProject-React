import React from "react";
import { Link } from "react-router-dom";
// import { Carousel, CarouselControl, CarouselItem } from "reactstrap";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Carousel, CarouselCaption, CarouselItem } from "react-bootstrap"
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import {
  faShippingFast,
  faMoneyBillWave,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import "./HomeEdit.css";

import ProductCard from "../../components/Cards/ProductCard";

import Carousel1 from "../../../assets/images/Carousel/1.jpg";
import Carousel2 from "../../../assets/images/Carousel/2.jpg";
import Carousel3 from "../../../assets/images/Carousel/3.jpg";
import ButtonUI from "../../components/Button/Button";
import CarouselShowcaseItem from "./CarouselShowcaseItem.tsx";
import Colors from "../../../constants/Colors";
import { API_URL } from "../../../constants/API";

class HomeEdit extends React.Component {
  state = {
    activeIndex: 0,
    animating: false,
    bestSellerData: [],
    bestSellerType: "",
  };

  getBestSellerData = () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ bestSellerData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderProducts = () => {
    const { bestSellerType } = this.state;
    return this.state.bestSellerData.map((val) => {
      if (bestSellerType || this.props.search.searchInput) {
        if (this.props.search.searchInput) {
          return (
            <>
              {val.productName
                .toLowerCase()
                .startsWith(this.props.search.searchInput.toLowerCase()) ? (
                <div key={`best-seller${val.id}`}>
                  <Link to={`/product/${val.id}`}>
                    <ProductCard data={val} className="m-2" />
                  </Link>
                </div>
              ) : null}
            </>
          );
        } else {
          return (
            <>
              {val.category == this.state.bestSellerType ? (
                <div key={`best-seller${val.id}`}>
                  <Link to={`/product/${val.id}`}>
                    <ProductCard data={val} className="m-2" />
                  </Link>
                </div>
              ) : null}
            </>
          );
        }
      } else {
        return (
          <div key={`best-seller${val.id}`}>
            <Link to={`/product/${val.id}`}>
              <ProductCard data={val} className="m-2" />
            </Link>
          </div>
        );
      }
    });
  };

  componentDidMount() {
    this.getBestSellerData();
  }

  render() {
    return (
      <div>
        <div className="container-fluid px-0 py-5 border ">
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={Carousel1}
                alt="First slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={Carousel2}
                alt="Third slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={Carousel3}
                alt="Third slide"
              />
            </Carousel.Item>
          </Carousel>
        </div>
        <div className="container-fluid border border-success">
          {/* Category Section */}
          <h2 className="text-center font-weight-bolder mt-5">BEST SELLER</h2>
          <div className="row justify-content-center p-1 rowH">
            <div className="col-lg-4 border gbr1">
              <div className="layerButton">
                <ButtonUI className="btnHover">MEN SHOP</ButtonUI>
              </div>
              
            </div>
            <div className="col-lg-4 border gbr2">
              <div className="layerButton">
                <ButtonUI className="btnHover">WOMEN SHOP</ButtonUI>
              </div>
             
            </div>
            <div className="col-lg-4 border gbr3">
              <div className="layerButton">
                <ButtonUI className="btnHover">SALE ITEMS</ButtonUI>
              </div>
             
            </div>
          </div>
        </div>
        {/* ABOUT SECTION */}
        <div
          className="py-5"
          style={{
            marginTop: "128px",
            backgroundColor: "black",
            color: "white",
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-4 text-center d-flex flex-column align-items-center">
               
              </div>
              <div className="col-4 text-center d-flex flex-column align-items-center">
                
              </div>
              <div className="col-4 text-center d-flex flex-column align-items-center">
              
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
    search: state.searchInput,
  };
};

export default connect(mapStateToProps)(HomeEdit);
