import "../styles/globals.css";

import type { AppProps } from "next/app";
import React from "react";

import { ColorSchemeProvider } from "../components/ColorSchemeContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ColorSchemeProvider>
      <Component {...pageProps} />
    </ColorSchemeProvider>
  );
}
export default MyApp;
