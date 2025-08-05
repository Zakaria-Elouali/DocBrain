import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import InfoMessage from "components/ErrorMessage/InfoMessage";

const PasswordConfirmation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState(new Array(8).fill(""));
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem("emailForgotPass");
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const handleResend = async () => {
        // try {
        //     const responseResend = await fetch('http://localhost:8080/api/auth/resend-token', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({email}),
        //     });
        //
        //     // Check for response status
        //     if (!responseResend.ok) {
        //         const errorMessage = await responseResend.text(); // Read error message from server
        //         setError(`Error: ${errorMessage}`);
        //         setIsLoading(false);
        //         return;
        //     }
        //     // If the response is successful
        //     const res = await responseResend.json();
        //     setInfo('Token Sent, checkout your Email.');
        // } catch (error) {
        //     console.error('error:', error);
        //     setError('Something went wrong. Please try again.');
        // } finally {
        //     setIsLoading(false); // Stop loading after request
        // }
    }

    const handleCodeChange = (e, index) => {
        setError('');
        const value = e.target.value;
        if (isNaN(value)) return;  // only allow numbers

        let newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Move focus to next input if current is filled and not the last
        if (value !== "" && index < 7) {
            document.getElementById(`codeInput-${index + 1}`).focus();
        }

        // Check if all fields are filled, and set the confirmation token
        if (newCode.every(digit => digit !== "")) {
            const joinedCode = newCode.join("");
            handleSubmit(joinedCode).then(); // Call submit directly here
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            let newCode = [...code];
            // If current input is not empty, clear it first
            if (newCode[index] !== "") {
                newCode[index] = "";
                setCode(newCode);
            }
            // Move focus to the previous input if it's not the first
            else if (index > 0) {
                document.getElementById(`codeInput-${index - 1}`).focus();
            }
        }
    };

    const handleSubmit = async (joinedCode) => {
        setInfo('');
        setIsLoading(true);
        // Validate empty fields
        if (passwordInputRef.current.value.trim() === '' ||
            confirmPasswordInputRef.current.value.trim() === '') {
            setError('Passwords do not match');
            return;
        }
        const newPassword = passwordInputRef.current.value.trim();
        if (joinedCode.length === 8) {
            try {
                const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({passcode: joinedCode, email, newPassword}),
                });

                const res = await response.json();

                if (!response.ok) {
                    setError(res.message);
                    setIsLoading(false);
                    return;
                }

                if (res.message === "Password reset successfully") {
                    localStorage.removeItem('emailForgotPass');
                    setError('');
                    navigate('/informative-page', {
                        state: {
                            title: 'Password Reset Successful',
                            message: 'Your password has been reset successfully! You can now log in with your new password.',
                            link: '/login'
                        }
                    });
                }

            } catch (error) {
                console.error('Error during account confirmation:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-100">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Reset Password</h2>
                    {(error && !isLoading) && <ErrorMessage error={error}/>}
                    {(info && !isLoading) && <InfoMessage info={info}/>}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="input input-bordered"
                            ref={passwordInputRef}
                        />
                    </div>
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Confirm Password</span>
                        </label>
                        <input
                            type="password"
                            ref={confirmPasswordInputRef}
                            placeholder="Confirm your password"
                            className="input input-bordered"
                        />
                    </div>
                    <label className="label">
                        <span className="label-text">Enter your 8-digit confirmation code</span>
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                        We’ve sent a confirmation code to your email.
                        If you didn’t receive the code, Please enter the 8-digit code below to
                        reset your password and complete the process.please check your spam folder or <Link to="#"
                                                                                                            onClick={handleResend}
                                                                                                            className="text-primary">resend
                        the code</Link>.
                    </p>

                    <div className="flex space-x-2 mb-5">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                id={`codeInput-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleCodeChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-10 h-10 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>
                    <div className="form-control">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordConfirmation;
