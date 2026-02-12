import "./globals.css";

export const metadata = {
  title: "Invitation de mariage",
  description: "Site d'invitation de mariage"
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
