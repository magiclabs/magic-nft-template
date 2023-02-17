import Layout from "@/components/layout";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/UserContext";

import CollectibleCard from "@/components/CollectibleCard";
import LoginWithMagic from "@/components/LoginWithMagic";
import MintNFTButton from "@/components/MintNFTButton";
import { fetchJSONfromURI, fetchNFTs } from "@/lib/utils";

export default function CollectablesPage() {
  const [user, setUser] = useContext(UserContext);

  // initialize the state used to track the current page's data
  const [collectables, setCollectables] = useState([]);
  const [loading, setLoading] = useState(true);

  // const address = "0xfBb0C937C780D345CFD4ef41071504931F46E5C8";

  // fetch the list of current NFTs owned by the connected user
  useEffect(() => {
    // only attempt to fetch the NFTs if a user is connected
    if (!user?.address) return;

    // fetch the listing of the user's NFT from the blockchain
    (async () => {
      let tokenURIs = await fetchNFTs(user.address).then((res) => {
        console.log("Completed fetching token uri listing");
        return res;
      });

      // console.log("tokenURIs listing found:", tokenURIs);

      // update the stored state
      setCollectables(tokenURIs);
      setLoading(false);
    })();
  }, [user]);

  return (
    <Layout title="My Collection" className="">
      <section className="space-y-3 text-center">
        <h1 className="text-5xl font-semibold">
          My Collection of Magic Carpets
        </h1>

        <p className="text-gray-500">
          View your current owned NFTs from the Magic Carpet collection
        </p>
      </section>

      {user?.address ? (
        <>
          <MintNFTButton className="mx-auto text-center" />

          {loading ? (
            <p className="font-bold text-center">
              loading your collectables from the blockchain
            </p>
          ) : (
            <section className="grid gap-8 mx-auto md:grid-cols-3 lg:grid-cols-4">
              {collectables.map((uri, id) => (
                <CollectibleCard key={id} tokenURI={uri} />
              ))}
            </section>
          )}
        </>
      ) : (
        <section className="py-10 space-y-3 text-center">
          <LoginWithMagic />

          <p className="text-lg">
            Connect your wallet or login with Magic.link to view your
            collectables
          </p>
        </section>
      )}
    </Layout>
  );
}
