import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

export default function FaucetSection({}) {
  const { user } = useUser();
  const [copyState, setCopyState] = useState({
    copied: false,
    text: "Copy wallet address",
  });

  // only show this component when a user is connected
  if (!user?.address) return null;

  const handleClick = async () => {
    if (!user?.address) return alert("Please connect!");

    try {
      await navigator.clipboard.writeText(user?.address);
      setCopyState({ copied: true, text: "Copied!" });
      setTimeout(() => {
        setCopyState({ copied: false, text: "Copy wallet address" });
      }, 5000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <section className="mx-auto max-w-lg space-y-3">
      <div>
        <p>Add free ETH to your wallet using Goerli testnet.</p>
        <p className="text-sm text-gray-500">
          *You will need to create an account using Alchemy
        </p>
      </div>

      <div className="justify-between space-y-2 md:flex md:space-x-4 md:space-y-0">
        <button
          className={`${
            copyState.copied ? "text-[#00875F]" : ""
          } btn-outline block w-full`}
          onClick={() => handleClick()}
        >
          {copyState.text}
        </button>

        <Link
          href={"https://sepoliafaucet.com/"}
          target={"_blank"}
          rel={"noreferrer"}
          className="btn-light block w-full"
        >
          Open Sepolia ETH faucet
        </Link>
      </div>
    </section>
  );
}
