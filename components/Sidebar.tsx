"use client";

import { cn } from "@/lib/utils";
import { Home, Video, Podcast } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const routes = [
  {
    label: 'Home',
    icon: Home,
    href: '/',
    color: "text-sky-500"
  },
  {
    label: 'Podcast',
    icon: Podcast,
    href: '/create-podcast',
    color: "text-violet-500",
  },
  {
    label: 'Video',
    icon: Video,
    href: '/video',
    color: "text-pink-700",
  }
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">
            AI Media Creator
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
