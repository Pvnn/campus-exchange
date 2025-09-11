import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Campus Exchange",
  description: "A marketplace for campus resources",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
