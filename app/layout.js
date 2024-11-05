import './styles.css';
import Navbar from './components/Navbar';
import { GlobalProvider } from './context/GlobalContext';

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