import { useContext, useState } from "react";
import { UserContext } from "@/lib/UserContext";
import { requestMintNFT } from "@/lib/utils";

export default function MintNFTButton({ className = "" }) {
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  return (
    <div className={className}>
      <button
        className={`inline-flex space-x-3 text-xl btn ${loading && "loading"}`}
        disabled={loading}
        onClick={() => {
          setLoading(true);

          (async () => {
            await requestMintNFT(user.address)
              .then((res) => {
                console.log("Mint complete!");

                // update the `user.refreshCollectibles` values to auto reload the owned NFTs
                setUser({ ...user, refreshCollectibles: true });
              })
              .finally((res) => setLoading(false));
          })();
        }}
      >
        {loading ? "minting NFT..." : "Mint a Magic Carpet NFT"}
      </button>

      <p className="py-1">
        Your ETH balance is{" "}
        <span className="italic underline">{user?.balance}</span> ETH
      </p>
    </div>
  );
}
