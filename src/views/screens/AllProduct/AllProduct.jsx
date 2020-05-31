import React from "react";
import ProductCard from "../../components/Cards/ProductCard";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar,faGrinHearts,faHeart as heartOutlined } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid, faKissWinkHeart} from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import {cartUpdate} from '../../../redux/actions'
import "./AllProduct.css"
const CircleBg = ({ children }) => {
  return <div className="lingkaran">{children}</div>;
};

class AllProduct extends React.Component{
    state = {
        liked : false,
        productData : [],
        wishlist : [],
        wishtlistProductId :[]
    }

    componentDidMount(){
        this.getProductData()
        this.getWishList()
        this.props.cartUpdate(this.props.user.id)
        for(let data of this.state.wishlist){
          this.setState({wishtlistProductId:data.productId})
        }
    }

    getProductData = () => {
        Axios.get(`${API_URL}/products`)
          .then((res) => {
            this.setState({ productData: res.data });
          })
          .catch((err) => {
            console.log(err);
          });
      };

    getWishList = () => {
        Axios.get(`${API_URL}/wishlist`,{
          params:{
            userId:this.props.user.id
          }
        })
          .then((res) => {
            this.setState({ wishlist: res.data });
          
          })
          .catch((err) => {
            console.log(err);
          });
      };

      renderProducts = () =>{
        const {productData}=this.state
        // console.log(this.state.bestSellerData)
        return productData.map((val) => {
            return <>
              <div key={`best-seller${val.id}`}>
                <div style={{position:"absolute",zIndex:"2",marginTop:"15px",marginLeft:"20px", color:"red"}}>
                  {this.state.liked?
                  <CircleBg>
                    <FontAwesomeIcon 
                      style={{fontSize: "20px"}}
                      icon={heartSolid} onClick={()=>this.setState({liked:!this.state.liked})} 
                      />
                  </CircleBg>

                  :

                  <CircleBg>
                    <FontAwesomeIcon 
                      style={{fontSize: "20px"}}
                      icon={heartOutlined} onClick={()=>this.setState({liked:!this.state.liked})} 
                      />
                  </CircleBg>
                  } 
                </div>
                <div style={{zIndex:"1",position:"relative"}}>
                <Link to={`/product/${val.id}`}>
                   <ProductCard data={val} className="m-2" />
                </Link>
                </div>
              </div>
        </>
        })
      }
    render(){
        return (
        <div className="container">
                {/* BEST SELLER SECTION */}
            <h2 className="text-center font-weight-bolder mt-5">All Product Available</h2>
            <div className="row d-flex flex-wrap justify-content-center">
                {this.renderProducts()}
            </div>
        </div>
        )
    }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps ={
  cartUpdate
}

export default connect(mapStateToProps,mapDispatchToProps)(AllProduct);