import { useCallback, useContext, useEffect, useRef, useState } from "react";
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
  const navMenuRef = useRef(null);

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
        getUserData().then((data) => setUser(data));
      })
      .catch((err) => console.error(err));
  }

  const handleClickOutside = useCallback(
    (event) => {
      if (
        navbarOpen &&
        navMenuRef.current &&
        !navMenuRef.current.contains(event.target)
      ) {
        setNavbarOpen(false);
      }
    },
    [navbarOpen],
  );

  const handleClose = () => {
    setNavbarOpen(!navbarOpen);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <header className={styles.header}>
      <nav className={"container " + styles.wrapper} ref={navMenuRef}>
        <section className={styles.staticArea}>
          <Link href={"/"} className="flex space-x-3">
            <Image src={"/logo.svg"} width={120} height={47} alt="Magic.link" />
            <span className="badge">demo</span>
          </Link>

          <button onClick={() => handleClose()} className={styles.burger}>
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
              <div className="image.png grid grid-cols-2 gap-3 lg:flex lg:space-x-3">
                <Link
                  href="https://github.com/magiclabs/magic-nft-template/blob/master/README.md"
                  target="_blank"
                  className="btn-neutral col-span-2 flex justify-center gap-3"
                >
                  Guide
                  <Image
                    src={"/img/github-mark.png"}
                    width={24}
                    height={24}
                    alt="Github"
                  />
                </Link>

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
              <div className="flex space-x-3">
                <Link
                  href="https://github.com/magiclabs/magic-nft-template/blob/master/README.md"
                  target="_blank"
                  className="btn-neutral flex justify-center gap-3"
                >
                  Guide
                  <Image
                    src={"/img/github-mark.png"}
                    width={24}
                    height={24}
                    alt="Github"
                  />
                </Link>

                <button
                  onClick={() => loginWithConnect()}
                  type="button"
                  className="btn"
                >
                  Connect wallet
                </button>
              </div>
            )}
          </div>
        </nav>
      </nav>
    </header>
  );
}
