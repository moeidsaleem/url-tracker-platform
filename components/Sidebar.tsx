import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Menu, Home, Link as LinkIcon, MapPin } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Sidebar = () => {
  const pathname = usePathname();

  const SidebarContent = () => (
    <nav className="space-y-2">
      <Link href="/">
        <Button 
          variant={pathname === '/' ? 'secondary' : 'ghost'} 
          className="w-full justify-start text-primary hover:text-primary-dark transition-colors px-2"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </Link>
      <Link href="/share-links">
        <Button 
          variant={pathname === '/share-links' ? 'secondary' : 'ghost'} 
          className="w-full justify-start text-primary hover:text-primary-dark transition-colors px-2"
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          Manage Links
        </Button>
      </Link>
      <Link href="/locations">
        <Button 
          variant={pathname === '/locations' ? 'secondary' : 'ghost'} 
          className="w-full justify-start text-primary hover:text-primary-dark transition-colors px-2"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Locations
        </Button>
      </Link>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-background border-r h-screen p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-primary">Dashboard</h2>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 bg-primary text-white hover:bg-primary-dark">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold text-primary">Dashboard Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;