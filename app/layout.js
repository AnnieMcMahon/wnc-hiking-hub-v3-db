import { GlobalProvider } from "@/app/context/GlobalContext";
import { ModalProvider } from "@/app/context/ModalContext";
import Script from "next/script";
import Modal from "./Modal";
import Navbar from "./ui/components/Navbar";
import "./global.css";

export const metadata = {
  title: "WNC Hiking Hub",
  description: "An app for hikers to join or post hikes",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-[100vh] text-center bg-no-repeat bg-center bg-[url('/background.jpeg')] bg-cover"
        >   
        {/* Google Analytics Script */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-L5Q33L0NSS"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L5Q33L0NSS');
          `}
        </Script>
        <GlobalProvider>
          <ModalProvider>
            <Modal />
            <Navbar />
            {children}
          </ModalProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
