import { ThemeProviderProps, ThemeProvider } from "next-themes";

export function TrackrThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}
