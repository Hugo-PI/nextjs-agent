'use client';
import { PanelLeftClose } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 left-0 z-50 flex items-center px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="mr-4 cursor-pointer rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Toggle navigation"
            onClick={toggleSidebar}
          >
            <PanelLeftClose size={25}/>
          </button>
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="hidden text-xl font-semibold text-gray-800 sm:block">
                LangGraph & NextJS Agent
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
