import "./globals.css";

export const metadata = {
  title: "Wedding Invitation",
  description: "Wedding invitation website"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
