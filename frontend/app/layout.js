import "./globals.css";

export const metadata = {
  title: "Education Analyzer",
  description: "Smarter Assessments. Powered by Gemma.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
