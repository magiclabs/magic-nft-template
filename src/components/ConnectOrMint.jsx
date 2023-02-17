import { useContext } from "react";
import { UserContext } from "@/lib/UserContext";
import { magic } from "@/lib/magic";
import { getUserData } from "@/lib/utils";

export default function ConnectOrMint({}) {
  const [user] = useContext(UserContext);

  // handler function to attempt a mint of the NFT collection
  function requestMintNFT() {
    console.log("Request to mint an NFT...");
  }

  return (
    <section className="space-x-4">
      {user?.address ? (
        <div>
          <button
            className="inline-flex space-x-3 text-xl btn"
            onClick={() => requestMintNFT()}
          >
            Mint a Magic Carpet NFT
          </button>

          <p>
            Your ETH balance is{" "}
            <span className="italic underline">{user?.balance}</span> ETH
          </p>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              magic.wallet
                .connectWithUI()
                .then((res) => {
                  (async () => {
                    await getUserData().then((data) => setUser(data));
                  })();
                })
                .catch((err) => console.log(err));
            }}
            className="inline-flex space-x-3 text-xl btn-outline"
          >
            <span>Connect with</span>
            <img src="/logo.svg" className="h-8" />
          </button>
        </div>
      )}
    </section>
  );
}
