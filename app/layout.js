import { GlobalProvider } from "@/app/context/GlobalContext";
import { ModalProvider } from "@/app/context/ModalContext";
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
      <body>
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
