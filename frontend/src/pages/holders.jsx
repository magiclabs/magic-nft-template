import Layout from "@/components/layout";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/UserContext";
import MintNFTButton from "@/components/MintNFTButton";
import LoadingWrapper from "@/components/LoadingWrapper";
import LoginWithMagic from "@/components/LoginWithMagic";

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
        <h1>Token-Gated Perks</h1>
        <p className="max-w-xl mx-auto">
          You must be logged in with a wallet holding an NFT
          to see hidden content. At Magic, we&apos;re seeing a
          rising number of sophisticated token-gating use
          cases at large enterprises. <a href="https://magic.link/contact" rel="noreferrer" target="_blank" className="underline text-brand-purple">Contact us</a> if
          you&apos;d like our help with your project.
        </p>
      </section>

      <LoadingWrapper>
        {user?.address ? (
          <section className="space-y-4 text-center">
            <LoadingWrapper loading={loading}>
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
          <section className="py-10 space-y-3 text-center">
            <LoginWithMagic />
          </section>
        )}
      </LoadingWrapper>
    </Layout>
  );
}
