"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineViewBoards,
  HiOutlineFolder,
  HiOutlineUser,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";

interface SidebarProps {
  userEmail?: string;
  onLogout: () => void;
}

const navigationItems = [
  {
    name: "Job Tracker",
    href: "/dashboard",
    icon: HiOutlineViewBoards,
  },
  {
    name: "File Store",
    href: "/dashboard/files",
    icon: HiOutlineFolder,
  },
  {
    name: "User Dashboard",
    href: "/dashboard/profile",
    icon: HiOutlineUser,
  },
];

export default function Sidebar({ userEmail, onLogout }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          {isMobileMenuOpen ? (
            <HiOutlineX className="w-6 h-6 text-gray-600" />
          ) : (
            <HiOutlineMenu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <HiOutlineViewBoards className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "text-black shadow-lg bg-gray-50"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-black"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          isActive ? "text-black" : "text-gray-900"
                        }`}
                      >
                        {item.name}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User info and logout */}
        </div>
      </div>
    </>
  );
}
