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
import "./Footer.css";
import { onCategoryChange, cartUpdate } from "../../../redux/actions";

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

class Footer extends React.Component {
  state = {
    activeIndex: 0,
    animating: false,
    bestSellerData: [],
    bestSellerType: "",
  };

  componentDidMount() {
    this.props.cartUpdate(this.props.user.id);
  }

  render() {
    return (
      <div>
        {/* ABOUT SECTION */}
        <div
          className="py-5"
          style={{
            // marginTop: "128px",
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
                <h4>INFORMASI</h4>
                <a className="footnote" href="">
                  Aturan Pengguna
                </a>
                <a className="footnote" href="">
                  Kebijakan Privacy
                </a>
                <a className="footnote" href="">
                  Kebijakan Hak Cipta
                </a>
                <a className="footnote" href="">
                  Syarat dan Ketentuan Berlaku
                </a>
                <a className="footnote" href="">
                  Lokasi Toko
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
  onCategoryChange,
  cartUpdate,
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
