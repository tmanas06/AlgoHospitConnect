export const colors = {
  lightBlue: "#a8d0ff",
  lightPurple: "#c7b8ff",
  bgLight: "#f7f9ff",
  bgDark: "#0f1222",
  textLight: "#0f1222",
  textDark: "#f1f3ff",
};

export type ThemeMode = "light" | "dark";

export function getTheme(mode: ThemeMode) {
  if (mode === "dark") {
    return {
      background: colors.bgDark,
      foreground: colors.textDark,
      primary: colors.lightBlue,
      secondary: colors.lightPurple,
      card: "#171a2e",
    };
  }
  return {
    background: colors.bgLight,
    foreground: colors.textLight,
    primary: colors.lightBlue,
    secondary: colors.lightPurple,
    card: "#ffffff",
  };
}


