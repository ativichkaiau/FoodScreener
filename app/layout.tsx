import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import IntroScreen from "../components/IntroScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VESTRIPPN3.0 // Food Screening Matrix",
  description: "Sustenance Logistics Node",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAFA] dark:bg-[#050505] transition-colors duration-700 ease-in-out">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('theme-mode');if(m!=='day'&&m!=='night'&&m!=='auto')m='auto';var h=new Date().getHours();var dark=m==='night'||(m==='auto'&&(h>=18||h<6));var r=document.documentElement;r.classList.toggle('dark',dark);r.dataset.themeMode=m;}catch(e){}})();`,
          }}
        />
        <IntroScreen />
        {children}
      </body>
    </html>
  );
}