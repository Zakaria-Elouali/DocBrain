import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { logoutUser } from "@/store/actions";

import { useDispatch, useSelector } from "react-redux";

import withRouter from "components/Common/withRouter";
import { createSelector } from "reselect";

const Logout = () => {
    const dispatch = useDispatch();

    const clearLocalStorageWithPrefix = (prefix) => {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach((key) => localStorage.removeItem(key));
    };

    const isUserLogoutSelector = createSelector(
        (state) => state.LoginReducer.isUserLogout,
        (isUserLogout) => isUserLogout
    );
    const isUserLogout = useSelector(isUserLogoutSelector);

    useEffect(() => {
        clearLocalStorageWithPrefix("filter_");
        sessionStorage.removeItem("activeModule");
        dispatch(logoutUser());
    }, [dispatch]);

    if (isUserLogout) {
        return <Navigate to="/login" />;
    }

    return <></>;
};

Logout.propTypes = {
    history: PropTypes.object,
};

export default withRouter(Logout);
