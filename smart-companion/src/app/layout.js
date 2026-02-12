import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext"; // <--- 1. IMPORT THIS

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sahayak Neo",
  description: "AI Task Decomposer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. WRAP THE CHILDREN IN THE PROVIDER */}
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}