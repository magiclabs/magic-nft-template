import Link from "next/link";
import { UserContext } from "@/lib/UserContext";
import { useContext } from "react";

export default function FaucetSection({}) {
  const [user] = useContext(UserContext);

  // only show this component when a user is connected, and they are low on balance
  if (!user?.address || !user?.balance <= 0.01) return <></>;

  return (
    <section className="my-8 space-y-2">
      <div className="inline-flex justify-between space-x-4">
        <button
          onClick={() => {
            if (!user?.address) return alert("Please connect!");

            navigator.clipboard
              .writeText(user?.address)
              .then((res) =>
                alert(
                  `ETH wallet address coppied to clipboard: ${user?.address}`
                )
              );
          }}
          className="inline-flex space-x-3 text-xl btn-outline"
        >
          Copy Wallet Address
        </button>

        <Link
          href={"https://goerlifaucet.com/"}
          target={"_blank"}
          rel={"noreferrer"}
          className="inline-flex space-x-3 text-xl btn-outline"
        >
          ETH faucet
        </Link>
      </div>

      <p>Low ETH balance? Get free testnet ETH from the faucet.</p>
    </section>
  );
}
