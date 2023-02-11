import Link from "next/link";
import styles from "@/styles/Nav.module.css";

export default function AppNavigation({}) {
  return (
    <ul className={styles.nav}>
      <li>
        <Link href={"/"}>Home</Link>
      </li>
      <li>
        <Link href={"/"}>Guest Area</Link>
      </li>
      <li>
        <Link href={"/"}>Member Area</Link>
      </li>
    </ul>
  );
}
