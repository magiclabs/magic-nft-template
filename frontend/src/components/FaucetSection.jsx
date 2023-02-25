import Link from "next/link";
import { UserContext } from "@/lib/UserContext";
import { useContext } from "react";

export default function FaucetSection({}) {
  const [user] = useContext(UserContext);

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
          className="block w-full btn-outline"
          onClick={() => {
            if (!user?.address) return alert("Please connect!");

            navigator.clipboard
              .writeText(user?.address)
              .then((res) =>
                alert(
                  `ETH wallet address copied to clipboard: ${user?.address}`,
                ),
              );
          }}
        >
          Copy wallet address
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
