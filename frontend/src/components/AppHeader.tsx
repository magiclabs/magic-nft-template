import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Nav.module.css";
import AppNavigation from "./AppNavigation";
import { useUser } from "@/context/UserContext";
import { useWeb3 } from "@/context/Web3Context";
import { magic } from "@/lib/magic";

export default function AppHeader({}) {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { user, setUser } = useUser();
  const { initializeWeb3 } = useWeb3();

  // Reference to the navigation menu
  const navMenuRef = useRef(null);

  // Function to handle wallet opening
  const openWallet = async () => {
    try {
      // Try to show the magic wallet UI
      // This will only work if the user has connected via a magic wallet, not via browser wallet (e.g. MetaMask)
      /// @ts-ignore
      await magic.wallet.showUI().on("disconnect", () => {
        disconnect();
      });
    } catch (error) {
      console.error("openWallet", error);
      // for non-magic wallets, copy the full wallet address to the clipboard
      await navigator.clipboard.writeText(user?.address);
      alert(`ETH wallet address copied to clipboard: ${user?.address}`);
    }
  };

  // Function to handle disconnection
  const disconnect = async () => {
    // Disconnect from magic
    await magic.user.logout();

    // Clear the user state
    setUser(null);

    // Re-initialize web3 instance to ensure correct provider is used
    await initializeWeb3();
  };

  // Function to handle login with Magic Connect
  const loginWithConnect = async () => {
    try {
      // Attempt to connect with the user's wallet using Magic's UI
      await magic.wallet.connectWithUI();
      // If the wallet connection is successful, initialize web3 instance
      await initializeWeb3();
    } catch (error) {
      // Log any errors that occur during the login process
      console.error("loginWithConnect:", error);
    }
  };

  // Function to handle clicks outside of the navbar
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

  // Function to handle navbar closing
  const handleClose = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Effect to handle click events for closing the navbar when clicking outside of it
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
