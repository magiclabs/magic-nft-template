import { useState } from "react";
import { requestMintNFT } from "@/lib/utils";
import { AnimatedLoader } from "./AnimatedLoader";
import { useUser } from "@/context/UserContext";
import { useWeb3 } from "@/context/Web3Context";

export default function MintNFTButton({
  className = "",
  buttonText = "Mint a Hiro NFT",
}) {
  const { user, setUser } = useUser();
  const { web3, contract } = useWeb3();
  const [loading, setLoading] = useState(false);

  // Function to update the user's balance
  const updateBalance = async () => {
    // Fetch the user's balance in wei
    const wei = await web3.eth.getBalance(user.address);
    // Convert the balance from wei to Ether
    const balance = web3.utils.fromWei(wei);
    // Update the user's balance in the state
    setUser({ ...user, balance });
  };

  const handleMint = async () => {
    // Set loading state to true
    setLoading(true);

    try {
      // Request to mint NFT
      const res = await requestMintNFT(user.address, contract);

      // If the request returns no result, log an error and return
      if (!res) {
        console.log("Mint failed (or was canceled by the user).");
        return;
      }

      // Log minting success
      console.log("Mint complete!");

      // Update the user's state to refresh the collectibles and set the new token ID
      setUser({
        ...user,
        refreshCollectibles: true,
        tokenIdForModal: res.tokenId,
      });

      // Log balance update
      console.log("Updating the user's balance...");
      // Update the user's balance
      await updateBalance();
    } catch (error) {
      // Log any errors that occur during the process
      console.error("handleMint", error);
    } finally {
      // Set loading state back to false when the operation is complete
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        className={`btn-lg relative inline-flex justify-center space-x-3`}
        disabled={loading}
        onClick={handleMint}
      >
        <span className={loading ? "opacity-0" : "opacity-100"}>
          {buttonText}
        </span>

        {loading ? (
          <span className="absolute">
            <AnimatedLoader width={40} height={40} fill="#FFFFFF" />
          </span>
        ) : null}
      </button>

      <p className="py-2">
        Your test ETH balance:{" "}
        <span>
          {new Intl.NumberFormat(undefined, {
            minimumSignificantDigits: 1,
            maximumSignificantDigits: 4,
          }).format(Number(user?.balance))}
        </span>{" "}
        ETH
      </p>
      <p className={loading ? "font-sm" : "font-sm opacity-0"}>
        *minting may take around 30 seconds
      </p>
    </div>
  );
}
