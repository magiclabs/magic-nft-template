/*
  Helper function to collect all the desired connected user's data,
  both from Magic.link and the blockchain
*/
export async function getUserData(web3) {
  try {
    console.log("Fetching user data...");

    // Get the user's address
    const [address] = await web3.eth.getAccounts();

    // Get the user's balance
    const balanceInWei = await web3.eth.getBalance(address);
    const balance = web3.utils.fromWei(balanceInWei);

    // Truncate the user's address for display purposes
    const shortAddress = `${address.substring(0, 5)}...${address.substring(
      address.length - 4,
    )}`;

    return {
      isLoggedIn: true,
      loading: false,
      address,
      balance,
      shortAddress,
      collectibles: undefined,
      refreshCollectibles: true,
    };
  } catch (error) {
    console.error("getUserData", error);
  }
}

export async function requestMintNFT(address, contract) {
  try {
    // Print initial log message.
    console.log(`Request to mint an NFT to address ${address}...`);

    // Retrieve the contract name.
    const name = await contract.methods.name().call();
    console.log(`Contract name: ${name}`);

    // Estimate the gas required to mint the NFT.
    const estimatedGas = await contract.methods
      .safeMint(address)
      .estimateGas({ from: address });
    console.log(`Estimated gas: ${estimatedGas}`);

    // Prepare the transaction to mint the NFT.
    const transaction = contract.methods.safeMint(address);

    // Send the transaction and wait for its receipt.
    const receipt = await transaction.send({
      from: address,
      gas: estimatedGas,
    });
    console.log("Transaction receipt:", receipt);

    // Extract the minted tokenId from the transaction receipt.
    const tokenId = receipt?.events?.Transfer?.returnValues?.tokenId;
    console.log("Minted tokenId:", tokenId);

    // Return the transaction hash and tokenId.
    return { hash: receipt.transactionHash, tokenId };
  } catch (error) {
    // Log any errors that occur during the minting process.
    console.error("requestMintNFT", error);
    return false;
  }
}

export async function fetchNFTs(address, contract) {
  console.log(`Fetch the NFTs owned by ${address} from the collection...`);

  try {
    // Get the total count of tokens owned by the `address`.
    const tokenBalance = await contract.methods.balanceOf(address).call();
    console.log(`Total NFTs owned: ${tokenBalance}`);

    const tokens = await Promise.all(
      Array.from({ length: tokenBalance }, async (_, i) => {
        try {
          // Fetch the owned token ID.
          const tokenId = await contract.methods
            .tokenOfOwnerByIndex(address, i)
            .call();
          // Fetch the token URI.
          const uri = await contract.methods.tokenURI(tokenId).call();
          // Convert IPFS URI to HTTPS URI.
          return ipfsToHttps(uri);
        } catch (err) {
          console.warn(`Error fetching token at index ${i}:`, err);
          return null;
        }
      }),
    );

    // Filter out null values (where token fetch failed).
    const validTokens = tokens.filter(Boolean);
    console.log("Total NFTs found:", validTokens.length);

    return validTokens;
  } catch (err) {
    console.error(`Error fetching NFTs:`, err);
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
