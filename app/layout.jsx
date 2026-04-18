import './globals.css';

export const metadata = {
  title: 'Digital Business Card Creator',
  description: 'Create AI-powered digital business cards with a 3D rotatable preview.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
