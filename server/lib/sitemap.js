const xmlEscape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toIsoDate = (value) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
};

const makeUrlEntry = ({ loc, lastmod, changefreq, priority }) => `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${xmlEscape(toIsoDate(lastmod))}</lastmod>
    <changefreq>${xmlEscape(changefreq)}</changefreq>
    <priority>${xmlEscape(priority)}</priority>
  </url>`;

export const resolveSiteUrl = ({ configuredSiteUrl, req }) => {
  if (configuredSiteUrl) {
    return configuredSiteUrl;
  }

  const protocol = req.protocol || "https";
  const host = req.get("host");

  return `${protocol}://${host}`;
};

export const buildSitemapXml = ({ siteUrl, properties }) => {
  const now = new Date();
  const staticPages = [
    { path: "/", changefreq: "daily", priority: "1.0", lastmod: now },
    { path: "/properties", changefreq: "daily", priority: "0.9", lastmod: now },
    { path: "/office", changefreq: "monthly", priority: "0.8", lastmod: now },
    { path: "/about", changefreq: "monthly", priority: "0.7", lastmod: now },
    { path: "/contact", changefreq: "monthly", priority: "0.7", lastmod: now },
  ];

  const propertyPages = properties.map((property) => ({
    path: `/property/${property._id}`,
    lastmod: property.updatedAt || property.createdAt || now,
    changefreq: "weekly",
    priority: "0.8",
  }));

  const entries = [...staticPages, ...propertyPages]
    .map((entry) =>
      makeUrlEntry({
        loc: `${siteUrl}${entry.path}`,
        lastmod: entry.lastmod,
        changefreq: entry.changefreq,
        priority: entry.priority,
      }),
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
};
