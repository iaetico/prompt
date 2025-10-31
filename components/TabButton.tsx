import React from 'react';

interface TabButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}

export const TabButton: React.FC<TabButtonProps> = ({ children, onClick, isActive }) => {
  const baseClasses = "flex items-center justify-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500";
  const activeClasses = "text-purple-400 border-b-2 border-purple-400 bg-slate-800";
  const inactiveClasses = "text-slate-400 hover:text-white hover:bg-slate-800/50";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};
