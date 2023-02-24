import { Magic } from "magic-sdk";

// const customNodeOptions = {
//   rpcUrl: "https://polygon-rpc.com", // your ethereum, polygon, or optimism mainnet/testnet rpc URL
//   chainId: 137,
// };

const createMagic = (key) => {
  return (
    typeof window !== "undefined" &&
    new Magic(key, {
      network: "goerli", // or "mainnet" or customNodeOptions
    })
  );
};

export const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
