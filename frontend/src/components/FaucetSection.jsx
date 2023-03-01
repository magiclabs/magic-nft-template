import Link from "next/link";
import { UserContext } from "@/lib/UserContext";
import { useContext, useState } from "react";

export default function FaucetSection({}) {
  const [user] = useContext(UserContext);
  const [copyState, setCopyState] = useState({
    copied: false,
    text: "Copy wallet address",
  });

  // only show this component when a user is connected
  if (!user?.address) return <></>;
  // (optional) only show if the user.address is low on balance
  // else if (!user?.balance >= 0.01) return <></>;

  return (
    <section className="max-w-lg mx-auto space-y-3">
      <div>
        <p>Add free ETH to your wallet using Goerli testnet.</p>
        <p className="text-sm text-gray-500">
          *You will need to create an account using Alchemy
        </p>
      </div>

      <div className="justify-between space-y-2 md:space-x-4 md:space-y-0 md:flex">
        <button
          className={`${
            copyState.copied ? "text-[#00875F]" : ""
          } block w-full btn-outline`}
          onClick={() => {
            if (!user?.address) return alert("Please connect!");

            navigator.clipboard.writeText(user?.address).then((res) => {
              setTimeout(() => {
                setCopyState({ copied: false, text: "Copy wallet address" });
              }, 5000);
              setCopyState({ copied: true, text: "Copied!" });
            });
          }}
        >
          {copyState.text}
        </button>

        <Link
          href={"https://goerlifaucet.com/"}
          target={"_blank"}
          rel={"noreferrer"}
          className="block w-full btn-light"
        >
          Open Goerli ETH faucet
        </Link>
      </div>
    </section>
  );
}
