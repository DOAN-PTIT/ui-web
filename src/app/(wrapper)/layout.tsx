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
        className={`antialiased ${inter.className}`}
        style={{ display: "flex" }}
      >
        <ReduxProvider>
          <div style={{ width: 200 }}>
            <Menu />
          </div>
          <div style={{ width: "calc(100% - 200px)" }}>{children}</div>
        </ReduxProvider>
      </body>
    </html>
  );
}
