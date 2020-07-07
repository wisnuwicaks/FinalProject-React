import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { Button,Pagination } from "react-bootstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/ButtonUI/ButtonUI";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class AdminDashboard extends React.Component {
  state = {
    productList: [],
    activePage :0,
    createForm: {
      productName: "",
      price: 0,
      category: "Phone",
      image: "",
      desc: "",
    },
    editForm: {
      id: 0,
      productName: "",
      price: 0,
      category: "",
      image: "",
      desc: "",
    },
    activeProducts: [],
    modalOpen: false,
  };

  getProductList = () => {
    Axios.get(`${API_URL}/products/allproducts`)
      .then((res) => {
        this.setState({ productList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteProduct = (id) => {
    Axios.delete(`${API_URL}/products/${id}`)
      .then((res) => {
        this.getProductList();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderProductList = () => {
    return this.state.productList.map((val, idx) => {
      const { id, productName, price, category, image, size } = val;
      return (
        <>
          <tr
            onClick={() => {
              if (this.state.activeProducts.includes(idx)) {
                this.setState({
                  activeProducts: [
                    ...this.state.activeProducts.filter((item) => item !== idx),
                  ],
                });
              } else {
                this.setState({
                  activeProducts: [...this.state.activeProducts, idx],
                });
              }
            }}
          >
            <td> {idx + 1} </td>
            <td> {productName} </td>
            <td>
              {" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(price)}{" "}
            </td>
            <td>{size}</td>
            <td>
              <img src={image} width="50px" alt="" />
            </td>
            <td>
              <Button>Edit</Button>
            </td>
          </tr>
        </>
      );
    });
  };

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  createProductHandler = () => {
    Axios.post(`${API_URL}/products`, this.state.createForm)
      .then((res) => {
        swal("Success!", "Your item has been added to the list", "success");
        this.setState({
          createForm: {
            productName: "",
            price: 0,
            category: "Phone",
            image: "",
            desc: "",
          },
        });
        this.getProductList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be added to the list", "error");
      });
  };

  editBtnHandler = (idx) => {
    this.setState({
      editForm: {
        ...this.state.productList[idx],
      },
      modalOpen: true,
    });
  };

  editProductHandler = () => {
    Axios.put(
      `${API_URL}/products/${this.state.editForm.id}`,
      this.state.editForm
    )
      .then((res) => {
        swal("Success!", "Your item has been edited", "success");
        this.setState({ modalOpen: false });
        this.getProductList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be edited", "error");
        console.log(err);
      });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getProductList();
  }

  activePageHandler = (whichPage)=>{
    this.setState({activePage: whichPage })
  }

  renderActivePage = (activePage) =>{
    let arrPage = [1,2,3,4,5]
    let temp = [...arrPage]
    let lastVal = temp[temp.length-1]
    return arrPage.map((val)=>{
      return val+lastVal
    }
    )
    
  }
  render() {
    return (
      <div className="col-10 border border-primary">
        <div className="dashboard">
          <caption className="p-3">
            <h2>Products</h2>
          </caption>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Size</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.renderProductList()}</tbody>
          </table>
      <div className="d-flex justify-content-center border">
      
      <Pagination>
            <Pagination.First />
            <Pagination.Prev />
            {this.renderActivePage(this.state.activePage)}
            
{/*          
            <Pagination.Item active >{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Item>{4}</Pagination.Item>
            <Pagination.Item>{5}</Pagination.Item> */}
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
      </div>
          
        </div>
        <div className="dashboard-form-container p-4">
          <caption className="mb-4 mt-2">
            <h2>Add Product</h2>
          </caption>
          <div className="row">
            <div className="col-8">
              <TextField
                value={this.state.createForm.productName}
                placeholder="Product Name"
                onChange={(e) =>
                  this.inputHandler(e, "productName", "createForm")
                }
              />
            </div>
            <div className="col-4">
              <TextField
                value={this.state.createForm.price}
                placeholder="Price"
                onChange={(e) => this.inputHandler(e, "price", "createForm")}
              />
            </div>
            <div className="col-12 mt-3">
              <textarea
                value={this.state.createForm.desc}
                onChange={(e) => this.inputHandler(e, "desc", "createForm")}
                style={{ resize: "none" }}
                placeholder="Description"
                className="custom-text-input"
              ></textarea>
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.image}
                placeholder="Image Source"
                onChange={(e) => this.inputHandler(e, "image", "createForm")}
              />
            </div>
            <div className="col-6 mt-3">
              <select
                value={this.state.createForm.category}
                className="custom-text-input h-100 pl-3"
                onChange={(e) => this.inputHandler(e, "category", "createForm")}
              >
                <option value="Phone">Phone</option>
                <option value="Tab">Tab</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
              </select>
            </div>
            <div className="col-3 mt-3">
              <ButtonUI onClick={this.createProductHandler} type="contained">
                Create Product
              </ButtonUI>
            </div>
          </div>
        </div>
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Edit Product</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-8">
                <TextField
                  value={this.state.editForm.productName}
                  placeholder="Product Name"
                  onChange={(e) =>
                    this.inputHandler(e, "productName", "editForm")
                  }
                />
              </div>
              <div className="col-4">
                <TextField
                  value={this.state.editForm.price}
                  placeholder="Price"
                  onChange={(e) => this.inputHandler(e, "price", "editForm")}
                />
              </div>
              <div className="col-12 mt-3">
                <textarea
                  value={this.state.editForm.desc}
                  onChange={(e) => this.inputHandler(e, "desc", "editForm")}
                  style={{ resize: "none" }}
                  placeholder="Description"
                  className="custom-text-input"
                ></textarea>
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.image}
                  placeholder="Image Source"
                  onChange={(e) => this.inputHandler(e, "image", "editForm")}
                />
              </div>
              <div className="col-6 mt-3">
                <select
                  value={this.state.editForm.category}
                  className="custom-text-input h-100 pl-3"
                  onChange={(e) => this.inputHandler(e, "category", "editForm")}
                >
                  <option value="Phone">Phone</option>
                  <option value="Tab">Tab</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                </select>
              </div>
              <div className="col-12 text-center my-3">
                <img src={this.state.editForm.image} alt="" />
              </div>
              <div className="col-5 mt-3 offset-1">
                <ButtonUI
                  className="w-100"
                  onClick={this.toggleModal}
                  type="outlined"
                >
                  Cancel
                </ButtonUI>
              </div>
              <div className="col-5 mt-3">
                <ButtonUI
                  className="w-100"
                  onClick={this.editProductHandler}
                  type="contained"
                >
                  Save
                </ButtonUI>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default AdminDashboard;
