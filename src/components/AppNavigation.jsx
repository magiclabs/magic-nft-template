import Link from "next/link";
import styles from "@/styles/Nav.module.css";

export default function AppNavigation({}) {
  return (
    <ul className={styles.nav}>
      <li>
        <Link href={"/"}>Home</Link>
      </li>
      <li>
        <Link href={"/collectables"}>My Collectables</Link>
      </li>
      <li>
        <Link href={"/holders"}>Holders Only</Link>
      </li>
    </ul>
  );
}
