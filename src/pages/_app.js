import "@/styles/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@/lib/UserContext";
import { magic } from "@/lib/magic";
import Web3 from "web3";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState();
  const router = useRouter();

  useEffect(() => {
    setUser({ loading: true });

    const fn = async () => {
      // await magic.user.isLoggedIn();
      await magic.connect
        .getWalletInfo()
        .then(async (walletInfo) => {
          // request the user's info from magic.link, and store it in the state
          await magic.connect
            .requestUserInfo()
            .then(async (user) => {
              // connect and retreive the user's primary wallet address
              const web3 = new Web3(magic.rpcProvider);
              const address = (await web3.eth.getAccounts())[0];

              // compute the short address for display in the UI
              let shortAddress = `${address?.substring(
                0,
                5
              )}...${address?.substring(address.length - 4)}`;

              // update the user state via the UserContext
              setUser({
                ...user,
                isLoggedIn: true,
                loading: false,
                address,
                shortAddress,
              });
              return user;
            })
            .catch((err) => {
              console.log(err);
            });
          // await magic.connect.showWallet().catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log("no user authenticated via Connect");
          console.log("connect error:");
          console.log(err);
        });

      // magic.user.isLoggedIn().then((isLoggedIn) => {
      //   if (isLoggedIn) {
      //     magic.user.getMetadata().then((userData) => setUser(userData));
      //     router.push("/dashboard");
      //   } else {
      //     router.push("/login");
      //     setUser({ user: null });
      //   }
      // });
    };
    fn();
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
