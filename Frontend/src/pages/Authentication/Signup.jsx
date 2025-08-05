import React, {useState} from 'react';
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
import { Link, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../store/actions';
import {createSelector} from "@reduxjs/toolkit";
import {ROLES as Roles} from "../../helpers/auth_helper";
import {toast} from "react-toastify"; // Replace with your actual action

function Signup() {
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
    const {errorMsg, loading} = useSelector(
        selectLayoutProperties
    );
    const [passwordShow, setPasswordShow] = useState(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
    // Formik setup
    const validation = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            username: '',
            companyName: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            username: Yup.string().required('username is required most be unique'),
            companyName: Yup.string().required('Company Name is required most be unique'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required')
        }),
        onSubmit: (values, { setSubmitting, setErrors }) => {
            const signupData = {
                fullName: `${values.firstName} ${values.lastName}`,
                username : values.username,
                companyName : values.companyName,
                email: values.email,
                password: values.password,
            };

            sessionStorage.setItem("confirmationEmail", signupData.email);

             dispatch(registerUser(signupData, (error) => {
                if (error && error.message === "Account exists but not verified. Please verify your email.") {
                    navigate('/email-confirmation'); // Redirect to confirmation page
                    toast.error(
                        "Account exists but not verified. Please verify your email.",
                        { position: toast.POSITION.TOP_RIGHT, autoClose: 8000 }
                    );
                }else if (error && error.message === "Email already exists.") {
                     navigate('/login'); // Redirect to confirmation page
                     toast.error(
                         "Account already exists. Please login.",
                         { position: toast.POSITION.TOP_RIGHT, autoClose: 8000 }
                     );
                 } else if (error) {
                    console.log("Something went wrong. Please try again.");
                    setErrors({ submit: error.message || "Something went wrong. Please try again." });
                }
            })).finally(() => {
                console.log("Finally block executed"); // This will never execute
                setSubmitting(false);
            });

        },
    });

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
                                    <CardBody className="py-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Create Account</h5>
                                        </div>
                                        {errorMsg && (
                                            <Alert color="danger"> {errorMsg} </Alert>
                                        )}
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                action="#"
                                            >
                                                <Row className={"mb-2"}>
                                                <Col md = {6} lg={6} xl={6}>
                                                    <div>
                                                        <Label htmlFor="firstName" className="form-label">
                                                            First Name
                                                        </Label>
                                                        <Input
                                                            name="firstName"
                                                            className="form-control"
                                                            placeholder="Enter first name"
                                                            type="text"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.firstName || ""}
                                                            invalid={
                                                                !! (validation.touched.firstName &&
                                                                validation.errors.firstName)
                                                            }
                                                        />
                                                        {validation.touched.firstName &&
                                                            validation.errors.firstName && (
                                                                <FormFeedback type="invalid">
                                                                    {validation.errors.firstName}
                                                                </FormFeedback>
                                                            )}
                                                    </div>
                                                </Col>
                                                <Col md = {6} lg={6} xl={6}>
                                                    <div>
                                                        <Label htmlFor="lastName" className="form-label">
                                                            Last Name
                                                        </Label>
                                                        <Input
                                                            name="lastName"
                                                            className="form-control"
                                                            placeholder="Enter last name"
                                                            type="text"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.lastName || ""}
                                                            invalid={
                                                                validation.touched.lastName &&
                                                                validation.errors.lastName
                                                            }
                                                        />
                                                        {validation.touched.lastName &&
                                                            validation.errors.lastName && (
                                                                <FormFeedback type="invalid">
                                                                    {validation.errors.lastName}
                                                                </FormFeedback>
                                                            )}
                                                    </div>
                                                </Col>
                                                </Row>
                                                <Row className={"mb-2"}>
                                                    <Col md = {6} lg={6} xl={6}>
                                                        <div>
                                                            <Label htmlFor="username" className="form-label">
                                                                Username
                                                            </Label>
                                                            <Input
                                                                name="username"
                                                                className="form-control"
                                                                placeholder="Enter username"
                                                                type="username"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.username || ""}
                                                                invalid={
                                                                    !! (validation.touched.username &&
                                                                        validation.errors.username)
                                                                }
                                                            />
                                                            {validation.touched.username &&
                                                                validation.errors.username && (
                                                                    <FormFeedback type="invalid">
                                                                        {validation.errors.username}
                                                                    </FormFeedback>
                                                                )}
                                                        </div>
                                                    </Col>
                                                    <Col md = {6} lg={6} xl={6}>
                                                        <div>
                                                            <Label htmlFor="companyName" className="form-label">
                                                                Company Name
                                                            </Label>
                                                            <Input
                                                                name="companyName"
                                                                className="form-control"
                                                                placeholder="Enter company name"
                                                                type="text"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.companyName || ""}
                                                                invalid={
                                                                    validation.touched.companyName &&
                                                                    validation.errors.companyName
                                                                }
                                                            />
                                                            {validation.touched.companyName &&
                                                                validation.errors.companyName && (
                                                                    <FormFeedback type="invalid">
                                                                        {validation.errors.companyName}
                                                                    </FormFeedback>
                                                                )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className="mb-3">
                                                    <Label htmlFor="email" className="form-label">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter email"
                                                        type="email"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.email || ""}
                                                        invalid={
                                                            validation.touched.email &&
                                                            validation.errors.email
                                                        }
                                                    />
                                                    {validation.touched.email &&
                                                        validation.errors.email && (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.email}
                                                            </FormFeedback>
                                                        )}
                                                </div>

                                                <div className="mb-3">
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
                                                                !! validation.touched.password &&
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

                                                <div className="mb-3">
                                                    <Label
                                                        className="form-label"
                                                        htmlFor="confirm-password-input"
                                                    >
                                                        Confirm Password
                                                    </Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            name="confirmPassword"
                                                            value={validation.values.confirmPassword || ""}
                                                            type={confirmPasswordShow ? "text" : "password"}
                                                            className="form-control pe-5"
                                                            placeholder="Confirm Password"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            invalid={
                                                                !! (validation.touched.confirmPassword &&
                                                                validation.errors.confirmPassword)
                                                            }
                                                        />
                                                        {validation.touched.confirmPassword &&
                                                            validation.errors.confirmPassword && (
                                                                <FormFeedback type="invalid">
                                                                    {validation.errors.confirmPassword}
                                                                </FormFeedback>
                                                            )}
                                                        <button
                                                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                                            type="button"
                                                            id="confirm-password-addon"
                                                            onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}
                                                        >
                                                            <i className="ri-eye-fill align-middle"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <Button
                                                        color="success"
                                                        disabled={loading}
                                                        className="btn btn-success w-100"
                                                        type="submit"
                                                    >
                                                        {loading && (
                                                            <Spinner size="sm" className="me-2">
                                                                Loading...
                                                            </Spinner>
                                                        )}
                                                        Sign Up
                                                    </Button>
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <p className="mb-0">Already have an account ? <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <footer className="footer">
                    <Container>
                        <div className="text-center">
                            <p className="mb-0 text-muted">
                                &copy; {new Date().getFullYear()}
                            </p>
                        </div>
                    </Container>
                </footer>
            </div>
        </React.Fragment>
    )
}


export default Signup;
