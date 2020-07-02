import React from "react";
import { Link } from "react-router-dom";

import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { connect } from "react-redux";
import {
  faShippingFast,
  faMoneyBillWave,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import "./HomeEdit.css";
import {
  onCategoryChange
} from "../../../redux/actions";

import ProductCard from "../../components/Cards/ProductCard";
import Carousel1 from "../../../assets/images/Carousel/1.jpg";
import Carousel2 from "../../../assets/images/Carousel/2.jpg";
import Carousel3 from "../../../assets/images/Carousel/3.jpg";
import ButtonUI from "../../components/ButtonUI/ButtonUI";
import CarouselShowcaseItem from "./CarouselShowcaseItem.tsx";
import Colors from "../../../constants/Colors";
import { API_URL } from "../../../constants/API";

const pic1 =
  "https://storage.sg.content-cdn.io/in-resources/ff5c6da1-2d74-4846-96c9-ccd65d766244/Images/userimages/home/second-new/Category-Banner_Men.jpg";
const pic2 =
  "https://storage.sg.content-cdn.io/in-resources/ff5c6da1-2d74-4846-96c9-ccd65d766244/Images/userimages/home/second-new/Category-Banner_Women.jpg";
const pic3 =
  "https://storage.sg.content-cdn.io/in-resources/ff5c6da1-2d74-4846-96c9-ccd65d766244/Images/userimages/home/second-new/Category-Banner_Accessories.jpg";
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
        <div className="container-fluid border-top border-bottom pb-4 border-dark">
          {/* Category Section */}
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "-20px" }}
          >
            <h2 className="w-25 text-center text-white font-weight-bolder bg-dark">
              Find Your Style
            </h2>
          </div>
          <div className="row justify-content-center p-1 rowH">
            <div
              className="col-lg-4 border d-flex align-items-center justify-content-center"
              style={{ backgroundImage: `url(${pic1})` }}
            >
              <div className="layerButton">
                <Link to="/allproduct">
                <ButtonUI className="btnHover" onClick={()=>this.props.onCategoryChange("Men")}>MEN SHOP </ButtonUI>
                </Link>
              </div>
            </div>
            <div
              className="col-lg-4 border d-flex align-items-center justify-content-center"
              style={{ backgroundImage: `url(${pic2})` }}
            >
              <div className="layerButton">
              <Link to="/allproduct">
                <ButtonUI className="btnHover" onClick={()=>this.props.onCategoryChange("Women")}>WOMEN SHOP</ButtonUI>
                </Link>
              </div>
            </div>
            <div
              className="col-lg-4 border d-flex align-items-center justify-content-center"
              style={{ backgroundImage: `url(${pic3})` }}
            >
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
              <div className="col-3 d-flex flex-column">
                <img
                  src="https://i.ibb.co/ssCQKFm/white-logo.png"
                  width="250px"
                  alt=""
                />
              </div>
              <div className="col-3 d-flex flex-column pl-5 ">
                <h4>SERVICE</h4>
                <a className="footnote" href="">
                  Lacak Pesanan
                </a>
                <a className="footnote" href="">
                  Cara Belanja
                </a>
                <a className="footnote" href="">
                  Cara Pengembalian
                </a>
                <a className="footnote" href="">
                  Info Pengiriman
                </a>
                <a className="footnote" href="">
                  FAQ
                </a>
              </div>

              <div className="col-3 d-flex flex-column ">
                <h4>SERVICE</h4>
                <a className="footnote" href="">
                  Lacak Pesanan
                </a>
                <a className="footnote" href="">
                  Cara Belanja
                </a>
                <a className="footnote" href="">
                  Cara Pengembalian
                </a>
                <a className="footnote" href="">
                  Info Pengiriman
                </a>
                <a className="footnote" href="">
                  FAQ
                </a>
              </div>
              <div className="col-3 text-center d-flex flex-column align-items-center">
                <h4>FIND US</h4>
                <div className="d-flex">
                  <FontAwesomeIcon
                    className="p-2"
                    icon={faFacebook}
                    style={{ fontSize: "50px" }}
                  />
                  <FontAwesomeIcon
                    className="p-2"
                    icon={faInstagram}
                    style={{ fontSize: "50px" }}
                  />
                  <FontAwesomeIcon
                    className="p-2"
                    icon={faTwitter}
                    style={{ fontSize: "50px" }}
                  />
                  <FontAwesomeIcon
                    className="p-2"
                    icon={faYoutube}
                    style={{ fontSize: "50px" }}
                  />
                </div>
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
    category: state.categoryActive,
  };
};

const mapDispatchToProps = {
  onCategoryChange
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeEdit);

