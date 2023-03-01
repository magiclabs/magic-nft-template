import Link from "next/link";
import styles from "@/styles/Nav.module.css";

export default function AppNavigation({}) {
  return (
    <ul className={styles.linkArea}>
      <li>
        <Link
          href="https://github.com/magiclabs/magic-nft-template/blob/master/README.md"
          target="_blank"
        >
          Guide
        </Link>
      </li>
      <li>
        <Link href={"/collectibles"}>Collection</Link>
      </li>
      <li>
        <Link href={"/holders"}>Token-Gated Perks</Link>
      </li>
    </ul>
  );
}
