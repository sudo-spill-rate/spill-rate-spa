import { useEffect } from "react";

/**
 * Custom hook to update document title, meta description, and canonical link
 * Works seamlessly in client-side navigation.
 *
 * @param {string} title - Page title
 * @param {string} [description] - Meta description content
 * @param {string} [canonicalPath] - Relative URL path (e.g. "/about")
 * @param {boolean} [noindex=false] - Whether to disallow indexing (e.g. 404 pages)
 */
export function useDocumentTitle(title, description, canonicalPath, noindex = false) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (title) {
      document.title = title;
    }

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    }

    if (canonicalPath) {
      const canonicalUrl = `https://spillrate.up.railway.app${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", canonicalUrl);
    }

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute("content", "noindex, nofollow");
    } else if (robotsMeta && robotsMeta.getAttribute("content") === "noindex, nofollow") {
      robotsMeta.setAttribute("content", "index, follow");
    }
  }, [title, description, canonicalPath, noindex]);
}

export default useDocumentTitle;
