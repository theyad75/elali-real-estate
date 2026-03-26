import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Globe, Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: t.nav.home },
    { path: "/properties", label: t.nav.properties },
    { path: "/office", label: t.nav.office },
    { path: "/about", label: t.nav.about },
    { path: "/contact", label: t.nav.contact },
    { path: "/admin", label: t.nav.admin },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="El Ali Real Estate" className="h-14 w-14 rounded-lg object-cover" />
          <div className="hidden sm:block">
            <span className="text-lg font-bold font-display text-foreground">EL ALI</span>
            <span className="block text-xs font-body text-accent font-semibold tracking-wider uppercase">Real Estate</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium font-body transition-colors hover:text-accent ${
                isActive(link.path) ? "text-accent" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Globe className="h-4 w-4" />
            <span>{language === "en" ? "عربي" : "EN"}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-foreground md:hidden hover:bg-secondary"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-medium font-body transition-colors ${
                isActive(link.path) ? "text-accent" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
