import Layout from "@/components/layout";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/UserContext";

import CollectibleCard from "@/components/CollectibleCard";
import LoginWithMagic from "@/components/LoginWithMagic";
import MintNFTButton from "@/components/MintNFTButton";

export default function CollectablesPage() {
  const [user, setUser] = useContext(UserContext);

  const [collectables, setCollectables] = useState([]);

  const address = "0xfBb0C937C780D345CFD4ef41071504931F46E5C8";

  // fetch the list of current NFTs owned by the connected user
  useEffect(() => {
    // update the stored state
    setCollectables([0, 0, 0]);
  }, []);

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

          <section className="grid gap-8 mx-auto md:grid-cols-3 lg:grid-cols-4">
            {collectables.map((item, id) => (
              <CollectibleCard key={id} item={item} />
            ))}
          </section>
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
