"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Solutions", href: "/#solutions" },
  { name: "Services", href: "/#services" },
  { name: "Technology", href: "/#technology" },
  { name: "Process", href: "/#process" },
  { name: "Calculators", href: "/#calculator" },
  { name: "Testimonials", href: "/#testimonials" },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  const handleTabKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isMenuOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll(
      'a, button, input, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link href="/" aria-label="Seed Investments Home">
                <Image
                  src="https://drive.google.com/uc?export=view&id=1rxGvnvABjF11CPabCXbK3BJLE5xJ0dwc"
                  alt="Seed Investments Logo"
                  width={160}
                  height={40}
                  className="h-8 md:h-10 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            <nav className="hidden md:flex md:items-center md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}
              <Button variant="default" onClick={() => window.location.href = "/#login"}>
                Wealth Elite Login
              </Button>
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}
              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                className="text-foreground p-2 -mr-2"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        onKeyDown={handleTabKey}
        className={`fixed inset-0 z-50 bg-background transition-opacity duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 border-b border-border flex-shrink-0">
            <Link href="/" aria-label="Seed Investments Home">
              <Image
                src="https://drive.google.com/uc?export=view&id=1rxGvnvABjF11CPabCXbK3BJLE5xJ0dwc"
                alt="Seed Investments Logo"
                width={160}
                height={40}
                className="h-8 md:h-10 w-auto object-contain"
              />
            </Link>
            <button
              ref={closeButtonRef}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 -mr-2 text-foreground"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-grow flex items-center justify-center">
            <ul className="space-y-8 text-center">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-2xl font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-6 border-t border-border flex-shrink-0">
            <Button className="w-full" size="lg" onClick={() => { window.location.href = "/#login"; setIsMenuOpen(false); }}>
              Wealth Elite Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
