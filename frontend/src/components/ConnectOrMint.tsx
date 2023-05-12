import { useUser } from "@/context/UserContext";
import LoginWithMagic from "./LoginWithMagic";
import MintNFTButton from "./MintNFTButton";

export default function ConnectOrMint({}) {
  const { user } = useUser();

  return (
    <section className="space-x-4">
      {user?.address ? <MintNFTButton /> : <LoginWithMagic />}
    </section>
  );
}
