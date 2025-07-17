import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RainbowKitCustomConnectButton } from "./scaffold-eth";
import { UserGroupIcon, BriefcaseIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useAuth } from "~~/contexts/AuthContext";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Girişimler",
    href: "/projects",
    icon: <BriefcaseIcon className="h-4 w-4" />,
  },
  {
    label: "Topluluk",
    href: "/people",
    icon: <UserGroupIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "underline" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Authentication Button Component
 */
const AuthButton = () => {
  const { isAuthenticated, user, signIn, logOut, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <button className="btn btn-sm btn-ghost" disabled>
        <span className="loading loading-spinner loading-xs"></span>
      </button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-sm btn-ghost">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="truncate max-w-24">
              {user.ens || `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`}
            </span>
          </div>
        </div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <li>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {user.ens || "Anonymous"}
              </span>
              <span className="text-xs text-gray-500">
                {user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {user.role}
              </span>
            </div>
          </li>
          <div className="divider my-1"></div>
          <li>
            <button onClick={logOut} className="text-error">
              Çıkış Yap
            </button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <button 
      onClick={signIn}
      className="btn btn-sm btn-primary"
      disabled={isLoading}
    >
      <KeyIcon className="h-4 w-4" />
      {error ? "Tekrar Dene" : "Giriş Yap"}
    </button>
  );
};

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="navbar items-start bg-base-200 px-5 py-4">
      <div className="navbar-start gap-10">
        <Link href="/" passHref className="flex items-center">
          <div className="flex relative w-[130px] md:w-[150px] h-[36px]">
            <Image alt="Turkish Web3 logo" className="cursor-pointer" fill sizes="150px" src="/assets/logo.png" />
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>

      <div className="navbar-end flex-grow z-10 gap-2">
        <AuthButton />
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
