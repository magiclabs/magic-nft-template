import { Magic } from "magic-sdk";

// Initialize the Magic instance
const createMagic = () => {
  return (
    typeof window !== "undefined" &&
    new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
      network: {
        rpcUrl: "https://rpc2.sepolia.org",
        chainId: 11155111,
      },
    })
  );
};

export const magic = createMagic();
