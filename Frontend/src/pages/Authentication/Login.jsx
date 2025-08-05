import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    FormFeedback,
    Input,
    Label,
    Row,
    Spinner,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { loginUser, resetLoginFlag } from "@/store/actions";
import withRouter from "components/Common/withRouter";
import { createSelector } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const Login = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectLayoutState = (state) => state.Account;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (layout) => ({
            user: layout.user,
            errorMsg: layout.errorMsg,
            loading: layout.loading,
            error: layout.error,
        })
    );

    const { user, errorMsg, loading, error } = useSelector(
        selectLayoutProperties
    );
    const loginError = useSelector((state) => state.LoginReducer.error);
    const [userLogin, setUserLogin] = useState([]);
    const [passwordShow, setPasswordShow] = useState(false);
    let to = "/dashboard";
    /**
     * if the variable has value we navigate to /labs/validate_invitation after login success (check Routes/index.jsx)
     */
    const from = localStorage.getItem("from");
    function getTo(url) {
        let _to = "/dashboard";
        try {
            const params = from.split(url)[1];
            const paramsFlag =
                params == undefined ||
                params == "undefined" ||
                params == null ||
                params == "null" ||
                !params
                    ? false
                    : true;
            if (params && paramsFlag) {
                _to = url + params;
            } else {
                localStorage.removeItem("from");
                _to = "/dashboard";
            }
        } catch (error) {
            console.log("code : 202303311056");
            _to = "/dashboard";
        }

        return _to;
    }

    if (from) {
        if (from?.toString().includes("/labs/validate_invitation")) {
            to = getTo("/labs/validate_invitation");
        } else if (from?.toString().includes("/forum/validate_invitation")) {
            to = getTo("/forum/validate_invitation");
        } else if (from?.toString().includes("/forum/validate_request")) {
            to = getTo("/forum/validate_request");
        }
    }

    // useEffect(() => {
    //     if (user && user) {
    //         debugger;
    //         const updatedUserData =
    //             process.env.REACT_APP_DEFAULTAUTH === "firebase"
    //                 ? user.multiFactor.user.email
    //                 : user.user.email;
    //         setUserLogin({
    //             username: updatedUserData,
    //             password: user.user.confirm_password ? user.user.confirm_password : "",
    //         });
    //     }
    // }, [user]);

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            username: userLogin.username || "",
            password: userLogin.password || "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Please Enter Your Email"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: (values,{ setSubmitting, setErrors }) => {
            sessionStorage.setItem("confirmationEmail", values.username);
            console.log ("login values", values);
            dispatch(loginUser(values, (error) => {
                console.log(error);
                if (error && error.message === "Please verify your email!") {
                    navigate('/email-confirmation'); // Redirect to confirmation page
                    toast.error(
                        "Please verify your email.",
                        { position: toast.POSITION.TOP_RIGHT, autoClose: 8000 }
                    );
                } else if (error) {
                    console.log("Something went wrong. Please try again.");
                    setErrors({ submit: error.message || "Something went wrong. Please try again." });
                }
            })).finally(() => {
                console.log("Finally block executed");
                setSubmitting(false);
            });
        },
    });

    // useEffect(() => {
    //     if (error) {
    //         setTimeout(() => {
    //             dispatch(resetLoginFlag());
    //         }, 3000);
    //     }
    // }, [dispatch, error]);
    //
    // useEffect(() => {
    //     loginError &&
    //     toast.error(
    //         "Invalid user/password, Please note that data entry season have been done for now",
    //         {
    //             position: toast.POSITION.TOP_RIGHT,
    //         },
    //         { autoClose: 8000 }
    //     );
    // }, [loginError]);

    document.title = "Login | DocBrain";
    return (
        <React.Fragment>
            <div className="auth-page-wrapper">
                <div
                    className="auth-one-bg-position auth-one-bg"
                    id="auth-particles"
                ></div>
                <div className="auth-page-content">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4 cardlogin">
                                    <CardBody className="p-4">
                                        {/*<div className="text-center mt-2">*/}
                                        {/*      <img*/}
                                        {/*        src={mtcitLogo}*/}
                                        {/*        alt="MTCIT Logo"*/}
                                        {/*        style={{ width: "400px" }}*/}
                                        {/*      />*/}
                                        {/*    </div>*/}
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Welcome </h5>
                                            <p className="text-muted">Sign in to continue</p>
                                        </div>
                                        {errorMsg && errorMsg ? (
                                            <Alert color="danger"> {errorMsg} </Alert>
                                        ) : null}
                                        <div className="p-2 mt-4">
                                            <Form onSubmit={validation.handleSubmit}>
                                                <div className="mb-3">
                                                    <Label htmlFor="email" className="form-label">
                                                        Username
                                                    </Label>
                                                    <Input
                                                        name="username"
                                                        className="form-control"
                                                        placeholder="Enter username"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.username || ""}
                                                        invalid={
                                                            validation.touched.username &&
                                                            validation.errors.username
                                                        }
                                                    />
                                                    {validation.touched.email &&
                                                        validation.errors.email && (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.username}
                                                            </FormFeedback>
                                                        )}
                                                </div>

                                                <div className="mb-3">
                                                    <div className="float-end">
                                                        <Link to="/forgot-password" className="text-muted">
                                                            Forgot password?
                                                        </Link>
                                                    </div>
                                                    <Label
                                                        className="form-label"
                                                        htmlFor="password-input"
                                                    >
                                                        Password
                                                    </Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            name="password"
                                                            value={validation.values.password || ""}
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5"
                                                            placeholder="Enter Password"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            invalid={
                                                                validation.touched.password &&
                                                                validation.errors.password
                                                            }
                                                        />
                                                        {validation.touched.password &&
                                                            validation.errors.password && (
                                                                <FormFeedback type="invalid">
                                                                    {validation.errors.password}
                                                                </FormFeedback>
                                                            )}
                                                        <button
                                                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                                            type="button"
                                                            id="password-addon"
                                                            onClick={() => setPasswordShow(!passwordShow)}
                                                        >
                                                            <i className="ri-eye-fill align-middle"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="form-check">
                                                    <Input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value=""
                                                        id="auth-remember-check"
                                                    />
                                                    <Label
                                                        className="form-check-label"
                                                        htmlFor="auth-remember-check"
                                                    >
                                                        Remember me
                                                    </Label>
                                                </div>

                                                <div className="mt-4">
                                                    <Button
                                                        color="success"
                                                        disabled={!error && loading}
                                                        className="btn btn-success w-100"
                                                        type="submit"
                                                    >
                                                        {!error && loading && (
                                                            <Spinner size="sm" className="me-2">
                                                                {" "}
                                                                Loading...{" "}
                                                            </Spinner>
                                                        )}
                                                        Sign In
                                                    </Button>
                                                </div>
                                                <div className="mt-4 d-flex justify-content-center align-items-center gap-2">
                                                    <h6 className="text-muted mb-0 ml-2">Not a member yet?</h6>
                                                    <Link to="/signup" className="float-end text-muted">
                                                        Sign Up
                                                    </Link>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <footer className="footer ">
                    <div className="container">
                        <div className="text-center">
                            <p className="mb-0 text-muted">
                                &copy; {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </React.Fragment>
    );
};

export default withRouter(Login);
