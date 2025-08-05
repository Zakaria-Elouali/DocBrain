import React, { useEffect, useState } from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import avatar1 from "../../assets/images/users/avatar.avif";
import withRouter from "./withRouter";
import { withTranslation } from "react-i18next";
import {LOGOUT} from "@/helpers/url_helper";
import ThemeController from "../ThemeController";
import {useDispatch, useSelector} from "react-redux";
import {fetchProfileRequest} from "@/store/users/action";

const ProfileDropdown = (props) => {
  const dispatch = useDispatch();
  // const user = JSON.parse(sessionStorage.getItem("authUser") ?? {});
   const [userName, setUserName] = useState("Admin");
   const { userProfile } = useSelector((state) => state.UserReducer);
   const [profilePicture, setProfilePicture] = useState(avatar1);
   const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false)

    useEffect(() => {
        dispatch(fetchProfileRequest());
    }, [dispatch]); // Only depends on dispatch which is stable

    // Update username when profile changes
    useEffect(() => {
        if (userProfile?.fullName) {
            setUserName(userProfile.fullName);
        }
    }, [userProfile?.fullName]);

    // Handle profile picture loading
    useEffect(() => {
        if (userProfile?.profilePicture && !hasAttemptedLoad) {
            setHasAttemptedLoad(true);
            const img = new Image();
            img.src = userProfile.profilePicture;
            img.onload = () => setProfilePicture(userProfile.profilePicture);
            img.onerror = () => setProfilePicture(avatar1);
        } else if (!userProfile?.profilePicture && !hasAttemptedLoad) {
            setHasAttemptedLoad(true);
            setProfilePicture(avatar1);
        }
    }, [userProfile?.profilePicture, hasAttemptedLoad]);
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  return (
      <React.Fragment>
        <Dropdown
            isOpen={isProfileDropdown}
            toggle={toggleProfileDropdown}
            className="ms-sm-3 header-item topbar-user"
        >
          <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <img
                            className="rounded-circle header-profile-user"
                            src={profilePicture}
                            alt="Header Avatar"
                        />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                                {userName}
                            </span>
                        </span>
                    </span>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <h6 className="dropdown-header">
              {props.t("Welcome")} {userName}!
            </h6>
            <DropdownItem href="#" onClick={() => console.log("Profile Clicked")}>
              <i className="mdi mdi-account text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">{props.t("Profile")}</span>
            </DropdownItem>
            <DropdownItem href="#" onClick={() => console.log("Settings Clicked")}>
              <i className="mdi mdi-cog text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">{props.t("Settings")}</span>
            </DropdownItem>
            <DropdownItem divider />
                  <div className="">
                      <h6 className="align-middle mx-2 mb-2 ">{props.t("Theme Mode")}</h6>
                      <div onClick={(e) => e.stopPropagation()}>
                          <ThemeController/>
                      </div>
                  </div>
              <DropdownItem divider/>
              <DropdownItem href={LOGOUT}>
                  <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle" data-key="t-logout">
                            {props.t("Logout")}
                        </span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
  );
};

export default withRouter(withTranslation()(ProfileDropdown));
