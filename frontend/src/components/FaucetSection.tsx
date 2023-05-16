import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function FaucetSection({}) {
  const { user } = useUser();
  const [copyState, setCopyState] = useState({
    copied: false,
    text: "Copy wallet address",
  });

  // Don't render the component if there is no connected user
  if (!user?.address) return null;

  const handleClick = async () => {
    try {
      // Attempt to copy the user's wallet address to the clipboard
      await navigator.clipboard.writeText(user?.address);

      // Update the state to reflect that the text has been copied
      setCopyState({ copied: true, text: "Copied!" });

      // After 1 second, reset the copyState to its initial state
      setTimeout(() => {
        setCopyState({ copied: false, text: "Copy wallet address" });
      }, 1000);
    } catch (error) {
      // Log any errors that occur during the copying process
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <section className="mx-auto max-w-lg space-y-3">
      <div>
        <p>Add free ETH to your wallet using Sepolia testnet.</p>
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
