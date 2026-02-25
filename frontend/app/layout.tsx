import type { Metadata } from "next";
import { FinanceProvider } from "@/lib/context/FinanceContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BudgetWise - Personal Finance Tracker",
  description:
    "Track your income, expenses, and financial goals with AI-powered insights",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Blocking script: applies dark class before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var settings = JSON.parse(localStorage.getItem('budgetwise_settings') || '{}');
                  if (settings.darkMode !== false) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <AuthProvider>
          <FinanceProvider>{children}</FinanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
