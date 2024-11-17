import type { Metadata } from "next";
import { Inter, Roboto, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({subsets: ["latin"], weight: ["300", "400", "500", "600",  "700"]})


export const metadata: Metadata = {
  title: {
    default: "Recurring Date Picker",
    template: `Recurring Date Picker`,
  },
  description:
    "Recurring Date Picker",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
            "scroll-smooth antialiased",
            inter.className
          )}>
          <main className="flex flex-1 flex-col  min-h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          </main>
      </body>
    </html>
  );
}
