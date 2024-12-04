import { Fragment } from "react";

const LoaderComponent = () => {
  return (
    <Fragment>
      <div className="loader">
        <h2 className="text-3xl text-center text-blue-500">
            Loading ....
        </h2>
      </div>
    </Fragment>
  );
};

export default LoaderComponent;