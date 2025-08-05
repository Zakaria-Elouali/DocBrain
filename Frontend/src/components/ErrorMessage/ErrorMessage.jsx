const ErrorMessage = (props) => {
    return (
        <div className="bg-red-500 text-white rounded-lg p-2 mb-4">
            <p className="text-sm">{props.error}</p>
        </div>
    );
}

export default ErrorMessage;