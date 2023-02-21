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
    <section className="max-w-lg mx-auto space-y-2">
      <div className="justify-between space-y-2 md:space-x-4 md:space-y-0 md:flex">
        <button
          className="block w-full btn-outline"
          onClick={() => {
            if (!user?.address) return alert("Please connect!");

            navigator.clipboard
              .writeText(user?.address)
              .then((res) =>
                alert(
                  `ETH wallet address copied to clipboard: ${user?.address}`
                )
              );
          }}
        >
          Copy Wallet Address
        </button>

        <Link
          href={"https://goerlifaucet.com/"}
          target={"_blank"}
          rel={"noreferrer"}
          className="block w-full btn-outline"
        >
          Open ETH faucet
        </Link>
      </div>

      <p>Low ETH balance? Get free testnet ETH from the faucet.</p>
      <p className="text-sm text-gray-500">*Goerli faucet powered by Alchemy</p>
    </section>
  );
}
