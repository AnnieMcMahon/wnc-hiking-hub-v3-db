import { GlobalProvider } from "@/app/context/GlobalContext";
import Navbar from "@/app/ui/Navbar";
import "./global.css";

export const metadata = {
  title: "WNC Hiking Hub",
  description: "An app for hikers to join or post hikes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <Navbar />
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}