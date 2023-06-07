# Magic NFT Starter Kit - Frontend Guide

This guide is meant to walk you through how
[this site](https://nextjs-nft-template.magic.link) works and how you can
customize and build on top of it to create your own project.

[Magic](https://magic.link) makes it super simple to spin up secure,
non-custodial wallets for users while also supporting third party wallets. This
NFT Starter Kit illustrates how to integrate
[Magic Connect](https://magic.link/connect) with a basic NFT site that allows
users to mint and view NFTs from a particular NFT collection. The guide below
walks through the Magic Connect integration as well as the remaining items that
may be new for developers just getting into Web3 (e.g. connecting to the
Ethereum network, reading data from the network, submitting transactions, etc.)

## Magic Connect

[Magic Connect](https://magic.link/connect) is a seamless, single sign-on
solution for Web3. It provides simple onboarding, a unified wallet UX, secure
transaction and wallet management, and streamlined on-ramp payments.

All of this backed by Magic's Delegated Key Management system. It's a
non-custodial solution to wallet management that's both more secure and more
user-friendly than traditional wallet solutions. This guide doesn't cover the
underlying technology, but it's worth reading the
[Whitepaper](https://magic-whitepaper-key-based-authentication-system.s3.us-west-2.amazonaws.com/Magic+Whitepaper.pdf)
if you're interested.

### The Magic SDK

The Magic SDK provides all the developer tools you need to get Magic Connect up
and running.

In `package.json`, you'll notice that this site has the `magic-sdk` JS package
listed as a dependency. Once the SDK is installed, you simply need to create an
instance of `Magic` and use the appropriate methods from the
[Wallet module](https://magic.link/docs/connect/wallet-api-reference/javascript-client-sdk#wallet-module-methods).

#### Create your `Magic` instance

The `src/lib/magic.ts` file shows the first step to working with the Magic SDK:
create an instance of `Magic` using an
[API Key](https://magic.link/docs/connect/getting-started/quickstart#api-keys)
from your Magic Dashboard and a config object. This site uses the config object
to set the network to `Sepolia`, an Ethereum test network that we'll be using
throughout this guide.

```jsx
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
```

#### Use the Wallet module

The remainder of the app uses the
[Wallet module](https://magic.link/docs/connect/wallet-api-reference/javascript-client-sdk#wallet-module-methods)
`magic.wallet`. Specifically, the following three methods:

1. [`connectWithUI()`](<https://magic.link/docs/connect/wallet-api-reference/javascript-client-sdk#connectwithui()>) -
   displays the Magic Connect UI for sign up and authentication. This is called
   when the user clicks the button to connet or sign up. You can see example
   usage in `src/components/AppHeader.tsx` and
   `src/components/LoginWithMagic.tsx`.

   ```jsx
   await magic.wallet.connectWithUI();
   ```

2. [`showUI()`](<https://magic.link/docs/connect/wallet-api-reference/javascript-client-sdk#showui()>) -
   once you're connected, you can use this method to show the wallet UI. User
   interaction is then handled by the SDK. Note that this _only_ works for Magic
   Connect. If you support other wallets and the user connects with one of
   those, this method will throw an error.

   ```jsx
   await magic.wallet.showUI().on("disconnect", () => {
     disconnect();
   });
   ```

3. [`disconnect()`](<https://magic.link/docs/connect/wallet-api-reference/javascript-client-sdk#disconnect()>) -
   disconnects from _any connected wallet_, Magic Connect or otherwise.

   ```jsx
   await magic.wallet.disconnect();
   ```

## Interact with the blockchain

After you have initialized your Magic object, you can send transactions and read
from your chosen blockchain network using popular web3 libraries like `web3.js`
or `ethers.js`. In this demo, we are using the Sepolia test network.

You can see all of the EVM RPC methods that Magic supports
[here](https://magic.link/docs/connect/wallet-api-reference/javascript-client-sdk#evm-rpc-methods).
In this project, we use the following methods:

- `getAccounts` - returns a list of addresses owned by client. Typically, this
  is a single address representing the connected user's address.
- `getBalance` - returns the balance of the given address's account
- `estimateGas` - generates and returns an estimate of how much gas is necessary
  to allow the transaction to complete

The syntax for calling these methods depends on the library you're using. This
codebase uses `web3.js`.

### Use `web3.js`

For a comprehensive review of working with `web3.js` package, you should check
out their [documentation](https://web3js.readthedocs.io/en/v1.7.5/). That being
said, let's go through the way that this site uses it.

The starting point for working with `web3.js` is to create a new instance of
`Web3` and an instance of `Contract` using the `eth` module. You can see how
this is done on the site in `context/Web3Context.tsx`:

```jsx
// Get the provider from the Magic instance
const provider = await magic.wallet.getProvider();

// Create a new instance of Web3 with the provider
const web3Instance = new Web3(provider);

// Create a contract instance
const contractInstance = new web3Instance.eth.Contract(
  contractABI as any,
  CONTRACT_ADDRESS,
);
```

Notice that in addition to `web3.js`, we needed `magic.wallet.getProvider()`,
the address of the contract we plan to interact with, and that same contract's
Application Binary Interface (ABI). In this case, the ABI is in `lib/abi.ts`,
but if you want the site to use a different contract you'll need to update this
file to be that contract's ABI.

#### Call RPC methods

To call RPC methods (not smart contract methods), you can use `web3.eth`
followed by the RPC method, as is shown in `lib/utils.ts` when getting a user's
ETH balance:

```jsx
import { web3 } from "@/lib/web3";
...
// Get the user's address
const [address] = await web3.eth.getAccounts();

// Get the user's balance
const balanceInWei = await web3.eth.getBalance(address);
const balance = web3.utils.fromWei(balanceInWei);
```

#### Call contract methods

To call contract methods, you use the instance of `contract` created earlier.
This object has a `methods` field that you can use to call all of the available
methods.

Contract methods are written such that the developer marks those that are
read-only versus those that mutate data in some way. Any methods that involve
writing data require a transaction, whereas read-only methods can be called
without a transaction (and therefore no signature required from the user).

When calling read-only methods, simply use dot syntax to call the method,
followed by `.call()`. For example, in `lib/utils.ts` we get the user's balance
of NFTs by calling the contract's `balanceOf` method:

```jsx
// Get the total count of tokens owned by the `address`.
const tokenBalance = await contract.methods.balanceOf(address).call();
```

Methods that require a transaction can be more complicated. It's best to first
get a gas estimate for the transaction by calling the contract method but then
adding `.estimateGas` instead of `.call`. This will give you an estimate of the
transaction cost, called gas.

Then you issue the actual transaction by calling the same method name and adding
`.send`. `send` lets you add configuration options. We add the user's address
and the estimated gas. Users connected to Magic Connect will have their
transaction signed by the Magic SDK, while users who chose to connect with other
supported wallets will be prompted to sign using that wallet's normal UI.

The return value will be a transaction receipt that you can use to get events
emitted by the transaction. The example below from `lib/utils.ts` shows the code
for minting from the contract using the `safeMint` method.

```jsx
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
```

That covers the basics of how this project works! Feel free to browse the rest
of the code to get an idea of how to use both the Magic SDK and `web3.js`!

## Use this template

When building something new, it often helps to build from an existing project
rather than starting over. You're more than welcome to clone this repository and
start modifying it to suit your needs. Just be sure to use your own IP for
images, NFTs, etc. before publishing!

### Local setup

This is a simple [Next.js](https://nextjs.org/) app with a few basic
dependencies. If you need to get familiar with Next.js, check out the
[Next.js documentation](https://nextjs.org/docs/).

To start, make sure to install your dependencies with the following command line
commands:

```bash
npm install
# or
yarn install
```

You'll then need to copy rename `.env.example` to `.env` and fill in the values
it mentions:

- `NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY` - get this from your
  [Magic Dashboard](https://dashboard.magic.link). You can sign up for a free
  account if you haven't already
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - the address of the NFT contract you want the
  site to use for minting NFTs. You can use ours
  (`0xf4759a2bf9a8b6dc8318efc53e6e27b452c42310`) for testing on the Sepolia
  testnet if you'd like, but eventually you should replace it with your own
  contract address.

With the environment variables set, you can run the development server:

```bash
npm run dev
# or
yarn dev
```

The development server will run on port 3000 if available. If port 3000 is
already in use, it'll use another one. You'll be able to see which port is being
used in the console.

Open [http://localhost:3000](http://localhost:3000) (or whichever port the
development server is running on) with your browser to see the result.

### Sepolia Testnet

This template uses the Sepolia Testnet so that you can experiment without using
real ETH. Sepolia is an Ethereum test network, or testnet. Testnets are designed
to be as close as possible to the production network without requiring tokens to
have actual value. That way, you can execute transactions, deploy contracts,
mint, and generally just experiment, without fear of losing money.

Before using Sepolia, you will need to first acquire some Sepolia ETH. To do so,
you can use a faucet such as https://sepoliafaucet.com/. Faucets are sites that
send you test ETH. At the time of writing, https://sepoliafaucet.com/ requires
creating an Alchemy account, but once you have an account you can get 0.5
Sepolia ETH for testing. Once you have your Sepolia ETH, you are ready to begin
minting!
