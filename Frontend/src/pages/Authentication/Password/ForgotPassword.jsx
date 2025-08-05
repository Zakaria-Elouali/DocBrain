// ForgotPassword.jsx
import React, {useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import ErrorMessage from "components/ErrorMessage/ErrorMessage";
import InfoMessage from "components/ErrorMessage/InfoMessage";

const ForgotPassword = () => {
    const emailInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const email = emailInputRef.current.value;

        try {
            const response = await fetch("http://localhost:8080/api/auth/forgot-password",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email}),
                });
            console.log('here');
            const res = await response.json();

            // Handle non-OK responses
            if (!response.ok) {
                if (response.status === 404) {
                    // Handle 404 without trying to parse JSON
                    setError(res.message);
                } else {
                    setError(`Unexpected error: ${response.status}`);
                }
                setIsLoading(false);
                return;
            }
            if (res.message === "Check your email for the passcode") {
                localStorage.setItem('emailForgotPass',email);
                setError('');
                navigate('/confirm-password'); // Navigate to login on success
            }

        } catch (e) {
            console.log(e);
        }

    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-100">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Forgot Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="input input-bordered"
                                ref={emailInputRef}
                            />
                        </div>
                        {(error && !isLoading) && <ErrorMessage error={error}/>}
                        {(info && !isLoading) && <InfoMessage info={info}/>}
                        <div className="form-control">
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>
                    <p className="mt-4 text-sm text-center">
                        Got a Password? <Link className="text-primary" to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
