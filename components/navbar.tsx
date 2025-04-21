"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Home, MessageSquare, Mic, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Popover } from "@headlessui/react";

export default function Navbar() {
  return (
    <nav className="bg-black/20 dark:bg-black/10 light:bg-white backdrop-blur-sm border-b border-white/10 dark:border-gray-800 light:border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-2 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/logo.png" alt="English Tutor Logo" width={32} height={32} className="mr-2" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              English Tutor
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <NavLink href="/" icon={<Home className="h-4 w-4" />} label="Home" />
            <NavLink href="/practice" icon={<Mic className="h-4 w-4" />} label="Practice" />
            <NavLink href="/scenarios" icon={<MessageSquare className="h-4 w-4" />} label="Scenarios" />
            <ThemeToggle />
          </div>
          <Popover className="md:hidden relative">
            {({ open, close }) => (
              <>
                <Popover.Button className="p-2 rounded-md hover:bg-white/10 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-transform ${open ? 'rotate-90' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Popover.Button>
                <Popover.Panel className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-xl ring-1 ring-black/10 dark:ring-white/10 focus:outline-none z-20 overflow-hidden">
                  <div className="flex flex-col p-2">
                    <NavLink href="/" icon={<Home className="h-5 w-5" />} label="Home" onClick={close} />
                    <NavLink href="/practice" icon={<Mic className="h-5 w-5" />} label="Practice" onClick={close} />
                    <NavLink href="/scenarios" icon={<MessageSquare className="h-5 w-5" />} label="Scenarios" onClick={close} />
                    <div className="border-t border-white/10 dark:border-gray-800 mt-2 pt-2">
                      <div className="w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 dark:hover:bg-gray-700/50 light:hover:bg-gray-100 transition-colors">
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </>
            )}
          </Popover>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function NavLink({ href, icon, label, onClick = () => {} }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-white/10 dark:hover:bg-gray-700/50 light:hover:bg-gray-100 transition-colors text-white dark:text-gray-200 light:text-gray-800"
      onClick={onClick}
    >
      <span className="mr-1.5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
