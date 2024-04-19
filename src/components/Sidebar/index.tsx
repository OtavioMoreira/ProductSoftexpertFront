"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarLinkGroup from "./SidebarLinkGroup";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/">
          <Image
            width={176}
            height={32}
            src={"/images/logo/logo.svg"}
            alt="Logo"
            priority
          />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      {/* https://icons8.com.br/icons/set/usuarios */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              ADMIN
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/user/list"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("user/list") &&
                    "bg-graydark dark:bg-meta-4"
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" x="0px" y="0px" width="25" height="25" viewBox="0 0 30 30">
                    <path d="M 6.6015625 3 C 5.6875625 3 5 4 5 4 C -0.235 4 2.6532344 12.355891 1.1152344 13.587891 C 1.1152344 13.587891 2.058 14.753906 5 14.753906 L 5 15.751953 C 4.187 17.869953 -2.9605947e-16 17.087 0 21 L 8.0234375 21 C 8.7274375 20.574 11 19.392578 11 19.392578 C 10.457 18.812578 9.6736719 17.809781 9.3886719 17.050781 C 8.7646719 16.737781 8.237 16.369953 8 15.751953 L 8 14.742188 C 8.19 14.742188 8.7502656 14.698297 8.9472656 14.654297 C 8.5012656 13.967297 8.125 12.401438 8.125 11.523438 C 8.125 9.2904375 9.0866406 7.4537344 10.681641 6.3027344 C 10.200641 4.4617344 9.1325625 3 6.6015625 3 z M 23 3 C 20.777 3 19.412031 4.5292031 19.082031 6.5332031 C 20.698031 7.3992031 21.75 9.2661875 21.75 11.617188 C 21.75 12.352187 21.578578 13.059422 21.392578 13.607422 C 21.461578 13.878422 21.5 14.180625 21.5 14.515625 C 21.5 16.985625 19 19.449219 19 19.449219 C 19.543 19.686219 21.280234 20.569 21.990234 21 L 30 21 C 30 15.75 25.737 17.25 25 15 L 25 13.5 C 25.332 13.333 26.122656 12.183156 26.222656 11.285156 C 26.482656 11.265156 27 10.629547 27 10.060547 C 27 9.4915469 26.819109 9.2521562 26.662109 9.1601562 C 26.662109 9.1601562 27 8.409 27 7.5 C 27 5.679 26.508 4 25 4 C 25 4 24.567 3 23 3 z M 15 7 C 12.308 7 10.125 8.6214375 10.125 11.523438 C 10.125 12.750438 10.8125 13.707031 10.8125 13.707031 C 10.8125 13.707031 10.5 13.860625 10.5 14.515625 C 10.5 15.788625 11.318359 16.09375 11.318359 16.09375 C 11.432359 17.10175 13 18.578125 13 18.578125 L 13 20.263672 C 12.158 22.789672 7 21.125 7 27 L 23 27 C 23 21.105 17.842 22.789672 17 20.263672 L 17 18.578125 C 17 18.578125 18.567641 17.10175 18.681641 16.09375 C 18.681641 16.09375 19.5 15.528625 19.5 14.515625 C 19.5 13.813625 19.1875 13.707031 19.1875 13.707031 C 19.1875 13.707031 19.75 12.637188 19.75 11.617188 C 19.75 9.5721875 18.724 8 17 8 C 17 8 16.268 7 15 7 z"></path>
                  </svg>
                  Users
                </Link>
              </li>
            </ul>
          </div>

        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
