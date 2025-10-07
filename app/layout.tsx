import "./globals.css";

export const metadata = {
  title: "Teuron Mini-App",
  description: "Tap to earn Teuron Points",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
