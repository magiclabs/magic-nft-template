import AppHeader from "./AppHeader";
import Modal from "./Modal";

export default function Layout({ children, title, className = "" }) {
  return (
    <>
      <AppHeader />
      <Modal />
      <main className={`container space-y-12 px-3 py-12 ${className}`}>
        {children}
      </main>
    </>
  );
}
