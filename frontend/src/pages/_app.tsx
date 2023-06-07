import "@/styles/globals.css";
import { Inter } from "@next/font/google";
import { UserProvider } from "@/context/UserContext";
import { Web3Provider } from "@/context/Web3Context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }) {
  return (
    <Web3Provider>
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
    </Web3Provider>
  );
}
