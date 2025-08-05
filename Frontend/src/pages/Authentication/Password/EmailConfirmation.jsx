import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import InfoMessage from "components/ErrorMessage/InfoMessage";
import {Card, CardBody, Col, Container, Form, Row} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {createSelector} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {confirmEmailRequest, resendConfirmationEmail} from "../../../store/auth/emailconfirmation/actions";
import {Loader2} from "lucide-react";

const EmailConfirmation = () => {
    const [code, setCode] = useState(new Array(8).fill(""));
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    // const [error, setError] = useState("");
    const [info, setInfo] = useState("");
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
    useEffect(() => {
        const savedEmail = sessionStorage.getItem("confirmationEmail");
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const handleResend = async () => {
        try {
                console.log("handel resend trigged");
            dispatch(resendConfirmationEmail(email));

        } catch (error) {
            console.error('error:', error);
            // setError('Something went wrong. Please try again.');
        } finally {
            // setIsLoading(false); // Stop loading after request
        }
    }

    // const handleCodeChange = (e, index) => {
    //     const value = e.target.value;
    //     if (isNaN(value)) return;  // only allow numbers
    //
    //     let newCode = [...code];
    //     newCode[index] = value;
    //     setCode(newCode);
    //
    //     // Move focus to next input if current is filled and not the last
    //     if (value !== "" && index < 7) {
    //         document.getElementById(`codeInput-${index + 1}`).focus();
    //     }
    //
    //     // Check if all fields are filled, and set the confirmation token
    //     if (newCode.every(digit => digit !== "")) {
    //         const joinedCode = newCode.join("");
    //         handleSubmit(joinedCode).then(); // Call submit directly here
    //     }
    // };
    //
    // const handleKeyDown = (e, index) => {
    //     if (e.key === "Backspace") {
    //         let newCode = [...code];
    //         // If current input is not empty, clear it first
    //         if (newCode[index] !== "") {
    //             newCode[index] = "";
    //             setCode(newCode);
    //         }
    //         // Move focus to the previous input if it's not the first
    //         else if (index > 0) {
    //             document.getElementById(`codeInput-${index - 1}`).focus();
    //         }
    //     }
    // };

    // const validation = useFormik({
    //     enableReinitialize: true,
    //
    //     initialValues: {
    //         email: email || "",
    //         confirmation_code: code || "",
    //     },
    //     validationSchema: Yup.object({
    //         confirmation_code: Yup.string().required("Please Enter Your confirmation Code"),
    //     }),
    //     onSubmit: (values) => {
    //         dispatch(confirmEmailRequest(values));
    //     },
    // });
    const codeInputs = Array.from({ length: 8 }, (_, i) => `codeInput-${i}`);

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            email: email || "",
            confirmation_code: "", // Joined code will populate this before submit
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email format").required("Email is required"),
            confirmation_code: Yup.string()
                .length(8, "Confirmation code must be 8 digits")
                .required("Please Enter Your Confirmation Code"),
        }),
        onSubmit: (values, { setSubmitting, setErrors }) => {
            console.log("submiting values:", values);
            dispatch(confirmEmailRequest(values))
                .then(() => {
                    toast.success("Email confirmed successfully!", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                })
                .catch((error) => {
                    toast.error(error.message || "An error occurred. Please try again.", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setSubmitting(false);
                });
        },
    });

    const handleCodeChange = (e, index) => {
        const value = e.target.value;

        // Only allow numbers
        if (value === '' || (value.length === 1 && !isNaN(Number(value)))) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Move focus to the next input if current is filled and not the last
            if (value !== "" && index < 7) {
                document.getElementById(`codeInput-${index + 1}`).focus();
            }

            // Automatically submit if all fields are filled
            const joinedCode = newCode.join("");
            if (joinedCode.length === 8) {
                validation.setFieldValue("confirmation_code", joinedCode);
                validation.handleSubmit();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newCode = [...code];

            // If current input is not empty, clear it first
            if (newCode[index] !== "") {
                newCode[index] = "";
                setCode(newCode);
            } else if (index > 0) {
                // Move focus to the previous input if it's not the first
                document.getElementById(codeInputs[index - 1]).focus();
            }
        }
    };

    return (
        <Container className="confirmation-page">
            <Row className="justify-content-center">
                <Col md={8} lg={6} xl={5}>
                    <Card className="mt-4 confirmation-card">
                        <CardBody className="confirmation-card-body">
                            <h2 className="confirmation-title">Enter your 8-digit confirmation code</h2>
                            <p className="confirmation-description">
                                We've sent a confirmation code to your email. Please enter the 8-digit code below to
                                verify your email address and complete the process.
                                If you didn't receive the code, please check your spam folder or <Link to="#"
                                                                                                       onClick={handleResend}
                                                                                                       className="confirmation-resend-link">resend the code</Link> to {email}.
                            </p>
                            {(error && !loading) && <div className="confirmation-error">{error}</div>}
                            {(info && !loading) && <div className="confirmation-info">{info}</div>}
                            <div className="d-flex justify-content-center">
                                <Form
                                    className="confirmation-code-form"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        validation.handleSubmit();
                                        return false;
                                    }}
                                    action="#"
                                >
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`codeInput-${index}`}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleCodeChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            className="confirmation-code-input"
                                        />
                                    ))}
                                </Form>
                            </div>

                            {/*{loading && (*/}
                            {/*    <div className="confirmation-loading">*/}
                            {/*        <div className="confirmation-loading-dots">*/}
                            {/*            <span></span>*/}
                            {/*            <span></span>*/}
                            {/*            <span></span>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                            {validation.isSubmitting && (
                                <div className="flex justify-center items-center mt-4">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
//         <Container>
//             <Row className="justify-content-center">
//                 <Col md={8} lg={6} xl={5}>
//                     <Card className="mt-4 cardlogin">
//                         <CardBody className="p-4">
//                             <h2 className="text-lg font-bold mb-2">Enter your 8-digit confirmation code</h2>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 We’ve sent a confirmation code to your email. Please enter the 8-digit code below to
//                                 verify your email address and complete the process.
//                                 If you didn’t receive the code, please check your spam folder or <Link to="#"
//                                                                                                        onClick={handleResend}
//                                                                                                        className="text-primary">resend
//                                 the code</Link> to {email}.
//                             </p>
//                             {(error && !loading) && <ErrorMessage error={error}/>}
//                             {(info && !loading) && <InfoMessage info={info}/>}
//                             <div className="d-flex justify-content-center">
//                                 <Form
//                                     onSubmit={(e) => {
//                                         e.preventDefault();
//                                         validation.handleSubmit();
//                                         return false;
//                                     }}
//                                     action="#"
//                                 >
//                                 {code.map((digit, index) => (
//                                     <input
//                                         key={index}
//                                         id={`codeInput-${index}`}
//                                         type="text"
//                                         maxLength="1"
//                                         value={digit}
//                                         onChange={(e) => handleCodeChange(e, index)}
//                                         onKeyDown={(e) => handleKeyDown(e, index)}
//                                         className="mx-1 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                         style={{
//                                             width: "2rem", // Reduced width
//                                             height: "2rem", // Keeps the input square
//                                             fontSize: "1rem", // Adjusted font size for smaller boxes
//                                         }}
//                                     />
//                                 ))}
//                                 </Form>
//                             </div>
//
//                             {/*<div className="form-control flex justify-center items-center">*/}
//                             {/*    {loading && <span className="loading loading-dots loading-md"></span>}*/}
//                             {/*</div>*/}
//                         </CardBody>
//                     </Card>
//                 </Col>
//             </Row>
//         </Container>
    );
};

export default EmailConfirmation;
