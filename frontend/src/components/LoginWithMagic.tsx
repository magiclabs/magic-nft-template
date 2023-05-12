import { useUser } from "@/context/UserContext";
import { getUserData } from "@/lib/utils";
import { useMagicContext } from "@/context/MagicContext";

export default function LoginWithMagic({ className = "" }) {
  const { setUser } = useUser();
  const { magic, web3 } = useMagicContext();

  const handleLogin = async () => {
    try {
      await magic.wallet.connectWithUI();
      const data = await getUserData(magic, web3);
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleLogin}
        className="btn inline-flex space-x-3 text-lg"
      >
        <span>Sign up</span>
      </button>
    </div>
  );
}
