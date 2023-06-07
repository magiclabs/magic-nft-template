import { useState, useEffect, createContext, useContext } from "react";
import { fetchNFTs, getUserData } from "@/lib/utils";
import { useWeb3 } from "./Web3Context";

// Define custom user data type
interface UserData {
  address?: string;
  shortAddress?: string;
  balance?: string;
  collectibles?: string[];
  isLoggedIn?: boolean;
  loading?: boolean;
  refreshCollectibles?: boolean;
  tokenIdForModal?: number;
}

// Define user context type
type UserContextType = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | undefined>> | null;
};

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: null,
});

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Provider component to wrap around components that need access to the context
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // Get web3 and contract instances from Web3Context
  const { web3, contract, isAccountChanged } = useWeb3();

  // State to hold the user data
  const [user, setUser] = useState<UserData>();

  // Fetch user data when web3 instance is available
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching user data");
      if (!web3) return;
      setUser({ loading: true });

      const account = await web3.eth.getAccounts();
      console.log(account);

      if (account.length > 0) {
        const data = await getUserData(web3);
        setUser(data);
      } else {
        setUser({ loading: false });
      }
    };

    fetchData();
  }, [web3, isAccountChanged]);

  // Function to fetch and update NFTs for the user
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

  // Fetch and update NFTs when address or refreshCollectibles state changes
  useEffect(() => {
    fetchAndUpdateNFTs();
  }, [user?.address, user?.refreshCollectibles]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
