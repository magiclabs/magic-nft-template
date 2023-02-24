import { useContext, useState } from "react";
import { UserContext } from "@/lib/UserContext";
import { requestMintNFT } from "@/lib/utils";
import { web3 } from "@/lib/web3";

export default function MintNFTButton({
  className = "",
  buttonText = "Mint a Hiro NFT",
}) {
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
            const status = await requestMintNFT(user.address)
              .then(async (res) => {
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
                const balance = await web3.eth
                  .getBalance(user.address)
                  .then((wei) => web3.utils.fromWei(wei));

                setUser({ ...user, balance });
              })
              .catch((err) => {
                console.warn(err);
              })
              .finally(() => {
                setLoading(false);
              });
          })();
        }}
      >
        {loading ? "Minting NFT..." : buttonText}
      </button>

      <p className="py-2">
        Your test ETH balance:{" "}
        <span className="italic underline">
          {new Intl.NumberFormat(undefined, {
            minimumSignificantDigits: 1,
            maximumSignificantDigits: 4,
          }).format(user?.balance)}
        </span>{" "}
        ETH
      </p>

      {loading && (
        <p className="font-sm">
          *minting may take around 30 seconds.
          <br />
          please be patient!
        </p>
      )}
    </div>
  );
}
