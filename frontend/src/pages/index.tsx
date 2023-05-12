import Layout from "@/components/Layout";

import LoadingWrapper from "@/components/LoadingWrapper";
import CollectibleCard from "@/components/CollectibleCard";
import FaucetSection from "@/components/FaucetSection";
import ConnectOrMint from "@/components/ConnectOrMint";

// store a default listing of NFT images from the collection for display on the page
const tokens = [
  { id: 0, image: "/img/Ace Hiro.png" },
  { id: 3, image: "/img/Jack Hiro.png" },
  { id: 9, image: "/img/Queen Hiro.png" },
  { id: 4, image: "/img/King Hiro.png" },
];

export default function Home() {
  return (
    <Layout title="Home" className="">
      <section className="hero">
        <h1 className="hidden custom-breakpoint-500:block">
          Magic NFT dApp Template
        </h1>
        <h1 className="block custom-breakpoint-500:hidden">
          Magic NFT dApp&nbsp;Template
        </h1>
        <p>
          Follow our{" "}
          <a
            href="https://github.com/magiclabs/magic-nft-template/blob/master/README.md"
            rel="noreferrer"
            target="_blank"
            className="text-brand-purple underline"
          >
            NFT developer guide
          </a>{" "}
          to clone this open source template as your NFT starter kit. This demo
          includes code for authentication, wallet onboarding, NFT minting, NFT
          viewing, and token gating.
        </p>
      </section>

      <LoadingWrapper>
        <section className="space-t-4 mx-auto text-center">
          <ConnectOrMint />
        </section>

        <section className="mx-auto text-center">
          <FaucetSection />
        </section>

        <div className="flex justify-center">
          <section className="inline-grid place-items-center gap-8 md:grid-cols-3 lg:grid-cols-4">
            {tokens.slice(0, 4).map((item, id) => (
              <CollectibleCard key={id} item={item} />
            ))}
          </section>
        </div>
      </LoadingWrapper>
    </Layout>
  );
}
