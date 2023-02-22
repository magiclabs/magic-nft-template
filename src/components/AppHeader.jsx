import { useContext, useState } from "react";
import { UserContext } from "@/lib/UserContext";
import Link from "next/link";
import Image from "next/image";
import AppNavigation from "./AppNavigation";

import styles from "@/styles/Nav.module.css";

import { magic } from "@/lib/magic";
import { getUserData } from "@/lib/utils";

export default function AppHeader({}) {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [user, setUser] = useContext(UserContext);

  function openWallet() {
    magic.wallet.getInfo().then((walletInfo) => {
      if (walletInfo?.walletType == "magic") {
        // NOTE: this will only work if the user has connected via a
        // magic wallet, not via browser wallet (e.g. MetaMask)
        magic.wallet.showUI().catch((err) => console.error(err));
      } else {
        // for non-magic wallets, copy the full wallet address to the clipboard
        navigator.clipboard
          .writeText(user?.address)
          .then((res) =>
            alert(`ETH wallet address copied to clipboard: ${user?.address}`),
          );
      }
    });
  }

  function disconnect() {
    // disconnect from magic
    magic.wallet.disconnect();

    // clear the state
    setUser({});
  }

  function loginWithConnect() {
    magic.wallet
      .connectWithUI()
      .then((res) => {
        (async () => {
          await getUserData().then((data) => setUser(data));
        })();
      })
      .catch((err) => console.error(err));
  }

  return (
    <header className={styles.header}>
      <nav className={"container " + styles.wrapper}>
        <section className={styles.staticArea}>
          <Link href={"/"} className="flex space-x-3">
            <img src={"/logo.svg"} alt="Magic.link" />
            <span className="badge">demo</span>
          </Link>

          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className={styles.burger}
          >
            {navbarOpen ? (
              <Image
                src={"/img/close.svg"}
                width={24}
                height={24}
                alt="Close"
              />
            ) : (
              <Image
                src={"/img/burger.svg"}
                width={24}
                height={24}
                alt="Menu"
              />
            )}
          </button>
        </section>

        <nav
          className={
            styles.navContainer +
            " " +
            (navbarOpen ? styles.navOpen : styles.navClosed)
          }
        >
          <AppNavigation />

          <div className={navbarOpen ? styles.actionAreaMobile : ""}>
            {user?.isLoggedIn ? (
              <div className="space-x-3">
                <button
                  onClick={() => openWallet()}
                  type="button"
                  className="btn-light"
                >
                  {user?.shortAddress || "Open wallet"}
                </button>

                <button
                  onClick={() => disconnect()}
                  type="button"
                  className="btn"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => loginWithConnect()}
                type="button"
                className="btn"
                // disabled={user?.loading}
              >
                {user?.loading ? "Connect Wallet" : "Connect Wallet"}
              </button>
            )}
          </div>
        </nav>
      </nav>
    </header>
  );
}
