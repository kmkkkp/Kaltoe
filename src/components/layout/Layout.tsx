import React from 'react';
import { Navbar } from './Navbar';
import { Home, BarChart2, History, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 via-[#090b1f] to-black text-white overflow-hidden">
      <div className="stars absolute inset-0 pointer-events-none"></div>
      <div className="galaxy absolute inset-0 pointer-events-none"></div>
      
      <main className="flex-1 overflow-auto py-4 px-4 md:py-8 md:px-8 relative z-10">
        {children}
      </main>
      
      <Navbar 
        items={[
          { label: '별자리', icon: <Home size={24} />, href: '/' },
          { label: '챌린지', icon: <BarChart2 size={24} />, href: '/challenges' },
          { label: '히스토리', icon: <History size={24} />, href: '/history' },
          { label: '프로필', icon: <User size={24} />, href: '/profile' },
        ]} 
      />
    </div>
  );
};