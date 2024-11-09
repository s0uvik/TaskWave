import { SignedOut, SignedIn, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import UserMenu from "./UserMenu";

const Header = () => {
  return (
    <header>
      <nav className=" container mx-auto flex justify-between items-center py-4">
        <Link href="/">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            TaskWave
          </span>
        </Link>

        <div className=" flex gap-4 items-center justify-between">
          <Link href="/project/create">
            <Button className="bg-blue-500">
              <PenBox size={18} />
              Create Project
            </Button>
          </Link>
          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button variant="outline">Sign In</Button>
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
