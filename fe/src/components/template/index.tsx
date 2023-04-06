import React from "react";
import { Outlet } from "react-router";
import Header from "../header";

import "./style.scss";

const Template = () => {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Template;
