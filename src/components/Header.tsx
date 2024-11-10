import React from "react";
import Link from "next/link";
import { SignedOut, SignedIn, SignInButton } from "@clerk/nextjs";
import { PenBox } from "lucide-react";

import { Button } from "./ui/button";
import UserMenu from "./UserMenu";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className=" px-4">
      <nav className=" container mx-auto flex justify-between items-center py-4">
        <Link href="/">
          <Logo />
        </Link>

        <div className=" flex gap-4 items-center justify-between">
          <Link href="/project/create">
            <Button className="bg-blue-500 p-2 text-xs sm:text-sm sm:px-4 sm:py-2">
              <PenBox size={16} className="sm:w-4 sm:h-4" />
              Create Project
            </Button>
          </Link>
          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button
                variant="outline"
                className="p-2 text-xs sm:text-sm sm:px-4 sm:py-2"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
