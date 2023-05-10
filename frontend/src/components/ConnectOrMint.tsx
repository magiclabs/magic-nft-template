import { useContext } from "react";
import { UserContext } from "@/lib/UserContext";

import LoginWithMagic from "./LoginWithMagic";
import MintNFTButton from "./MintNFTButton";

export default function ConnectOrMint({}) {
  const [user] = useContext(UserContext);

  return (
    <section className="space-x-4">
      {user?.address ? <MintNFTButton /> : <LoginWithMagic />}
    </section>
  );
}
