import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminSidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const links = [
    { href: "/admin/dashboard", label: "Tableau de bord", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/admin/products", label: "Produits", icon: <Package className="h-5 w-5" /> },
    { href: "/admin/orders", label: "Commandes", icon: <ShoppingCart className="h-5 w-5" /> },
    { href: "/admin/customers", label: "Clients", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/settings", label: "Paramètres", icon: <Settings className="h-5 w-5" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const SidebarContent = () => (
    <>
      {/* Header with Logo */}
      <div className="px-4 py-6 border-b border-gray-800">
        <Link href="/admin/dashboard">
          <a className="flex items-center">
            <span className="text-xl font-bold text-white">PhoneGear</span>
            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Admin</span>
          </a>
        </Link>
      </div>

      {/* Navigation Links */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={`flex items-center px-3 py-2 rounded-md text-sm ${
                  location === link.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {link.icon}
                <span className="ml-3">{link.label}</span>
              </a>
            </Link>
          ))}
        </nav>

        {/* Categories Collapsible Section */}
        <div className="mt-8">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Gestion des données
          </div>

          <div className="space-y-1">
            <button
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="ml-3">Catégories</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            <button
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="ml-3">Réductions</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </ScrollArea>

      {/* User Profile & Logout */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
              A
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">admin@phonegear.com</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-900 border-gray-700 text-white"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-30 bg-gray-900/80 ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
        onClick={toggleMobileMenu}
      />

      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full w-64 flex-col fixed inset-y-0 bg-gray-900">
        <SidebarContent />
      </div>
    </>
  );
}
