import { magic } from "./magic";
import { web3, contract } from "./web3";

/*
  Helper function to collect all the desired connected user's data,
  both from Magic.link and the blockchain
*/
export async function getUserData() {
  let data = {};

  data = await magic.wallet
    .getInfo()
    .then(async (walletInfo) => {
      // console.log("connected via magic!");

      let userInfo;
      // you can also request the user's info from magic.link
      // (e.g. email address), for later storing it in the state
      // userInfo = await magic.wallet.requestUserInfoWithUI().catch((err) => {
      //   console.error(err);
      // });

      // connect and retrieve the user's primary wallet address
      const address = (await web3.eth.getAccounts())[0];
      // console.log("address:", address);

      // get the wallet's current ETH balance
      const balance = await web3.eth
        .getBalance(address)
        .then((wei) => web3.utils.fromWei(wei));
      // console.log("balance:", balance);

      // compute the short address for display in the UI
      let shortAddress = `${address?.substring(0, 5)}...${address?.substring(
        address.length - 4
      )}`;

      // return the user's data for the state
      return {
        ...userInfo,
        ...walletInfo,
        isLoggedIn: true,
        loading: false,
        address,
        balance,
        shortAddress,
      };
    })
    .catch((err) => {
      console.log("no user authenticated via Magic.link");
      // console.log("error:");
      // console.error(err);
    });

  // log the user's data into the console
  // console.log("Current connected user:");
  // console.log(data);

  return data;
}

/*
  Handler function to attempt to mint an NFT from the collection
*/
export async function requestMintNFT(address) {
  console.log(`Request to mint an NFT to address ${address}...`);

  let txHash = false;

  try {
    const name = await contract.methods.name().call();
    // console.log("Name:", name);

    // estimate the amount of gas required
    const gas = await contract.methods
      .safeMint(address)
      .estimateGas({ from: address });
    console.log(`Estimated gas: ${gas}`);

    // construct and send the mint request to the blockchain
    await contract.methods
      .safeMint(address)
      .send({
        from: address,
        gas,
      })
      .on("transactionHash", (hash) => {
        txHash = hash;
        console.log("Transaction hash:", hash);
      })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt);
        return txHash;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });

    return txHash;
  } catch (error) {
    console.error(error);
    return false;
  }
}

/*
  Helper function to fetch all the metadata URIs from 
  the collection (owned by the given `address`) 
*/
export async function fetchNFTs(address) {
  console.log(`Fetch the NFTs owned by ${address} from the collection...`);

  try {
    // get the total count of tokens owned by the `address`
    const tokenBalance = await contract.methods.balanceOf(address).call();
    // console.log("tokenBalance:", tokenBalance);

    // init tracking arrays
    let promisesForIds = [];
    let promisesForUris = [];
    let tokens = [];

    // build the listing of promises to fetch the owned token IDs
    for (let i = 0; i < tokenBalance; i++) {
      promisesForIds.push(
        await contract.methods
          .tokenOfOwnerByIndex(address, i)
          .call()
          .then((tokenIndex) => {
            // console.log(`token ID ${tokenIndex} found`);
            return tokenIndex;
          })
          .catch((err) => console.warn(err))
      );
    }

    // await all promises to fetch the owned token IDs
    await Promise.allSettled(promisesForIds).then(async (tokenIDs) => {
      for (let i = 0; i < tokenIDs.length; i++) {
        // console.log("id:", i, ":", tokenIDs[i].status);
        // console.log(tokenIDs[i]);

        // add each token id to the next round of promises
        promisesForUris.push(
          await contract.methods
            .tokenURI(tokenIDs[i].value)
            .call()
            .then((uri) => {
              uri = ipfsToHttps(uri);
              // console.log(`Token ID ${result.value} has URI of ${uri}`);
              tokens.push(uri);
              return uri;
            })
            .catch((err) => console.warn(err))
        );
      }
    });

    // await all promises for fetching the token URIs
    await Promise.allSettled(promisesForUris);

    return tokens;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/*
  Wrapper function to fetch a token's JSON metadata from the given URI stored on-chain
*/
export async function fetchJSONfromURI(url) {
  // console.log(`Fetching metadata from ${url}...`);
  return fetch(ipfsToHttps(url))
    .then((res) => res?.json())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
    });
}

/*
  parse ipfs address into https
*/
export function ipfsToHttps(uri) {
  uri = uri.replace("ipfs://", "https://nftstorage.link/ipfs/").toString();
  return uri;
}
