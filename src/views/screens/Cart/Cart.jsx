import React from "react";
import { connect } from "react-redux";
import "./Cart.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Swal from "sweetalert2";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/ButtonUI/ButtonUI";
import { cartUpdate } from "../../../redux/actions";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { idrFormat } from "../SuppportFunction";

// import ReactPDF from '@react-pdf/renderer';
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import {
  Table,
  Badge,
  Col,
  Form,
  FormGroup,
  InputGroup,
  Navbar,
  Button,
  FormControl,
  ListGroup,
} from "react-bootstrap";

import jsPDF from "jspdf";
import "jspdf-autotable";

class Cart extends React.Component {
  state = {
    pdfRender: [],
    cartData: [],
    arrCheckoutData: [],
    isCheckOut: false,
    arrCheckoutProdId:[],
    arrCheckoutCartId: [],
    priceBeforeShipping:0,
    totalCartPrice: 0,
    subTotalCart: 0,
    shipping: "",
    deliveryCost: 10000,
    deliveryType: "Regular",
    modalOpen: false,
    diskon3in1: 0,
    diskon2in1: 0,
    shippingAddress: "",
    paket2in1: [],
    paket3in1: [],
    paketAvailable: ["3in1", "2in1"],
  };

  exportPDF = (arr, fileName, totalPrice) => {
    const {diskon2in1,diskon3in1,totalCartPrice,deliveryCost} = this.state
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = `Invoice ${new Date().toLocaleString()}`;
    const headers = [["Product Name", "Size", "Quantity", "Price"]];
    let content = {
      startY: 50,
      head: headers,
      body: arr,
      foot: [
        ["Delivery cost:", "", "", `${deliveryCost}`],
        ["Discount:", "", "", `${diskon2in1+diskon3in1}%`],
        ["Total Price", "", "", `${totalCartPrice}`],
        ["Transfer to:", "706042047300(CIMB Niaga)"],
      ],
    };

    doc.setFont("helvetica");
    doc.setFontType("bold");
    doc.setFontSize(15);

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`${fileName}.pdf`);
  };

  componentDidMount() {
    this.setState({ shippingAddress: this.props.user.address });
    this.getCartData();
    this.getProductOfPaket();
  }

  getCartData = () => {
    Axios.get(`${API_URL}/carts/user/${this.props.user.id}`)
      .then((res) => {
        console.log(res.data);
        this.setState({ cartData: res.data });
        this.props.cartUpdate(this.props.user.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getProductOfPaket = () => {
    const { paketAvailable } = this.state;
    let paket3 = [];
    let paket2 = [];
    for (let paket of paketAvailable) {
      Axios.get(`${API_URL}/products/paket_name/${paket}`)
        .then((res) => {
          for (let prod of res.data) {
            if (paket == "3in1") {
              paket3.push(prod.id);
            } else if (paket == "2in1") {
              paket2.push(prod.id);
            }
          }
        })
        .catch((err) => console.log(err));
    }
    this.setState({ paket2in1: paket2 });
    this.setState({ paket3in1: paket3 });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };
  onClickCheckBox = (e,cartId,prodId) => {
    const { arrCheckoutCartId,arrCheckoutProdId } = this.state;
    const { checked } = e.target;
    if (checked) {
        this.setState({ arrCheckoutCartId: [...arrCheckoutCartId, cartId] });
        if(arrCheckoutProdId.indexOf(prodId)==-1){
        this.setState({ arrCheckoutProdId: [...arrCheckoutProdId, prodId] });
        }
    } else {
      let arrPopoutCartId = arrCheckoutCartId.filter((val) => val !== cartId);
      let arrPopoutProdId = arrCheckoutProdId.filter((val) => val !== prodId);
      
      this.setState({ arrCheckoutCartId: arrPopoutCartId });
      // if(arrCheckoutProdId.indexOf(prodId)==1){
        this.setState({ arrCheckoutProdId: arrPopoutProdId });
      // }

    }
  };

  deleteCartHandler = (cartIdDelete) => {
    Axios.delete(`${API_URL}/carts/delete/${cartIdDelete}/${this.props.user.id}`)
      .then((res) => {
        console.log(res);
        this.getCartData();
      })
      .catch((err) => {
        alert("error delete");
        console.log(err);
      });
  };

  renderBadge = (prodId) => {
    const { paket2in1, paket3in1 } = this.state;
    if (paket2in1.includes(prodId) && paket3in1.includes(prodId)) {
      return (
        <>
          <Badge variant="danger">2in1</Badge> {" "}
          <Badge variant="primary">3in1</Badge>
        </>
      );
    } else if (paket2in1.includes(prodId)) {
      return <Badge variant="danger">2in1</Badge>;
    } else if (paket3in1.includes(prodId)) {
      return <Badge variant="primary"> 3in1</Badge>;
    }
    return null
  };

  renderCartData = () => {
    const { cartData, paket2in1, paket3in1 } = this.state;
    return cartData.map((val, idx) => {
      const { quantity, product, size,cartId } = val;
      const { productName, id, price, image, category } = product;

      return (
        <tr key={`beda-${id}`}>
          <td>{idx + 1}</td>
          <td>
            <Link to={`/product/${id}`}>{productName}</Link>
            {" "}
            {this.renderBadge(id)}
          </td>
          <td>{size}</td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(price)}
          </td>
          <td>{quantity}</td>
          <td>
            <img
              src={`${image}`}
              style={{ objectFit: "contain", height: "150px" }}
            />
          </td>
          <td className="text-center">
            <Form.Check
              custom
              onClick={(e) => this.onClickCheckBox(e, cartId,id)}
              type="checkbox"
              id={cartId}
              size="lg"
              label=""
            />
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                this.deleteCartHandler(val.cartId);
              }}
            >
              DELETE
            </button>
          </td>
        </tr>
      );
    });
  };

  checkOutBtnHandler = () => {
    const {
      cartData,
      arrCheckoutCartId,
      arrCheckoutProdId,
      paket2in1,
      paket3in1,
      diskon2in1,
      diskon3in1,
      subTotalCart,
      totalCartPrice,
      deliveryCost,
    } = this.state;

    let subTotal = 0;
    let total = 0;

    if (arrCheckoutCartId.length == 0) {
      return Swal.fire({
        title: "Select item first to checkout",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    }
  
    let paket3in1Counter = 0;
    let paket2in1Counter = 0;
    this.setState({diskon2in1:0})
    this.setState({diskon3in1:0})

    for (let idCheckout of arrCheckoutProdId) {
      if (paket2in1.includes(idCheckout)) {
        paket2in1Counter += 1;
      }
      if (paket3in1.includes(idCheckout)) {
        paket3in1Counter += 1;
      }
    }
    console.log("paket 3 "+paket3in1Counter);
    console.log("paket 2 "+paket2in1Counter);

    let diskon2in1Calculate = 0
    let diskon3in1Calculate = 0
    if (paket3in1Counter >= 3) {
      swal("Congrats !!!", "3in1 Promo is success applied", "success");
      diskon2in1Calculate = 50
      this.setState({ diskon3in1: 50 });
    } else if (paket2in1Counter >= 2) {
      diskon2in1Calculate = 30
      swal("Congrats !!!", "2in1 Promo is success applied", "success");
      this.setState({ diskon2in1: 30 });
    }

    cartData.forEach((val, idx) => {
      const { quantity, product, cartId } = val;
      const { productName, price, image, category,id } = product;
      if (arrCheckoutCartId.includes(cartId)) {
        subTotal = quantity * price;
        total += subTotal;
      }
    });


    this.setState({ subTotalCart: total });
    let totalAfterDiscount = total-(total*(diskon2in1Calculate+diskon3in1Calculate)/100)
    
    this.setState({ priceBeforeShipping: totalAfterDiscount});
    
    
    this.setState({ totalCartPrice: totalAfterDiscount + deliveryCost});

    this.toggleModal();
  };

  delivery = (e) => {
    const {
      deliveryCost,
      deliveryType,
      priceBeforeShipping,
      totalCartPrice,
      subTotalCart,
    } = this.state;
    const { value } = e.target;
    if (value == "Regular") {
      this.setState({ deliveryType: value });
      this.setState({ deliveryCost: 10000 });
      this.setState({ totalCartPrice: priceBeforeShipping + 10000 });
    } else if (value == "Same Day") {
      this.setState({ deliveryType: value });
      this.setState({ deliveryCost: 20000 });
      this.setState({ totalCartPrice: priceBeforeShipping + 20000 });
    } else if (value == "Instant") {
      this.setState({ deliveryType: value });
      this.setState({ deliveryCost: 40000 });
      this.setState({ totalCartPrice: priceBeforeShipping + 40000 });
    }
  };

  confirmBtnHandler = () => {
    const {
      cartData,
      totalCartPrice,
      shippingAddress,
      arrCheckoutCartId,
    } = this.state;

    let transactionData = {
      totalPrice: totalCartPrice,
      status: "Pending",
      endTrx: "On Process",
      shippingAddress,
    };

    let pdfReport = [];

    let fileName = `${new Date()
      .toLocaleString()
      .replace(/\s+/g, "")
      .replace(/,/g, "_")
      .replace(/\//g, "-")
      .replace(/:/g, "-")}_invoice`;

    console.log(transactionData);
    Axios.post(
      `${API_URL}/transactions/add_transaction/${this.props.user.id}`,
      transactionData
    )
      .then((resTranscations) => {
        console.log(resTranscations);

        cartData.map((val, idx) => {
          const { quantity, products, product, size, cartId } = val;
          const { productName, price, image, category, id } = product;

         
          if (arrCheckoutCartId.includes(cartId)) {

            pdfReport.push([productName, size, quantity, price]);

            Axios.post(
              `${API_URL}/transactions/add_detail/${resTranscations.data.trxId}/${id}`,
              {
                size,
                price,
                quantity,
                subTotalPrice: quantity * price,
              }
            )
              .then((res) => {
                console.log(res.data);
                this.deleteCartHandler(cartId);

                if (cartId == arrCheckoutCartId[arrCheckoutCartId.length - 1]) {
                  swal(
                    "Success Checkout",
                    "Please check your email, finish payment to end transaction",
                    "success"
                  );
                  this.exportPDF(pdfReport, fileName);
                  // setTimeout(()=>{
                  //   this.sendInvoice(fileName);
                  // }, 2000);
                  this.sendInvoice(fileName);
                }

                this.toggleModal();
              })
              .catch((err) => {
                alert("error add detail");
                console.log(err);
              });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  sendInvoice = (fileName) => {
    console.log(fileName);

    Axios.post(
      `${API_URL}/transactions/send_invoice/${this.props.user.id}/${fileName}`
    )
      .then((res) => {
        console.log("terkirim");
        console.log(res.data);
        // alert("masuk then");
      })
      .catch((err) => {
        // alert("masuk err");

        console.log(err);
      });
  };

  renderDiskon = () => {
    let { diskon2in1, diskon3in1 } = this.state;
    if (diskon2in1 || diskon3in1) {
      if (diskon2in1) {
        return (
          <div className="row">
            <div className="col-4">
              <h5>Discount</h5>
            </div>
            <div className="col-6">
              <h5> : {diskon2in1}%</h5>
            </div>
          </div>
        );
      } else {
        return (
          <div className="row">
            <div className="col-4">
              <h5>Discount</h5>
            </div>
            <div className="col-6">
              <h5> : %{diskon3in1}</h5>
            </div>
          </div>
        );
      }
    }
    return null;
  };
  render() {
    if (this.state.cartData.length < 1) {
      return (
        <div style={{ minHeight: "700px" }}>
          <div className="text-center" style={{ paddingTop: "50px" }}>
            <img
              src="http://localhost:8080/users/profile_picture/emptycart.png"
              width="600px"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ minHeight: "600px" }} className="container pb-5">
          <div className="text-center">
            <h1>CART</h1>
          </div>
          <div>
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Product Name</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Image</th>
                  <th>Check to Checkout</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.renderCartData()}</tbody>
            </Table>
            <ButtonUI onClick={this.checkOutBtnHandler}> Checkout </ButtonUI>
          </div>

          <Modal
            toggle={this.toggleModal}
            isOpen={this.state.modalOpen}
            className="edit-modal"
          >
            <ModalHeader toggle={this.toggleModal}>
              <caption>
                <h3>Checkout Form</h3>
              </caption>
            </ModalHeader>
            <ModalBody>
              <div className="row">
                <div className="col-4">
                  <h5>Subtotal</h5>
                </div>
                <div className="col-6">
                  <h5>: {idrFormat(this.state.subTotalCart)}</h5>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <h5>Shipping</h5>
                  <Form.Control
                    custom
                    size="sm"
                    onChange={(e) => this.delivery(e)}
                    as="select"
                    className=""
                  >
                    <option value="Regular">Regular</option>
                    <option value="Instant">Instant</option>
                    <option value="Same Day">Same Day</option>
                  </Form.Control>
                </div>
                <div className="col-6">
                  <h5> :{idrFormat(this.state.deliveryCost)}</h5>
                </div>
              </div>

              {this.renderDiskon()}

              <div className="row">
                <div className="col-4">
                  <h5>Total Payment</h5>
                </div>
                <div className="col-6">
                  <h5> :{idrFormat(this.state.totalCartPrice)}</h5>
                </div>
              </div>
              <div className="row border-top border-bottom">
                <div className="col-4">
                  <caption>Shipping Address</caption>
                </div>
                <div className="col p-2">
                  <Form.Control
                    as="textarea"
                    size="sm"
                    onChange={(e) =>
                      this.setState({ shippingAddress: e.target.value })
                    }
                    value={this.state.shippingAddress}
                    // className="w-25"
                    type="text"
                    // placeholder="Enter Shipping Address"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-6 mt-3">
                  <ButtonUI
                    className="w-100"
                    onClick={this.toggleModal}
                    type="outlined"
                  >
                    Cancel
                  </ButtonUI>
                </div>
                <div className="col-6 mt-3">
                  <ButtonUI
                    className="w-100"
                    onClick={this.confirmBtnHandler}
                    type="contained"
                  >
                    Confirm
                  </ButtonUI>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
