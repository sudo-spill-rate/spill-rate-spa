import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

/**
 * Global Scroll Restoration component.
 * - On new page navigation ("PUSH" / "REPLACE"): Instantly scrolls to top (0, 0).
 * - On Hash anchors (#id): Smoothly scrolls to the targeted element on the page.
 * - On Browser Back/Forward ("POP"): Preserves natural reading position on desktop history navigation.
 */
export default function ScrollToTop(): null {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // 1. If hash anchor exists (e.g., #main-content), scroll to that specific element
    if (hash) {
      try {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }
      } catch {
        // Fall through to standard scroll if selector is invalid
      }
    }

    // 2. On desktop Back/Forward navigation ("POP"), preserve natural browser history scroll
    if (navType === "POP") {
      return;
    }

    // 3. On forward page transitions, instantly snap to top
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, navType]);

  return null;
}
