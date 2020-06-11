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
          <div className="row d-flex flex-wrap justify-content-center">
            <div className="col-lg-4 border">
              <div className="layerButton">
                <ButtonUI className="btnHover">MEN SHOP</ButtonUI>
              </div>

              <div className="layerBackground">
                <img
                  src="https://storage.sg.content-cdn.io/in-resources/ff5c6da1-2d74-4846-96c9-ccd65d766244/Images/userimages/home/second-new/Category-Banner_Men.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className="col-lg-4 border">
              <div className="layerButton">
                <ButtonUI className="btnHover">WOMEN SHOP</ButtonUI>
              </div>
              <div className="layerBackground">
                <img
                  src="https://storage.sg.content-cdn.io/in-resources/ff5c6da1-2d74-4846-96c9-ccd65d766244/Images/userimages/home/second-new/Category-Banner_Women.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="layerButton">
                <ButtonUI className="btnHover">SALE ITEMS</ButtonUI>
              </div>
              <div className="layerBackground">
                <img
                  src="https://storage.sg.content-cdn.io/in-resources/ff5c6da1-2d74-4846-96c9-ccd65d766244/Images/userimages/home/second-new/Category-Banner_Accessories.jpg"
                  alt=""
                />
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
                <FontAwesomeIcon
                  icon={faShippingFast}
                  style={{ fontSize: 70, color: Colors.accentLight }}
                />
                <h3 className="font-weight-bolder mt-4">FAST SHIPPING</h3>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic
                  impedit facilis nam vitae, accusamus doloribus alias
                  repellendus veniam voluptates ad doloremque sequi est, at
                  fugit pariatur quisquam ratione, earum sapiente.
                </p>
              </div>
              <div className="col-4 text-center d-flex flex-column align-items-center">
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  style={{ fontSize: 70, color: Colors.accentLight }}
                />
                <h3 className="font-weight-bolder mt-4">100% REFUND</h3>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic
                  impedit facilis nam vitae, accusamus doloribus alias
                  repellendus veniam voluptates ad doloremque sequi est, at
                  fugit pariatur quisquam ratione, earum sapiente.
                </p>
              </div>
              <div className="col-4 text-center d-flex flex-column align-items-center">
                <FontAwesomeIcon
                  icon={faHeadset}
                  style={{ fontSize: 70, color: Colors.accentLight }}
                />
                <h3 className="font-weight-bolder mt-4">SUPPORT 24/7</h3>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic
                  impedit facilis nam vitae, accusamus doloribus alias
                  repellendus veniam voluptates ad doloremque sequi est, at
                  fugit pariatur quisquam ratione, earum sapiente.
                </p>
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
