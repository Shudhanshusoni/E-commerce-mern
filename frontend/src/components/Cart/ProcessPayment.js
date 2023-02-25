import React, { useEffect, useRef, useState } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/Metadata";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./ProcessPayment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { createOrder, clearErrors } from "../../actions/OrderAction";
import { useNavigate } from "react-router-dom";
import AccountTreeIcon from "@material-ui/icons/AccountTree";

const ProcessPayment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const [mode,setMode]=useState('Card Payment');

  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate=useNavigate() ;
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;
    
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      if(mode === 'COD'){
        order.paymentInfo = {
          id:"cod",
          status: 'Cash On Delivery',
        };
        dispatch(createOrder(order));

        navigate("/success");
      }else{
      const { data } = await axios.post(
        "/api/payment/process",
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
                name: user.name,
                email: user.email,
            address: {
                line1: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                postal_code: shippingInfo.pinCode,
                country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;

        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));

          navigate("/success");
        } else {
          alert.error("There's some issue while processing payment ");
        }
      }
    }
    } catch (error) {
      payBtn.current.disabled = false;
      alert.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="body">
      <div className="mode">
        <AccountTreeIcon />
          <select onChange={(e) => setMode(e.target.value)}>
            <option value="">Choose Category</option>
              <option value="COD">Cash on Delivery</option>
              <option value="Card Payment">Card Payment</option>
          </select>
      </div>
      { mode === 'Card Payment' ? 
      (<div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>
          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>):(
        <form className="codForm" onSubmit={(e) => submitHandler(e)}>
        <input
        type="submit"
        value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
        ref={payBtn}
        className="codFormBtn"
      />
      </form>
      )
   }
   </div>
    </>
  );
};

export default ProcessPayment;