import "./globals.css";

export const metadata = {
  title: "Invitation",
  description: "Wedding invitation"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
