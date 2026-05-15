export type CommandItem = {
  id: string;
  label: string;
  href: string;
  keywords?: string[];
};

export const commandMenu: CommandItem[] = [
  {
    id: "dashboard",
    label: "داشبورد",
    href: "/",
    keywords: ["home", "main"],
  },
  {
    id: "accounts",
    label: "حساب‌ها",
    href: "/accounts",
    keywords: ["wallet", "bank"],
  },
  {
    id: "transactions",
    label: "تراکنش‌ها",
    href: "/transactions",
    keywords: ["payments", "money"],
  },
  {
    id: "categories",
    label: "دسته‌بندی‌ها",
    href: "/categories",
    keywords: ["tags"],
  },
  {
    id: "settings",
    label: "تنظیمات",
    href: "/settings",
    keywords: ["preferences"],
  },
];
