import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { requestMintNFT } from "@/lib/utils";
import { AnimatedLoader } from "./AnimatedLoader";
import { useMagicContext } from "@/context/MagicContext";

export default function MintNFTButton({
  className = "",
  buttonText = "Mint a Hiro NFT",
}) {
  const { user, setUser } = useUser();
  const { web3, contract } = useMagicContext();
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    setLoading(true);

    try {
      const res = await requestMintNFT(user.address, contract);
      if (!res) {
        console.log("Mint failed (or was canceled by the user).");
        return;
      }
      console.log("Mint complete!");
      // update the `user.refreshCollectibles` values to auto reload the owned NFTs
      setUser({
        ...user,
        refreshCollectibles: true,
        tokenIdForModal: res?.tokenId, // track the id to show the success modal
      });

      console.log("Updating the user's balance...");

      // get and set the user's new balance after the mint
      const wei = await web3.eth.getBalance(user.address);
      const balance = web3.utils.fromWei(wei);

      setUser({ ...user, balance });
    } catch (err) {
      console.warn(err);
    } finally {
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
