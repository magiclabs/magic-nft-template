import Layout from "@/components/layout";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/UserContext";

import LoadingWrapper from "@/components/LoadingWrapper";
import CollectibleCard from "@/components/CollectibleCard";
import LoginWithMagic from "@/components/LoginWithMagic";
import MintNFTButton from "@/components/MintNFTButton";

export default function CollectiblesPage() {
  const [user, setUser] = useContext(UserContext);

  // initialize the state used to track the current page's data
  const [loading, setLoading] = useState(user?.refreshCollectibles);

  useEffect(() => {
    // do nothing if the user is not logged in
    if (!user?.address) {
      setLoading(true);
      return;
    }

    // disable the loading after collectibles have already been loaded
    if (user?.address && !user?.refreshCollectibles && user?.collectibles) {
      setLoading(false);
      return;
    }
  }, [user?.address, user?.refreshCollectibles, user?.collectibles]);

  return (
    <Layout title="My Collection" className="">
      <section className="hero">
        <h1>My Collection</h1>

        <p>Show users the NFTs from your collection that they own</p>
      </section>

      <LoadingWrapper>
        {user?.address ? (
          <>
            <MintNFTButton
                buttonText={
                  user?.collectibles?.length > 0
                    ? "Mint another NFT"
                    : "Mint an NFT"
                }
                className="mx-auto text-center"
              />

            <LoadingWrapper
              loading={loading}
              message="fetching your NFTs from the blockchain"
            >
              <section className="grid gap-8 mx-auto md:grid-cols-3 lg:grid-cols-4">
                {user?.collectibles?.map((uri, id) => (
                  <CollectibleCard key={id} tokenURI={uri} />
                ))}
              </section>
            </LoadingWrapper>
          </>
        ) : (
          <section className="py-10 space-y-3 text-center">
            <LoginWithMagic />

            <p className="text-lg">
              Connect your wallet or login with Magic.link to view your
              collectibles
            </p>
          </section>
        )}
      </LoadingWrapper>
    </Layout>
  );
}
