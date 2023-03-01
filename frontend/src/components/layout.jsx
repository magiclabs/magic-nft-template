import Head from "next/head";
import AppHeader from "./AppHeader";
import Modal from "./Modal";

export default function Layout({ children, title, className = "" }) {
  return (
    <>
      <AppHeader />

      <Modal />

      <main className={`px-3 container py-12 space-y-12 ${className}`}>
        {children}
      </main>
    </>
  );
}
