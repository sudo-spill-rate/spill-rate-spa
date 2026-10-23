import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.resolve(root, "dist");

const ROUTE_METADATA = {
  "/": {
    title: "SpillRate - Discover, Review, and Rate Trusted Businesses",
    description: "Discover local businesses, read verified customer feedback, and share authentic ratings and reviews with photos.",
    canonical: "https://spillrate.up.railway.app/",
  },
  "/explore": {
    title: "Explore Local Businesses & Storefront Ratings - SpillRate Directory",
    description: "Search and discover verified local businesses, customer ratings, operating hours, and authentic community feedback across your neighborhood.",
    canonical: "https://spillrate.up.railway.app/explore",
  },
  "/about": {
    title: "About SpillRate - Honest Community Reviews & Local Business Directory",
    description: "Learn how SpillRate provides frictionless local business discovery and verified customer reviews with a 24-hour device cooldown anti-spam protection.",
    canonical: "https://spillrate.up.railway.app/about",
  },
  "/faq": {
    title: "Frequently Asked Questions - SpillRate Community & Business Ratings",
    description: "Read answers to common questions about submitting reviews, merchant claim processes, 24-hour anti-spam cooldowns, and rating calculations.",
    canonical: "https://spillrate.up.railway.app/faq",
  },
  "/contact": {
    title: "Contact Us - SpillRate Community Support & Verification Desk",
    description: "Get in touch with the SpillRate team for support, merchant storefront verification, feedback, or community moderation inquiries.",
    canonical: "https://spillrate.up.railway.app/contact",
  },
  "/privacy-policy": {
    title: "Privacy Policy & Google AdSense Cookie Disclosures - SpillRate",
    description: "Understand how SpillRate protects user privacy, enforces anti-spam device cooldowns without tracking, and complies with Google AdSense advertising cookie standards.",
    canonical: "https://spillrate.up.railway.app/privacy-policy",
  },
  "/terms": {
    title: "Terms of Service & Community Guidelines - SpillRate",
    description: "Review our community terms, merchant guidelines, honest review standards, content moderation rules, and platform usage policies.",
    canonical: "https://spillrate.up.railway.app/terms",
  },
};

async function prerender() {
  const templatePath = path.resolve(dist, "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error("dist/index.html not found. Run client build first.");
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, "utf-8");
  const serverEntryPath = path.resolve(dist, "server", "server-entry.js");

  const { render } = await import(`file://${serverEntryPath.replace(/\\/g, "/")}`);

  const routes = Object.keys(ROUTE_METADATA);

  console.log(`Prerendering ${routes.length} public static routes for AdSense & SEO...`);

  for (const url of routes) {
    try {
      const appHtml = render(url);
      const meta = ROUTE_METADATA[url];

      let html = template.replace('<div id="root"><!-- ssr --></div>', `<div id="root">${appHtml}</div>`);

      if (meta) {
        // Replace Title
        html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);
        // Replace Meta Description
        html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/, `<meta name="description" content="${meta.description}">`);
        // Replace/Inject Canonical Link
        const canonicalTag = `<link rel="canonical" href="${meta.canonical}" />`;
        if (html.includes('<link rel="canonical"')) {
          html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/, canonicalTag);
        } else {
          html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
        }
      }

      if (url === "/") {
        fs.writeFileSync(templatePath, html, "utf-8");
        console.log(`  ✓ Prerendered ${url} -> dist/index.html`);
      } else {
        const routeDir = path.resolve(dist, url.slice(1));
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        fs.writeFileSync(path.resolve(routeDir, "index.html"), html, "utf-8");
        console.log(`  ✓ Prerendered ${url} -> dist/${url.slice(1)}/index.html`);
      }
    } catch (err) {
      console.error(`  ✗ Error prerendering ${url}:`, err);
    }
  }

  console.log("Static prerendering complete!");
}

prerender();
