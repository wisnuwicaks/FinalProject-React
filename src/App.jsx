import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Cookie from "universal-cookie";
import { connect } from "react-redux";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Axios from "axios";
import { API_URL } from "./constants/API";
import { cartUpdate } from "./redux/actions";

import Home from "./views/screens/Home/Home";
import NavbarUI from "./views/components/NavbarUI/NavbarUI";

import SidebarUI from "./views/screens/Sidebar/SidebarUI";

import UserProfile from "./views/screens/UserProfile/UserProfile";
import ResetPassword from "./views/screens/ResetPassword/ResetPassword";
import RequestReset from "./views/screens/RequestReset/RequestReset";

import ProductDetails from "./views/screens/ProductDetails/ProductDetails";

import AdminDashboard from "./views/screens/Admin/AdminDashboard";
import AddProduct from "./views/screens/Admin/AddProduct";

import AllProduct from "./views/screens/AllProduct/AllProduct";
import PageNotFound from "./views/screens/PageNotFound/PageNotFound";
import { userKeepLogin, cookieChecker } from "./redux/actions";

import Cart from "./views/screens/Cart/Cart";
import Wishlist from "./views/screens/Wishlist/Wishlist";
import PaymentReport from "./views/screens/Admin/PaymentReport";
import Members from "./views/screens/Admin/Members";
import History from "./views/screens/History/History";
import UserPayment from "./views/screens/UserPayment/UserPayment";

import Report from "./views/screens/Admin/Report";
import Test from "./views/components/TestComponent/Test";
import Test1 from "./Test1";
import Test2 from "./Test2";
import Footer from "./views/screens/Footer/Footer";
import { log } from "util";
const cookieObj = new Cookie();

class App extends React.Component {
  componentDidMount() {
    let cookieResult = cookieObj.get("authData");
    if (cookieResult) {
      console.log(cookieResult);
      this.props.keepLogin(cookieResult);
    } else {
      this.props.cookieChecker();
    }
  }

  componentDidUpdate() {
    if (this.props.user.id) {
      cookieObj.set("authData", JSON.stringify(this.props.user), { path: "/" });
    }
  }

  renderAdminRoutes = () => {
    if (this.props.user.role === "admin") {
      return (
        <>
          <div className="row">
            <SidebarUI />
            <Route exact path="/admin/dashboard" component={AdminDashboard} />
            <Route exact path="/admin/add_product" component={AddProduct} />
            <Route exact path="/admin/payment" component={PaymentReport} />
            <Route exact path="/admin/report" component={Report} />
            <Route exact path="/admin/member" component={Members} />
          </div>
        </>
      );
    } else {
      return <Redirect to="/pagenotfound" />;
    }
  };

  userRoutes = () => {
    if (this.props.user.id && this.props.user.role == "user") {
      return (
        <>
          <Route exact path="/cart" component={Cart} />
          <Route exact path="/wishlist" component={Wishlist} />
          <Route exact path="/allproduct" component={AllProduct} />
          <Route exact path="/history" component={History} />
        </>
      );
    } else {
      return <Redirect to="/pagenotfound" />;
    }
  };
  render() {
    if (this.props.user.cookieChecked) {
      return (
        <>
          <NavbarUI />
          {/* {this.props.user.role == "admin" ? <SidebarUI /> : null} */}

          <Switch>
            {/* {this.props.user.role == "admin" ? null : ( */}
            <Route exact path="/" component={Home} />
            {/* )} */}

            <Route
              exact
              path="/product/:productId"
              component={ProductDetails}
            />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/wishlist" component={Wishlist} />
            <Route exact path="/allproduct" component={AllProduct} />
            <Route exact path="/user_payment" component={UserPayment} />
            <Route exact path="/history" component={History} />
            <Route exact path="/test" component={Test} />
            <Route exact path="/userprofile" component={UserProfile} />
            <Route
              exact
              path="/reset_password/:user_id/:reset_code+"
              component={ResetPassword}
            />
            <Route exact path="/request_reset" component={RequestReset} />

            {this.renderAdminRoutes()}
            {this.userRoutes()}
            <Route exact path="/pagenotfound" component={PageNotFound} />
          </Switch>
          <Footer />
        </>
      );
    } else {
      return <div><img src={"https://cdn.lowgif.com/full/4546f79e78124c4c-page-loader-gif-14-gif-images-download.gif"} alt=""/></div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  keepLogin: userKeepLogin,
  cookieChecker,
  cartUpdate,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
