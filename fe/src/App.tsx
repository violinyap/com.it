import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

import "./style.scss";

import { Provider } from "react-redux";
import store from "./store/store";
import Template from "./components/template";
import Journal from "./pages/journal";
import Profile from "./pages/profile";
import Onboard from "./pages/onboard";
import StressJournal from "./pages/journal/stress";
import ProdJournal from "./pages/journal/productive";
import TodoJournal from "./pages/journal/todo";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#B0FF4D',
    },
    secondary: {
      main: 'rgba(127, 183, 190, 0.6)',
    },
    background: {
      default: '#18181A'
    },
    error: {
      main: '#FF6B6B'
    },
    warning: {
      main: '#DEF276'
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Template />} >
              <Route index element={<Dashboard />} />
              <Route path="/onboard" element={<Onboard />} />
              <Route path="profile" element={<Profile />} >
                <Route index element={<Profile />} />
              </Route>
              <Route path="/dash" element={<Dashboard />} />
              <Route path="journal">
                <Route index element={<Journal />} />
                <Route path="stress" element={<StressJournal />} />
                <Route path="productivity" element={<ProdJournal />} />
                <Route path="todo" element={<TodoJournal />} />
              </Route>

            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
