import { Droplets } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eff6ff] via-[#dbeafe] to-[#bfdbfe] px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient blob */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#3B82F6]/20 to-[#1D4ED8]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[#6BBF4E]/15 to-[#3D6F2B]/10 rounded-full blur-3xl" />

        {/* Floating water drops */}
        <div className="absolute top-[15%] left-[10%] w-4 h-5 rounded-full bg-[#3B82F6]/20 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[25%] right-[15%] w-3 h-4 rounded-full bg-[#3B82F6]/15 animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-[30%] left-[20%] w-2.5 h-3.5 rounded-full bg-[#60A5FA]/20 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[20%] right-[25%] w-3 h-4 rounded-full bg-[#3B82F6]/15 animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[40%] left-[5%] w-2 h-3 rounded-full bg-[#60A5FA]/20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[60%] right-[8%] w-3.5 h-4.5 rounded-full bg-[#3B82F6]/15 animate-float" style={{ animationDelay: '0.8s' }} />
      </div>

      {/* Content */}
      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6BBF4E] to-[#3D6F2B] shadow-lg shadow-[#6BBF4E]/30 mb-4">
            <Droplets className="w-8 h-8 text-white" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">HydroLog</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your hydration journey</p>
        </div>

        {children}
      </div>
    </div>
  );
}
