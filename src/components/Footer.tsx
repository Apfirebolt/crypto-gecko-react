import React, { FC } from "react";

const FooterComponent: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-800 bg-neutral-950/80 text-neutral-400 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Mission */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                🦎
              </span>
              <span className="text-base font-semibold tracking-tight text-white">
                Crypto Gecko
              </span>
            </div>
            <p className="text-sm leading-6 text-neutral-400">
              Real-time market analytics, coin data, and exchange insights
              delivered with high precision.
            </p>
          </div>

          {/* Column 1: Market & Coins */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-200">
              Coins
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#all-coins" className="transition hover:text-white">
                  All Cryptocurrencies
                </a>
              </li>
              <li>
                <a href="#market-cap" className="transition hover:text-white">
                  Market Cap Rankings
                </a>
              </li>
              <li>
                <a href="#new-coins" className="transition hover:text-white">
                  Recently Added
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Markets & Exchanges */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-200">
              Exchanges
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#spot" className="transition hover:text-white">
                  Spot Exchanges
                </a>
              </li>
              <li>
                <a href="#derivatives" className="transition hover:text-white">
                  Derivatives
                </a>
              </li>
              <li>
                <a href="#dex" className="transition hover:text-white">
                  Decentralized (DEX)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Insights & Trends */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-200">
              Trending
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#gainers" className="transition hover:text-white">
                  Top Gainers & Losers
                </a>
              </li>
              <li>
                <a href="#categories" className="transition hover:text-white">
                  Categories
                </a>
              </li>
              <li>
                <a href="#sentiment" className="transition hover:text-white">
                  Market Sentiment
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800/80 pt-6 sm:flex-row">
          <p className="text-xs text-neutral-500">
            © {currentYear} Crypto Gecko. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-neutral-500">
            <a href="#privacy" className="transition hover:text-neutral-300">
              Privacy Policy
            </a>
            <a href="#terms" className="transition hover:text-neutral-300">
              Terms of Service
            </a>
            <a href="#api" className="transition hover:text-neutral-300">
              API Docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;