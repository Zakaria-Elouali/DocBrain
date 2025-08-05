const ErrorMessage = (props) => {
    return (
        <div className="bg-info text-white rounded-lg p-2 mb-4">
            <p className="text-sm">{props.info}</p>
        </div>
    );
}

export default ErrorMessage;