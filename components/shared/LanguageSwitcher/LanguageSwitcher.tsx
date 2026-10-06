"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

const languages = [
  { code: "en", name: "English" },
  { code: "th", name: "ไทย" },
];

const triggerStyles = {
  sidebar:
    "h-8 w-full px-3 border border-sidebar-ring/35 bg-sidebar-ring/8 text-sidebar-foreground hover:bg-sidebar-ring/15 hover:text-sidebar-accent-foreground hover:border-sidebar-ring/55 transition-colors",
  public:
    "h-9 w-auto gap-2 px-3 border border-[#E8DFD4] bg-[#FFFCF8] text-[#6B6560] hover:bg-[#F5F0EA] hover:text-[#2A2A2A] hover:border-[#D9CFC3] transition-colors",
} as const;

type LanguageSwitcherProps = {
  variant?: keyof typeof triggerStyles;
};

export function LanguageSwitcher({
  variant = "sidebar",
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLanguageChange = (newLocale: string) => {
    // eslint-disable-next-line
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    const queryString = searchParams.toString();
    const localizedPath = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(localizedPath, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(triggerStyles[variant])}
        >
          <Globe className="h-4 w-4" />
          <span>{languages.find((lang) => lang.code === locale)?.name}</span>
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={locale === lang.code ? "bg-primary text-slate-100" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
