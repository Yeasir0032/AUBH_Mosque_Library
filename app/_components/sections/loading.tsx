const LoadingOverlay = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-90 z-50"></div>
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
        <div className="custom-loader"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
