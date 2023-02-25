import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:Shudhanshusoni880@gmail.com">
        <Button>Contact: Shudhanshusoni880@gmail.com</Button>
      </a>
      <a className="mailBtn" href="http://wa.me/917717765408">
        <Button>WhatsApp</Button>
      </a>
    </div>
  );
};

export default Contact;