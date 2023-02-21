import { useContext, useState } from "react";
import { UserContext } from "@/lib/UserContext";
import { requestMintNFT } from "@/lib/utils";

export default function MintNFTButton({
  className = "",
  buttonText = "Mint a Magic Carpet NFT",
}) {
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  return (
    <div className={className}>
      <p className="py-2">
        Your ETH balance is{" "}
        <span className="italic underline">
          {new Intl.NumberFormat(undefined, {
            minimumSignificantDigits: 1,
            maximumSignificantDigits: 4,
          }).format(user?.balance)}
        </span>{" "}
        ETH
      </p>

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
              .catch((err) => {
                console.warn(err);
                setLoading(false);
              })
              .finally((res) => setLoading(false));
          })();
        }}
      >
        {loading ? "minting NFT..." : buttonText}
      </button>

      {loading && (
        <p className="text-gray-500 font-sm">
          *minting may take around 30 seconds.
          <br />
          please be patient!
        </p>
      )}
    </div>
  );
}
