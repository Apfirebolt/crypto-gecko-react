import React, { Fragment } from "react";

const LoaderComponent: React.FC = () => {
  return (
    <Fragment>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-neutral-700"></div>
      </div>
    </Fragment>
  );
};

export default LoaderComponent;
