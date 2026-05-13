import "./globals.css";
import QueryProvider from "@/lib/query-provider";

export const metadata = {
  title: "Finance App",
  description: "Professional Finance Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}