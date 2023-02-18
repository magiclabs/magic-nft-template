import Link from "next/link";
import { UserContext } from "@/lib/UserContext";
import { useContext } from "react";

export default function FaucetSection({}) {
  const [user] = useContext(UserContext);

  // only show this component when a user is connected
  if (!user?.address) return <></>;
  // (optioanl) only show if the user.address is low on balance
  // else if (!user?.balance >= 0.01) return <></>;

  return (
    <section className="my-8 space-y-2">
      <div className="inline-flex justify-between space-x-4">
        <button
          className="btn-outline"
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
        >
          Copy Wallet Address
        </button>

        <Link
          href={"https://goerlifaucet.com/"}
          target={"_blank"}
          rel={"noreferrer"}
          className="btn-outline"
        >
          Open ETH faucet
        </Link>
      </div>

      <p>Low ETH balance? Get free testnet ETH from the faucet.</p>
      <p className="text-sm text-gray-500">*Goerli faucet powered by Alchemy</p>
    </section>
  );
}
