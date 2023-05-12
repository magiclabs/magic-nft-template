import { useState, useEffect, createContext, useContext } from "react";
import { fetchNFTs, getUserData } from "@/lib/utils";
import { useMagicContext } from "@/context/MagicContext";

interface UserData {
  address?: string;
  balance?: string;
  collectibles?: string[];
  isLoggedIn?: boolean;
  loading?: boolean;
  refreshCollectibles?: boolean;
  shortAddress?: string;
  walletType?: string;
  tokenIdForModal?: number | boolean;
}

type UserContextType = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | undefined>> | null;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: null,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { magic, web3, contract } = useMagicContext();
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    fetchData();
  }, [magic, web3]);

  const fetchData = async () => {
    if (!web3) return;
    setUser({ loading: true });

    const account = await web3.eth.getAccounts();

    if (account.length > 0) {
      const data = await getUserData(magic, web3);
      setUser(data);
    } else {
      setUser({ loading: false });
    }
  };

  useEffect(() => {
    const fetchAndUpdateNFTs = async () => {
      if (!user?.address || !user?.refreshCollectibles) return;

      setUser({ ...user, refreshCollectibles: true });

      try {
        const res = await fetchNFTs(user.address, contract);

        if (Array.isArray(res)) {
          setUser({
            ...user,
            collectibles: res.reverse(),
            refreshCollectibles: false,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndUpdateNFTs();
  }, [user?.address, user?.refreshCollectibles]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
