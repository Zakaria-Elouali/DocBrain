import React from "react";
import { Link, useLocation } from "react-router-dom";

import logoSm from "../assets/images/logo-sm.png";
import logoSmDark from "../assets/images/logo-dark-mode.png";

import LanguageDropdown from "components/Common/LanguageDropdown";
import ProfileDropdown from "components/Common/ProfileDropdown";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const Header = ({ headerClass }) => {
  const { i18n } = useTranslation();
  let isArabicLanguage = i18n.language == "ar";
  const user = JSON.parse(sessionStorage.getItem("authUser")) ?? {};

  const sidebarVisibilityData = createSelector(
    (state) => state.Layout.sidebarVisibilityType,
    (sidebarVisibilityType) => sidebarVisibilityType
  );

  const sidebarVisibilityType = useSelector(sidebarVisibilityData);
  const location = useLocation();
  const isPageWithoutLayout =
    location.pathname.includes("/home") ||
    location.pathname.includes("/unauthorized");

  // const addEventListenerOnSmHoverMenu = () => {
  //   const dss = document.documentElement.getAttribute("data-FileTree-size");
  //   let new_dss = dss.endsWith("-active") ? "sm-hover" : "sm-hover-active";
  //   document.documentElement.setAttribute("data-FileTree-size", new_dss);
  // };

  return (
    <React.Fragment>
      <header
        id="page-topbar"
        className={headerClass}
        style={{ left: 0, right: 0 }}
      >
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              {/*<div className="navbar-brand-box">*/}
              {/*  <Link to="/home" className="logo logo-dark">*/}
              {/*    <span className="logo-sm fw-bolder">*/}
              {/*      <img*/}
              {/*        src={logoSm}*/}
              {/*        alt=""*/}
              {/*        height="50"*/}
              {/*        style={{ width: 250 }}*/}
              {/*      />*/}
              {/*    </span>*/}
              {/*    <span className="logo-lg fw-bolder">*/}
              {/*      <img*/}
              {/*        src={logoSm}*/}
              {/*        alt=""*/}
              {/*        height="50"*/}
              {/*        style={{ width: 250 }}*/}
              {/*      />*/}
              {/*    </span>*/}
              {/*  </Link>*/}
              {/*</div>*/}
              {/*-------------------for the logos */}
              <div className="navbar-brand-box horizontal-logo">
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoSm} alt="" height="17" />
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logoSmDark} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoSmDark} alt="" height="17" />
                  </span>
                </Link>
              </div>

              {/*{!isPageWithoutLayout && (*/}
              {/*  <button*/}
              {/*    // onClick={() =>*/}
              {/*    //   adjustSidebar(sidebarVisibilityType, isArabicLanguage)*/}
              {/*    // //   //   handleSidebarToggle(isArabicLanguage)*/}
              {/*    // }*/}
              {/*    type="button"*/}
              {/*    className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"*/}
              {/*    id="topnav-hamburger-icon"*/}
              {/*  >*/}
              {/*    <span className="hamburger-icon open">*/}
              {/*      <span></span>*/}
              {/*      <span></span>*/}
              {/*      <span></span>*/}
              {/*    </span>*/}
              {/*  </button>*/}
              {/*)}*/}
            </div>
            <div className="d-flex align-items-center">
              <LanguageDropdown />
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
