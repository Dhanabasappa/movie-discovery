const ErrorState = ({ message }) => {
  return (
    <div className="error">
      <h2>😢 Something went wrong</h2>
      <p>{message}</p>
    </div>
  );
};

export default ErrorState;
