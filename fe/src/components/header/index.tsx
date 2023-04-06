import React, { useEffect, useState } from "react";
import "./style.scss";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/reducer/userReducer";
import { useNavigate } from "react-router";
import LogoWhiteImg from '../../assets/logowhite.png';
import AvaImg from '../../assets/squares.png';
import { Avatar, Stack } from "@mui/material";
import { Code, Edit, KeyboardArrowDown, KeyboardArrowUp, Logout, Person, TrackChanges } from "@mui/icons-material";
import { personas } from "../../pages/onboard/steps/persona";
import { getProfileGoal } from "../../store/reducer/profileReducer";
import { AppDispatch } from "../../store/store";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { login: username } = useSelector((state: any) => state?.user?.user);
  const { coderType } = useSelector((state: any) => state?.profile.data);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!coderType) {
      dispatch(getProfileGoal());
    }
  }, [])

  return (
    <div className="headerbar">
      <a href="/" className="headerbar__icon"><img src={LogoWhiteImg} height={50} /></a>

      <button className="headerbar__user" onClick={() => setIsMenuOpen((prev) => !prev)}>
        <div className="header-ava">
          <img src={personas?.find((per) => per.key === coderType)?.ava ?? AvaImg} className="header-ava-img" />
        </div>
        <h3 className="headerbar__user__name">
          {username}
          {isMenuOpen ? (
            <KeyboardArrowUp htmlColor="white" />
          ) : (

            <KeyboardArrowDown htmlColor="white" />
          )}
        </h3>
      </button>

      {isMenuOpen && (

        <Stack className="headerbar__menus" gap={2}>
          <a href="/profile" className="headerbar__menus__item">
            <h4>Profile</h4>
            <div className="headerbar__menus__item__icon">
              <Person />
            </div>
          </a>
          <a href="/journal" className="headerbar__menus__item">
            <h4>Journal</h4>
            <div className="headerbar__menus__item__icon">
              <TrackChanges />
            </div>
          </a>
          <a href="/dash" className="headerbar__menus__item">
            <h4>Dashboard</h4>
            <div className="headerbar__menus__item__icon">
              <Code />
            </div>
          </a>
          <a href="/onboard" className="headerbar__menus__item">
            <h4>Edit Goal</h4>
            <div className="headerbar__menus__item__icon">
              <Edit />
            </div>
          </a>
          <a href="/login" onClick={() => { dispatch(logout()) }} className="headerbar__menus__item">
            <h4 className="red">Sign out</h4>
            <div className="red headerbar__menus__item__icon">
              <Logout />
            </div>
          </a>
        </Stack>
      )
      }
    </div >
  );
};

export default Header;
