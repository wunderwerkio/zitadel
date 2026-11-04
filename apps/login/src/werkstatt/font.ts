// wunderwerk: Geist, self-hosted (OFL, ./fonts/OFL.txt), in the cuts the
// Werkstatt design uses. werkstatt.css sets it over the stock Lato class,
// which stays in layout.tsx to keep the upstream diff small.
import localFont from "next/font/local";

export const geist = localFont({
  src: [
    { path: "./fonts/Geist-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Geist-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Geist-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Geist-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--ww-font",
  display: "swap",
});
