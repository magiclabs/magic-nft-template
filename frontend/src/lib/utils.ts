/*
  Helper function to collect all the desired connected user's data,
  both from Magic.link and the blockchain
*/
export async function getUserData(magic, web3) {
  try {
    const walletInfo = await magic.wallet.getInfo();
    const address = (await web3.eth.getAccounts())[0];
    const balanceInWei = await web3.eth.getBalance(address);
    const balance = web3.utils.fromWei(balanceInWei);

    let shortAddress = `${address?.substring(0, 5)}...${address?.substring(
      address.length - 4,
    )}`;

    return {
      ...walletInfo,
      isLoggedIn: true,
      loading: false,
      address,
      balance,
      shortAddress,
      collectibles: undefined,
      refreshCollectibles: true,
    };
  } catch (error) {
    console.error(error);
  }
}

export async function requestMintNFT(address, contract) {
  console.log(`Request to mint an NFT to address ${address}...`);

  let txData = {};

  try {
    const name = await contract.methods.name().call();

    // estimate the amount of gas required
    const gas = await contract.methods
      .safeMint(address)
      .estimateGas({ from: address });
    console.log(`Estimated gas: ${gas}`);

    // construct and send the mint request to the blockchain
    const transaction = contract.methods.safeMint(address).send({
      from: address,
      gas,
    });

    // listen for the transactionHash event and populate txData
    transaction.on("transactionHash", (hash) => {
      txData = { hash };
      console.log("Transaction hash:", hash);
    });

    // wait for the transaction to complete
    const receipt = await transaction;
    console.log("Transaction receipt:", receipt);

    // extract the minted tokenId from the transaction response
    const tokenId = receipt?.events?.Transfer?.returnValues?.tokenId;
    console.log("Minted tokenId:", tokenId);

    // return the transaction data
    return { ...txData, tokenId };
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function fetchNFTs(address, contract) {
  console.log(`Fetch the NFTs owned by ${address} from the collection...`);

  try {
    // get the total count of tokens owned by the `address`
    const tokenBalance = await contract.methods.balanceOf(address).call();

    // init tracking arrays
    let promisesForIds = [];
    let promisesForUris = [];
    let tokens = [];

    // build the listing of promises to fetch the owned token IDs
    for (let i = 0; i < tokenBalance; i++) {
      try {
        const tokenIndex = await contract.methods
          .tokenOfOwnerByIndex(address, i)
          .call();
        promisesForIds.push(tokenIndex);
      } catch (err) {
        console.warn(err);
      }
    }

    // await all promises to fetch the owned token IDs
    const tokenIDs = (await Promise.allSettled(promisesForIds)) as {
      status: "fulfilled" | "rejected";
      value: number;
    }[];

    for (let i = 0; i < tokenIDs.length; i++) {
      // add each token id to the next round of promises
      try {
        const uri = await contract.methods.tokenURI(tokenIDs[i].value).call();
        const httpsUri = ipfsToHttps(uri);
        tokens.push(httpsUri);
        promisesForUris.push(httpsUri);
      } catch (err) {
        console.warn(err);
      }
    }

    // await all promises for fetching the token URIs
    await Promise.allSettled(promisesForUris);

    console.log("Total NFTs found:", tokens?.length);

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
