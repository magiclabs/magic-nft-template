import { UserContext } from "@/lib/UserContext";
import Image from "next/image";
import { useContext } from "react";
import { AnimatedLoader } from "./AnimatedLoader";

export default function LoadingWrapper({
  children,
  loading = false,
  message = "loading, please wait...",
}) {
  const [user] = useContext(UserContext);

  return (
    <>{!loading && !user?.loading ? <>{children}</> : <AnimatedLoader />}</>
  );
}
