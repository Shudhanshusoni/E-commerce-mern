import React, { useEffect } from 'react'
import {CgMouse} from 'react-icons/cg';
import './Home.css';
import ProductCard from './ProductCard.js';
import Metadata from '../Metadata';
import {clearErrors, getProduct} from '../../../actions/ProductAction'
import {useSelector,useDispatch} from 'react-redux';
import Loader from '../Loader/Loader';
import {useAlert} from 'react-alert'

const Home = () => {
  
  const alert=useAlert();
  const dispatch=useDispatch();
  const {loading ,error ,products ,productsCount} = useSelector((state)=>state.products);
  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  },[dispatch,error,alert]);

  return (
   <>
   {loading ?(<Loader/>):
   (
    <>
    <Metadata title="Ecommerce"/>
        <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
        </div>
        <h2 className="homeHeading">Featured Products</h2>

        <div className="container" id="container">
          { products &&
            products.map((product) => (
              <ProductCard key={product._id} product= { product } />
               ))}
        </div>
    </>
   )}
   </>
  )
}

export default Home