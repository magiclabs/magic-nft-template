// Import necessary modules from React, Magic SDK, and Web3
import React, { createContext, useContext, useEffect, useState } from "react";
import { contractABI } from "../lib/abi";
import { Magic } from "magic-sdk";
import Web3 from "web3";

// Define the structure of the context state
type MagicContextType = {
  magic: Magic | null;
  web3: Web3 | null;
  contract: any;
};

// Create the context with default values
const MagicContext = createContext<MagicContextType>({
  magic: null,
  web3: null,
  contract: null,
});

// Custom hook to use the Magic context
export const useMagicContext = () => useContext(MagicContext);

// Provider component to wrap around components that need access to the context
export const MagicProvider = ({ children }: { children: React.ReactNode }) => {
  // State variables to hold instances of Magic and Web3
  const [magicInstance, setMagicInstance] = useState<Magic | null>(null);
  const [web3Instance, setWeb3Instance] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);

  // Effect to initialize Magic and Web3 when the component mounts
  useEffect(() => {
    // Only run in the browser where window is defined
    if (typeof window !== "undefined") {
      initialize();
    }
  }, []);

  // Initialize Magic and Web3
  const initialize = async () => {
    // Create a new instance of Magic
    const magic = new Magic("pk_live_51FA35CBAD23D818", {
      network: {
        rpcUrl: "https://rpc2.sepolia.org",
        chainId: 11155111,
      },
    });

    // Get the provider from the Magic instance
    const provider = await magic.wallet.getProvider();

    // Create a new instance of Web3 with the provider
    const web3 = new Web3(provider);

    const contractAddress = "0xf4759a2bf9a8b6dc8318efc53e6e27b452c42310";
    const contract = new web3.eth.Contract(contractABI as any, contractAddress);
    // Save the instances to state
    setMagicInstance(magic);
    setWeb3Instance(web3);
    setContract(contract);
  };

  // Render the provider with the state as its value
  return (
    <MagicContext.Provider
      value={{
        magic: magicInstance,
        web3: web3Instance,
        contract: contract,
      }}
    >
      {children}
    </MagicContext.Provider>
  );
};
