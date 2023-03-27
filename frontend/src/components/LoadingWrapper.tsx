import { UserContext } from "@/lib/UserContext";
import { useContext } from "react";
import { AnimatedLoader } from "./AnimatedLoader";

export default function LoadingWrapper({ children, loading = false }) {
  const [user] = useContext(UserContext);

  return (
    <>{!loading && !user?.loading ? <>{children}</> : <AnimatedLoader />}</>
  );
}
