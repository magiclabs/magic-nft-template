import "@/styles/globals.css";
import { useState, useEffect } from "react";
import { UserContext } from "@/lib/UserContext";
import { fetchNFTs, getUserData } from "@/lib/utils";
import { web3 } from "@/lib/web3";
import { Inter } from "@next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

interface UserData {
  address?: string;
  balance?: string;
  collectibles?: string[];
  isLoggedIn?: boolean;
  loading?: boolean;
  refreshCollectibles?: boolean;
  shortAddress?: string;
  walletType?: string;
}

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState<UserData>();

  // auto load the user's authenticated state via magic
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setUser({ loading: true });

    console.log("Checking if a user is already logged in...");
    // if no user is logged in, this will return empty array
    const account = await web3.eth.getAccounts();

    if (account.length > 0) {
      // auto load the userData and store it in the state
      const data = await getUserData();
      setUser(data);
    } else {
      setUser({ loading: false });
    }
  }

  useEffect(() => {
    // clear the state of tracked collectibles on logout
    if (!user?.address) {
      //   setLoading(true);
      return;
    }

    // only attempt to fetch the NFTs if a user is connected
    if (user?.loading || !user?.address || !user?.refreshCollectibles) return;

    // fetch the listing of the user's NFT from the blockchain
    console.log("Refreshing collectibles...");
    // update the fetching status
    setUser({ ...user, refreshCollectibles: true });

    fetchNFTs(user.address).then((res: string[]) => {
      // update the tracked state
      setUser({
        ...user,
        collectibles: res.reverse(),
        refreshCollectibles: false,
      });
    });
  }, [user?.address, user?.loading, user?.refreshCollectibles]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <style jsx global>
        {`
          :root {
            --font-inter: ${inter.style.fontFamily};
          }
        `}
      </style>

      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
