import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import Web3 from "web3";
import { contractABI } from "../lib/abi";
import { magic } from "../lib/magic";

// Define the structure of the Web3 context state
type Web3ContextType = {
  web3: Web3 | null;
  initializeWeb3: () => void;
  contract: any;
  isAccountChanged: boolean;
};

// Define contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// Create the context with default values
const Web3Context = createContext<Web3ContextType>({
  web3: null,
  initializeWeb3: () => {},
  contract: null,
  isAccountChanged: false,
});

// Custom hook to use the Web3 context
export const useWeb3 = () => useContext(Web3Context);

// Provider component to wrap around components that need access to the context
export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  // State variable to hold an instance of Web3 and the contract
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [isAccountChanged, setIsAccountChanged] = useState<boolean>(false);

  // Initialize Web3
  const initializeWeb3 = useCallback(async () => {
    try {
      // Get the provider from the Magic instance
      const provider = await magic.wallet.getProvider();

      // Create a new instance of Web3 with the provider
      const web3Instance = new Web3(provider);

      // Subscribe to accounts changed event
      provider.on("accountsChanged", async () => {
        setIsAccountChanged((state) => !state);
      });

      // Subscribe to chain changed event
      provider.on("chainChanged", async () => {
        const chainId = await web3Instance.eth.getChainId();
        const sepoliaChainId = 11155111;
        if (chainId !== sepoliaChainId) {
          alert("Please switch to the Sepolia network");
        }
      });

      // Create a contract instance
      const contractInstance = new web3Instance.eth.Contract(
        contractABI as any,
        CONTRACT_ADDRESS,
      );

      // Save the instance to state
      setWeb3(web3Instance);
      setContract(contractInstance);
    } catch (error) {
      console.error("Failed to initialize web3 or contract", error);
    }
  }, []);

  // Effect to initialize Web3 when the component mounts
  useEffect(() => {
    initializeWeb3();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        web3,
        initializeWeb3,
        contract,
        isAccountChanged,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
