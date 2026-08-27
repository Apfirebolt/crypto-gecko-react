import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const HeaderComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block py-2 pr-4 pl-3 rounded md:p-0 transition-colors duration-200 ${
      isActive
        ? "text-blue-600 dark:text-blue-400 font-semibold"
        : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
    }`;

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Exchanges", to: "/exchanges" },
    { label: "Coins", to: "/coins" },
    { label: "Trending Coins", to: "/trending" },
  ];

  return (
    <nav className="bg-red-800 border-b border-gray-200 px-4 py-3 dark:bg-gray-900 dark:border-gray-800">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <NavLink
          to="/"
          className="text-xl font-bold text-gray-900 dark:text-white"
          onClick={closeMenu}
        >
          Crypto Gecko
        </NavLink>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-700"
          aria-controls="navbar-menu"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-menu"
        >
          <ul className="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={navLinkClasses}
                  onClick={closeMenu}
                  end={item.to === "/"}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HeaderComponent;