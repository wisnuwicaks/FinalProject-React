import React from "react";

import { connect } from "react-redux";
import { cartUpdate } from "./redux/actions";
import Test2 from "./Test2";
import App from "./App";




class Test1 extends React.Component {
  state = {
    productData: {
      image: "",
      productName: "",
      price: 0,
      sizeAvailable: "",
      id: 0,
    },
    selectedSize: "",
    cartDataNow: [],
  };

  testFunc1 = ()=>{
    alert(this.props.user.id)
  }
  testFunc2 = ()=>{
    alert(this.props.user.id + "qwdad")
    
    }
  
  render() {

    return (
        
        <App fungsi = {()=>this.testFunc1()} />
        // {/* <Test2 fungsi2 = {this.testFunc2} /> */}
        
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
export default connect(mapStateToProps, mapDispatchToProps)(Test1);

