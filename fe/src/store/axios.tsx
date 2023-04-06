import React from "react";
import axios from "axios";

const CustAxios = axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`
  }
}
);


