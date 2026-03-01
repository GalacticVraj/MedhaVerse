import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "MedhaVerse: Engineer the Future",
    description: "Interactive smart city simulation for learning engineering and science.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
