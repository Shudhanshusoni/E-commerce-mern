import React from 'react';
import {ReactNavbar} from "overlay-navbar"
import {MdAccountCircle } from "react-icons/md";
import {MdSearch } from "react-icons/md";
import {MdAddShoppingCart } from "react-icons/md";
import logo from "../../../images/logo.png";
const Header = () => {
    const options = {
        burgerColorHover: "#eb4034",
        logo,
        logoWidth: "20vmax",
        navColor1: "rgba(0,0,0,0.4)",
        logoHoverSize: "0.5px",
        logoHoverColor: "rgba(0,0,0,0.9)",
        logoAnimationTime:3,
        link1Text: "Home",
        link2Text: "Products",
        link3Text: "Contact",
        link4Text: "About",
        link1Url: "/",
        link2Url: "/products",
        link3Url: "/contact",
        link4Url: "/about",
        link1Size: "1.3vmax",
        link1Color: "white",
        nav1justifyContent: "flex-end",
        nav2justifyContent: "flex-end",
        nav3justifyContent: "flex-start",
        nav4justifyContent: "flex-start",
        link1ColorHover: "#eb4034",
        link1Margin: "1vmax",
        profileIcon:true,
        profileIconUrl:"/login",
        profileIconColor: "rgba(35, 35, 35,0.8)",
        ProfileIconElement: MdAccountCircle, 
        searchIcon:true,
        searchIconColor: "rgba(35, 35, 35,0.8)",
        SearchIconElement:MdSearch,
        cartIcon:true,
        cartIconColor: "rgba(35, 35, 35,0.8)",
        CartIconElement:MdAddShoppingCart,
        profileIconColorHover: "#eb4034",
        searchIconColorHover: "#eb4034",
        cartIconColorHover: "#eb4034",
        cartIconMargin: "1vmax",
      };
  return (
    <ReactNavbar {...options}/>
  )
}

export default Header;