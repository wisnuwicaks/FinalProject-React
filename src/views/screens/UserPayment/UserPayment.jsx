import React from "react";
import "../Admin/AdminDashboard.css";
import {idrFormat} from "../SuppportFunction"
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
// import { Table } from 'reactstrap';

import Axios from "axios";
import { connect } from "react-redux";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/ButtonUI/ButtonUI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faGrinHearts } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as heartSolid,
  faCheck,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class UserPayment extends React.Component {
  state = {
    userPaymentData: [],
    trxDetail: [],
    detailActiveIdx: 0,
    detailActiveTrxId: 0,
    productDetails: [],
    modalOpen1: false,
    modalOpen2: false,
    modalTypeState: 1,
    selectedFileLocal: null,
    selectedFileUpload: null,
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
    const { userPaymentData } = this.state;
    let arrProdDetail = [];

    Axios.get(`${API_URL}/transactions/user/${this.props.user.id}`)
      .then((res) => {
        res.data.sort((a, b) => (a.trxId > b.trxId) ? 1 : -1)

        this.setState({ userPaymentData: res.data });
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

  uploadBtnHandler = (trxId, idx) => {
    console.log(trxId);
    console.log(idx);

    this.setState({ detailActiveIdx: idx });
    this.setState({ detailActiveTrxId: trxId });

    this.toggleModal2();
  };
  renderDetailTrx = () => {
    const { trxDetail, productDetails, detailActiveIdx } = this.state;
    if(productDetails[detailActiveIdx].length==0){
      return <div> null</div>
    }
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

  setSelectedImage = (e) => {
    this.setState({
      selectedFileLocal: URL.createObjectURL(e.target.files[0]),
    });
    this.setState({ selectedFileUpload: e.target.files[0] });
  };

  uploadSlipHandler = (trxId) => {
    const { selectedFileUpload } = this.state;
    let formData = new FormData();
    if (selectedFileUpload) {
      formData.append(
        "file",
        this.state.selectedFileUpload,
        this.state.selectedFileUpload.name
      );
      Axios.put(`${API_URL}/transactions/upload_slip/${trxId}`, formData)
        .then((res) => {
          console.log(res.data);
          swal(
            "Payment Success",
            "Thank you, Payment finish, please wait for approval :)",
            "success"
          );
          this.getTransactionList();
          this.toggleModal2();
        })
        .catch((err) => {
          swal(
            "Maintenace System",
            "Sorry for the inconvenience, try again later",
            "success"
          );
          console.log(err);
        });
    } else {
      swal(
        "Please input Your Slip",
        "Thank you, Payment finish, please wait for approval :)",
        "error"
      );
    }
  };

 
  renderStatus = (val) => {
    const {status,trfSlip} = val;

    if (trfSlip == null) {
      return "Waiting for Payment";
    } else if (status == "Pending" && trfSlip !== null) {
      return "Waiting Approval";
    } else {
      return status;
    }
  };

  renderPayment = () => {
    const { userPaymentData } = this.state;
    return userPaymentData.map((val, idx) => {
      const {
        trxId,
        totalPrice,
        status,
        user,
        buyDate,
        endTrx,
        trfSlip,
        shippingAddress,
        trxMessage
      } = val;

      return (
        <tr>
          <td>{idx + 1}</td>
          <td>TRX-{trxId}089649</td>
          <td>{this.renderStatus(val)}</td>
        
          <td>{idrFormat(totalPrice)}</td>
          <td>{shippingAddress}</td>
          <td className="p-2 m-0">
            <ButtonUI
              className="py-2 my-2  "
              onClick={() => this.detailBtnHandler(trxId, idx)}
            >
              Details
            </ButtonUI>
          </td>
     
          <td style={{}} className="">
            {trfSlip == null ? (
              <>
                <ButtonUI
                  onClick={() => this.uploadBtnHandler(trxId, idx)}
                  className="py-2 m-2"
                  type="outlined"
                >
                  Upload Transfer Receipt <FontAwesomeIcon icon={faUpload} />
                </ButtonUI>
              </>
            ) : (
              <div
                className="py-2 mx-2 d-flex justify-content-center"
                style={{
                  color: "white",
                  backgroundColor: "green",
                  width: "215px",
                  borderRadius:"5px"
                }}
              >
                Already Paid
                <FontAwesomeIcon
                  style={{ color: "white" }}
                  className="mx-2"
                  size="lg"
                  icon={faCheck}
                />
              </div>
            )}
          </td>
          <td className="text-center">{trxMessage}</td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div>
        <div className="container" style={{ minHeight: "650px" }}>
          <div className="card mt-4">
            <caption className="mt-3 text-center">
              <h2>Payment</h2>
            </caption>
            <Table striped>
              <thead>
                <tr>
                  <th> No</th>
                  <th> Trx ID</th>
                  <th>Status</th>
                  <th> Total Price</th>
                  <th> Shipping Address</th>
                  <th className="text-center"> See Details</th>
                  <th className="text-center"> Transfer</th>
                  <th className="text-center"> Transaction Message</th>

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
                  src={this.state.selectedFileLocal?this.state.selectedFileLocal:"https://quantum-inti.co.id/home/wp-content/uploads/2020/04/No-Image-Available.png"}
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
export default connect(mapStateToProps)(UserPayment);
