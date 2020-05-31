import React from "react";
import ProductCard from "../../components/Cards/ProductCard";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar,faGrinHearts,faHeart as heartOutlined } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid, faKissWinkHeart} from "@fortawesome/free-solid-svg-icons";
import "./AllProduct.css"
const CircleBg = ({ children }) => {
  return <div className="lingkaran">{children}</div>;
};

class AllProduct extends React.Component{
    state = {
        productData : []
    }

    
    componentDidMount(){
        this.getProductData()
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

      renderProducts = () =>{
        const {productData}=this.state
        // console.log(this.state.bestSellerData)
        return productData.map((val) => {
            return <>

              <div key={`best-seller${val.id}`}>
                <div style={{position:"absolute",zIndex:"2",marginTop:"15px",marginLeft:"20px", color:"red"}}>
                  <CircleBg  >
                    <FontAwesomeIcon 
                      style={{fontSize: "20px"}}
                      icon={heartOutlined} onClick={()=>alert('qwe')} 
                      />
                  </CircleBg>
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

export default AllProduct