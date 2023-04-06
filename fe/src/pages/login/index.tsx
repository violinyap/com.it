import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./style.scss";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/reducer/userReducer";
import { useSearchParams } from "react-router-dom";

import SquaresImg from "../../assets/squares.png";
import GithubIcon from "../../assets/githubicon.png";
import ComitLogo from "../../assets/comit_neon.png";
import { CircularProgress } from "@mui/material";
import { getProfileGoal } from "../../store/reducer/profileReducer";
import { AppDispatch } from "../../store/store";

//code=b92f4cc90d6ff0621b6c
function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const loginCode = searchParams.get("code");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const connectAccount = ({ code }: { code: string }) => {
    var bodyFormData = new FormData();
    bodyFormData.append("code", code);
    console.log('connect acc')
    // After requesting Github access, Github redirects back to your app with a code parameter
    axios
      .post("http://localhost:10801/auth", bodyFormData,)
      .then((res) => {
        console.log("res", res?.data);
        if (res?.data?.user) {
          dispatch(
            login({
              user: {
                ...res?.data?.user,
                id: res?.data?.uid,
                token: res?.data?.access_token,
              },
              isLoggedIn: true,
            })
          );
          dispatch(getProfileGoal())
          if (res?.data?.new === "") {
            navigate("/onboard");
          } else {
            navigate("/dash");
          }
        }
      })
      .catch((error) => { console.error(error) });
  };



  useEffect(() => {
    if (loginCode && !isLoggingIn) {
      console.log('here', loginCode)
      setIsLoggingIn(true);
      connectAccount({ code: loginCode });
    }
  }, [searchParams, loginCode])


  const client_id = process.env.REACT_APP_CLIENT_ID;
  const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
  return (
    <div className="LoginPage">
      <div className="LoginPage__left">
        <img className="LoginPage__left__img" src={SquaresImg} />
      </div>
      <div className="LoginPage__right">
        <h1 className="LoginPage__right__title">Welcome to</h1>
        <img src={ComitLogo} className="LoginPage__right__logo" />
        <p className="LoginPage__right__subtitle">Connect to your GitHub account to get started.</p>
        <a
          className="LoginPage__right__signup"
          href={isLoggingIn ? '#' : `https://github.com/login/oauth/authorize?scope=repo,user&client_id=${client_id}&redirect_uri=${redirect_uri}`}
        >
          {isLoggingIn ? (
            <CircularProgress color="inherit" />
          ) : (
            <>
              <img src={GithubIcon} className="LoginPage__right__signup__icon" />
              Login / Sign up with GitHub
            </>
          )}
        </a>
      </div>
    </div >
  );
}

export default Login;
