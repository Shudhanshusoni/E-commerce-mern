import React, { useEffect, useState } from 'react'
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/ProductAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from '../layout/Home/ProductCard';
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { useAlert } from "react-alert";
import Metadata from '../layout/Metadata';

const categories = [
  "Electronics",
  "Clothes",
  "Footwear",
  "Glossary",
  "Artgallery",
  "Sunglass",
  "Others",
];


const Products = () => {

    const dispatch=useDispatch();
    const id=useParams();
    const alert = useAlert();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);

    const {products,loading,error,productsCount,resultPerPage} = useSelector((state)=>state.products)

    const setCurrentPageNo = (e) => {
      setCurrentPage(e);
    };

    const priceHandler = (event, newPrice) => {
      setPrice(newPrice);
    };
 
    

    useEffect(()=>{
      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }
        dispatch(getProduct(id.id,currentPage,price,category, ratings));
    },[dispatch,error,id.id,currentPage,price,category, ratings,alert])

    //let count = filteredProductsCount;

  return (
    <>
     {loading ? (
        <Loader />
      ) : (
        <>
        <Metadata title="PRODUCTS -- ECOMMERCE"/>
        <h2 className="productsHeading">Products</h2>
        <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            />
             <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
            <fieldset>
              <Typography component="legend">Ratings</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>
          {resultPerPage < productsCount && (
          <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div> 
          )}
        </>
      )}
    </>
  )
}

export default Products