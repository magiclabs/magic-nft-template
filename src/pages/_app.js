import "@/styles/globals.css";
import { useState, useEffect } from "react";
import { UserContext } from "@/lib/UserContext";
import { fetchNFTs, getUserData } from "@/lib/utils";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState();

  // auto load the user's authenticated state via magic
  useEffect(() => {
    setUser({ loading: true });

    (async () => {
      // auto load the userData and store it in the state
      console.log("Checking if a user is already logged in...");
      await getUserData().then((data) => setUser(data));
    })();
  }, []);

  useEffect(() => {
    // clear the state of tracked collectibles on logout
    if (!user?.address) {
      //   setLoading(true);
      return;
    }

    // only attempt to fetch the NFTs if a user is connected
    if (user?.loading || !user?.address || !user?.refreshCollectibles) return;

    // fetch the listing of the user's NFT from the blockchain
    (async () => {
      console.log("Refreshing collectibles...");
      // update the fetching status
      setUser({ ...user, refreshCollectibles: true });

      await fetchNFTs(user.address).then((res) => {
        // update the tracked state
        setUser({
          ...user,
          collectibles: res.reverse(),
          refreshCollectibles: false,
        });
      });
    })();
  }, [user?.address, user?.loading, user?.refreshCollectibles]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
