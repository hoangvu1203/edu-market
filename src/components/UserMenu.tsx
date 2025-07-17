import React, { useRef } from 'react';
import { User, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  user: { name: string; email: string };
  open: boolean;
  setOpen: (open: boolean) => void;
  onViewHistory: () => void;
  userDropdownRef: React.RefObject<HTMLDivElement>;
  userDropdownCloseTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  isMobile?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
  navigate?: (path: string) => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  open,
  setOpen,
  onViewHistory,
  userDropdownRef,
  userDropdownCloseTimeout,
  isMobile = false,
  setIsMobileMenuOpen,
  navigate,
}) => {
  // Desktop hover logic
  const handleMouseEnter = () => {
    if (userDropdownCloseTimeout.current) {
      clearTimeout(userDropdownCloseTimeout.current);
    }
    setOpen(true);
  };
  const handleMouseLeave = () => {
    if (userDropdownCloseTimeout.current) {
      clearTimeout(userDropdownCloseTimeout.current);
    }
    userDropdownCloseTimeout.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };
  // Mobile click logic
  const handleMobileClick = () => setOpen(!open);

  return (
    <div
      className="relative"
      ref={userDropdownRef}
      onMouseEnter={!isMobile ? handleMouseEnter : undefined}
      onMouseLeave={!isMobile ? handleMouseLeave : undefined}
    >
      <button
        className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 px-2 py-1 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={isMobile ? handleMobileClick : undefined}
        type="button"
      >
        <User className="w-5 h-5" />
        <span className="text-sm font-medium">{user.name}</span>
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>
      {open && (
        <div className={`bg-white border border-secondary-200 rounded-lg shadow-lg z-50 animate-fade-in ${isMobile ? 'mt-2 w-full absolute left-0' : 'absolute right-0 mt-2 w-48'}`}>
          <div className="px-4 py-3 text-secondary-700 border-b border-secondary-100 cursor-default">
            <div className="font-semibold">{user.name}</div>
            <div className="text-xs text-secondary-500">{user.email}</div>
          </div>
          <button
            className="w-full text-left px-4 py-3 hover:bg-secondary-50 text-secondary-700 transition-colors duration-200"
            onClick={() => {
              if (isMobile && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
              setOpen(false);
              onViewHistory();
            }}
          >
            View History
          </button>
          <button
            className="w-full text-left px-4 py-3 text-secondary-400 cursor-not-allowed"
            disabled
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 