import { useWeb3 } from "@/context/Web3Context";
import { magic } from "@/lib/magic";

export default function LoginWithMagic() {
  const { initializeWeb3 } = useWeb3();

  const handleLogin = async () => {
    try {
      // Attempt to connect with the user's wallet using Magic's UI
      await magic.wallet.connectWithUI();
      // If the wallet connection is successful, initialize web3 instance
      await initializeWeb3();
    } catch (error) {
      // Log any errors that occur during the login process
      console.error("handleLogin", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogin}
        className="btn inline-flex space-x-3 text-lg"
      >
        <span>Sign up</span>
      </button>
    </div>
  );
}
