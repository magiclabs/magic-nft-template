import { useContext, useEffect } from "react";
import Image from "next/image";
// import { Inter } from "@next/font/google";
import Layout from "@/components/layout";
import CollectibleCard from "@/components/CollectibleCard";
import { UserContext } from "@/lib/UserContext";

import { magic } from "@/lib/magic";

// const inter = Inter({ subsets: ["latin"] });

const tokens = [0, 0, 0, 0];

export default function Home() {
  const [user] = useContext(UserContext);

  return (
    <Layout title="Home" className="">
      <h1 className="text-5xl font-semibold text-center">NFT Collection</h1>

      <section className="grid gap-8 mx-auto md:grid-cols-3 lg:grid-cols-4">
        {tokens.slice(0, 4).map((item, id) => (
          <CollectibleCard key={id} item={item} />
        ))}
      </section>

      <section className="mx-auto text-center">
        <button
          onClick={async () => {
            // magic.connect.showWallet();
            // magic.wallet.connectWithUI();
          }}
          className="inline-flex space-x-3 text-xl btn-outline"
        >
          <span>Connect with</span>
          <img src="/logo.svg" className="h-8" />
        </button>
      </section>
    </Layout>
  );
}
