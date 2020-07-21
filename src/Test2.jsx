import React from "react";

import { connect } from "react-redux";

import { cartUpdate } from "./redux/actions";
import Test1 from "./Test1";


class Test2 extends React.Component {
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

  componentDidMount(){
     
  }

  render() {

    return (
        <>
        <button onClick={this.props.fungsi}>asd</button>
        {/* <Test1/> */}

        </>
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
export default connect(mapStateToProps, mapDispatchToProps)(Test2);

