import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Modal.module.css";
import CollectibleCard from "./CollectibleCard";
import { useUser } from "@/context/UserContext";
import { useWeb3 } from "@/context/Web3Context";

export default function Modal() {
  const { user, setUser } = useUser();
  const { contract } = useWeb3();
  const [showModal, setShowModal] = useState(false);
  const [tokenURI, setTokenURI] = useState("");

  useEffect(() => {
    // Define an async function within the effect to handle the fetching of the token URI
    const fetchTokenURI = async () => {
      // Exit the function if there's no tokenIdForModal in the user state
      if (!user?.tokenIdForModal) return;

      // Reset the tokenIdForModal in the user state to null
      setUser({
        ...user,
        tokenIdForModal: null,
      });

      try {
        // Call the tokenURI method in the contract with the tokenIdForModal
        const uri = await contract.methods
          .tokenURI(user.tokenIdForModal)
          .call();
        console.log(`Token ID ${user.tokenIdForModal} has URI of ${uri}`);

        // Set the fetched URI in the local state
        setTokenURI(uri);

        // Show the modal
        setShowModal(true);
        console.log("show the minted modal");
      } catch (error) {
        // Log any errors
        console.warn("fetchTokenURI", error);
      }
    };

    fetchTokenURI();
  }, [user?.tokenIdForModal]);

  if (!showModal) return null;

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.modalInner}>
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <h3>Congratulations 🥳</h3>

              <button
                onClick={() => setShowModal(false)}
                className="hidden sm:block"
              >
                <Image src="/img/close.svg" width={16} height={16} alt="X" />
              </button>
            </div>

            <div className={styles.content}>
              <p className="text-center text-lg">You have minted a new NFT!</p>
              {tokenURI && (
                <div className="mx-auto w-64">
                  <CollectibleCard tokenURI={tokenURI} />
                </div>
              )}
            </div>

            <div
              className={`${styles.footer} flex flex-col md:flex-row ${styles.footerReverse}`}
            >
              <button
                className="btn btn-light mx-auto w-full"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>

              <Link
                href="/collectibles"
                className="btn mx-auto w-full text-center"
                onClick={() => setShowModal(false)}
              >
                View all collectibles
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.background}></div>
    </>
  );
}
