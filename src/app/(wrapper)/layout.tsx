import type { Metadata } from "next";
import "./global.css";
import { Inter } from "next/font/google";
import Menu from "@/components/Menu/Menu";
import ReduxProvider from "@/components/ReduxProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shop Manager",
};

export default function WrapperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${inter.className} bg-gray-100`}
        style={{ display: "flex" }}
      >
        <ReduxProvider>
          <div>
            <Menu />
          </div>
          <div className="w-full h-screen overflow-hidden">{children}</div>
        </ReduxProvider>
      </body>
    </html>
  );
}
