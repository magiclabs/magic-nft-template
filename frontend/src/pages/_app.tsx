import "@/styles/globals.css";
import { Inter } from "@next/font/google";
import { UserProvider } from "@/context/UserContext";
import { MagicProvider } from "@/context/MagicContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }) {
  return (
    <MagicProvider>
      <UserProvider>
        <style jsx global>
          {`
            :root {
              --font-inter: ${inter.style.fontFamily};
            }
          `}
        </style>
        <Component {...pageProps} />
      </UserProvider>
    </MagicProvider>
  );
}
