import { contractABI } from "./abi";
import { magic } from "./magic";
import { web3 } from "./web3";

export const contractAddress = "0xD7b9De00D2ca41137C95183DcA01E53Bf185F661";

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

  // log the user's data into the console
  console.log("Current connected user:");
  console.log(data);

  return data;
}

// handler function to attempt a mint of the NFT collection
export async function requestMintNFT(address) {
  console.log(`Request to mint an NFT to address ${address}...`);

  let txHash = false;

  try {
    //
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const name = await contract.methods.name();
    // console.log("Name:", name);

    // estimate the amount of gas required
    const gas = await contract.methods
      .safeMint(address)
      .estimateGas({ from: address });
    console.log(`Estimated gas: ${gas}`);

    //
    // contract.methods
    //   .safeMint(name)
    //   .send({
    //     from: address,
    //     gas,
    //   })
    //   .on("transactionHash", (hash) => {
    //     txHash = hash;
    //     console.log("Transaction hash:", hash);
    //   })
    //   .then((receipt) => {
    //     console.log("Transaction receipt:", receipt);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    return txHash;
  } catch (error) {
    console.error(error);
    return false;
  }
}
