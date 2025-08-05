import React, {useEffect} from 'react';
import './App.css';
import "./assets/scss/main.scss";
import "react-toastify/dist/ReactToastify.css";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '@coreui/coreui/dist/css/coreui.min.css';
import ChatBot from "components/AI/ChatBot";
import Route from "./Routes";
import { useTranslation } from "react-i18next";
import {useAuth} from "@/helpers/auth_helper";



function App() {

    const {isAuthenticated} = useAuth();

    // for loading the theme from local storage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
    }, []);

    const { i18n} = useTranslation();
    document.body.dir = i18n.dir();
    const isRTL = i18n.dir() === "rtl";

  return (
    <React.Fragment>
    <Route />
    {location.pathname !== "/login" && isAuthenticated && <ChatBot rtl={isRTL} />}
  </React.Fragment>
  );
}

export default App;
