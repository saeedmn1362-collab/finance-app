import "../globals.css";

import Providers from "../providers";
import GlobalCommands from "@/components/command/GlobalCommands";
import ShortcutEngine from "@/components/command/ShortcutEngine";
import { CommandRegistryProvider } from "@/context/CommandRegistry";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CommandRegistryProvider>
          <GlobalCommands />
          <ShortcutEngine />
          <Providers>{children}</Providers>
        </CommandRegistryProvider>
      </body>
    </html>
  );
}
