import React from "react";
import "./PaymentReport.css";
import { paidnotpaid } from "../SuppportFunction";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import {
  Table,
  Col,
  Form,
  FormGroup,
  InputGroup,
  Button,
  Navbar,
  FormControl,
  NavItem,
  NavLink,
  Nav,
} from "react-bootstrap";
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
  faTimes,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";


class PaymentReport extends React.Component {
  state = {
    paymentData: [],
    trxDetail: [],
    detailActiveIdx: 0,
    detailActiveTrxId: 0,
    productDetails: [],
    modalOpen1: false,
    modalOpen2: false,
    statusFilter: "Pending",
  };

  componentDidMount() {
    this.getTransactionList();
  }

  rejectMsgHandler = (trxId, idx) => {
    swal({
      title: "Are you sure?",
      text: "Once reject, user can resend valid transfer slip",
      content: "input",
      buttons: true,
      dangerMode: true,
    }).then((value) => {
      if (value) {
        this.rejectSlip(trxId, value);
      }
    });
  };
  toggleModal1 = () => {
    this.setState({ modalOpen1: !this.state.modalOpen1 });
  };
  toggleModal2 = () => {
    this.setState({ modalOpen2: !this.state.modalOpen2 });
  };

  statusFilterHandler = (status) => {
    this.setState({ statusFilter: status });

    // this.getTransactionList()
  };

  getTransactionList = () => {
    const { paymentData, statusFilter } = this.state;
    let linkToGet = `transactions/all_trx`;
    // if(statusFilter){
    //   linkToGet=`transactions/all_trx/filter/${statusFilter}`
    // }
    let arrProdDetail = [];

    Axios.get(`${API_URL}/${linkToGet}`)
      .then((res) => {
        this.setState({ paymentData: res.data });
        console.log(res.data);

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

  approveSlip = (trxId, idx) => {
    const { productDetails } = this.state;

    productDetails[idx].forEach((val,idxProdDet) => {
      const { product, size, quantity } = val;
      const { id } = product;

      Axios.put(`${API_URL}/transactions/approve/${trxId}/${id}/${quantity}`)
      .then((res) => {
        console.log(res.data);
        swal("Transaction Success", "Thank you :)", "success");
        if(idxProdDet==productDetails[idx].length-1 ){
          this.reduceStock(idx)
          this.getTransactionList();
        }
      })
      .catch((err) => {
        swal(
          "Maintenace System",
          "Sorry for the inconvenience, try again later",
          "error"
        );
        console.log(err);
      });

    })
    
      
  };

  reduceStock=(idx)=>{
    const { productDetails } = this.state;

    productDetails[idx].forEach((val) => {
      const { product, size, quantity } = val;
      const { id } = product;
      Axios.put(
        `${API_URL}/stocks/reduce_stock/${id}/${size}/${quantity}`
      )
        .then((res) => {
          console.log(res.data);

          alert("Pengurangan stock berhasil");
        })
        .catch((err) => {
          alert("Pengurangan stock gagal");
          console.log(err);

        });
    });
  }

  rejectSlip = (trxId, rejectMsg) => {
    Axios.put(`${API_URL}/transactions/reject/${trxId}/${rejectMsg}`)
      .then((res) => {
        console.log(res.data);
        swal("Transaction Rejected", "Thank you:)", "success");
        this.getTransactionList();
      })
      .catch((err) => {
        swal(
          "Maintenace System",
          "Sorry for the inconvenience, try again later",
          "success"
        );
        console.log(err);
      });
  };

  renderDetailTrx = () => {
    const { trxDetail, productDetails, detailActiveIdx } = this.state;
    if(productDetails[detailActiveIdx].length==0){
      return <div>Kosong</div>
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

  
  renderStatus = (val) => {
    const { status, trfSlip } = val;

    if (trfSlip == null) {
      return "Waiting for Payment";
    } else if (status == "Pending" && trfSlip !== null) {
      return "Waiting Approval";
    } else {
      return status;
    }
  };

  renderPayment = () => {
    const { paymentData, statusFilter } = this.state;
    let arrFilter = [...paymentData];
    if (statusFilter) {
      arrFilter = paymentData.filter((val) => {
        return val.status == statusFilter;
      });
    }
    return arrFilter.map((val, idx) => {
      const {
        trxId,
        totalPrice,
        status,
        user,
        buyDate,
        endTrx,
        trfSlip,
        shippingAddress,
      } = val;

      return (
        <tr>
          <td>{idx + 1}</td>
          <td>TRX-{trxId}089649</td>
          <td>{this.renderStatus(val)}</td>
          <td>{totalPrice}</td>
          <td>{shippingAddress}</td>
          <td>
            {
              trfSlip == null || "" ? (
                // paidnotpaid("Unpaid","red",1)
                "Unpaid"
              ) : (
                <p className="mylink" onClick={this.toggleModal2}>
                  Paid
                </p>
              )
              // paidnotpaid("Paid","green",0)
            }
          </td>
          <td className="">
            <>
              <ButtonUI
                className="py-2 m-2  "
                onClick={() => this.detailBtnHandler(trxId, idx)}
              >
                Details
              </ButtonUI>
            </>
          </td>
          <td>
            {status == "Success" ? null : (
              <>
                <ButtonUI
                  onClick={() => this.approveSlip(trxId, idx)}
                  className="py-2 m-2"
                  type="outlined"
                >
                  Accept <FontAwesomeIcon icon={faCheck} />
                </ButtonUI>
              </>
            )}
          </td>

          <td>
            {status == "Success" ? null : (
              <ButtonUI
                onClick={() => this.rejectMsgHandler(trxId)}
                className="py-2 m-2"
                type="outlined"
              >
                Reject <FontAwesomeIcon icon={faTimes} />
              </ButtonUI>
            )}
          </td>
        </tr>
      );
    });
  };

  render() {
    const { paymentData, detailActiveIdx, detailActiveTrxId } = this.state;
    return (
      <div>
        <div className="container" style={{ minHeight: "650px" }}>
          <Nav className="mt-2" variant="tabs" defaultActiveKey="/home">
            <Nav.Item>
              <Nav.Link onClick={() => this.statusFilterHandler("Pending")}>
                Unapproved Transaction
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => this.statusFilterHandler("Success")}>
                Approved Transaction
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <div className="">
            <caption className="mt-3 text-center">
              <h2>Payment</h2>
            </caption>
            <Table>
              <thead>
                <tr>
                  <th> No</th>
                  <th> TrxID</th>
                  <th> Status</th>
                  <th> Total Price</th>
                  <th> Shipping Address</th>
                  <th className="text-center"> Trf Slip</th>

                  <th className="text-center"> See Details</th>

                  <th colSpan="2" className="text-center">
                    {" "}
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>{this.renderPayment()}</tbody>
            </Table>
          </div>

          <div>
       
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
              <Table>
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
              <h3>Trasnfer Slip</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              {paymentData.length > 0 ? (
                <div className="col-12 border justify-content-center text-center">
                  <img
                    className="imgzoom"
                    src={paymentData[detailActiveIdx].trfSlip}
                    height="300px"
                    width="200px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ) : null}

              <div className="col-12 text-center justify-content-center align-items-center">
                <ButtonUI
                  className="w-100"
                  onClick={this.toggleModal2}
                  type="outlined"
                >
                  OK
                </ButtonUI>
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
export default connect(mapStateToProps)(PaymentReport);
