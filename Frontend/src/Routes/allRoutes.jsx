import React from "react";
import { Navigate } from "react-router-dom"; //Dashboard
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout"; // Custom
// import Users from "../pages/Users/Users";
import { ROLES } from "@/helpers/auth_helper";
import HomePage from "../pages/Home";
import Unauthorized from "../pages/unauthorized";
import Dashboard from "../pages/Dashboard/dashboard";
import ForgotPassword from "../pages/Authentication/Password/ForgotPassword";
import Signup from "../pages/Authentication/Signup";
import EmailConfirmation from "../pages/Authentication/Password/EmailConfirmation";
import {ContentPanel} from "components/SideBar/ContentPanel";




const authProtectedRoutes = [
  {
    path: "/home",
    role: [

      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.VIEWER,
      ROLES.CLIENT,
    ],
    component: <HomePage />,
  },
  {
    path: "/dashboard",
    role: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CLIENT],
    component: <ContentPanel activePanel="dashboard" />,  // Use this instead of <Dashboard/>
  },
  // {
  //   path: "/dashboard",
  //   role: [
  //
  //     ROLES.SUPER_ADMIN,
  //     ROLES.ADMIN,
  //   ],
  //   component: <Dashboard/>,
  // },
  // {
  //   path: "/dashboard/analyticsboard",
  //   role: [ROLES.ROOT_ADMIN],
  //   component: <AnalyticsBoard />,
  // },
  // {
  //   path: "/dashboard/processdashboard",
  //   role: [ROLES.ROOT_ADMIN, ROLES.SUPER_ADMIN],
  //   component: <ProcessDashboard />,
  // },
  // {
  //   path: "/users",
  //   role: [
  //     ROLES.SUPER_ADMIN,
  //     ROLES.ROOT_ADMIN,
  //     ROLES.ADMIN,
  //     ROLES.SUPER_VIEWER,
  //   ],
  //   component: <Users />,
  // },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/login" />,
  },

  // Invoice routes
  {
    path: "/invoice",
    role: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.VIEWER, ROLES.CLIENT],
    component: <ContentPanel activePanel="invoice" />,
  },

  { path: "*", component: <Navigate to="/home" /> },
  // { path: "*", component: <ContentPanel activePanel="dashboard" /> },

];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/signup", component: <Signup /> },
  { path: "/email-confirmation", component: <EmailConfirmation /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
  { path: "/unauthorized", component: <Unauthorized /> },
];

export { authProtectedRoutes, publicRoutes };
