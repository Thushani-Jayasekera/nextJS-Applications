import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Fira_Code, Inter } from "next/font/google";
import type { AppProps } from "next/app";



export default function App({ Component, pageProps }: AppProps) {
	
  return (
    <SessionProvider session={pageProps.session}>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="light">
          <Component {...pageProps} />
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}

const fontSans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
})

const fontMono = Fira_Code({
    subsets: ["latin"],
    variable: "--font-mono",
  })

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
