"use client";
import React from "react";
import Search from "../Search";
import ButtonGame from "../defaults/ButtonGame";
import { useGetUser } from "@/lib/queryFunctions";
import User from "../User";
import SkeletonCustom from "../SkeletonCustom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NAV_LINKS } from "./SideBar"; // استورد نفس اللينكات
import NavLink from "./NavLink";


const NavBar = () => {
  const { user, isLoading } = useGetUser();

  return (
    <nav className="w-full px-4 py-2 border-b border-gray-800">
      <header className="flex justify-between items-center gap-2">
        {/* Menu for mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20">
                <Menu className="w-6 h-6 text-white" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-black/90 text-white w-64">
              <div className="flex flex-col h-full">
                {NAV_LINKS.map((navLink, i: number) => (
                  <NavLink key={i} navLink={navLink} />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search */}
        <Search />

        {/* User or Login */}
        {isLoading ? (
          <SkeletonCustom circle />
        ) : user?.data ? (
          <User user={user.data} />
        ) : (
          <div className="flex items-center gap-2">
            <ButtonGame link="/login" text="Login" />
            <ButtonGame link="/signup" text="Sign up" />
          </div>
        )}
      </header>
    </nav>
  );
};

export default NavBar;