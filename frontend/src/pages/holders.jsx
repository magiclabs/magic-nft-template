import Layout from "@/components/layout";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/UserContext";
import MintNFTButton from "@/components/MintNFTButton";
import LoadingWrapper from "@/components/LoadingWrapper";

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
    <Layout title="Holders Only Area" className="">
      <section className="hero">
        <h1>Holders Only Area</h1>
      </section>

      <LoadingWrapper>
        {user?.address ? (
          <section className="space-y-4 text-center">
            <LoadingWrapper loading={loading}>
              {user?.collectibles?.length > 0 ? (
                <>
                  <h2 className="text-2xl">Super secret area</h2>
                  <p className="max-w-md mx-auto">
                    Host and display exclusive content that&apos;s
                    only available to NFT holders.
                  </p>
                </>
              ) : (
                <p className="max-w-md mx-auto">
                  This area is for holders of the NFT collection only.
                </p>
              )}

              <MintNFTButton
                buttonText={
                  user?.collectibles?.length > 0
                    ? "Mint another NFT"
                    : "Mint an NFT"
                }
                className="mx-auto text-center"
              />
            </LoadingWrapper>
          </section>
        ) : (
          <p className="max-w-md mx-auto text-xl text-center">
            Log in to access exclusive content{" "}
            <span className="italic font-semibold">only</span> available to NFT
            collection holders.
          </p>
        )}
      </LoadingWrapper>
    </Layout>
  );
}
