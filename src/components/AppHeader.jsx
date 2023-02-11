import { useContext } from "react";
import { UserContext } from "@/lib/UserContext";
import Link from "next/link";
import AppNavigation from "./AppNavigation";
import { magic } from "@/lib/magic";

export default function AppHeader({}) {
  const [user] = useContext(UserContext);

  function openWallet() {
    magic.connect.showWallet().catch((err) => console.log(err));
  }

  function loginWithConnect() {
    magic.wallet.connectWithUI().catch((err) => console.log(err));
  }

  return (
    <header className="border-b border-gray-300">
      <nav className="container flex justify-between py-3">
        <Link href={"/"} className="flex space-x-3">
          <img src={"/logo.svg"} alt="Magic.link" />
          <h2 className="text-2xl font-bold">demo</h2>
        </Link>

        <AppNavigation />

        <div className="">
          {user?.isLoggedIn ? (
            <button onClick={() => openWallet()} type="button" className="btn">
              Open Wallet
            </button>
          ) : (
            <button
              onClick={() => loginWithConnect()}
              type="button"
              className="btn"
            >
              Login with Connect
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
