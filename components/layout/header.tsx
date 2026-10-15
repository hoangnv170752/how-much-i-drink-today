'use client';

import { useState } from 'react';
import { Plus, LogOut, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddDrinkModal } from '@/components/add-drink/add-drink-modal';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#6BBF4E] via-[#5AAD3D] to-[#3D6F2B] shadow-md shadow-[#6BBF4E]/20">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm">
              <Droplets className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-lg ring-1 ring-white/30" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              HydroLog
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Add drink button - prominent */}
            <Button
              size="icon"
              onClick={() => setModalOpen(true)}
              className="relative w-10 h-10 rounded-full bg-white text-[#6BBF4E] hover:bg-white/90 hover:text-[#3D6F2B] shadow-lg shadow-black/10 transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
              <span className="sr-only">Add drink</span>
            </Button>

            {/* Logout button - subtle */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLogout}
              className="w-9 h-9 rounded-full text-white/80 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <AddDrinkModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
