import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface NavbarProps {
  items: NavItem[];
}

export const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const location = useLocation();
  
  return (
    <nav className="sticky bottom-0 w-full px-4 py-2 bg-black/30 backdrop-blur-lg border-t border-indigo-900/30 z-50">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-around items-center">
          {items.map((item, index) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={index}
                to={item.href}
                className={`flex flex-col items-center p-2 transition-all duration-300 ${
                  isActive 
                    ? 'text-indigo-400 scale-110' 
                    : 'text-gray-400 hover:text-indigo-300'
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                  )}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};