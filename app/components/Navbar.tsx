import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { AuthModal } from "./AuthModal";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <div className="flex py-5 items-center justify-between ">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Logo" className="size-10" />
        <h4 className="text-3xl font-semibold">
          Sched<span className="text-blue-500">Cal</span>
        </h4>
      </Link>

      <div className="md:flex md:justify-end md:space-x-4">
        <ThemeToggle />
        <div className="hidden md:flex  ">
          <AuthModal />
        </div>
      </div>
    </div>
  );
}
