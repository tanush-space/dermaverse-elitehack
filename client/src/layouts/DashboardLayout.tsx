import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, LayoutDashboard, ScanLine, LineChart, 
  Bot, Calendar, Settings, Bell, Search, Menu, LogOut, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { path: '/dashboard/analysis', label: 'Analysis', icon: ScanLine },
  { path: '/dashboard/timeline', label: 'Timeline', icon: LineChart },
  { path: '/dashboard/assistant', label: 'Intelligence', icon: Bot },
  { path: '/dashboard/appointments', label: 'Clinics', icon: Calendar },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex selection:bg-[#D97757]/30 font-sans text-[#2C2A25]">
      <div className="absolute inset-0 bg-noise pointer-events-none z-50 mix-blend-overlay" />
      
      {/* Sidebar - Floating Glass Style */}
      <aside className="w-[280px] hidden lg:flex flex-col fixed top-0 left-0 h-screen p-6 z-40">
        <div className="flex-1 bg-white/80 backdrop-blur-xl border border-[#EDE8E0] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden relative">
          
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D97757] flex items-center justify-center shadow-lg shadow-[#D97757]/20">
              <Sparkles className="w-5 h-5 text-[#FDFBF7]" />
            </div>
            <span className="text-2xl font-serif font-medium tracking-tight text-[#2C2A25]">DermaVerse</span>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);
                
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-medium transition-all relative group",
                    isActive 
                      ? "text-[#FDFBF7] bg-[#5A6B5D] shadow-md" 
                      : "text-[#5A6B5D] hover:text-[#2C2A25] hover:bg-[#F4EBE6]"
                  )}
                >
                  <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-[#FDFBF7]" : "text-[#D97757] group-hover:text-[#2C2A25]")} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="p-6 border-t border-[#EDE8E0]/50">
            <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#F4EBE6] cursor-pointer transition-colors">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FDFBF7] shadow-sm">
                <img src="https://picsum.photos/seed/user1/100/100" alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-serif font-medium text-[#2C2A25] truncate">Sarah Jenkins</p>
                <p className="text-xs text-[#5A6B5D] uppercase tracking-widest truncate mt-0.5">Pro Member</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:pl-[280px] relative z-10">
        {/* Top Header */}
        <header className="h-24 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-30 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#EDE8E0]/50">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="ghost" size="icon" className="text-[#5A6B5D]">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-[#D97757] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FDFBF7]" />
            </div>
          </div>

          <div className="hidden lg:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B5D]" />
              <input 
                type="text" 
                placeholder="Search analysis, articles, appointments..." 
                className="w-full h-12 pl-12 pr-4 rounded-full bg-white border border-[#EDE8E0] focus:bg-white focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 text-[15px] transition-all outline-none shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="relative text-[#5A6B5D] hover:text-[#2C2A25] bg-white border border-[#EDE8E0] rounded-full h-12 w-12 shadow-sm">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-[#D97757] rounded-full border-2 border-white" />
            </Button>
            
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 bg-white border border-[#EDE8E0] rounded-full px-4 py-2 h-12 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#D97757] flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-[#2C2A25]">
                  {user?.name || 'User'}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#EDE8E0] rounded-2xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#EDE8E0]">
                    <p className="text-sm font-medium text-[#2C2A25]">{user?.name}</p>
                    <p className="text-xs text-[#5A6B5D]">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#5A6B5D] hover:bg-[#F4EBE6] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
            
            <Button className="bg-[#2C2A25] text-[#FDFBF7] hover:bg-[#1A1916] rounded-full px-8 h-12 hidden lg:flex shadow-lg shadow-[#2C2A25]/10">
              <ScanLine className="w-4 h-4 mr-2 text-[#D97757]" /> Analyze Now
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1200px] mx-auto h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
