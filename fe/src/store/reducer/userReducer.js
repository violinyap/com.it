import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : {
          username: "",
        },
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    proxy_url: process.env.REACT_APP_PROXY_URL,
  },
  reducers: {
    login: (state, action) => {
      console.log("in login save", action.payload);
      localStorage.setItem(
        "isLoggedIn",
        JSON.stringify(action.payload.isLoggedIn)
      );
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
    },
    logout: (state) => {
      localStorage.clear();

      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
