import Layout from "@/components/layout";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/UserContext";
import MintNFTButton from "@/components/MintNFTButton";
import LoadingWrapper from "@/components/LoadingWrapper";
import LoginWithMagic from "@/components/LoginWithMagic";
import MerchForm from "@/components/MerchForm";
import Image from "next/image";

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
        <p>
          This page only shows content to users with a Hiro NFT. At Magic,
          we&apos;re seeing a rising number of sophisticated token-gating use
          cases at large enterprises.{" "}
          <a
            href="https://magic.link/contact"
            rel="noreferrer"
            target="_blank"
            className="underline text-brand-purple"
          >
            Contact us
          </a>{" "}
          if you&apos;d like our help with your project.
        </p>
      </section>

      <LoadingWrapper>
        {user?.address ? (
          <section className="space-y-4 text-center">
            <LoadingWrapper loading={loading}>
              {user?.collectibles?.length > 0 ? (
                <div>
                  <p className="max-w-5xl mx-auto">
                    Everyone loves free merch. Complete the form below for a
                    chance to win our monthly swag giveaway!
                  </p>
                  <div className="flex items-start justify-center mx-auto space-x-12">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Image
                          className="block shadow-image"
                          src="/img/swag-buckethat.png"
                          height={250}
                          width={250}
                          alt="Hat swag"
                        />
                      </div>
                      <div>
                        <Image
                          className="block shadow-image"
                          src="/img/swag-tote.png"
                          height={250}
                          width={250}
                          alt="Hat swag"
                        />
                      </div>
                      <Image
                        className="block shadow-image"
                        src="/img/swag-jacket.png"
                        height={250}
                        width={250}
                        alt="Hat swag"
                      />
                      <div>
                        <Image
                          className="block shadow-image"
                          src="/img/swag-cards.png"
                          height={250}
                          width={250}
                          alt="Hat swag"
                        />
                      </div>
                    </div>
                    <div className="p-8 bg-white shadow-form rounded-3xl">
                      <MerchForm />
                    </div>
                  </div>
                </div>
              ) : null}
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
