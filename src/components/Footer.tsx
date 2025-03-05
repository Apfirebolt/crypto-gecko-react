import { Fragment, FC } from "react";

const FooterComponent: FC = () => {
  return (
    <Fragment>
      <footer
        className="bg-neutral-700
             text-xl text-white text-center
             border-t-4
             fixed
             inset-x-0
             bottom-0
             p-4"
      >
        <div className="grid grid-cols-3 gap-4 border-b-2 border-neutral-600">
          <div>
            <h3 className="text-center text-lg font-bold my-2">Coins</h3>
            <p>All the coins in the world</p>
          </div>
          <div>
            <h3 className="text-center text-lg font-bold my-2">Exchanges</h3>
            <p>All the coins in the world All the exchanges in the world</p>
          </div>
          <div>
            <h3 className="text-center text-lg font-bold my-2">Trending</h3>
            <p>Get trending coins and categories</p>
          </div>
        </div>
        <div className="mt-4">
          <p>Copyright @2025 Crypto Gecko</p>
        </div>
      </footer>
    </Fragment>
  );
};

export default FooterComponent;
