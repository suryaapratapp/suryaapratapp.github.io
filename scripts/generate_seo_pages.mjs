import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src/app.jsx"), "utf8");
const productsSource = source.slice(source.indexOf("const PRODUCTS = "), source.indexOf("const TEAM = "));
const sizesSource = source.slice(source.indexOf("const MATERIAL_SIZES = "), source.indexOf("const PRODUCT_FILTERS = "));
const { PRODUCTS, MATERIAL_SIZES } = vm.runInNewContext(`${productsSource}\n${sizesSource}\n({PRODUCTS,MATERIAL_SIZES})`);
const origin = "https://kd-enterprises.co.in";
const escapeHtml = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const unique = values => [...new Set(values)];

const pages = [
    { slug: "glass-epoxy-fr4-g10-sheets", productId: 4, name: "FR4 / G10 Glass Epoxy Sheets", sizeKey: "Glass Epoxy Sheet", focus: "electrical insulation, switchgear, transformer parts and precision cut components" },
    { slug: "bakelite-phenolic-sheets", productId: 5, name: "Bakelite / Phenolic Sheets", sizeKey: "Bakelite / Phenolic Sheet", focus: "electrical insulation boards, solar mounting plates and custom drilled components" },
    { slug: "frp-fiberglass-sheets", productId: 8, name: "FRP / Fiberglass Sheets", sizeKey: "FRP Sheet", focus: "corrosion-resistant panels, industrial covers and lightweight insulation applications" },
    { slug: "acrylic-sheets", productId: 6, name: "Acrylic Sheets", sizeKey: "Acrylic Sheet", focus: "machine guards, transparent covers, signage and fabricated panels" },
    { slug: "nylon-sheets", productId: 7, name: "Nylon Sheets", sizeKey: "Nylon Sheet", focus: "wear pads, support blocks and machined mechanical parts" },
    { slug: "delrin-acetal-sheets", productId: 9, name: "Delrin / Acetal Sheets", sizeKey: "Delrin Sheet", focus: "low-friction precision components, gears, bushes and support blocks" },
    { slug: "custom-cut-plastic-components", productId: 10, name: "Custom Cut Industrial Plastic Components", focus: "drawing-based mounting plates, drilled parts and plastic cut-outs" }
];

const item = (value, label) => `<div class="card"><h3>${escapeHtml(value)}</h3>${label ? `<p>${escapeHtml(label)}</p>` : ""}</div>`;
const jsonLd = value => JSON.stringify(value).replaceAll("<", "\\u003c");

function renderPage(spec) {
    const product = PRODUCTS.find(entry => entry.id === spec.productId);
    if (!product) throw new Error(`Missing website product ${spec.productId}`);
    const url = `${origin}/materials/${spec.slug}/`;
    const title = `${spec.name} Supplier in Faridabad | KD Enterprises`;
    const description = `${product.desc} Faridabad B2B supplier with 30+ years of experience and competitive bulk pricing.`;
    const sizes = (MATERIAL_SIZES[spec.sizeKey] || []).map(size => size.custom ? "Custom size on enquiry" : size.label);
    const image = `${origin}/${encodeURI(product.img)}`;
    const related = pages.filter(page => page.slug !== spec.slug).slice(0, 5);
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        url,
        description,
        about: { "@type": "Product", name: spec.name, description: product.desc, image },
        breadcrumb: { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
            { "@type": "ListItem", position: 2, name: spec.name, item: url }
        ] }
    };
    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:image" content="${escapeHtml(image)}"><meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#10263b">
<link rel="icon" href="/assets/kd-logo-v2.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/seo.css">
<script type="application/ld+json">${jsonLd(schema)}</script></head><body>
<header class="site-header"><div class="wrap"><a class="brand" href="/"><img src="/assets/kd-logo-v2.png" alt="KD Enterprises logo"><span>KD Enterprises<small>Industrial Materials</small></span></a><nav aria-label="Main navigation"><a href="/">Home</a><a href="/#materials">Materials</a><a class="button" href="mailto:sales@kd-enterprises.co.in?subject=${encodeURIComponent(`B2B enquiry: ${spec.name}`)}">Request a quote</a></nav></div></header>
<main><section class="hero"><div class="wrap"><div class="crumb"><a href="/">Home</a> / Materials / ${escapeHtml(spec.name)}</div><div class="hero-grid"><div><span class="eyebrow">Industrial materials · Faridabad</span><h1>${escapeHtml(spec.name)} for industrial buyers</h1><p>${escapeHtml(product.desc)} KD Enterprises supports B2B buyers with material supply and processing around drawings, samples and exact requirements.</p><div class="actions"><a class="button" href="mailto:sales@kd-enterprises.co.in?subject=${encodeURIComponent(`B2B enquiry: ${spec.name}`)}">Request pricing &amp; availability</a><a class="button button-light" href="/">Explore KD Enterprises</a></div></div><img src="/${encodeURI(product.img)}" alt="${escapeHtml(spec.name)} material supplied by KD Enterprises" width="580" height="340"></div></div></section>
<div class="wrap value-strip"><div><strong>30+ years</strong><span>Three decades in industrial materials</span></div><div><strong>Competitive B2B pricing</strong><span>Our best possible quote for your quantity and specification</span></div><div><strong>Quality-focused supply</strong><span>Requirements reviewed against the drawing or sample</span></div></div>
<section class="section alt"><div class="wrap"><span class="eyebrow">Material overview</span><h2>${escapeHtml(spec.name)} from KD Enterprises</h2><p class="intro">For ${escapeHtml(spec.focus)}, share your required grade, thickness, length, width, quantity and any cut, drill or finishing details. We confirm the suitable material and available stock against your enquiry rather than assuming a one-size-fits-all specification.</p><ul class="pill-list">${unique(product.properties).map(value => `<li>${escapeHtml(value)}</li>`).join("")}</ul></div></section>
<section class="section"><div class="wrap"><span class="eyebrow">Where it is used</span><h2>Industrial applications</h2><p class="intro">Common enquiries for this material include the following applications. Final grade and suitability should be confirmed for your operating conditions.</p><div class="grid">${unique(product.applications).slice(0, 6).map(value => item(value, "Drawing or specification-based supply available on enquiry.")).join("")}</div></div></section>
<section class="section alt"><div class="wrap"><span class="eyebrow">Sizes &amp; processing</span><h2>${sizes.length ? "Published sheet size options" : "Made to your drawing"}</h2><p class="intro">${sizes.length ? "These are size options currently listed by KD Enterprises. Exact thickness, grade and availability are confirmed when you enquire." : "This product is made to order from the material, dimensions and processing instructions in your drawing or sample."}</p>${sizes.length ? `<ul class="pill-list">${unique(sizes).map(value => `<li>${escapeHtml(value)}</li>`).join("")}</ul>` : ""}<p class="size-note">Processing may include cut to size, drilling, mounting holes, slots, shape cut-outs, edge trimming and basic deburring where applicable.</p></div></section>
<section class="section"><div class="wrap"><span class="eyebrow">More materials</span><h2>Explore related industrial plastics</h2><div class="related">${related.map(page => `<a href="/materials/${page.slug}/">${escapeHtml(page.name)} →</a>`).join("")}</div></div></section>
<section class="cta"><div class="wrap"><div><h2>Send us your requirement.</h2><p>For the best possible B2B pricing, include material, size, thickness, quantity and a drawing or sample when available.</p></div><a class="button" href="mailto:sales@kd-enterprises.co.in?subject=${encodeURIComponent(`B2B enquiry: ${spec.name}`)}">Email sales@kd-enterprises.co.in</a></div></section></main>
<footer class="site-footer"><div class="wrap"><span>© KD Enterprises · Faridabad, Haryana · Industrial plastic supply</span><span><a href="/">Home</a> · <a href="mailto:kd.enterprises2009@yahoo.in">kd.enterprises2009@yahoo.in</a></span></div></footer></body></html>`;
}

for (const spec of pages) {
    const directory = path.join(root, "materials", spec.slug);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, "index.html"), renderPage(spec));
}
const urls = [`${origin}/`, ...pages.map(page => `${origin}/materials/${page.slug}/`)];
fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Generated ${pages.length} material pages, sitemap.xml and robots.txt`);
