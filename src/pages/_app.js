import "@/styles/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@/lib/UserContext";
import { magic } from "@/lib/magic";

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
            .then((user) => {
              setUser({ ...user, isLoggedIn: true, loading: false });
              return user;
            })
            .catch((err) => {
              console.log(err);
            });
          // await magic.connect.showWallet().catch((err) => console.log(err));
        })
        .catch((err) => {
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
