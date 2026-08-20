import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop Products', path: '/products' },
  { label: 'Featured Deals', path: '/products?deals=true' },
  { label: 'Track Order', path: '/account' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-xs hidden md:block">
      <div className="max-w-[1280px] mx-auto px-4">
        <ul className="flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-1 px-4 py-3.5 text-[13.5px] font-semibold transition-colors relative group ${
                    isActive
                      ? 'text-[#0066D6]'
                      : 'text-gray-700 hover:text-[#0066D6]'
                  }`}
                >
                  {link.label}
                  {/* Active underline */}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0066D6] rounded-full" />
                  )}
                  {/* Hover underline */}
                  {!isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0066D6] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
