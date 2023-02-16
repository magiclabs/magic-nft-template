import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";

import Web3 from "web3";

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

/*
  Helper function to collect all the desired connected user's data,
  both from Magic.link and the blockchain
*/
export async function getUserData() {
  let data = {};

  data = await magic.connect
    .getWalletInfo()
    .then(async (walletInfo) => {
      let user;
      // you can also request the user's info from magic.link
      // (e.g. email address), for later storing it in the state
      // user = await magic.connect.requestUserInfo().catch((err) => {
      //   console.log(err);
      // });

      // connect and retreive the user's primary wallet address
      const web3 = new Web3(magic.rpcProvider);
      const address = (await web3.eth.getAccounts())[0];

      // get the wallet's current ETH balance
      const balance = await web3.eth
        .getBalance(address)
        .then((wei) => web3.utils.fromWei(wei));

      // compute the short address for display in the UI
      let shortAddress = `${address?.substring(0, 5)}...${address?.substring(
        address.length - 4
      )}`;

      // return the user's data for the state
      return {
        ...user,
        ...walletInfo,
        isLoggedIn: true,
        loading: false,
        address,
        balance,
        shortAddress,
      };
    })
    .catch((err) => {
      console.log("no user authenticated via Connect");
      console.log("connect error:");
      console.log(err);
    });

  console.log(data);

  return data;
}
