const {SitemapStream, streamToPromise} = require("sitemap");
const fs = require("fs");
const path = require("path");

const links = [
    {url: "/", changefreq: "weekly", priority: 1.0},
];

const stream = new SitemapStream({hostname: "https://gemini-chat.surengharajyan.com"});

streamToPromise(require("stream").Readable.from(links).pipe(stream))
    .then((sitemap) => {
        fs.writeFileSync(path.join(__dirname, "public", "sitemap.xml"), sitemap.toString());
        console.log("✅ Sitemap generated at /public/sitemap.xml");
    })
    .catch((err) => console.error("❌ Sitemap generation failed:", err));
