import './globals.css'
export const metadata = {
  title: 'SpyLink - Smart Tracker',
  description: 'Create tracking links and monitor visitors',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
