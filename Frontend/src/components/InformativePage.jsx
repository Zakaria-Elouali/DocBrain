import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

function InformativePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { title, message, link } = location.state || {};
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);

        // Redirect when countdown reaches 0
        if (countdown === 0) {
            navigate(link);
        }

        // Cleanup the timer on component unmount
        return () => clearInterval(timer);
    }, [countdown, navigate, link]);


    return (
        <div className="flex justify-center items-center min-h-screen bg-base-100">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">{title}</h2>
                    <p className="mt-1 text-sm">
                        {message} <Link className="text-primary" to={link}>Click Here</Link>
                    </p>
                    <p className="text-sm">Redirecting in {countdown} seconds...</p>
                </div>
            </div>
        </div>
    );
}

export default InformativePage;
