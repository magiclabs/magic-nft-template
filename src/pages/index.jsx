import Layout from "@/components/layout";
import { useContext } from "react";
import { UserContext } from "@/lib/UserContext";

import CollectibleCard from "@/components/CollectibleCard";
import FaucetSection from "@/components/FaucetSection";
import ConnectOrMint from "@/components/ConnectOrMint";

//
const tokens = [0, 0, 0, 0];

export default function Home() {
  const [user, setUser] = useContext(UserContext);

  return (
    <Layout title="Home" className="">
      <h1 className="text-5xl font-semibold text-center">
        Magic Carpet NFT Collection
      </h1>

      <section className="grid gap-8 mx-auto md:grid-cols-3 lg:grid-cols-4">
        {tokens.slice(0, 4).map((item, id) => (
          <CollectibleCard key={id} item={item} />
        ))}
      </section>

      <section className="mx-auto space-y-8 text-center">
        <ConnectOrMint />

        <FaucetSection />
      </section>
    </Layout>
  );
}
