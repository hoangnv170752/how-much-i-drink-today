import { Header } from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eff6ff] via-background to-background">
      <Header />
      <main className="w-full max-w-lg mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
