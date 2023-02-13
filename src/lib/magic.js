import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";

// const customNodeOptions = {
//   rpcUrl: "https://polygon-rpc.com", // your ethereum, polygon, or optimism mainnet/testnet rpc URL
//   chainId: 137,
// };

const createMagic = (key) => {
  return (
    typeof window !== "undefined" &&
    new Magic(key, {
      extensions: [new ConnectExtension()],
      network: "goerli", // or "mainnet" or customNodeOptions
    })
  );
};

export const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
