import React, { useEffect } from "react";
import { Navigate, Route } from "react-router-dom";
import { setAuthorization } from "@/helpers/api_helper";
import { useDispatch } from "react-redux";

import { useProfile } from "hooks/UserHooks";
import { useTranslation } from "react-i18next";

import {
  // getEnums,
  // getInteractionParametersApiRequest,
  logoutUser,
} from "@/store/actions";

const AuthProtected = (props) => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  const { userProfile, loading, token } = useProfile();

  useEffect(() => {
    if (userProfile && !loading && token) {
      setAuthorization(token);
      // dispatch(getEnums(null, i18n.language));
      // dispatch(getInteractionParametersApiRequest());
    } else if (!userProfile && loading && !token) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  /*
          Navigate is un-auth access protected routes via url
          */

  if (!userProfile && loading && !token) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {" "}
            <Component {...props} />{" "}
          </>
        );
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
