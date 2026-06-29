"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLocale, getLocale, type Locale } from "@/lib/i18n";

const languages: Array<{ locale: Locale; label: string; flag: string }> = [
  { locale: "en", label: "English", flag: "🇺🇸" },
  { locale: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

export function LanguageToggle() {
  const currentLang = getLocale();

  const handleLanguageChange = (locale: Locale) => {
    setLocale(locale);
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.locale}
            onClick={() => handleLanguageChange(lang.locale)}
            className={currentLang === lang.locale ? "bg-primary/10" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
