import React from "react";
import { Link, Redirect } from "react-router-dom";

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
import "./Home.css";
import {
  onCategoryChange,
  cartUpdate,
  onGanti,
  onSearchProduct

} from "../../../redux/actions";

import ProductCard from "../../components/Cards/ProductCard";
import Carousel1 from "../../../assets/images/Carousel/1.jpg";
import Carousel2 from "../../../assets/images/Carousel/2.jpg";
import Carousel3 from "../../../assets/images/Carousel/3.jpg";
import ButtonUI from "../../components/ButtonUI/ButtonUI";

import Colors from "../../../constants/Colors";
import { API_URL } from "../../../constants/API";

const pic1 =
  "https://storage.sg.content-cdn.io/in-resources/ff5c6da1-2d74-4846-96c9-ccd65d766244/Images/userimages/home/second-new/Category-Banner_Men.jpg";
const pic2 =
  "https://storage.sg.content-cdn.io/in-resources/ff5c6da1-2d74-4846-96c9-ccd65d766244/Images/userimages/home/second-new/Category-Banner_Women.jpg";
const pic3 =
  "https://storage.sg.content-cdn.io/in-resources/ff5c6da1-2d74-4846-96c9-ccd65d766244/Images/userimages/home/second-new/Category-Banner_Accessories.jpg";

  class Home extends React.Component {
  state = {
    activeIndex: 0,
    animating: false,
    bestSellerData: [],
    bestSellerType: "",
    cari : ""
  };

  componentDidMount() {
      this.props.onSearchProduct("")
      this.props.cartUpdate(this.props.user.id)
  }

  componentDidUpdate(){
    if(this.state.cari!==this.props.search.searchProduct){
      this.setState({cari:this.props.search.searchProduct})
    }
  }

  render() {
    if(this.props.search.searchProduct){
      return <Redirect to="/allproduct"/>
    }
    return (
      <div>
        <div className="container-fluid px-0 pt-3 pb-4 home-bg">
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
          <div className="row justify-content-center p-2 rowH">
            <div
              className="col-lg-4 d-flex align-items-center justify-content-center borderRadiusLeft"
              style={{ backgroundImage: `url(${pic1})`, }}
            >
              <div className="layerButton">
                <Link to="/allproduct">
                <ButtonUI className="btnHover" onClick={()=>this.props.onGanti(1)}>MEN SHOP </ButtonUI>
                </Link>
              </div>
            </div>
            <div
              className="col-lg-4 border d-flex align-items-center justify-content-center "
              style={{ backgroundImage: `url(${pic2})`,  }}
            >
              <div className="layerButton">
              <Link to="/allproduct">
                <ButtonUI className="btnHover" onClick={()=>this.props.onGanti(2)}>WOMEN SHOP</ButtonUI>
                </Link>
              </div>
            </div>
            <div
              className="col-lg-4 border d-flex align-items-center justify-content-center borderRadiusRight"
              style={{ backgroundImage: `url(${pic3})` }}
            >
              <div className="layerButton">
              <Link to="/allproduct">
                <ButtonUI onClick={()=>this.props.onGanti(3)} className="btnHover">ACCESSORIES</ButtonUI>
                </Link>
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
    search: state.search,
    category: state.categoryActive,
  };
};

const mapDispatchToProps = {
  onCategoryChange,
  cartUpdate,
  onGanti,
  onSearchProduct
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

