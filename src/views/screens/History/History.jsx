import React from "react";
import "../Admin/AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import {
  Col,
  Form,
  FormGroup,
  InputGroup,
  Button,
  Navbar,
  FormControl,
} from "react-bootstrap";
import Table from 'react-bootstrap/Table'
import Axios from "axios";
import { connect } from "react-redux";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/ButtonUI/ButtonUI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faGrinHearts } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as heartSolid,
  faKissWinkHeart,
  faShoppingCart,
  faLuggageCart,
  faCartPlus,
  faCheck,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class History extends React.Component {
  state = {
    finishTrxData: [],
    trxDetail: [],
    detailActiveIdx: 0,
    detailActiveTrxId: 0,
    productDetails: [],
    modalOpen1: false,
    modalOpen2: false,
  };

  componentDidMount() {
    this.getTransactionList();
  }

  toggleModal1 = () => {
    this.setState({ modalOpen1: !this.state.modalOpen1 });
  };
  toggleModal2 = () => {
    this.setState({ modalOpen2: !this.state.modalOpen2 });
  };

  getTransactionList = () => {
    const { finishTrxData } = this.state;
    let arrProdDetail = [];

    Axios.get(`${API_URL}/transactions/user/${this.props.user.id}/Success`)
      .then((res) => {
        this.setState({ finishTrxData: res.data });
        res.data.forEach((val) => {
          const { trxId } = val;
          Axios.get(`${API_URL}/transactions/trx_detail/${trxId}`)
            .then((resProd) => {
              arrProdDetail = [...arrProdDetail, resProd.data];
              this.setState({ productDetails: arrProdDetail });

              console.log(resProd.data);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        console.log(arrProdDetail);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  detailBtnHandler = (trxId, idx) => {
    console.log(trxId);
    console.log(idx);

    this.setState({ detailActiveIdx: idx });
    this.setState({ detailActiveTrxId: trxId });

    this.renderDetailTrx();
    this.toggleModal1();
  };

  renderDetailTrx = () => {
    const { trxDetail, productDetails, detailActiveIdx } = this.state;
    return productDetails[detailActiveIdx].map((val, idx) => {
      const { product, size, price, quantity, subTotalPrice } = val;
      const { productName, image } = product;
      return (
        <>
          <tr>
            <td>{idx + 1}</td>
            <td>{productName}</td>
            <td>{price}</td>
            <td>{size}</td>
            <td>{quantity}</td>
            <td> {subTotalPrice}</td>
            <td>
              <img
                src={image}
                style={{ objectFit: "contain", height: "70px" }}
              />
            </td>
          </tr>
        </>
      );
    });
  };

  renderPayment = () => {
    const { finishTrxData } = this.state;
    return finishTrxData.map((val, idx) => {
      const {
        trxId,
        totalPrice,
        status,
        user,
        buyDate,
        endTrxDate,
        trfSlip,
        shippingAddress,
        trxMessage,
      } = val;

      return (
        <tr>
          <td>{idx + 1}</td>
          <td>TRX-{trxId}089649</td>
          <td>
            {status}
          </td>
          <td>{totalPrice}</td>
          <td>{buyDate}</td>
          <td>{endTrxDate}</td>

          <td>{shippingAddress}</td>
          <td className="d-flex justify-content-center p-2 m-0">
            <ButtonUI
              className="py-2 my-2  "
              onClick={() => this.detailBtnHandler(trxId, idx)}
            >
              Details
            </ButtonUI>
          </td>
        </tr>
      );
    });
  };

  render() {
    if(this.state.finishTrxData.length==0){
      return(
        <div className=" border text-center" style={{minHeight:"600px", paddingTop:"200px"}}>
          <h2>No Transaction Completed</h2>
        </div>
      )
    }
    return (
      <div>
        <div className="container" style={{ minHeight: "650px" }}>
          <div className="card mt-4">
            <caption className="mt-3 text-center">
              <h2>History</h2>
            </caption>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th> No</th>
                  <th> TrxID</th>
                  <th> Status</th>
                  <th> Total Price</th>
                  <th> Buy Date</th>
                  <th> End Date</th>
                  <th> Shipping Address</th>
                  <th className="text-center"> See Details</th>
                </tr>
                </thead>
              
              <tbody>{this.renderPayment()}</tbody>
              </Table>
          </div>
        </div>

        <Modal
          toggle={this.toggleModal1}
          isOpen={this.state.modalOpen1}
          className="modal-lg"
          // style={{width:"800px",margin:"auto"}}
        >
          <ModalHeader>
            <caption>
              <h3>Transaction Details</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row px-5">
              <Table >
                <thead>
                  <th>No</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Size</th>

                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Image</th>
                </thead>
                <tbody>
                  {this.state.productDetails.length > 0
                    ? this.renderDetailTrx()
                    : null}
                </tbody>
              </Table>

              <div className="col-12 mt-3">
                <center>
                  <ButtonUI
                    className="w-50"
                    onClick={this.toggleModal1}
                    type="outlined"
                  >
                    OK
                  </ButtonUI>
                </center>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal
          toggle={this.toggleModal2}
          isOpen={this.state.modalOpen2}
          className="modal-md"
          // style={{width:"800px",margin:"auto"}}
        >
          <ModalHeader>
            <caption>
              <h3>Upload Trasnfer Slip</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-6 mt-3">
                <div className="m-2">File Format : .jpg, .jpeg, .png</div>
                <Form>
                  <Form.File
                    id="custom-file"
                    // className="w-"
                    // label="Click to Input Browse Slip"

                    onChange={(e) => this.setSelectedImage(e)}
                  />
                </Form>
              </div>
              <div className="col-5 border">
                <img
                  src={
                    this.state.selectedFileLocal
                      ? this.state.selectedFileLocal
                      : "https://quantum-inti.co.id/home/wp-content/uploads/2020/04/No-Image-Available.png"
                  }
                  height="300px"
                  width="200px"
                  style={{ objectFit: "contain" }}
                />
              </div>

              <div className="col-6 mt-3">
                <center>
                  <ButtonUI
                    className="w-50"
                    onClick={() =>
                      this.uploadSlipHandler(this.state.detailActiveTrxId)
                    }
                    type="outlined"
                  >
                    Upload
                  </ButtonUI>
                </center>
              </div>

              <div className="col-6 mt-3">
                <center>
                  <ButtonUI
                    className="w-50"
                    onClick={this.toggleModal2}
                    type="outlined"
                  >
                    Cancel
                  </ButtonUI>
                </center>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps)(History);
