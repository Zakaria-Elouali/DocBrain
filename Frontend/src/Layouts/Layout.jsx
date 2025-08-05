import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import withRouter from "components/Common/withRouter";

import Header from "./Header";
import Footer from "./Footer";

import {
    changeLayout,
    changeLayoutMode,
    changeLayoutPosition,
    changeLayoutWidth,
    changeLeftSidebarSizeType,
    changeLeftSidebarViewType,
    changeSidebarTheme,
    changeSidebarVisibility,
    changeTopbarTheme,
} from "../store/actions";

import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { auto } from "@popperjs/core";
import { useLocation } from "react-router";
import { Row, Col } from "reactstrap";
import {Sidebar} from "./Sidebar";

const Layout = (props) => {
    const [headerClass, setHeaderClass] = useState("");
    const dispatch = useDispatch();
    const selectLayoutProperties = createSelector(
        (state) => state.Layout,
        (layout) => ({
            layoutType: layout.layoutType,
            leftSidebarType: layout.leftSidebarType,
            layoutModeType: layout.layoutModeType,
            layoutWidthType: layout.layoutWidthType,
            layoutPositionType: layout.layoutPositionType,
            topBarThemeType: layout.topBarThemeType,
            leftSidebarSizeType: layout.leftSidebarSizeType,
            leftSidebarViewType: layout.leftSidebarViewType,
            leftSidebarImageType: layout.leftSidebarImageType,
            sidebarVisibilityType: layout.sidebarVisibilityType,
        })
    );

    const {
        layoutType,
        leftSidebarType,
        layoutModeType,
        layoutWidthType,
        layoutPositionType,
        topBarThemeType,
        leftSidebarSizeType,
        leftSidebarViewType,
        sidebarVisibilityType,
    } = useSelector(selectLayoutProperties);
    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
    });

    function scrollNavigation() {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 50) {
            setHeaderClass("topbar-shadow");
        } else {
            setHeaderClass("");
        }
    }

    useEffect(() => {
        window.dispatchEvent(new Event("resize"));

        if (layoutType) dispatch(changeLeftSidebarViewType(leftSidebarViewType));
        if (leftSidebarSizeType)
            dispatch(changeLeftSidebarSizeType(leftSidebarSizeType));
        if (leftSidebarType) dispatch(changeSidebarTheme(leftSidebarType));
        if (layoutModeType) dispatch(changeLayoutMode(layoutModeType));
        if (layoutWidthType) dispatch(changeLayoutWidth(layoutWidthType));
        if (layoutPositionType) dispatch(changeLayoutPosition(layoutPositionType));
        if (topBarThemeType) dispatch(changeTopbarTheme(topBarThemeType));
        if (layoutType) dispatch(changeLayout(layoutType));
        if (sidebarVisibilityType)
            dispatch(changeSidebarVisibility(sidebarVisibilityType));
    }, [
        layoutType,
        leftSidebarType,
        layoutModeType,
        layoutWidthType,
        layoutPositionType,
        topBarThemeType,
        leftSidebarSizeType,
        leftSidebarViewType,
        sidebarVisibilityType,
        dispatch,
    ]);

    // useEffect(() => {
    //     if (
    //         sidebarVisibilityType === "show" ||
    //         layoutType === "vertical" ||
    //         layoutType === "twocolumn"
    //     ) {
    //         document.querySelector(".hamburger-icon")?.classList.remove("open");
    //     } else {
    //         document.querySelector(".hamburger-icon")?.classList.add("open");
    //     }
    // }, [sidebarVisibilityType, layoutType]);
    //
    // const onChangeLayoutMode = (value) => {
    //     if (changeLayoutMode) {
    //         dispatch(changeLayoutMode(value));
    //     }
    // };

    const location = useLocation();
    const isPageWithoutLayout =
        location.pathname.includes("/home") ||
        location.pathname.includes("/unauthorized");

    return (
        <React.Fragment>
            <div id="layout-wrapper">
                <Header
                    headerClass={headerClass}
                    layoutModeType={layoutModeType}
                    // onChangeLayoutMode={onChangeLayoutMode}
                />
                <div
                    className="main-content"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                >
                    {!isPageWithoutLayout ? (
                        <>
                            <div id="sidebarContainer">
                                <Sidebar layoutType={layoutType} />
                            </div>
                            <div id="mainContainer" style={{ position: 'relative' }}>
                                {props.children}
                            </div>
                        </>
                    ) : (
                        <Row>{props.children}</Row>
                    )}
                </div>
                <Footer />
            </div>
        </React.Fragment>
    );
};

Layout.propTypes = {
    children: PropTypes.object,
};

export default withRouter(Layout);
