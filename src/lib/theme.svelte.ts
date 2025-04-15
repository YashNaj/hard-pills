// src/lib/theme.svelte.ts
import { browser } from "$app/environment";
import { THEME_COLORS } from "./const";
type Theme = "light" | "dark";

// Cache DOM selectors
let metaThemeElement: HTMLMetaElement | null = null;
let documentElement: HTMLElement | null = null;
let viewportMeta: HTMLMetaElement | null = null;

// Initialize DOM references once
if (browser) {
  documentElement = document.documentElement;
  metaThemeElement = document.querySelector('meta[name="theme-color"]');
  viewportMeta = document.querySelector('meta[name="viewport"]');

  if (!metaThemeElement) {
    metaThemeElement = document.createElement("meta");
    metaThemeElement.setAttribute("name", "theme-color");
    document.head.appendChild(metaThemeElement);
  }

  // Add viewport-fit=cover for iOS Dynamic Island support
  if (viewportMeta) {
    let content = viewportMeta.getAttribute("content") || "";
    if (!content.includes("viewport-fit=cover")) {
      content = "viewport-fit=cover, " + content;
      viewportMeta.setAttribute("content", content);
    }
  } else {
    // Create viewport meta if it doesn't exist
    viewportMeta = document.createElement("meta");
    viewportMeta.setAttribute("name", "viewport");
    viewportMeta.setAttribute(
      "content",
      "viewport-fit=cover, width=device-width, initial-scale=1.0",
    );
    document.head.appendChild(viewportMeta);
  }
}

// Constants for cookie
const THEME_COOKIE_NAME = "app-theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

// Helper to get a cookie value
function getCookieValue(name: string): string | null {
  if (!browser) return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!cookie) return null;

  return cookie.split("=")[1];
}

// Use a more efficient initial theme check that checks cookies first
const getInitialTheme = (): Theme => {
  if (!browser) return "light";

  // First try to get theme from cookie
  const cookieTheme = getCookieValue(THEME_COOKIE_NAME);
  if (cookieTheme === "light" || cookieTheme === "dark") {
    return cookieTheme;
  }

  // Fall back to localStorage
  return (localStorage.getItem("theme") as Theme) ?? "light";
};

// Use $state rune to make theme reactive
let theme = $state(getInitialTheme());

// Optimized theme color update
function updateMetaThemeColor(newTheme: Theme): void {
  if (!browser || !metaThemeElement) return;
  metaThemeElement.setAttribute("content", THEME_COLORS[newTheme].background);
}

export function getTheme(): Theme {
  return theme;
}

// Get theme-specific colors
export function getThemeColor(
  colorType: "background" | "text" | "fill",
): string {
  return THEME_COLORS[theme][colorType];
}

// Toggle theme and save in both localStorage and cookie
export function toggleTheme(): void {
  theme = theme === "light" ? "dark" : "light";
  if (!browser || !documentElement) return;

  // Save to localStorage
  localStorage.setItem("theme", theme);

  // Save to cookie (client-side)
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; max-age=${COOKIE_MAX_AGE}; path=/; samesite=strict`;

  // Update DOM
  documentElement.classList.toggle("dark", theme === "dark");
  updateMetaThemeColor(theme);

  // Update server-side via API (handling errors)
  try {
    fetch("/api/theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ theme }),
    }).catch((error) => {
      console.error("Error saving theme to server:", error);
    });
  } catch (error) {
    console.error("Error saving theme to server:", error);
  }
}
