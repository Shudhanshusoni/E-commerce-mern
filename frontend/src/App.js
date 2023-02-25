import './App.css';
import axios from 'axios';
import Header from './components/layout/Header/Header';
import {Routes,Route, BrowserRouter} from "react-router-dom"
import WebFont from 'webfontloader'; 
import { useEffect, useState } from 'react';
import Footer from './components/layout/Footer/Footer';
import Home from './components/layout/Home/Home.js'
import ProductDetails from './components/products/ProductDetails'
import Products from './components/products/Products.js' 
import Contact from './components/layout/Contact/Contact'
import About from './components/layout/About/About.js'
import Search from './components/products/Search.js';
import Profile from './components/User/Profile.js'
import LoginSignUp from './components/User/LoginSignup';
import store from './store';
import { loadUser } from './actions/UserAction';
import UserOptions from './components/layout/Header/UserOptions.js'
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/routes/ProtectedRoute';
import UpdateProfile from './components/User/UpdateProfile.js'
import UpdatePassword from './components/User/UpdatePassword.js'
import ForgotPassword from './components/User/ForgotPassword.js'
import ResetPassword from './components/User/ResetPassword.js'
import Cart from './components/Cart/Cart.js'
import Shipping from './components/Cart/Shipping.js'
import ConfirmOrder from './components/Cart/ConfirmOrder.js'
import OrderSuccess from './components/Cart/OrderSuccess.js'

import ProcessPayment from './components/Cart/ProcessPayment.js'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import MYOrder from './components/Order/MYOrder.js';
import OrderDetail from './components/Order/OrderDetail.js';
import Dashboard from './components/Admin/Dashboard.js'
import AdminProductList from './components/Admin/AdminProductList.js';
import NewProduct from './components/Admin/NewProduct.js'
import UpdateProduct from './components/Admin/UpdateProduct.js'
import AdminOrders from './components/Admin/AdminOrders.js'
import AdminUpdateOrders from './components/Admin/AdminUpdateOrders.js'
import AdminAllUsers from './components/Admin/AdminAllUsers.js'
import AdminUpdateUser from './components/Admin/AdminUpdateUser.js'
import AdminProductReviews from './components/Admin/AdminProductReviews.js'
import NotFound from './components/layout/NotFound/NotFount';



function App() {

  const {user,isAuthenticated}=useSelector((state)=>state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);
  return (
   <BrowserRouter>
     <Header/>
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/product/:id' element={<ProductDetails/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/products/:keyword' element={<Products/>}/>
        <Route path='/account' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path='/update/profile' element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>}/>
        <Route path='/update/password' element={<ProtectedRoute><UpdatePassword/></ProtectedRoute>}/>
        <Route path='/forgot/password' element={<ForgotPassword/>}/>
        <Route path='/reset/password/:token' element={<ResetPassword/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/login' element={<LoginSignUp/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login/shipping' element={<ProtectedRoute><Shipping/></ProtectedRoute>}/>
        <Route path='/confirm/order' element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute>}/>
        <Route path='/process/payment' element={<ProtectedRoute>{stripeApiKey && <Elements stripe={loadStripe(stripeApiKey)}><ProcessPayment/></Elements>}</ProtectedRoute>}/>
        <Route path='/success' element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>}/>
        <Route path='/orders' element={<ProtectedRoute><MYOrder/></ProtectedRoute>}/>
        <Route path='/order/:id' element={<ProtectedRoute><OrderDetail/></ProtectedRoute>}/>
        {/* dashboard */}
        <Route path='/admin/dashboard' element={<ProtectedRoute isAdmin={true}><Dashboard/></ProtectedRoute>}/>
        <Route path='/admin/products' element={<ProtectedRoute isAdmin={true}><AdminProductList/></ProtectedRoute>}/>
        <Route path='/admin/product' element={<ProtectedRoute isAdmin={true}><NewProduct/></ProtectedRoute>}/>
        <Route path='/admin/product/:id' element={<ProtectedRoute isAdmin={true}><UpdateProduct/></ProtectedRoute>}/>
        <Route path='/admin/orders' element={<ProtectedRoute isAdmin={true}><AdminOrders/></ProtectedRoute>}/>
        <Route path='/admin/orders/:id' element={<ProtectedRoute isAdmin={true}><AdminUpdateOrders/></ProtectedRoute>}/>
        <Route path='/admin/users' element={<ProtectedRoute isAdmin={true}><AdminAllUsers/></ProtectedRoute>}/>
        <Route path='/admin/user/:id' element={<ProtectedRoute isAdmin={true}><AdminUpdateUser/></ProtectedRoute>}/>
        <Route path='/admin/reviews' element={<ProtectedRoute isAdmin={true}><AdminProductReviews/></ProtectedRoute>}/>
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>
     <Footer/>
   </BrowserRouter>
  );
}

export default App;
