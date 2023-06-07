import { useUser } from "@/context/UserContext";
import { AnimatedLoader } from "./AnimatedLoader";

export default function LoadingWrapper({ children, loading = false }) {
  const { user } = useUser();

  return (
    <>{!loading && !user?.loading ? <>{children}</> : <AnimatedLoader />}</>
  );
}
