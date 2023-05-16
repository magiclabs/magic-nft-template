import { Magic } from "magic-sdk";

// Initialize the Magic instance
const createMagic = () => {
  return (
    typeof window !== "undefined" &&
    new Magic("pk_live_51FA35CBAD23D818", {
      network: {
        rpcUrl: "https://rpc2.sepolia.org",
        chainId: 11155111,
      },
    })
  );
};

export const magic = createMagic();
