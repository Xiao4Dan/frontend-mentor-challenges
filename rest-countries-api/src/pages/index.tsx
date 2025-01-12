import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Countries from "@/components/Countries";
import Header from "@/components/Header";
import { useState } from "react";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export default function Home() {
  const [mode, setMode] = useState("light");
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "hsl(230, 17%, 14%)",
      },
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      background: {
        default: "hsl(0, 0%, 100%)",
      },
    },
  });

  const selectedTheme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={selectedTheme}>
      <CssBaseline enableColorScheme />
      <Head>
        <title>REST Countries API with color theme switcher</title>
        <meta
          name="description"
          content="Front end mentor challenge: REST Countries API with color theme switcher."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        component="div"
        sx={{
          backgroundColor:
            mode === "light" ? "rgba(249, 250, 251, 1);" : "black",
        }}
      >
        <Header
          mode={mode}
          onChangeMode={() => setMode(mode === "light" ? "dark" : "light")}
        />
        <Countries />
        <footer className={styles.footer} />
      </Box>
    </ThemeProvider>
  );
}
