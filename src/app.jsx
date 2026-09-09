import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
    ArrowRight, BatteryCharging, Bolt, Box, Calculator, CarFront, Check, ChevronDown, Circle,
    ClipboardCheck, CloudSun, Component, Copy, Drill, Factory, FileCheck2, FileText, FileUp,
    Grid, Layers, Linkedin, List, LoaderCircle, Lock, LockOpen, Mail, MapPin, Menu,
    MessageCircle, PanelTop, PanelsTopLeft, Palette, ReceiptText, RotateCw, Scissors, Search,
    Send, Settings, Settings2, Shield, ShieldCheck, Sparkles, Sun, TrainFront, TriangleAlert,
    Wrench, X, Zap
} from "lucide-react";

        const CUSTOMISATION_LIST = [
            "Cut to size",
            "Drilling",
            "Mounting holes",
            "Corner cutting",
            "Slot cutting",
            "Shape/custom cut-outs",
            "Counter sinking / counter boring where applicable",
            "Edge trimming",
            "Basic deburring after cutting/drilling",
            "Marking as per drawing/sample"
        ];

        const PRODUCTS = [
            {
                id: 1,
                title: "Acrylic Products",
                category: "Acrylic",
                material: "Acrylic Sheet / Acrylic Pipe",
                desc: "Clear, weather-resistant acrylic sheets for guards, covers, displays and fabrication panels.",
                applications: ["Machine guards", "Transparent covers", "Display panels", "Signage", "Protective screens", "Fabrication panels"],
                properties: ["Optical clarity", "Lightweight", "Weather resistant", "Easy to fabricate"],
                industries: ["Display/signage", "Manufacturing", "Custom components"],
                suitableIndustries: ["Display", "Signage", "Machine guards", "Protective covers"],
                img: "products/acrylic pipe.png",
                icon: "layers"
            },
            {
                id: 2,
                title: "Nylon Products",
                category: "Nylon",
                material: "Nylon Rod / Cast Nylon Rod",
                desc: "Durable nylon stock for wear-resistant machined and cut mechanical components.",
                applications: ["Bushes", "Spacers", "Wear pads", "Rollers", "Industrial blocks", "Mechanical support parts", "Nylon bushes and spacers", "Low-friction support components"],
                properties: ["Wear resistant", "High load capacity", "Low friction", "Machinable"],
                industries: ["Manufacturing", "Machine parts", "Custom components", "Automobile", "EV"],
                suitableIndustries: ["Automobile", "Machinery", "Textile machinery", "Industrial maintenance", "Mechanical components"],
                img: "products/nylon rod (1).png",
                icon: "settings"
            },
            {
                id: 3,
                title: "Industrial Rods & Sheets",
                category: "Engineering Plastics",
                material: "Polycarbonate / Delrin / PU",
                desc: "Industrial plastic stock for machine guards, support parts, fixtures and drawing-based components.",
                applications: ["Machine guards", "Precision cut parts", "Industrial fixtures", "Support blocks", "Custom engineering parts", "Custom plastic mounting blocks"],
                properties: ["Impact strength", "Dimensional stability", "Custom machinable", "Industrial grade"],
                industries: ["Manufacturing", "Machine parts", "Custom components", "Automobile", "EV"],
                suitableIndustries: ["Industrial machinery", "Custom engineering", "Machine builders", "Automobile", "EV equipment"],
                img: "products/industrial sheets.png",
                icon: "component"
            },
            {
                id: 4,
                title: "Glass Epoxy Sheet",
                category: "Glass Epoxy",
                material: "FR4 / G10 Epoxy Sheet",
                desc: "High-strength electrical insulation laminate for switchgear, transformer and electronics applications.",
                applications: ["High-strength electrical insulation", "Switchgear parts", "Transformer parts", "Terminal boards", "Precision cut electrical components", "Electronics support structures", "Signal system insulation components", "Charger cabinet insulation plates", "Busbar support insulation"],
                properties: ["High dielectric strength", "Rigid", "Heat resistant", "Moisture resistant"],
                industries: ["Electrical", "Manufacturing", "Custom components", "Railway", "EV"],
                suitableIndustries: ["Electrical", "Switchgear", "Transformer", "Railway", "EV charging cabinets"],
                img: "products/glass epoxy (1).png",
                icon: "zap"
            },
            {
                id: 5,
                title: "Bakelite / Phenolic Sheet",
                category: "Bakelite",
                material: "Phenolic Laminated Sheet",
                desc: "Hard, heat-resistant industrial laminate used for electrical insulation and custom drilled components.",
                applications: ["Electrical insulation boards", "Solar panel mounting plates", "Control panel backing plates", "Switchgear insulation", "Transformer terminal boards", "Heat-resistant industrial fixtures", "Custom drilled electrical components", "Electrical insulation plates", "Signal system insulation components", "Switchgear insulation boards", "Battery pack insulation support", "Electrical mounting boards", "Heat-resistant phenolic support plates"],
                properties: ["Electrical insulation", "Heat resistant", "Rigid", "Cost effective", "Drillable"],
                industries: ["Solar", "Electrical", "Manufacturing", "Custom components", "Railway", "EV", "Automobile"],
                suitableIndustries: ["Electrical", "Solar", "Railway", "EV equipment", "Industrial machinery"],
                img: "products/bakelite.png",
                icon: "shield"
            },
            {
                id: 6,
                title: "Acrylic Sheets",
                category: "Acrylic",
                material: "Cast / MOP Acrylic Sheet",
                desc: "Premium acrylic sheets for visual, protective and fabricated panel requirements.",
                applications: ["Machine guards", "Transparent covers", "Display panels", "Signage", "Protective screens", "Fabrication panels"],
                properties: ["Clear finish", "Polishable edges", "Lightweight", "Easy cutting"],
                industries: ["Display/signage", "Manufacturing", "Custom components"],
                suitableIndustries: ["Display", "Signage", "Machine guards", "Protective covers"],
                img: "products/acrylic sheet.png",
                icon: "palette"
            },
            {
                id: 7,
                title: "Nylon Sheets",
                category: "Nylon",
                material: "Extruded / Cast Nylon Sheet",
                desc: "Strong nylon sheet stock for wear pads, support blocks and fabricated machine parts.",
                applications: ["Bushes", "Spacers", "Wear pads", "Rollers", "Industrial blocks", "Mechanical support parts", "Nylon bushes and spacers", "Low-friction nylon support components"],
                properties: ["Tough", "Wear resistant", "Low friction", "Good mechanical strength"],
                industries: ["Manufacturing", "Machine parts", "Custom components", "Automobile", "EV"],
                suitableIndustries: ["Automobile", "Machinery", "Textile machinery", "Industrial maintenance", "Mechanical components"],
                img: "products/nylon sheet (1).png",
                icon: "file-text"
            },
            {
                id: 8,
                title: "FRP Sheets",
                category: "FRP",
                material: "Fiberglass Reinforced Plastic Sheet",
                desc: "Lightweight corrosion-resistant sheets for utility panels, covers and insulation applications.",
                applications: ["Corrosion-resistant panels", "Electrical insulation", "Industrial covers", "Chemical area panels", "Lightweight machine parts", "Utility panels", "Railway panels", "Outdoor utility panels"],
                properties: ["Corrosion resistant", "Lightweight", "Insulating", "Weather tolerant"],
                industries: ["Electrical", "Manufacturing", "Custom components", "Railway"],
                suitableIndustries: ["Chemical areas", "Electrical", "Industrial covers", "Railway panels", "Outdoor utility panels"],
                img: "products/frp.png",
                icon: "grid"
            },
            {
                id: 9,
                title: "Delrin / Acetal Sheets",
                category: "Delrin",
                material: "Acetal Engineering Plastic",
                desc: "Precision engineering plastic for low-friction, dimensionally stable machined parts.",
                applications: ["Precision engineering parts", "Low-friction components", "Gears", "Bushes", "Support blocks", "Machined plastic components", "Delrin low-friction parts", "Low-friction moving parts"],
                properties: ["Low friction", "High stiffness", "Dimensional stability", "Excellent machinability"],
                industries: ["Manufacturing", "Machine parts", "Custom components", "Automobile", "EV"],
                suitableIndustries: ["Automobile", "EV", "Precision machinery", "Low-friction moving parts", "Engineering components"],
                img: "products/delrin sheet.png",
                icon: "box"
            },
            {
                id: 10,
                title: "Custom Plastic Components",
                category: "Custom Components",
                material: "Cut, drilled and drawing-based industrial plastic parts",
                desc: "Made-to-order components processed from Bakelite, FRP, epoxy, acrylic, nylon and Delrin as per drawing, sample or size.",
                applications: ["Industrial plastic cut components", "Mounting plates", "Corner cut parts", "Control panel parts", "Custom cut-out work", "Sample-based parts", "Control cabinet backing plates", "Custom drilled phenolic/glass epoxy parts", "Custom plastic mounting blocks"],
                properties: ["Made to drawing", "Sample-based support", "Batch-wise supply", "Deburred after cutting/drilling"],
                industries: ["Solar", "Electrical", "Manufacturing", "Machine parts", "Custom components", "Railway", "EV", "Automobile"],
                suitableIndustries: ["Electrical", "Solar", "Railway", "EV equipment", "Automobile", "Industrial machinery"],
                img: "products/other-components.png",
                icon: "wrench"
            }
        ];

        const TEAM = [
            { name: "Radhey Shyam Bhardwaj", role: "Advisor", img: "https://ui-avatars.com/api/?name=RS&background=1e40af&color=fff" },
            { name: "Krishna Devi", role: "Director", img: "https://ui-avatars.com/api/?name=KD&background=1e40af&color=fff" },
            { name: "Pankaj Sharma", role: "Head of Operations", img: "https://ui-avatars.com/api/?name=PS&background=1e40af&color=fff" }
        ];

        const MATERIAL_SIZES = {
            "Bakelite / Phenolic Sheet": [{ label: "2440 x 1220 x 5 mm", l: 2440, w: 1220, t: 5, price: 1997.50 }, { label: "1220 x 2440 mm", l: 2440, w: 1220 }, { label: "1220 x 1830 mm", l: 1830, w: 1220 }, { label: "1000 x 2000 mm", l: 2000, w: 1000 }, { label: "Custom size", custom: true }],
            "FRP Sheet": [{ label: "1220 x 780 x 5 mm", l: 1220, w: 780, t: 5, price: 2090.00 }, { label: "1020 x 1220 mm", l: 1220, w: 1020 }, { label: "1220 x 2440 mm", l: 2440, w: 1220 }, { label: "Custom size", custom: true }],
            "Glass Epoxy Sheet": [{ label: "1020 x 1220 mm", l: 1220, w: 1020 }, { label: "1220 x 2440 mm", l: 2440, w: 1220 }, { label: "Custom size", custom: true }],
            "Polycarbonate Sheet": [{ label: "1220 x 2440 mm", l: 2440, w: 1220 }, { label: "2050 x 3050 mm", l: 3050, w: 2050 }, { label: "Custom size", custom: true }],
            "Acrylic Sheet": [{ label: "1220 x 2440 mm", l: 2440, w: 1220 }, { label: "1830 x 2440 mm", l: 2440, w: 1830 }, { label: "Custom size", custom: true }],
            "Nylon Sheet": [{ label: "1000 x 2000 mm", l: 2000, w: 1000 }, { label: "1220 x 2440 mm", l: 2440, w: 1220 }, { label: "Custom size", custom: true }],
            "Delrin Sheet": [{ label: "1000 x 2000 mm", l: 2000, w: 1000 }, { label: "1220 x 2440 mm", l: 2440, w: 1220 }, { label: "Custom size", custom: true }]
        };

        const PRODUCT_FILTERS = ["All", "Bakelite", "FRP", "Glass Epoxy", "Acrylic", "Nylon", "Delrin", "Engineering Plastics", "Custom Components"];
        const INDUSTRY_FILTERS = ["All", "Solar", "Electrical", "Manufacturing", "Machine parts", "Display/signage", "Custom components", "Railway", "EV", "Automobile"];
        const SUPPLY_ITEMS = ["Sheets", "Cut-to-size parts", "Drilled components", "Mounting plates", "Electrical insulation parts", "Solar/industrial application components"];
        const INDUSTRIES_SERVED = ["Electrical & Switchgear", "Solar & Renewable Energy", "Railway & Signalling", "EV & Charging Equipment", "Automobile Components", "Industrial Machinery", "Display & Fabrication", "Custom Engineering Parts"];
        const INDUSTRY_COPY = "From electrical insulation plates to custom cut mounting components, KD Enterprises supports manufacturers, panel builders, solar suppliers, railway contractors, EV equipment makers and industrial workshops with reliable plastic sheet materials and customised components.";
        const WHY_CHOOSE = ["Drawing/sample-based supply", "Custom cutting and drilling", "Industrial material knowledge", "Batch-wise supply", "Practical support for manufacturing requirements", "Reliable enquiry and quotation process"];
        const ADMIN_AUTH_KEY = "kd_calc_auth";
        const ADMIN_TOOLS = [
            { key: "Calculator", label: "Internal Calculator", title: "KD Internal Pricing Calculator", icon: "calculator" },
            { key: "Payslip", label: "Payslip Template", title: "Editable Payslip Template", icon: "receipt-text" },
            { key: "PDIR", label: "Generate PDIR", title: "PDIR Generator", icon: "clipboard-check" },
            { key: "RMTC", label: "Generate RMTC", title: "Raw Material Test Certificate", icon: "file-check-2" }
        ];

        const ICONS = {
            "arrow-right": ArrowRight, "battery-charging": BatteryCharging, bolt: Bolt, box: Box,
            calculator: Calculator, "car-front": CarFront, check: Check, "chevron-down": ChevronDown,
            "clipboard-check": ClipboardCheck, "cloud-sun": CloudSun, component: Component, copy: Copy,
            drill: Drill, factory: Factory, "file-check-2": FileCheck2, "file-text": FileText, "file-up": FileUp,
            grid: Grid, layers: Layers, linkedin: Linkedin, list: List, "loader-circle": LoaderCircle,
            lock: Lock, "lock-open": LockOpen, mail: Mail, "map-pin": MapPin, menu: Menu,
            "message-circle": MessageCircle, "panel-top": PanelTop, "panels-top-left": PanelsTopLeft,
            palette: Palette, "receipt-text": ReceiptText, "rotate-cw": RotateCw, scissors: Scissors,
            search: Search, send: Send, settings: Settings, "settings-2": Settings2, shield: Shield,
            "shield-check": ShieldCheck, sparkles: Sparkles, sun: Sun, "train-front": TrainFront,
            "triangle-alert": TriangleAlert, wrench: Wrench, x: X, zap: Zap
        };

        const Icon = ({ name, className = "" }) => {
            const LucideIcon = ICONS[name] || Circle;
            return <LucideIcon className={className} strokeWidth={1.9} aria-hidden="true" />;
        };

        const loadExternalScript = (src, isReady) => {
            if (isReady()) return Promise.resolve();
            const existing = document.querySelector(`script[data-kd-library="${src}"]`);
            if (existing) {
                return new Promise((resolve, reject) => {
                    existing.addEventListener("load", resolve, { once: true });
                    existing.addEventListener("error", () => reject(new Error("A reporting tool could not be loaded.")), { once: true });
                });
            }
            return new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.dataset.kdLibrary = src;
                script.onload = resolve;
                script.onerror = () => reject(new Error("A reporting tool could not be loaded."));
                document.head.appendChild(script);
            });
        };

        let adminLibrariesPromise;
        const ensureAdminLibraries = () => {
            if (!adminLibrariesPromise) {
                adminLibrariesPromise = Promise.all([
                    loadExternalScript("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js", () => Boolean(window.jspdf)),
                    loadExternalScript("https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js", () => Boolean(window.Papa)),
                    loadExternalScript("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js", () => Boolean(window.XLSX)),
                    loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", () => Boolean(window.pdfjsLib)),
                    loadExternalScript("https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js", () => Boolean(window.JSZip))
                ]).catch(error => {
                    adminLibrariesPromise = undefined;
                    throw error;
                });
            }
            return adminLibrariesPromise;
        };

        const KDLogo = ({ className = "" }) => (
            <img
                src="assets/kd-logo-v2.png"
                alt="KD Enterprises logo"
                className={`object-contain ${className}`}
                draggable="false"
            />
        );

        const SectionTitle = ({ eyebrow, title, subtitle, align = "center", tone = "dark" }) => (
            <div className={`${align === "left" ? "text-left mx-0" : "text-center mx-auto"} mb-12 max-w-3xl px-4`}>
                {eyebrow && <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-600 mb-3">{eyebrow}</p>}
                <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${tone === "light" ? "text-white" : "text-slate-950"}`}>{title}</h2>
                {subtitle && <p className={`${tone === "light" ? "text-slate-300" : "text-slate-600"} text-lg mt-4 leading-relaxed`}>{subtitle}</p>}
            </div>
        );

        const PrimaryButton = ({ children, onClick, icon = "arrow-right", variant = "primary", className = "", type = "button" }) => {
            const styles = variant === "light"
                ? "bg-white text-slate-950 hover:bg-slate-100 border border-white"
                : variant === "outline"
                    ? "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300"
                    : "bg-slate-900 text-white hover:bg-slate-800 border border-slate-900 shadow-lg shadow-slate-900/15";
            return (
                <button type={type} onClick={onClick} className={`${styles} px-5 py-3 rounded-md font-extrabold text-sm transition-all inline-flex items-center justify-center gap-2 ${className}`}>
                    {children}
                    {icon && <Icon name={icon} className="w-4 h-4" />}
                </button>
            );
        };

        const Tag = ({ children, tone = "slate" }) => {
            const tones = {
                slate: "bg-slate-100 text-slate-700 border-slate-200",
                blue: "bg-sky-50 text-sky-800 border-sky-100",
                amber: "bg-amber-50 text-amber-800 border-amber-100"
            };
            return <span className={`text-xs font-bold px-2.5 py-1 rounded border ${tones[tone]}`}>{children}</span>;
        };

        const useLucide = () => {};

        const ParticleBackground = ({ tone = "light" }) => {
            const canvasRef = useRef(null);

            useEffect(() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                let width = 0;
                let height = 0;
                let rafId;
                let particles = [];

                const resize = () => {
                    const rect = canvas.parentElement.getBoundingClientRect();
                    width = Math.max(320, rect.width);
                    height = Math.max(220, rect.height);
                    const dpr = Math.min(window.devicePixelRatio || 1, 2);
                    canvas.width = width * dpr;
                    canvas.height = height * dpr;
                    canvas.style.width = `${width}px`;
                    canvas.style.height = `${height}px`;
                    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                    const count = reducedMotion ? 18 : Math.min(58, Math.floor(width / 18));
                    particles = Array.from({ length: count }, (_, index) => ({
                        x: (index * 97) % width,
                        y: (index * 53) % height,
                        vx: ((index % 5) - 2) * 0.12,
                        vy: (((index + 2) % 5) - 2) * 0.10,
                        r: index % 7 === 0 ? 2.2 : 1.45
                    }));
                };

                const draw = () => {
                    ctx.clearRect(0, 0, width, height);
                    const dot = tone === "dark" ? "rgba(245, 158, 11, 0.58)" : "rgba(29, 78, 216, 0.38)";
                    const line = tone === "dark" ? "rgba(147, 197, 253, 0.18)" : "rgba(15, 39, 66, 0.10)";
                    const grid = tone === "dark" ? "rgba(255,255,255,0.055)" : "rgba(15,39,66,0.055)";

                    ctx.strokeStyle = grid;
                    ctx.lineWidth = 1;
                    for (let x = 0; x < width; x += 44) {
                        ctx.beginPath();
                        ctx.moveTo(x, 0);
                        ctx.lineTo(x, height);
                        ctx.stroke();
                    }
                    for (let y = 0; y < height; y += 44) {
                        ctx.beginPath();
                        ctx.moveTo(0, y);
                        ctx.lineTo(width, y);
                        ctx.stroke();
                    }

                    particles.forEach((p, i) => {
                        for (let j = i + 1; j < particles.length; j++) {
                            const q = particles[j];
                            const dx = p.x - q.x;
                            const dy = p.y - q.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < 120) {
                                ctx.strokeStyle = line;
                                ctx.globalAlpha = 1 - dist / 120;
                                ctx.beginPath();
                                ctx.moveTo(p.x, p.y);
                                ctx.lineTo(q.x, q.y);
                                ctx.stroke();
                            }
                        }
                    });
                    ctx.globalAlpha = 1;
                    particles.forEach((p) => {
                        ctx.fillStyle = dot;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                        ctx.fill();
                        if (!reducedMotion) {
                            p.x += p.vx;
                            p.y += p.vy;
                            if (p.x < -10) p.x = width + 10;
                            if (p.x > width + 10) p.x = -10;
                            if (p.y < -10) p.y = height + 10;
                            if (p.y > height + 10) p.y = -10;
                        }
                    });
                    if (!reducedMotion) rafId = requestAnimationFrame(draw);
                };

                resize();
                draw();
                window.addEventListener("resize", resize);
                return () => {
                    window.removeEventListener("resize", resize);
                    if (rafId) cancelAnimationFrame(rafId);
                };
            }, [tone]);

            return <div className="particle-wrap"><canvas ref={canvasRef} className="particle-canvas"></canvas></div>;
        };

        const BrandIcon = ({ brand }) => {
            if (brand === "whatsapp") {
                return (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" fill="currentColor">
                        <path d="M12.04 2C6.58 2 2.14 6.35 2.14 11.7c0 1.89.56 3.65 1.52 5.14L2 22l5.32-1.63a10.1 10.1 0 0 0 4.72 1.17c5.46 0 9.9-4.35 9.9-9.7S17.5 2 12.04 2Zm0 17.87c-1.53 0-2.96-.42-4.19-1.16l-.3-.18-3.06.94.95-2.9-.2-.31a8.1 8.1 0 0 1-1.43-4.56c0-4.42 3.69-8.02 8.23-8.02s8.23 3.6 8.23 8.02-3.69 8.17-8.23 8.17Zm4.52-6.1c-.25-.12-1.47-.71-1.7-.79-.23-.08-.4-.12-.57.12-.17.25-.65.79-.8.95-.15.17-.3.19-.55.06-.25-.12-1.05-.38-2-1.2-.74-.64-1.24-1.43-1.38-1.68-.15-.25-.02-.38.11-.5.12-.11.25-.29.38-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.57-1.34-.78-1.84-.2-.48-.41-.42-.57-.43h-.49c-.17 0-.43.06-.66.31-.23.25-.87.83-.87 2.03s.89 2.36 1.02 2.53c.13.17 1.76 2.64 4.27 3.7.6.25 1.06.4 1.42.52.6.19 1.15.16 1.58.1.48-.07 1.47-.59 1.68-1.16.21-.57.21-1.06.15-1.16-.06-.1-.23-.16-.48-.28Z" />
                    </svg>
                );
            }
            if (brand === "linkedin") return <Icon name="linkedin" className="w-5 h-5" />;
            return <span className="text-lg font-extrabold leading-none">X</span>;
        };

        const Navigation = ({ activeTab, setTab, isMobileMenuOpen, setMobileMenuOpen }) => {
            const [isAdminOpen, setAdminOpen] = useState(false);
            const navItems = ["Products", "Material Guide", "Services", "About", "Contact"];
            const adminKeys = ADMIN_TOOLS.map(tool => tool.key);
            const isAdminActive = adminKeys.includes(activeTab);
            const chooseTab = (item) => {
                setTab(item);
                setAdminOpen(false);
                setMobileMenuOpen(false);
            };
            return (
                <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur no-print">
                    <div className="hidden border-b border-slate-200 bg-slate-950 text-slate-200 md:block">
                        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-[11px] font-bold tracking-wide">
                            <span>Industrial plastic sheets, cut parts and drawing-based fabrication</span>
                            <a href="mailto:sales@kd-enterprises.co.in" className="inline-flex items-center gap-2 hover:text-white"><Icon name="mail" className="h-3.5 w-3.5" /> sales@kd-enterprises.co.in</a>
                        </div>
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-[72px] items-center justify-between">
                            <button className="flex items-center text-left" onClick={() => chooseTab("Home")}>
                                <KDLogo className="mr-4 h-14 w-14" />
                                <div>
                                    <h1 className="text-lg font-extrabold leading-none text-slate-950 md:text-xl">KD Enterprises</h1>
                                    <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">Industrial Materials</p>
                                </div>
                            </button>
                            <div className="hidden items-center gap-5 lg:flex">
                                {navItems.map(item => (
                                    <button key={item} onClick={() => chooseTab(item)} className={`text-sm font-extrabold transition ${activeTab === item ? "text-blue-700" : "text-slate-600 hover:text-slate-950"}`}>{item}</button>
                                ))}
                                <div className="relative">
                                    <button type="button" onClick={() => setAdminOpen(prev => !prev)} className={`inline-flex items-center gap-1.5 text-sm font-extrabold transition ${isAdminActive ? "text-blue-700" : "text-slate-600 hover:text-slate-950"}`}>Admin <Icon name="chevron-down" className="h-4 w-4" /></button>
                                    {isAdminOpen && <div className="absolute right-0 top-full mt-4 w-64 border border-slate-200 bg-white p-2 shadow-xl">
                                        {ADMIN_TOOLS.map(tool => <button key={tool.key} type="button" onClick={() => chooseTab(tool.key)} className={`flex w-full items-center gap-3 px-3 py-3 text-left ${activeTab === tool.key ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}><Icon name={tool.icon} className="h-4 w-4" /><span className="text-sm font-extrabold">{tool.label}</span></button>)}
                                    </div>}
                                </div>
                                <button type="button" onClick={() => chooseTab("Contact")} className="inline-flex items-center gap-2 bg-blue-700 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-blue-600"><Icon name="file-up" className="h-4 w-4" /> Send Drawing</button>
                            </div>
                            <button type="button" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-700 lg:hidden" aria-label="Toggle navigation"><Icon name={isMobileMenuOpen ? "x" : "menu"} className="h-6 w-6" /></button>
                        </div>
                    </div>
                    {isMobileMenuOpen && <div className="border-t border-slate-200 bg-white shadow-xl lg:hidden">
                        <div className="space-y-1 px-4 py-4">
                            {navItems.map(item => <button key={item} onClick={() => chooseTab(item)} className={`block w-full px-4 py-3 text-left text-sm font-extrabold ${activeTab === item ? "bg-blue-50 text-blue-700" : "text-slate-700"}`}>{item}</button>)}
                            <button type="button" onClick={() => chooseTab("Contact")} className="mt-2 flex w-full items-center justify-center gap-2 bg-blue-700 px-4 py-3 text-sm font-extrabold text-white"><Icon name="file-up" className="h-4 w-4" /> Send Drawing / Request Quote</button>
                            <div className="mt-3 border-t border-slate-100 pt-3"><p className="px-4 pb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Admin tools</p>{ADMIN_TOOLS.map(tool => <button key={tool.key} onClick={() => chooseTab(tool.key)} className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-extrabold ${activeTab === tool.key ? "bg-blue-50 text-blue-700" : "text-slate-700"}`}><Icon name={tool.icon} className="h-4 w-4" />{tool.label}</button>)}</div>
                        </div>
                    </div>}
                </nav>
            );
        };

        const ProjectBrief = ({ onContinue }) => {
            const [material, setMaterial] = useState("Bakelite / Phenolic Sheet");
            const [partType, setPartType] = useState("Cut component");
            const [dimensions, setDimensions] = useState("");
            const [quantity, setQuantity] = useState("");
            const [operations, setOperations] = useState([]);
            const toggleOperation = (value) => setOperations(previous => previous.includes(value) ? previous.filter(item => item !== value) : [...previous, value]);
            const continueToQuote = () => {
                const request = [
                    "Quotation request",
                    `Material: ${material}`,
                    `Requirement: ${partType}`,
                    dimensions && `Dimensions / thickness: ${dimensions}`,
                    quantity && `Quantity: ${quantity}`,
                    operations.length && `Processing required: ${operations.join(", ")}`,
                    "Drawing or sample: to be attached / shared where available."
                ].filter(Boolean).join("\n");
                onContinue(request);
            };
            return <section className="border-y border-slate-200 bg-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-600">Requirement builder</p>
                            <h2 className="mt-3 text-3xl font-extrabold text-slate-950 md:text-4xl">Turn a part requirement into a clear enquiry.</h2>
                            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">Capture the material, part form, key size and processing work before speaking with KD. Your completed brief flows directly into the quotation form.</p>
                            <div className="mt-8 space-y-4 border-l-2 border-blue-700 pl-5 text-sm text-slate-600"><p><strong className="text-slate-950">1. Define the material</strong><br />Choose a starting material or use the material guide.</p><p><strong className="text-slate-950">2. Capture the part</strong><br />Add thickness, size, quantity and required operations.</p><p><strong className="text-slate-950">3. Attach the drawing</strong><br />Share a PDF, image or sample reference with your enquiry.</p></div>
                        </div>
                        <form onSubmit={(event) => { event.preventDefault(); continueToQuote(); }} className="border border-slate-200 bg-slate-50 p-5 md:p-7">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <label className="block"><span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Material</span><select value={material} onChange={(event) => setMaterial(event.target.value)} className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-blue-600">{Object.keys(MATERIAL_SIZES).map(item => <option key={item}>{item}</option>)}</select></label>
                                <label className="block"><span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Requirement</span><select value={partType} onChange={(event) => setPartType(event.target.value)} className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-blue-600"><option>Raw sheet</option><option>Cut component</option><option>Drilled / slotted component</option><option>Drawing-based fabricated part</option></select></label>
                                <label className="block"><span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Size / thickness</span><input value={dimensions} onChange={(event) => setDimensions(event.target.value)} placeholder="Example: 300 x 200 x 5 mm" className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-600" /></label>
                                <label className="block"><span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Quantity</span><input value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Example: 100 pcs" className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-600" /></label>
                            </div>
                            <fieldset className="mt-6"><legend className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Processing needed</legend><div className="mt-3 flex flex-wrap gap-2">{["Cutting", "Drilling", "Slots / cut-outs", "Corner radius", "Tapping", "Deburring"].map(item => <button key={item} type="button" onClick={() => toggleOperation(item)} className={`border px-3 py-2 text-xs font-extrabold transition ${operations.includes(item) ? "border-blue-700 bg-blue-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}>{item}</button>)}</div></fieldset>
                            <button type="submit" className="mt-7 inline-flex items-center gap-2 bg-slate-950 px-5 py-3 text-sm font-extrabold text-white hover:bg-slate-800">Create enquiry brief <Icon name="arrow-right" className="h-4 w-4" /></button>
                        </form>
                    </div>
                </div>
            </section>;
        };

        const HomePage = ({ setTab, setQuoteMessage }) => {
            const startBrief = (message) => { setQuoteMessage(message); setTab("Contact"); };
            return <div>
                <section className="hero-bg relative flex min-h-[720px] items-end overflow-hidden pt-36">
                    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-300">Faridabad, Haryana | Industrial material supply</p>
                            <h2 className="mt-5 text-4xl font-extrabold leading-[1.08] text-white md:text-6xl">The right industrial plastic material, prepared for your production line.</h2>
                            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">Bakelite, FRP, Glass Epoxy, Acrylic, Nylon and Delrin sheets supplied raw or processed to your drawing, sample and dimensional requirements.</p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><PrimaryButton onClick={() => setTab("Products")} variant="light">Explore materials</PrimaryButton><button type="button" onClick={() => setTab("Contact")} className="inline-flex items-center justify-center gap-2 border border-white/40 px-5 py-3 text-sm font-extrabold text-white hover:bg-white/10"><Icon name="file-up" className="h-4 w-4" /> Send drawing for quote</button></div>
                        </div>
                        <div className="mt-14 grid border-t border-white/25 sm:grid-cols-3">
                            {[['Drawing-led supply', 'Send a PDF, photo or sample reference'], ['Made for production', 'Cutting, drilling, slots and finishing'], ['Business-ready documents', 'PDIR and test certificate tools']].map(([title, detail]) => <div key={title} className="border-b border-white/20 py-5 pr-6 sm:border-b-0 sm:border-r sm:px-6 first:pl-0 last:border-r-0"><p className="font-extrabold text-white">{title}</p><p className="mt-1 text-sm text-slate-300">{detail}</p></div>)}
                        </div>
                    </div>
                </section>
                <section className="bg-slate-950 py-5 text-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><p className="text-sm font-bold text-slate-200">Need a material recommendation before you specify a grade?</p><button type="button" onClick={() => setTab("Material Guide")} className="inline-flex items-center gap-2 self-start text-sm font-extrabold text-amber-300 hover:text-amber-200 md:self-auto">Open material guide <Icon name="arrow-right" className="h-4 w-4" /></button></div></section>
                <ProjectBrief onContinue={startBrief} />
                <section className="bg-slate-100 py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><SectionTitle align="left" eyebrow="Material range" title="Industrial sheet materials for practical applications" subtitle="Source the base material and, where required, have it cut and prepared for assembly." /><button type="button" onClick={() => setTab("Products")} className="inline-flex items-center gap-2 self-start border border-slate-300 bg-white px-4 py-3 text-sm font-extrabold text-slate-800 hover:border-blue-400 md:mb-12">Full product catalogue <Icon name="arrow-right" className="h-4 w-4" /></button></div><div className="grid gap-5 md:grid-cols-3">{PRODUCTS.slice(3, 6).map(product => <article key={product.id} className="group overflow-hidden border border-slate-200 bg-white"><img src={product.img} alt={product.title} className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy" /><div className="p-6"><Tag tone="blue">{product.category}</Tag><h3 className="mt-4 text-xl font-extrabold text-slate-950">{product.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{product.desc}</p></div></article>)}</div></div></section>
                <section className="border-y border-slate-800 bg-slate-900 py-20 text-white"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionTitle tone="light" eyebrow="How KD supports production" title="From requirement to dispatch, with the details carried through." subtitle="Bring a specification, drawing or sample. KD helps turn it into a material and processing requirement that can be reviewed before dispatch." /><div className="grid gap-8 md:grid-cols-4">{[['01', 'Review', 'Material, dimensions, quantity and application'], ['02', 'Prepare', 'Cutting, drilling and component processing'], ['03', 'Verify', 'Inspection records and material certificates'], ['04', 'Dispatch', 'Batch-wise packing and dispatch coordination']].map(([number, title, copy]) => <div key={number} className="border-t border-slate-600 pt-5"><span className="text-sm font-extrabold text-amber-300">{number}</span><h3 className="mt-4 text-xl font-extrabold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300">{copy}</p></div>)}</div></div></section>
                <section className="bg-white py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionTitle eyebrow="Applications" title="Built around industrial use cases" subtitle={INDUSTRY_COPY} /><div className="grid gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">{INDUSTRIES_SERVED.map((item, index) => <div key={item} className="bg-white p-5"><Icon name={["bolt", "sun", "train-front", "battery-charging", "car-front", "factory", "panels-top-left", "settings-2"][index]} className="h-5 w-5 text-blue-700" /><p className="mt-5 font-extrabold text-slate-950">{item}</p></div>)}</div></div></section>
            </div>;
        };

        const ProductModal = ({ product, onClose, onQuote }) => {
            if (!product) return null;
            return (
                <div className="fixed inset-0 z-[60] modal-backdrop p-4 flex items-center justify-center" onClick={onClose}>
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="grid md:grid-cols-2">
                            <img src={product.img} alt={product.title} className="w-full h-72 md:h-full object-cover" />
                            <div className="p-7">
                                <div className="flex justify-between gap-4">
                                    <Tag tone="blue">{product.category}</Tag>
                                    <button onClick={onClose} className="p-2 rounded-md hover:bg-slate-100"><Icon name="x" className="w-5 h-5" /></button>
                                </div>
                                <h3 className="text-3xl font-extrabold text-slate-950 mt-4">{product.title}</h3>
                                <p className="text-slate-600 mt-3 leading-relaxed">{product.desc}</p>
                                <DetailGroup title="Common Applications" items={product.applications} />
                                <DetailGroup title="Suitable Industries" items={product.suitableIndustries} />
                                <DetailGroup title="Key Properties" items={product.properties} />
                                <DetailGroup title="Available Customisation" items={CUSTOMISATION_LIST} />
                                <PrimaryButton onClick={() => onQuote(product)} icon="send" className="w-full mt-6">Request Quote</PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const DetailGroup = ({ title, items }) => (
            <div className="mt-6">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 mb-3">{title}</h4>
                <div className="flex flex-wrap gap-2">
                    {items.map(item => <Tag key={item}>{item}</Tag>)}
                </div>
            </div>
        );

        const ProductGrid = ({ onQuote }) => {
            const [search, setSearch] = useState("");
            const [category, setCategory] = useState("All");
            const [industry, setIndustry] = useState("All");
            const [selectedProduct, setSelectedProduct] = useState(null);

            const filtered = useMemo(() => {
                const query = search.trim().toLowerCase();
                return PRODUCTS.filter(product => {
                    const haystack = [product.title, product.category, product.material, product.desc, ...product.applications, ...product.properties, ...product.industries, ...product.suitableIndustries].join(" ").toLowerCase();
                    const matchesSearch = !query || haystack.includes(query);
                    const matchesCategory = category === "All" || product.category === category;
                    const matchesIndustry = industry === "All" || product.industries.includes(industry);
                    return matchesSearch && matchesCategory && matchesIndustry;
                });
            }, [search, category, industry]);

            return (
                <div className="min-h-screen bg-slate-50 pb-24">
                    <div className="border-b border-slate-200 bg-white pb-12 pt-32">
                        <SectionTitle eyebrow="Product catalogue" title="Industrial materials and processed components" subtitle="Search by material, application or industry, then send a focused quotation request from the product detail." />
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative z-20 mb-8 grid gap-4 border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_220px] md:p-5">
                            <div className="relative">
                                <Icon name="search" className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
                                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product, application, property..." className="w-full pl-11 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 outline-none focus:border-blue-500" />
                            </div>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-3 rounded-md bg-slate-50 border border-slate-200 outline-none focus:border-blue-500">
                                {PRODUCT_FILTERS.map(item => <option key={item}>{item}</option>)}
                            </select>
                            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="px-4 py-3 rounded-md bg-slate-50 border border-slate-200 outline-none focus:border-blue-500">
                                {INDUSTRY_FILTERS.map(item => <option key={item}>{item}</option>)}
                            </select>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                            {filtered.map(product => (
                                <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 card-rise flex flex-col">
                                    <div className="relative">
                                        <img src={product.img} alt={product.title} className="h-56 w-full object-cover" />
                                        <div className="absolute top-4 left-4"><Tag tone="blue">{product.category}</Tag></div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-slate-100 p-2 rounded-md text-blue-700"><Icon name={product.icon} className="w-5 h-5" /></div>
                                            <div>
                                                <h3 className="text-xl font-extrabold text-slate-950">{product.title}</h3>
                                                <p className="text-sm text-slate-500 font-semibold">{product.material}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed mt-4">{product.desc}</p>
                                        <DetailGroup title="Use Cases" items={product.applications.slice(0, 4)} />
                                        <DetailGroup title="Suitable Industries" items={product.suitableIndustries} />
                                        <DetailGroup title="Properties" items={product.properties.slice(0, 4)} />
                                        <DetailGroup title="Available Customisation" items={CUSTOMISATION_LIST} />
                                        <div className="grid grid-cols-2 gap-3 mt-auto pt-6">
                                            <PrimaryButton onClick={() => onQuote(product)} icon="send" className="w-full px-3">Request Quote</PrimaryButton>
                                            <PrimaryButton onClick={() => setSelectedProduct(product)} variant="outline" icon="list" className="w-full px-3">View Details</PrimaryButton>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filtered.length === 0 && <div className="text-center bg-white border border-slate-200 rounded-xl p-10 text-slate-500 font-bold">No products found. Try a different search or filter.</div>}
                    </div>
                    <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onQuote={onQuote} />
                </div>
            );
        };

        const MATERIAL_GUIDE_OPTIONS = {
            "Electrical insulation": { material: "Glass Epoxy Sheet", icon: "zap", description: "A strong starting point for switchgear, terminal boards, transformer parts and electrical structures where mechanical strength and insulation are both important.", checks: ["Operating temperature", "Electrical clearance", "Required thickness", "Drawing tolerances"] },
            "Heat-resistant electrical support": { material: "Bakelite / Phenolic Sheet", icon: "shield-check", description: "A practical starting material for rigid insulation plates, panel backing, mounting boards and cost-conscious electrical components.", checks: ["Heat exposure", "Drilling pattern", "Thickness", "Surface finish"] },
            "Low-friction mechanical part": { material: "Nylon Sheet", icon: "rotate-cw", description: "Often suitable for bushes, wear pads, guides and support parts where a tough, machinable material is needed.", checks: ["Load direction", "Wear surface", "Machining allowance", "Material form"] },
            "Clear machine guard or cover": { material: "Acrylic Sheet", icon: "panel-top", description: "A clear material option for protective covers, display panels and visibility-led fabricated parts.", checks: ["Impact requirement", "Outdoor exposure", "Transparency", "Mounting holes"] },
            "Outdoor or corrosion-prone panel": { material: "FRP Sheet", icon: "cloud-sun", description: "A useful starting point for lightweight utility panels, industrial covers and corrosion-prone environments.", checks: ["Weather exposure", "Electrical requirement", "Thickness", "Fixing method"] },
            "Precision machined component": { material: "Delrin Sheet", icon: "settings-2", description: "A suitable material family to consider for dimensionally stable, low-friction machined components and fixtures.", checks: ["Tolerance requirement", "Load", "Machining feature", "Batch quantity"] }
        };

        const MaterialGuidePage = ({ startQuote }) => {
            const [useCase, setUseCase] = useState("Electrical insulation");
            const selection = MATERIAL_GUIDE_OPTIONS[useCase];
            const relatedProducts = PRODUCTS.filter(product => product.title.includes(selection.material.replace(" Sheet", "")) || product.material.includes(selection.material.replace(" Sheet", ""))).slice(0, 2);
            return <div className="min-h-screen bg-slate-50 pb-20 pt-32">
                <div className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-600">Material guide</p><h2 className="mt-3 max-w-3xl text-4xl font-extrabold text-slate-950 md:text-5xl">Start with the application, then narrow the material.</h2><p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">A practical shortlist for early-stage enquiries. KD confirms the final grade, thickness and processing requirements against your drawing and application.</p></div></div>
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[330px_1fr] lg:px-8"><aside className="border border-slate-200 bg-white"><p className="border-b border-slate-200 px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-slate-500">Select application</p>{Object.keys(MATERIAL_GUIDE_OPTIONS).map(option => <button key={option} type="button" onClick={() => setUseCase(option)} className={`flex w-full items-center justify-between border-b border-slate-100 px-5 py-4 text-left text-sm font-extrabold ${useCase === option ? "bg-blue-700 text-white" : "text-slate-700 hover:bg-slate-50"}`}>{option}<Icon name="arrow-right" className="h-4 w-4" /></button>)}</aside>
                    <section className="border border-slate-200 bg-white p-6 md:p-9"><div className="flex flex-col gap-6 border-b border-slate-200 pb-7 md:flex-row md:items-start md:justify-between"><div><div className="flex h-12 w-12 items-center justify-center bg-blue-50 text-blue-700"><Icon name={selection.icon} className="h-6 w-6" /></div><p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Suggested starting material</p><h3 className="mt-2 text-3xl font-extrabold text-slate-950">{selection.material}</h3><p className="mt-4 max-w-2xl leading-relaxed text-slate-600">{selection.description}</p></div><button type="button" onClick={() => startQuote(`Material guidance request\nApplication: ${useCase}\nSuggested starting material: ${selection.material}\nPlease help confirm the suitable grade and thickness for our drawing / application.`)} className="inline-flex shrink-0 items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-extrabold text-white hover:bg-slate-800">Use this in enquiry <Icon name="arrow-right" className="h-4 w-4" /></button></div><div className="grid gap-8 pt-8 md:grid-cols-2"><div><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Confirm before finalising</p><ul className="mt-4 space-y-3">{selection.checks.map(check => <li key={check} className="flex items-center gap-3 text-sm font-semibold text-slate-700"><Icon name="check" className="h-4 w-4 text-emerald-600" />{check}</li>)}</ul></div><div><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Related material range</p><div className="mt-4 space-y-3">{relatedProducts.length ? relatedProducts.map(product => <div key={product.id} className="border-l-2 border-blue-700 bg-slate-50 px-4 py-3"><p className="font-extrabold text-slate-950">{product.title}</p><p className="mt-1 text-xs text-slate-600">{product.material}</p></div>) : <p className="text-sm text-slate-500">See the full catalogue for related materials.</p>}</div></div></div></section>
                </div>
            </div>;
        };

        const ServicesPage = ({ startQuote, setTab }) => <div className="min-h-screen bg-white pb-20 pt-32"><section className="border-b border-slate-200 bg-slate-950 text-white"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8"><div><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-300">Supply and processing</p><h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">A material supplier that starts with the finished component.</h2><p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">KD helps buyers move from stock sheet selection to production-ready material parts, with the relevant requirement captured before work begins.</p><div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={() => startQuote("Service enquiry\nPlease help us with a drawing-based industrial plastic component requirement.")} className="inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-extrabold text-slate-950 hover:bg-slate-100">Discuss a component <Icon name="arrow-right" className="h-4 w-4" /></button><button type="button" onClick={() => setTab("Products")} className="inline-flex items-center gap-2 border border-slate-600 px-5 py-3 text-sm font-extrabold text-white hover:border-white">Browse materials</button></div></div><img src="products/other-components.png" alt="Custom industrial plastic components" className="h-full min-h-[260px] w-full object-cover" loading="lazy" /></div></section><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="grid gap-px border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-3">{[['Cut to size', 'Straight cutting for sheet and panel requirements.', 'scissors'], ['Drilling and mounting holes', 'Hole patterns, mounting locations and required diameters.', 'drill'], ['Slots and cut-outs', 'Openings and formed features prepared from the drawing.', 'panel-top'], ['Edge preparation', 'Basic deburring and finishing after processing.', 'sparkles'], ['Drawing-based supply', 'A clear requirement brief built around the supplied drawing.', 'file-text'], ['Quality documents', 'PDIR and raw material certificate workflows for internal records.', 'file-check-2']].map(([title, copy, icon]) => <article key={title} className="bg-white p-6"><Icon name={icon} className="h-5 w-5 text-blue-700" /><h3 className="mt-5 text-xl font-extrabold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{copy}</p></article>)}</div></section><section className="border-y border-slate-200 bg-slate-50"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><SectionTitle eyebrow="What to send" title="The details that make a quote faster and more accurate" subtitle="Material preference, drawing or sample, size and thickness, quantity, process details, application and any inspection requirement." /><div className="grid gap-6 md:grid-cols-3">{[['Drawing or sample', 'PDF, image, part number or physical sample reference'], ['Dimensions and quantity', 'Length, width, thickness, hole pattern and expected quantity'], ['Application conditions', 'Electrical, mechanical, heat, outdoor or assembly requirement']].map(([title, detail]) => <div key={title} className="border-t-2 border-slate-950 pt-5"><h3 className="font-extrabold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{detail}</p></div>)}</div></div></section></div>;

        const NumberInput = ({ label, name, value, onChange, suffix }) => (
            <label className="block">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{label}</span>
                <div className="mt-1 flex rounded-md border border-slate-200 bg-white overflow-hidden focus-within:border-blue-500">
                    <input name={name} type="number" value={value} onChange={onChange} className="w-full px-3 py-2.5 outline-none" />
                    {suffix && <span className="px-3 py-2.5 bg-slate-50 text-slate-500 text-sm font-bold border-l border-slate-200">{suffix}</span>}
                </div>
            </label>
        );

        const toAmount = value => Number(value || 0);
        const formatCurrency = value => `₹${toAmount(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const formatDate = value => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

        const numberToWordsIndian = (value) => {
            const amount = Math.round(toAmount(value));
            if (!amount) return "Zero Rupees Only";
            const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
            const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
            const belowHundred = num => num < 20 ? ones[num] : `${tens[Math.floor(num / 10)]}${num % 10 ? ` ${ones[num % 10]}` : ""}`;
            const belowThousand = num => {
                const hundred = Math.floor(num / 100);
                const rest = num % 100;
                return `${hundred ? `${ones[hundred]} Hundred` : ""}${hundred && rest ? " " : ""}${rest ? belowHundred(rest) : ""}`.trim();
            };
            const parts = [
                [10000000, "Crore"],
                [100000, "Lakh"],
                [1000, "Thousand"],
                [1, ""]
            ];
            let remaining = amount;
            const words = [];
            parts.forEach(([divisor, label]) => {
                const count = Math.floor(remaining / divisor);
                if (count) {
                    words.push(`${belowThousand(count)} ${label}`.trim());
                    remaining %= divisor;
                }
            });
            return `Rupees ${words.join(" ")} Only`;
        };

        const hashInput = async (value) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(value);
            const buffer = await crypto.subtle.digest("SHA-256", data);
            return Array.from(new Uint8Array(buffer)).map(byte => byte.toString(16).padStart(2, "0")).join("");
        };

        const verifyInternalEntry = async (value) => {
            const digestParts = [
                "c4589a15fb278bc8",
                "8f8c69ca5c8264a9",
                "5fa50b996ed14605",
                "80daa0c8437bbb4a"
            ];
            return await hashInput(value) === digestParts.join("");
        };

        const AdminGate = ({ toolTitle, toolSubtitle, children }) => {
            useLucide();
            const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem(ADMIN_AUTH_KEY) === "true");
            const [password, setPassword] = useState("");
            const [error, setError] = useState("");
            const [isChecking, setIsChecking] = useState(false);
            const [isToolkitReady, setToolkitReady] = useState(false);
            const [toolkitError, setToolkitError] = useState("");
            const passwordRef = useRef(null);

            useEffect(() => {
                if (!isAuthenticated) return;
                let active = true;
                ensureAdminLibraries()
                    .then(() => active && setToolkitReady(true))
                    .catch((loadError) => active && setToolkitError(loadError.message || "The reporting tools could not be loaded."));
                return () => { active = false; };
            }, [isAuthenticated]);

            const handleLogin = async (e) => {
                e.preventDefault();
                if (isChecking) return;
                const enteredPassword = ((passwordRef.current && passwordRef.current.value) || password).trim();
                setIsChecking(true);
                const isValid = await verifyInternalEntry(enteredPassword);
                if (isValid) {
                    sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
                    setIsAuthenticated(true);
                    setError("");
                } else {
                    setError("Incorrect password");
                    setTimeout(() => setIsChecking(false), 1400);
                    return;
                }
                setIsChecking(false);
            };

            if (isAuthenticated && isToolkitReady) return children;

            if (isAuthenticated) {
                return (
                    <div className="pt-32 pb-24 min-h-screen bg-slate-100 flex items-center justify-center px-4">
                        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full border border-slate-200 text-center">
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-md bg-blue-50 text-blue-700"><Icon name={toolkitError ? "triangle-alert" : "loader-circle"} className={`h-7 w-7 ${toolkitError ? "" : "animate-spin"}`} /></div>
                            <h2 className="text-xl font-extrabold text-slate-950">{toolkitError ? "Unable to open this tool" : "Preparing internal tools"}</h2>
                            <p className="mt-2 text-sm text-slate-500">{toolkitError || "Loading the reporting features needed for this workspace."}</p>
                            {toolkitError && <button type="button" onClick={() => { setToolkitError(""); ensureAdminLibraries().then(() => setToolkitReady(true)).catch(error => setToolkitError(error.message)); }} className="mt-5 rounded-md bg-slate-900 px-4 py-3 text-sm font-extrabold text-white">Try again</button>}
                        </div>
                    </div>
                );
            }

            return (
                <div className="pt-32 pb-24 min-h-screen bg-slate-100 flex items-center justify-center px-4">
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full border border-slate-200">
                        <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center text-blue-700 mb-5"><Icon name="lock" className="w-7 h-7" /></div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-600 mb-2">Admin Access Only</p>
                        <h2 className="text-2xl font-extrabold text-slate-950">{toolTitle}</h2>
                        {toolSubtitle && <p className="text-slate-500 mt-2">{toolSubtitle}</p>}
                        {/*
                          NOTE:
                          This is not secure authentication.
                          This is only to hide internal tools from general users.
                          For real security, backend authentication is required.
                        */}
                        <form onSubmit={handleLogin} className="space-y-4 mt-6">
                            <input ref={passwordRef} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:border-blue-500 outline-none" placeholder="Password" />
                            {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
                            <button type="submit" disabled={isChecking} className="w-full bg-blue-700 text-white hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed border border-blue-700 shadow-lg shadow-blue-900/15 px-5 py-3 rounded-md font-extrabold text-sm transition-all inline-flex items-center justify-center gap-2">
                                {isChecking ? "Checking..." : "Unlock Admin Tool"} <Icon name="lock-open" className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            );
        };

        const AdminField = ({ label, value, onChange, type = "text", rows, suffix, min, max, step }) => (
            <label className="block">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{label}</span>
                <div className="mt-1 flex rounded-md border border-slate-200 bg-white overflow-hidden focus-within:border-blue-500">
                    {rows ? (
                        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 outline-none resize-y" />
                    ) : (
                        <input type={type} min={min} max={max} step={step} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 outline-none" />
                    )}
                    {suffix && <span className="px-3 py-2.5 bg-slate-50 text-slate-500 text-sm font-bold border-l border-slate-200">{suffix}</span>}
                </div>
            </label>
        );

        const LineItemEditor = ({ title, items, setItems, amountLabel = "Amount" }) => {
            const updateItem = (index, field, value) => {
                setItems(prev => prev.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
            };
            const addItem = () => setItems(prev => [...prev, { label: "New item", amount: 0 }]);
            const removeItem = index => setItems(prev => prev.filter((_, itemIndex) => itemIndex !== index));

            return (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <h3 className="font-extrabold text-slate-950">{title}</h3>
                        <button type="button" onClick={addItem} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50">Add</button>
                    </div>
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-[1fr_130px_34px] gap-2">
                                <input value={item.label} onChange={(e) => updateItem(index, "label", e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                                <input type="number" value={item.amount} onChange={(e) => updateItem(index, "amount", e.target.value)} aria-label={amountLabel} className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                                <button type="button" onClick={() => removeItem(index)} className="rounded-md border border-red-200 text-red-700 hover:bg-red-50 flex items-center justify-center" aria-label="Remove item"><Icon name="x" className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        const CalculatorSection = () => {
            const [isProcessingOpen, setProcessingOpen] = useState(false);
            const [calculatedItems, setCalculatedItems] = useState([]);
            const [itemSearch, setItemSearch] = useState("");
            const [uploadRows, setUploadRows] = useState([]);
            const [uploadHeaders, setUploadHeaders] = useState([]);
            const [columnMapping, setColumnMapping] = useState({});
            const [selectedUploadIndex, setSelectedUploadIndex] = useState(0);
            const [drawingQuoteRows, setDrawingQuoteRows] = useState([]);
            const [drawingUploadMessage, setDrawingUploadMessage] = useState("");
            const [isReadingDrawings, setReadingDrawings] = useState(false);
            const [processingNotes, setProcessingNotes] = useState("");
            const [presetName, setPresetName] = useState("");
            const [processingPresets, setProcessingPresets] = useState(() => {
                try {
                    return JSON.parse(localStorage.getItem("kd_processing_presets") || "[]");
                } catch (error) {
                    return [];
                }
            });
            const firstSheet = MATERIAL_SIZES["Bakelite / Phenolic Sheet"][0];
            const [inputs, setInputs] = useState({
                product: "Bakelite / Phenolic Sheet",
                rawSizeIndex: 0,
                vLen: firstSheet.l,
                vWid: firstSheet.w,
                thickness: firstSheet.t,
                cLen: 300,
                cWid: 200,
                pieceThickness: firstSheet.t,
                blade: 2,
                rawPrice: firstSheet.price,
                processingCost: 0,
                packagingType: "percent",
                packagingCost: 2.5,
                profit: 10,
                quantity: 1
            });
            const [processingDetails, setProcessingDetails] = useState({
                sheetCutting: 0,
                cornerCutting: 0,
                drilling: 0,
                tapping: 0,
                chamfering: 0,
                boxCutting: 0,
                uShapeCutting: 0,
                roundCorners: 0,
                additionalCustomisation: 0
            });
            const [results, setResults] = useState(null);
            const canvasRef = useRef(null);

            const selectedSizes = MATERIAL_SIZES[inputs.product];
            const selectedSize = selectedSizes[Number(inputs.rawSizeIndex)] || selectedSizes[0];
            const isCustomSize = selectedSize.custom;
            const processingLabels = {
                sheetCutting: "Sheet cutting",
                cornerCutting: "Corner cutting",
                drilling: "Drilling",
                tapping: "Tapping",
                chamfering: "Chamfering",
                boxCutting: "Box cutting",
                uShapeCutting: "U-shape cutting",
                roundCorners: "Round corners",
                additionalCustomisation: "Additional customisation"
            };
            const processingTotal = Object.values(processingDetails).reduce((sum, value) => sum + Number(value || 0), 0);
            const processingSummary = Object.entries(processingDetails)
                .filter(([, value]) => Number(value || 0) > 0)
                .map(([key, value]) => `${processingLabels[key]} ₹${Number(value).toFixed(2)}`)
                .join(" + ");
            const money = value => Number(value || 0).toFixed(2);
            const currentDateISO = () => new Date().toISOString().slice(0, 10);
            const fileSafe = (value) => String(value || "KD").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
            const currentCutSizeName = () => `${inputs.cLen}x${inputs.cWid}x${inputs.pieceThickness}`;
            const filteredItems = calculatedItems.filter(item => {
                const query = itemSearch.trim().toLowerCase();
                if (!query) return true;
                return [item.product, item.requiredSize, item.notes, item.sourceDescription].join(" ").toLowerCase().includes(query);
            });
            const grandTotal = calculatedItems.reduce((sum, item) => sum + Number(item.totalOrderValue || 0), 0);
            const drawingGrandTotal = drawingQuoteRows.reduce((sum, row) => sum + Number(row.totalOrderValue || 0), 0);

            const setField = (name, value) => setInputs(prev => ({ ...prev, [name]: value }));
            const handleNumber = (e) => setField(e.target.name, e.target.value === "" ? "" : Number(e.target.value));
            const setProcessingField = (name, value) => {
                const numericValue = value === "" ? "" : Number(value);
                setProcessingDetails(prev => ({ ...prev, [name]: numericValue }));
            };
            const savePreset = () => {
                const name = presetName.trim();
                if (!name) {
                    alert("Enter a preset name first.");
                    return;
                }
                const nextPresets = [...processingPresets.filter(preset => preset.name !== name), { name, values: processingDetails, notes: processingNotes }];
                setProcessingPresets(nextPresets);
                localStorage.setItem("kd_processing_presets", JSON.stringify(nextPresets));
                setPresetName("");
            };
            const applyPreset = (name) => {
                const defaultPresets = [
                    { name: "Simple cut", values: { sheetCutting: 5, cornerCutting: 0, drilling: 0, tapping: 0, chamfering: 0, boxCutting: 0, uShapeCutting: 0, roundCorners: 0, additionalCustomisation: 0 }, notes: "Simple straight cutting" },
                    { name: "Electrical panel cut", values: { sheetCutting: 8, cornerCutting: 4, drilling: 6, tapping: 0, chamfering: 0, boxCutting: 0, uShapeCutting: 0, roundCorners: 0, additionalCustomisation: 0 }, notes: "Electrical panel drilling and corner work" },
                    { name: "Heavy drilling", values: { sheetCutting: 8, cornerCutting: 0, drilling: 18, tapping: 0, chamfering: 0, boxCutting: 0, uShapeCutting: 0, roundCorners: 0, additionalCustomisation: 0 }, notes: "High drilling count" },
                    { name: "Solar mounting plate", values: { sheetCutting: 8, cornerCutting: 5, drilling: 8, tapping: 0, chamfering: 2, boxCutting: 0, uShapeCutting: 0, roundCorners: 0, additionalCustomisation: 0 }, notes: "Solar mounting plate costing" },
                    { name: "FRP panel cutting", values: { sheetCutting: 10, cornerCutting: 3, drilling: 0, tapping: 0, chamfering: 0, boxCutting: 0, uShapeCutting: 0, roundCorners: 0, additionalCustomisation: 0 }, notes: "FRP panel cutting" }
                ];
                const preset = [...defaultPresets, ...processingPresets].find(item => item.name === name);
                if (!preset) return;
                setProcessingDetails(preset.values);
                setProcessingNotes(preset.notes || "");
            };

            const handleProductChange = (value) => {
                const firstSize = MATERIAL_SIZES[value][0];
                setInputs(prev => ({
                    ...prev,
                    product: value,
                    rawSizeIndex: 0,
                    vLen: firstSize.l,
                    vWid: firstSize.w,
                    thickness: firstSize.t || prev.thickness,
                    pieceThickness: firstSize.t || prev.pieceThickness,
                    rawPrice: firstSize.price ?? prev.rawPrice
                }));
                setResults(null);
            };

            const handleRawSizeChange = (value) => {
                const size = selectedSizes[Number(value)];
                setInputs(prev => ({
                    ...prev,
                    rawSizeIndex: Number(value),
                    vLen: size.custom ? prev.vLen : size.l,
                    vWid: size.custom ? prev.vWid : size.w,
                    thickness: size.custom ? prev.thickness : (size.t || prev.thickness),
                    pieceThickness: size.custom ? prev.pieceThickness : (size.t || prev.pieceThickness),
                    rawPrice: size.custom ? prev.rawPrice : (size.price ?? prev.rawPrice)
                }));
                setResults(null);
            };

            const drawDiagram = (sheetL, sheetW, cutL, cutW, cols, rows, gap) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                const padding = 28;
                const availW = Math.max(240, canvas.parentElement.offsetWidth - padding * 2);
                const availH = 330;
                const sheetRatio = sheetL / sheetW;
                let drawW = availW;
                let drawH = drawW / sheetRatio;
                if (drawH > availH) {
                    drawH = availH;
                    drawW = drawH * sheetRatio;
                }
                canvas.width = drawW + padding;
                canvas.height = drawH + padding;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.translate(padding / 2, padding / 2);
                ctx.fillStyle = "#f8fafc";
                ctx.strokeStyle = "#334155";
                ctx.lineWidth = 2;
                ctx.fillRect(0, 0, drawW, drawH);
                ctx.fillStyle = "#e5e7eb";
                ctx.fillRect(0, 0, drawW, drawH);
                ctx.strokeRect(0, 0, drawW, drawH);
                const scale = drawW / sheetL;
                const drawCutL = cutL * scale;
                const drawCutW = cutW * scale;
                const drawGap = gap * scale;
                ctx.fillStyle = "#2563eb";
                ctx.strokeStyle = "#1e3a8a";
                ctx.lineWidth = 1;
                for (let c = 0; c < cols; c++) {
                    for (let r = 0; r < rows; r++) {
                        const x = c * (drawCutL + drawGap);
                        const y = r * (drawCutW + drawGap);
                        ctx.fillRect(x + 1, y + 1, Math.max(1, drawCutL - 2), Math.max(1, drawCutW - 2));
                        ctx.strokeRect(x, y, drawCutL, drawCutW);
                    }
                }
                ctx.fillStyle = "#0f172a";
                ctx.font = "bold 12px Manrope, sans-serif";
                ctx.fillText(`${cols * rows} pcs | Gap ${gap} mm`, 10, Math.max(18, drawH - 10));
            };

            const calculate = () => {
                const vLen = Number(inputs.vLen);
                const vWid = Number(inputs.vWid);
                const cLen = Number(inputs.cLen);
                const cWid = Number(inputs.cWid);
                const gap = Number(inputs.blade) || 0;
                const rawPrice = Number(inputs.rawPrice);
                if ([vLen, vWid, cLen, cWid, rawPrice].some(value => !value || value <= 0)) {
                    alert("Please enter valid sheet, cut size and raw sheet price.");
                    return;
                }
                const calcGrid = (L, W, l, w) => {
                    const cols = Math.floor((L + gap) / (l + gap));
                    const rows = Math.floor((W + gap) / (w + gap));
                    return { count: Math.max(0, cols * rows), cols, rows };
                };
                const standard = calcGrid(vLen, vWid, cLen, cWid);
                const rotated = calcGrid(vLen, vWid, cWid, cLen);
                const best = standard.count >= rotated.count
                    ? { ...standard, fitL: cLen, fitW: cWid, orientation: "Standard" }
                    : { ...rotated, fitL: cWid, fitW: cLen, orientation: "Rotated" };
                if (best.count <= 0) {
                    alert("Cut size is too large for the selected raw sheet.");
                    return;
                }
                const materialPerPiece = rawPrice / best.count;
                const processingPerPiece = processingTotal;
                const packagingPerPiece = inputs.packagingType === "percent" ? materialPerPiece * (Number(inputs.packagingCost) / 100) : Number(inputs.packagingCost || 0);
                const costBeforeProfit = materialPerPiece + processingPerPiece + packagingPerPiece;
                const profitAmount = costBeforeProfit * (Number(inputs.profit || 0) / 100);
                const finalSellingPrice = costBeforeProfit + profitAmount;
                const usedArea = best.count * cLen * cWid;
                const wastage = Math.max(0, 100 - (usedArea / (vLen * vWid)) * 100);
                const quantity = Number(inputs.quantity) || 0;
                const nextResults = {
                    orientation: best.orientation,
                    pieces: best.count,
                    wastage,
                    materialPerPiece,
                    processingPerPiece,
                    processingDetails: { ...processingDetails },
                    processingTotal,
                    packagingPerPiece,
                    costBeforeProfit,
                    profitAmount,
                    finalSellingPrice,
                    profitPercent: Number(inputs.profit || 0),
                    quantity,
                    totalOrderValue: quantity > 0 ? finalSellingPrice * quantity : null,
                    rawSizeLabel: selectedSize.custom ? "Custom size" : selectedSize.label,
                    layout: best
                };
                setResults(nextResults);
                setTimeout(() => drawDiagram(vLen, vWid, best.fitL, best.fitW, best.cols, best.rows, gap), 80);
            };

            useEffect(() => {
                const timer = setTimeout(() => calculate(), 150);
                return () => clearTimeout(timer);
            }, []);

            useEffect(() => {
                setInputs(prev => ({ ...prev, processingCost: processingTotal }));
            }, [processingTotal]);

            useEffect(() => {
                const requiredValues = [inputs.vLen, inputs.vWid, inputs.cLen, inputs.cWid, inputs.rawPrice].map(Number);
                if (requiredValues.some(value => !value || value <= 0)) return;
                const timer = setTimeout(() => calculate(), 250);
                return () => clearTimeout(timer);
            }, [inputs, processingDetails]);

            useEffect(() => {
                try {
                    const draft = JSON.parse(localStorage.getItem("kd_quote_draft") || "null");
                    if (draft && Array.isArray(draft.items)) {
                        setCalculatedItems(draft.items);
                    }
                } catch (error) {
                    setCalculatedItems([]);
                }
            }, []);

            useEffect(() => {
                localStorage.setItem("kd_quote_draft", JSON.stringify({ items: calculatedItems }));
            }, [calculatedItems]);

            const copyTable = () => {
                const table = document.getElementById("quoteTable");
                if (!table) return;
                const range = document.createRange();
                range.selectNodeContents(table);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                document.execCommand("copy");
                alert("Pricing table copied.");
            };

            const resultRows = () => {
                if (!results) return [];
                return [
                    ["Selected product", inputs.product],
                    ["Raw sheet length", `${inputs.vLen} mm`],
                    ["Raw sheet width", `${inputs.vWid} mm`],
                    ["Raw sheet thickness", `${inputs.thickness} mm`],
                    ["Raw sheet price", `INR ${money(inputs.rawPrice)}`],
                    ["Required piece length", `${inputs.cLen} mm`],
                    ["Required piece width", `${inputs.cWid} mm`],
                    ["Required piece thickness", `${inputs.pieceThickness} mm`],
                    ["Blade gap", `${inputs.blade} mm`],
                    ["Best orientation", results.orientation],
                    ["Pieces per raw sheet", `${results.pieces}`],
                    ["Wastage percentage", `${results.wastage.toFixed(1)}%`],
                    ["Material cost per piece", `INR ${money(results.materialPerPiece)}`],
                    ...Object.entries(processingLabels).map(([key, label]) => [label, `INR ${money(results.processingDetails[key])}`]),
                    ["Processing cost total", `INR ${money(results.processingTotal)}`],
                    ["Processing cost per piece", `INR ${money(results.processingPerPiece)}`],
                    ["Packaging & forwarding cost per piece", `INR ${money(results.packagingPerPiece)}`],
                    ["Total cost before profit", `INR ${money(results.costBeforeProfit)}`],
                    ["Profit percentage", `${results.profitPercent}%`],
                    ["Profit amount", `INR ${money(results.profitAmount)}`],
                    ["Final selling price per piece", `INR ${money(results.finalSellingPrice)}`],
                    ["Quantity", results.quantity ? `${results.quantity} pcs` : "-"],
                    ["Total order value", results.totalOrderValue ? `INR ${money(results.totalOrderValue)}` : "-"]
                ];
            };

            const buildItemSnapshot = () => {
                if (!results) return null;
                return {
                    id: Date.now() + Math.random(),
                    product: inputs.product,
                    rawLength: Number(inputs.vLen),
                    rawWidth: Number(inputs.vWid),
                    rawThickness: Number(inputs.thickness),
                    rawPrice: Number(inputs.rawPrice),
                    cutLength: Number(inputs.cLen),
                    cutWidth: Number(inputs.cWid),
                    cutThickness: Number(inputs.pieceThickness),
                    requiredSize: `${inputs.cLen} x ${inputs.cWid} x ${inputs.pieceThickness} mm`,
                    quantity: Number(inputs.quantity || 0),
                    bladeGap: Number(inputs.blade || 0),
                    pieces: results.pieces,
                    wastage: results.wastage,
                    materialPerPiece: results.materialPerPiece,
                    processingPerPiece: results.processingPerPiece,
                    processingDetails: { ...results.processingDetails },
                    processingNotes,
                    packagingPerPiece: results.packagingPerPiece,
                    profitPercent: results.profitPercent,
                    profitAmount: results.profitAmount,
                    finalSellingPrice: results.finalSellingPrice,
                    totalOrderValue: results.totalOrderValue || 0,
                    costBeforeProfit: results.costBeforeProfit,
                    orientation: results.orientation,
                    sourceDescription: "",
                    inputs: { ...inputs },
                    layout: { ...results.layout }
                };
            };

            const addCurrentItem = () => {
                const item = buildItemSnapshot();
                if (!item) {
                    alert("Calculate pricing before adding item.");
                    return;
                }
                setCalculatedItems(prev => [...prev, item]);
            };

            const editItem = (item) => {
                setInputs(item.inputs);
                setProcessingDetails(item.processingDetails);
                setProcessingNotes(item.processingNotes || "");
                setResults(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
            };

            const duplicateItem = (item) => {
                setCalculatedItems(prev => [...prev, { ...item, id: Date.now() + Math.random(), sourceDescription: `${item.sourceDescription || item.product} copy` }]);
            };

            const deleteItem = (id) => {
                setCalculatedItems(prev => prev.filter(item => item.id !== id));
            };

            const resetCurrentItem = () => {
                const size = MATERIAL_SIZES["Bakelite / Phenolic Sheet"][0];
                setInputs({
                    product: "Bakelite / Phenolic Sheet",
                    rawSizeIndex: 0,
                    vLen: size.l,
                    vWid: size.w,
                    thickness: size.t,
                    cLen: 300,
                    cWid: 200,
                    pieceThickness: size.t,
                    blade: 2,
                    rawPrice: size.price,
                    processingCost: 0,
                    packagingType: "percent",
                    packagingCost: 2.5,
                    profit: 10,
                    quantity: 1
                });
                setProcessingDetails(Object.fromEntries(Object.keys(processingLabels).map(key => [key, 0])));
                setProcessingNotes("");
                setResults(null);
            };

            const downloadCSV = () => {
                if (!results) return;
                const rows = [["KD Enterprises Internal Pricing Summary", ""], ["Date", new Date().toLocaleDateString()], ...resultRows(), ["Disclaimer", "Internal estimate only. Not a final customer quotation."]];
                const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `kd-internal-pricing-${Date.now()}.csv`;
                link.click();
                URL.revokeObjectURL(link.href);
            };

            const downloadPDF = () => {
                if (!results || !window.jspdf) return;
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                const pageWidth = doc.internal.pageSize.getWidth();
                const margin = 14;
                const contentWidth = pageWidth - (margin * 2);
                const labelWidth = 45;
                const valueX = margin + labelWidth + 3;
                const valueWidth = pageWidth - valueX - margin;
                const canvas = canvasRef.current;
                const layoutImage = canvas ? canvas.toDataURL("image/png") : null;
                let y = 12;
                doc.setFont("helvetica", "bold");
                doc.setFontSize(16);
                doc.text("KD Enterprises", margin, y);
                doc.setFontSize(10);
                doc.text("Internal Pricing Summary", pageWidth - margin, y, { align: "right" });
                y += 6;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.text(doc.splitTextToSize("St. 3, Plot No. B/41, Ballabgarh, Faridabad 121004, Haryana, India", contentWidth - 38), margin, y);
                doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, y, { align: "right" });
                y += 8;
                doc.text(doc.splitTextToSize("kd.enterprises2009@yahoo.in | sales@kd-enterprises.co.in", contentWidth), margin, y);
                y += 7;

                const pdfRows = [
                    ["Product", inputs.product],
                    ["Raw material", `${inputs.vLen} x ${inputs.vWid} x ${inputs.thickness} mm | ₹${money(inputs.rawPrice)}`],
                    ["Required size", `${inputs.cLen} x ${inputs.cWid} x ${inputs.pieceThickness} mm | Qty ${results.quantity || 0} | Gap ${inputs.blade} mm`],
                    ["Pieces / wastage", `${results.pieces} pcs per sheet | ${results.wastage.toFixed(1)}% wastage`],
                    ["Processing", `${processingSummary || "No processing cost"} | Total ₹${money(results.processingTotal)}`],
                    ["Packaging & forwarding", `₹${money(results.packagingPerPiece)} per piece`],
                    ["Profit", `${results.profitPercent}% | ₹${money(results.profitAmount)}`],
                    ["Final price / piece", `₹${money(results.finalSellingPrice)}`],
                    ["Total order value", results.totalOrderValue ? `₹${money(results.totalOrderValue)}` : "-"]
                ];

                const drawRow = (label, value) => {
                    const valueLines = doc.splitTextToSize(String(value), valueWidth);
                    doc.setFont("helvetica", "bold");
                    doc.text(doc.splitTextToSize(`${label}:`, labelWidth), margin, y);
                    doc.setFont("helvetica", "normal");
                    doc.text(valueLines, valueX, y);
                    y += Math.max(6, valueLines.length * 4.2 + 2);
                };

                pdfRows.forEach(([label, value]) => drawRow(label, value));
                if (layoutImage) {
                    y += 2;
                    doc.setFont("helvetica", "bold");
                    doc.text("Layout visualizer", margin, y);
                    y += 3;
                    doc.addImage(layoutImage, "PNG", margin, y, contentWidth, 76);
                    y += 82;
                }
                doc.save(`${fileSafe(currentCutSizeName())}_${currentDateISO()}.pdf`);
            };

            const combinedRows = () => calculatedItems.map((item, index) => ({
                "Sr No.": index + 1,
                Product: item.product,
                "Required Size": item.requiredSize,
                Thickness: item.cutThickness,
                Quantity: item.quantity,
                "Raw Material": `${item.rawLength} x ${item.rawWidth} x ${item.rawThickness} mm`,
                "Raw Sheet Price": money(item.rawPrice),
                "Blade Gap": item.bladeGap,
                "Pieces Per Sheet": item.pieces,
                "Wastage %": item.wastage.toFixed(1),
                "Material Cost": money(item.materialPerPiece),
                "Sheet Cutting": money(item.processingDetails.sheetCutting),
                "Corner Cutting": money(item.processingDetails.cornerCutting),
                Drilling: money(item.processingDetails.drilling),
                Tapping: money(item.processingDetails.tapping),
                Chamfering: money(item.processingDetails.chamfering),
                "Box Cutting": money(item.processingDetails.boxCutting),
                "U-shape Cutting": money(item.processingDetails.uShapeCutting),
                "Round Corners": money(item.processingDetails.roundCorners),
                "Additional Customisation": money(item.processingDetails.additionalCustomisation),
                "Processing Total": money(item.processingPerPiece),
                "Packaging Cost": money(item.packagingPerPiece),
                "Profit %": item.profitPercent,
                "Final Selling Price/Piece": money(item.finalSellingPrice),
                "Total Item Value": money(item.totalOrderValue),
                Notes: item.processingNotes || item.sourceDescription || ""
            }));

            const exportCombinedCSV = () => {
                if (!calculatedItems.length) return;
                const rows = combinedRows();
                const headers = Object.keys(rows[0]);
                const csv = [headers, ...rows.map(row => headers.map(header => row[header]))]
                    .map(row => row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
                    .join("\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `KD-Quotation_${currentDateISO()}.csv`;
                link.click();
                URL.revokeObjectURL(link.href);
            };

            const exportCombinedXLSX = () => {
                if (!calculatedItems.length || !window.XLSX) return;
                const worksheet = XLSX.utils.json_to_sheet(combinedRows());
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "KD Quotation");
                XLSX.writeFile(workbook, `KD-Quotation_${currentDateISO()}.xlsx`);
            };

            const generateCombinedPDF = () => {
                if (!calculatedItems.length || !window.jspdf) return;
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                const margin = 12;
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                let y = 12;
                doc.setFont("helvetica", "bold");
                doc.setFontSize(15);
                doc.text("KD Enterprises", margin, y);
                doc.setFontSize(10);
                doc.text(`Internal Quotation | ${currentDateISO()}`, pageWidth - margin, y, { align: "right" });
                y += 6;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.text("St. 3, Plot No. B/41, Ballabgarh, Faridabad 121004, Haryana, India", margin, y, { maxWidth: pageWidth - 2 * margin });
                y += 5;
                doc.text("kd.enterprises2009@yahoo.in | sales@kd-enterprises.co.in", margin, y);
                y += 7;

                calculatedItems.forEach((item, index) => {
                    if (y > pageHeight - 42) {
                        doc.addPage();
                        y = 12;
                    }
                    doc.setFillColor(241, 245, 249);
                    doc.rect(margin, y - 4, pageWidth - 2 * margin, 25, "F");
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(8.5);
                    doc.text(`${index + 1}. ${item.product}`, margin + 2, y);
                    doc.setFont("helvetica", "normal");
                    doc.text(`Size: ${item.requiredSize} | Qty: ${item.quantity} | Pcs/sheet: ${item.pieces}`, margin + 2, y + 5);
                    doc.text(`Material: ₹${money(item.materialPerPiece)} | Processing: ₹${money(item.processingPerPiece)} | Packaging: ₹${money(item.packagingPerPiece)} | Profit: ${item.profitPercent}%`, margin + 2, y + 10);
                    const proc = Object.entries(item.processingDetails).filter(([, value]) => Number(value || 0) > 0).map(([key, value]) => `${processingLabels[key]} ₹${money(value)}`).join(", ") || "No processing cost";
                    doc.text(doc.splitTextToSize(`Processing: ${proc}`, pageWidth - 2 * margin - 4), margin + 2, y + 15);
                    doc.setFont("helvetica", "bold");
                    doc.text(`Final: ₹${money(item.finalSellingPrice)} / pc | Total: ₹${money(item.totalOrderValue)}`, pageWidth - margin - 2, y + 5, { align: "right" });
                    y += 29;
                });
                if (y > pageHeight - 24) {
                    doc.addPage();
                    y = 12;
                }
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.text(`Grand Total: ₹${money(grandTotal)}`, pageWidth - margin, y, { align: "right" });
                y += 8;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.text("Internal estimate only. Not final customer quotation.", margin, y);
                doc.save(`KD-Quotation_${currentDateISO()}.pdf`);
            };

            const guessMapping = (headers) => {
                const findHeader = (patterns) => headers.find(header => patterns.some(pattern => header.toLowerCase().includes(pattern)));
                return {
                    description: findHeader(["article name", "description", "item"]),
                    drawingNo: findHeader(["drg", "drawing", "article no"]),
                    material: findHeader(["material"]),
                    size: findHeader(["size", "thickness"]),
                    sheetCutting: findHeader(["sheet cutting", "cutting cost", "cutting charge", "straight cutting"]),
                    drilling: findHeader(["drilling", "holes"]),
                    slot: findHeader(["slot", "cutout", "counterbore"]),
                    boxCutting: findHeader(["box cutting", "box cut"]),
                    uShapeCutting: findHeader(["u-shape", "u shape", "u cutting"]),
                    corner: findHeader(["corner", "radius"]),
                    chamfering: findHeader(["chamfer"]),
                    tapping: findHeader(["tapping"]),
                    additionalCustomisation: findHeader(["other operation", "customisation", "customization"]),
                    notes: findHeader(["notes", "other"])
                };
            };

            const handleDrawingUpload = async (event) => {
                const file = event.target.files && event.target.files[0];
                if (!file) return;
                const ext = file.name.split(".").pop().toLowerCase();
                if (ext === "xlsx" || ext === "xls") {
                    const buffer = await file.arrayBuffer();
                    const workbook = XLSX.read(buffer, { type: "array" });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
                    const headers = Object.keys(rows[0] || {});
                    setUploadRows(rows);
                    setUploadHeaders(headers);
                    setColumnMapping(guessMapping(headers));
                    setSelectedUploadIndex(0);
                    return;
                }
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: ({ data, meta }) => {
                        const rows = data.filter(row => Object.values(row).some(Boolean));
                        const headers = meta.fields || Object.keys(rows[0] || {});
                        setUploadRows(rows);
                        setUploadHeaders(headers);
                        setColumnMapping(guessMapping(headers));
                        setSelectedUploadIndex(0);
                    }
                });
            };

            const parseSizeText = (value) => {
                const nums = String(value || "").match(/\d+(\.\d+)?/g) || [];
                return {
                    length: nums[0] ? Number(nums[0]) : inputs.cLen,
                    width: nums[1] ? Number(nums[1]) : inputs.cWid,
                    thickness: nums[2] ? Number(nums[2]) : inputs.pieceThickness
                };
            };

            const readOperationValue = (value) => {
                const text = String(value || "").trim();
                if (!text) return 0;
                const numeric = text.match(/\d+(\.\d+)?/g);
                return numeric ? Number(numeric[0]) : 0;
            };

            const collectOperationNotes = (row) => {
                const operationFields = [
                    ["Sheet cutting", columnMapping.sheetCutting],
                    ["Drilling / holes", columnMapping.drilling],
                    ["Slot / cutout / counterbore", columnMapping.slot],
                    ["Corner cutting / radius", columnMapping.corner],
                    ["Chamfering", columnMapping.chamfering],
                    ["Tapping", columnMapping.tapping],
                    ["Box cutting", columnMapping.boxCutting],
                    ["U-shape cutting", columnMapping.uShapeCutting],
                    ["Other operation", columnMapping.additionalCustomisation]
                ];
                return operationFields
                    .map(([label, header]) => header && row[header] ? `${label}: ${row[header]}` : "")
                    .filter(Boolean);
            };

            const matchProductFromMaterial = (value) => {
                const text = String(value || "").toLowerCase();
                if (text.includes("frp")) return "FRP Sheet";
                if (text.includes("glass") || text.includes("epoxy") || text.includes("fr4") || text.includes("g10")) return "Glass Epoxy Sheet";
                if (text.includes("polycarbonate") || /\bpc\b/.test(text)) return "Polycarbonate Sheet";
                if (text.includes("acrylic")) return "Acrylic Sheet";
                if (text.includes("nylon")) return "Nylon Sheet";
                if (text.includes("delrin") || text.includes("acetal")) return "Delrin Sheet";
                return "Bakelite / Phenolic Sheet";
            };

            const getDefaultRawSheet = (product) => {
                const sizes = MATERIAL_SIZES[product] || MATERIAL_SIZES["Bakelite / Phenolic Sheet"];
                return sizes.find(size => !size.custom && size.l && size.w) || sizes[0];
            };

            const estimateRawSheetPrice = (product, rawLength, rawWidth, rawThickness) => {
                const defaultSheet = getDefaultRawSheet(product);
                if (defaultSheet.price) return defaultSheet.price;
                const ratePerSqmMm = {
                    "Bakelite / Phenolic Sheet": 135,
                    "FRP Sheet": 440,
                    "Glass Epoxy Sheet": 520,
                    "Polycarbonate Sheet": 210,
                    "Acrylic Sheet": 175,
                    "Nylon Sheet": 780,
                    "Delrin Sheet": 1450
                }[product] || 220;
                const areaSqm = (Number(rawLength || defaultSheet.l) * Number(rawWidth || defaultSheet.w)) / 1000000;
                return Math.max(0, areaSqm * Number(rawThickness || 5) * ratePerSqmMm);
            };

            const calculateDrawingPricing = (row) => {
                const product = MATERIAL_SIZES[row.product] ? row.product : matchProductFromMaterial(row.material || row.fileName);
                const defaultSheet = getDefaultRawSheet(product);
                const rawLength = Number(row.rawLength || defaultSheet.l || 0);
                const rawWidth = Number(row.rawWidth || defaultSheet.w || 0);
                const rawThickness = Number(row.rawThickness || row.thickness || defaultSheet.t || row.cutThickness || 5);
                const cutLength = Number(row.cutLength || 0);
                const cutWidth = Number(row.cutWidth || 0);
                const cutThickness = Number(row.cutThickness || row.thickness || rawThickness || 0);
                const bladeGap = Number(row.bladeGap || inputs.blade || 2);
                const rawPrice = Number(row.rawPrice || estimateRawSheetPrice(product, rawLength, rawWidth, rawThickness));
                const quantity = Number(row.quantity || 1);
                const processingDetailsForRow = row.processingDetails || {};
                const autoProcessingPerPiece = Object.values(processingDetailsForRow).reduce((sum, value) => sum + Number(value || 0), 0);
                const processingPerPiece = row.processingOverride ? Number(row.processingCost || 0) : (autoProcessingPerPiece || Number(row.processingCost || 0));
                const packagingType = row.packagingType ?? inputs.packagingType ?? "percent";
                const packagingCost = Number(row.packagingCost ?? inputs.packagingCost ?? 0);
                const profitPercent = Number(row.profitPercent ?? inputs.profit ?? 0);

                const calcGrid = (L, W, l, w) => {
                    if ([L, W, l, w].some(value => !value || value <= 0)) return { count: 0, cols: 0, rows: 0 };
                    const cols = Math.floor((L + bladeGap) / (l + bladeGap));
                    const rows = Math.floor((W + bladeGap) / (w + bladeGap));
                    return { count: Math.max(0, cols * rows), cols, rows };
                };
                const standard = calcGrid(rawLength, rawWidth, cutLength, cutWidth);
                const rotated = calcGrid(rawLength, rawWidth, cutWidth, cutLength);
                const best = standard.count >= rotated.count
                    ? { ...standard, orientation: "Standard", fitL: cutLength, fitW: cutWidth }
                    : { ...rotated, orientation: "Rotated", fitL: cutWidth, fitW: cutLength };
                const piecesPerSheet = best.count || 0;
                const materialPerPiece = piecesPerSheet ? rawPrice / piecesPerSheet : 0;
                const packagingPerPiece = packagingType === "percent"
                    ? materialPerPiece * (packagingCost / 100)
                    : packagingCost;
                const costBeforeProfit = materialPerPiece + processingPerPiece + packagingPerPiece;
                const profitAmount = costBeforeProfit * (profitPercent / 100);
                const calculatedFinalSellingPrice = costBeforeProfit + profitAmount;
                const finalSellingPrice = row.manualPrice ? Number(row.finalSellingPrice || calculatedFinalSellingPrice) : calculatedFinalSellingPrice;
                const usedArea = piecesPerSheet * cutLength * cutWidth;
                const wastage = rawLength && rawWidth && piecesPerSheet ? Math.max(0, 100 - (usedArea / (rawLength * rawWidth)) * 100) : 0;

                return {
                    ...row,
                    product,
                    rawLength,
                    rawWidth,
                    rawThickness,
                    rawPrice,
                    cutLength,
                    cutWidth,
                    cutThickness,
                    bladeGap,
                    quantity,
                    processingCost: processingPerPiece,
                    packagingType,
                    packagingCost,
                    profitPercent,
                    piecesPerSheet,
                    orientation: best.orientation,
                    wastage,
                    materialPerPiece,
                    packagingPerPiece,
                    costBeforeProfit,
                    profitAmount,
                    finalSellingPrice,
                    totalOrderValue: finalSellingPrice * quantity,
                    layout: best,
                    manualPrice: row.manualPrice,
                    needsReview: !cutLength || !cutWidth || !rawPrice || !piecesPerSheet
                };
            };

            const findDrawingNumber = (text, fileName) => {
                const match = text.match(/(?:drawing|drg|dwg|part)\s*(?:no\.?|number|#)?\s*[:\-]?\s*([A-Z0-9_./-]{3,})/i);
                return match ? match[1] : fileName.replace(/\.[^.]+$/, "");
            };

            const findLabelNumber = (text, labels) => {
                const pattern = new RegExp(`(?:${labels.join("|")})\\s*(?:no\\.?|size|dimension)?\\s*[:=\\- ]{0,8}(\\d+(?:\\.\\d+)?)`, "i");
                const match = text.match(pattern);
                return match ? Number(match[1]) : "";
            };

            const parseDimensionTriplet = (text) => {
                const matches = [...String(text || "").matchAll(/(\d+(?:\.\d+)?)\s*(?:mm)?\s*[xX\u00d7]\s*(\d+(?:\.\d+)?)\s*(?:mm)?(?:\s*[xX\u00d7]\s*(\d+(?:\.\d+)?))?/g)];
                const candidates = matches
                    .map(match => [Number(match[1]), Number(match[2]), match[3] ? Number(match[3]) : ""])
                    .filter(([length, width, thickness]) => length >= 5 && width >= 5 && length <= 4000 && width <= 4000 && (!thickness || thickness <= 120));
                return candidates[0] || [];
            };

            const inferDrawingOperations = (text, parsed) => {
                const lower = String(text || "").toLowerCase();
                const holes = Number(parsed.holeCount || 0);
                return {
                    sheetCutting: parsed.cutLength && parsed.cutWidth ? 8 : 0,
                    cornerCutting: parsed.cornerRadius ? 4 : 0,
                    drilling: holes ? Math.max(4, holes * 1.5) : (/(hole|drill|dia)/i.test(lower) ? 4 : 0),
                    tapping: /tap|thread/i.test(lower) ? 4 : 0,
                    chamfering: /chamfer|bevel/i.test(lower) ? 3 : 0,
                    boxCutting: /cutout|cut-out|window|slot/i.test(lower) ? 10 : 0,
                    uShapeCutting: /u shape|u-shape/i.test(lower) ? 10 : 0,
                    roundCorners: parsed.cornerRadius ? 3 : 0,
                    additionalCustomisation: /counter|countersink|counterbore|special/i.test(lower) ? 5 : 0
                };
            };

            const parseDrawingTextToRow = (fileName, text) => {
                const combined = `${fileName}\n${String(text || "").replace(/\s+/g, " ")}`;
                const triplet = parseDimensionTriplet(combined);
                const product = matchProductFromMaterial(combined);
                const defaultSheet = getDefaultRawSheet(product);
                const length = findLabelNumber(combined, ["overall length", "length", "len", "\\bl\\b"]) || triplet[0] || inputs.cLen;
                const width = findLabelNumber(combined, ["overall width", "width", "\\bw\\b"]) || triplet[1] || inputs.cWid;
                const thickness = findLabelNumber(combined, ["thickness", "thk", "\\bt\\b"]) || triplet[2] || inputs.pieceThickness || defaultSheet.t || 5;
                const quantityMatch = combined.match(/(?:qty|quantity|qnty)\s*[:= -]*(\d+)/i);
                const holeCountMatch = combined.match(/(\d+)\s*(?:nos\.?|holes?|hole)/i);
                const holeDiaMatch = combined.match(/(?:hole\s*(?:dia|diameter)?|dia\.?|diameter|drill)\s*[:= -]*(\d+(?:\.\d+)?)/i);
                const radiusMatch = combined.match(/\bR\s*(\d+(?:\.\d+)?)/i);
                const materialMatch = combined.match(/material\s*[:= -]*([A-Z0-9 /+.-]{2,40})/i);
                const parsed = {
                    product,
                    material: materialMatch ? materialMatch[1].trim() : product.replace(" Sheet", ""),
                    fileName,
                    drawingNo: findDrawingNumber(combined, fileName),
                    cutLength: Number(length || 0),
                    cutWidth: Number(width || 0),
                    cutThickness: Number(thickness || 0),
                    rawLength: defaultSheet.l,
                    rawWidth: defaultSheet.w,
                    rawThickness: defaultSheet.t || thickness || 5,
                    rawPrice: estimateRawSheetPrice(product, defaultSheet.l, defaultSheet.w, defaultSheet.t || thickness || 5),
                    quantity: quantityMatch ? Number(quantityMatch[1]) : 1,
                    holeCount: holeCountMatch ? Number(holeCountMatch[1]) : 0,
                    holeDiameter: holeDiaMatch ? Number(holeDiaMatch[1]) : "",
                    cornerRadius: radiusMatch ? `R${radiusMatch[1]}` : "",
                    bladeGap: inputs.blade || 2,
                    packagingType: inputs.packagingType || "percent",
                    packagingCost: inputs.packagingCost || 0,
                    profitPercent: inputs.profit || 0,
                    selected: true,
                    extractedTextPreview: combined.slice(0, 450)
                };
                const processingDetailsForDrawing = inferDrawingOperations(combined, parsed);
                const operationSummary = Object.entries(processingDetailsForDrawing)
                    .filter(([, value]) => Number(value || 0) > 0)
                    .map(([key, value]) => `${processingLabels[key]} ₹${money(value)}`)
                    .join(", ");
                return calculateDrawingPricing({
                    ...parsed,
                    processingDetails: processingDetailsForDrawing,
                    operationSummary,
                    notes: [
                        `Auto-read from ${fileName}.`,
                        parsed.holeCount ? `${parsed.holeCount} holes detected.` : "",
                        operationSummary || "No extra operations detected.",
                        "Review dimensions and raw sheet price before final quotation."
                    ].filter(Boolean).join(" ")
                });
            };

            const ensurePDFRuntime = () => {
                if (!window.pdfjsLib) throw new Error("PDF reader library is not loaded.");
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            };

            const extractPDFText = async (fileName, buffer) => {
                ensurePDFRuntime();
                const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
                const pages = [];
                for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
                    const page = await pdf.getPage(pageNo);
                    const content = await page.getTextContent();
                    pages.push(content.items.map(item => item.str).join(" "));
                }
                return pages.join("\n");
            };

            const handleDrawingPDFUpload = async (event) => {
                const files = Array.from(event.target.files || []);
                if (!files.length) return;
                setReadingDrawings(true);
                setDrawingUploadMessage("Reading drawing files...");
                try {
                    const parsedRows = [];
                    for (const file of files) {
                        const ext = file.name.split(".").pop().toLowerCase();
                        if (ext === "pdf") {
                            const text = await extractPDFText(file.name, await file.arrayBuffer());
                            parsedRows.push(parseDrawingTextToRow(file.name, text));
                        } else if (ext === "zip") {
                            if (!window.JSZip) throw new Error("ZIP reader library is not loaded.");
                            const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
                            const pdfEntries = Object.values(zip.files).filter(entry => !entry.dir && /\.pdf$/i.test(entry.name));
                            for (const entry of pdfEntries) {
                                const text = await extractPDFText(entry.name, await entry.async("arraybuffer"));
                                parsedRows.push(parseDrawingTextToRow(entry.name.split("/").pop(), text));
                            }
                        }
                    }
                    setDrawingQuoteRows(parsedRows);
                    setDrawingUploadMessage(parsedRows.length ? `${parsedRows.length} drawing price rows generated. Review and edit before adding to quotation.` : "No PDF drawings found in the selected file.");
                } catch (error) {
                    setDrawingUploadMessage(`Could not read drawings: ${error.message}`);
                } finally {
                    setReadingDrawings(false);
                    event.target.value = "";
                }
            };

            const updateDrawingQuoteRow = (index, field, value) => {
                setDrawingQuoteRows(prev => prev.map((row, rowIndex) => {
                    if (rowIndex !== index) return row;
                    let nextRow = { ...row, [field]: value };
                    if (field === "selected") return nextRow;
                    if (field === "processingCost") {
                        nextRow = { ...nextRow, processingOverride: true };
                    }
                    if (field === "finalSellingPrice") {
                        const finalPrice = Number(value || 0);
                        return {
                            ...nextRow,
                            manualPrice: true,
                            finalSellingPrice: finalPrice,
                            totalOrderValue: finalPrice * Number(nextRow.quantity || 0)
                        };
                    }
                    if (field === "product") {
                        const sheet = getDefaultRawSheet(value);
                        nextRow = {
                            ...nextRow,
                            rawLength: sheet.l,
                            rawWidth: sheet.w,
                            rawThickness: sheet.t || nextRow.cutThickness || nextRow.rawThickness,
                            rawPrice: estimateRawSheetPrice(value, sheet.l, sheet.w, sheet.t || nextRow.cutThickness || nextRow.rawThickness || 5)
                        };
                    }
                    if (!nextRow.processingOverride && ["cutLength", "cutWidth", "holeCount", "holeDiameter", "cornerRadius"].includes(field)) {
                        const inferred = inferDrawingOperations(nextRow.extractedTextPreview || "", nextRow);
                        nextRow = {
                            ...nextRow,
                            processingDetails: inferred,
                            operationSummary: Object.entries(inferred)
                                .filter(([, amount]) => Number(amount || 0) > 0)
                                .map(([key, amount]) => `${processingLabels[key]} ₹${money(amount)}`)
                                .join(", ")
                        };
                    }
                    return calculateDrawingPricing(nextRow);
                }));
            };

            const drawingRowToQuoteItem = (row) => {
                const priced = calculateDrawingPricing(row);
                return {
                    id: Date.now() + Math.random(),
                    product: priced.product,
                    rawLength: Number(priced.rawLength),
                    rawWidth: Number(priced.rawWidth),
                    rawThickness: Number(priced.rawThickness),
                    rawPrice: Number(priced.rawPrice),
                    cutLength: Number(priced.cutLength),
                    cutWidth: Number(priced.cutWidth),
                    cutThickness: Number(priced.cutThickness),
                    requiredSize: `${priced.cutLength} x ${priced.cutWidth} x ${priced.cutThickness} mm`,
                    quantity: Number(priced.quantity || 0),
                    bladeGap: Number(priced.bladeGap || 0),
                    pieces: priced.piecesPerSheet,
                    wastage: priced.wastage,
                    materialPerPiece: priced.materialPerPiece,
                    processingPerPiece: priced.processingCost,
                    processingDetails: { ...priced.processingDetails },
                    processingNotes: priced.notes || "",
                    packagingPerPiece: priced.packagingPerPiece,
                    profitPercent: priced.profitPercent,
                    profitAmount: priced.profitAmount,
                    finalSellingPrice: priced.finalSellingPrice,
                    totalOrderValue: priced.totalOrderValue || 0,
                    costBeforeProfit: priced.costBeforeProfit,
                    orientation: priced.orientation,
                    sourceDescription: `${priced.fileName || "Drawing"} | ${priced.drawingNo || ""}`,
                    inputs: {
                        product: priced.product,
                        rawSizeIndex: 0,
                        vLen: priced.rawLength,
                        vWid: priced.rawWidth,
                        thickness: priced.rawThickness,
                        cLen: priced.cutLength,
                        cWid: priced.cutWidth,
                        pieceThickness: priced.cutThickness,
                        blade: priced.bladeGap,
                        rawPrice: priced.rawPrice,
                        processingCost: priced.processingCost,
                        packagingType: priced.packagingType,
                        packagingCost: priced.packagingCost,
                        profit: priced.profitPercent,
                        quantity: priced.quantity
                    },
                    layout: { ...priced.layout }
                };
            };

            const addDrawingRowsToQuote = () => {
                const selectedRows = drawingQuoteRows.filter(row => row.selected !== false);
                if (!selectedRows.length) {
                    alert("Select at least one drawing row first.");
                    return;
                }
                setCalculatedItems(prev => [...prev, ...selectedRows.map(drawingRowToQuoteItem)]);
                setDrawingUploadMessage(`${selectedRows.length} drawing rows added to the quotation list.`);
            };

            const exportDrawingRowsXLSX = () => {
                if (!drawingQuoteRows.length || !window.XLSX) return;
                const rows = drawingQuoteRows.map((row, index) => ({
                    "Sr No.": index + 1,
                    File: row.fileName,
                    Drawing: row.drawingNo,
                    Product: row.product,
                    Material: row.material,
                    "Cut Length": row.cutLength,
                    "Cut Width": row.cutWidth,
                    Thickness: row.cutThickness,
                    Quantity: row.quantity,
                    "Raw Sheet": `${row.rawLength} x ${row.rawWidth} x ${row.rawThickness} mm`,
                    "Raw Price": money(row.rawPrice),
                    "Pieces / Sheet": row.piecesPerSheet,
                    "Material / Piece": money(row.materialPerPiece),
                    "Processing / Piece": money(row.processingCost),
                    "P&F %": row.packagingCost,
                    "P&F / Piece": money(row.packagingPerPiece),
                    "Profit %": row.profitPercent,
                    "Final / Piece": money(row.finalSellingPrice),
                    Total: money(row.totalOrderValue),
                    Notes: row.notes
                }));
                const worksheet = XLSX.utils.json_to_sheet(rows);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Drawing Pricing");
                XLSX.writeFile(workbook, `KD-Drawing-Pricing_${currentDateISO()}.xlsx`);
            };

            const loadUploadRow = (rowIndex = selectedUploadIndex) => {
                const row = uploadRows[rowIndex];
                if (!row) return;
                const materialText = row[columnMapping.material] || "";
                const product = matchProductFromMaterial(materialText);
                const size = parseSizeText(row[columnMapping.size]);
                const defaultSheet = MATERIAL_SIZES[product][0];
                setInputs(prev => ({
                    ...prev,
                    product,
                    rawSizeIndex: 0,
                    vLen: defaultSheet.l,
                    vWid: defaultSheet.w,
                    thickness: defaultSheet.t || size.thickness,
                    rawPrice: defaultSheet.price || prev.rawPrice,
                    cLen: size.length,
                    cWid: size.width,
                    pieceThickness: size.thickness,
                    quantity: 1
                }));
                const nextProcessingDetails = {
                    sheetCutting: readOperationValue(row[columnMapping.sheetCutting]),
                    cornerCutting: readOperationValue(row[columnMapping.corner]),
                    drilling: readOperationValue(row[columnMapping.drilling]),
                    tapping: readOperationValue(row[columnMapping.tapping]),
                    chamfering: readOperationValue(row[columnMapping.chamfering]),
                    boxCutting: readOperationValue(row[columnMapping.boxCutting] || row[columnMapping.slot]),
                    uShapeCutting: readOperationValue(row[columnMapping.uShapeCutting]),
                    roundCorners: 0,
                    additionalCustomisation: readOperationValue(row[columnMapping.additionalCustomisation])
                };
                const baseNotes = [row[columnMapping.description], row[columnMapping.drawingNo], row[columnMapping.notes]].filter(Boolean);
                const operationNotes = collectOperationNotes(row);
                setProcessingDetails(nextProcessingDetails);
                setProcessingNotes([...baseNotes, ...operationNotes, operationNotes.length ? "Auto-read from upload. Confirm operation rates before final quotation." : ""].filter(Boolean).join(" | "));
                setSelectedUploadIndex(rowIndex);
                setResults(null);
            };

            const nextUploadItem = () => loadUploadRow(Math.min(uploadRows.length - 1, selectedUploadIndex + 1));
            const previousUploadItem = () => loadUploadRow(Math.max(0, selectedUploadIndex - 1));

            const applySameCostingToList = () => {
                setCalculatedItems(prev => prev.map(item => ({
                    ...item,
                    processingDetails: { ...processingDetails },
                    processingPerPiece: processingTotal,
                    processingTotal,
                    processingNotes
                })));
            };

            return (
                <div className="pt-32 pb-24 bg-slate-100 min-h-screen">
                    <SectionTitle eyebrow="KD Internal Team Only" title="KD Internal Pricing Calculator" subtitle="For internal estimation only. Final quotation may vary based on material availability, processing complexity and order quantity." />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-4 space-y-5 no-print">
                            <CalcStep number="1" title="Select Material">
                                <label className="block">
                                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Product</span>
                                    <select value={inputs.product} onChange={(e) => handleProductChange(e.target.value)} className="mt-1 w-full px-3 py-3 rounded-md border border-slate-200 bg-white outline-none focus:border-blue-500">
                                        {Object.keys(MATERIAL_SIZES).map(item => <option key={item}>{item}</option>)}
                                    </select>
                                </label>
                            </CalcStep>

                            <CalcStep number="2" title="Raw Material / Sheet Details">
                                <label className="block">
                                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Raw Sheet Size</span>
                                    <select value={inputs.rawSizeIndex} onChange={(e) => handleRawSizeChange(e.target.value)} className="mt-1 w-full px-3 py-3 rounded-md border border-slate-200 bg-white outline-none focus:border-blue-500">
                                        {selectedSizes.map((size, index) => <option key={size.label} value={index}>{size.label}</option>)}
                                    </select>
                                </label>
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <NumberInput label="Raw Length" name="vLen" value={inputs.vLen} onChange={handleNumber} suffix="mm" />
                                    <NumberInput label="Raw Width" name="vWid" value={inputs.vWid} onChange={handleNumber} suffix="mm" />
                                    <NumberInput label="Raw Thickness" name="thickness" value={inputs.thickness} onChange={handleNumber} suffix="mm" />
                                    <NumberInput label="Raw Sheet Price" name="rawPrice" value={inputs.rawPrice} onChange={handleNumber} suffix="INR" />
                                </div>
                                {!isCustomSize && <p className="text-xs text-slate-500 mt-3">Length and width are prefilled from the selected raw sheet size. You can still adjust them if needed.</p>}
                            </CalcStep>

                            <CalcStep number="3" title="Required Cut Size Details">
                                <div className="grid grid-cols-2 gap-3">
                                    <NumberInput label="Piece Length" name="cLen" value={inputs.cLen} onChange={handleNumber} suffix="mm" />
                                    <NumberInput label="Piece Width" name="cWid" value={inputs.cWid} onChange={handleNumber} suffix="mm" />
                                    <NumberInput label="Piece Thickness" name="pieceThickness" value={inputs.pieceThickness} onChange={handleNumber} suffix="mm" />
                                    <NumberInput label="Quantity Required" name="quantity" value={inputs.quantity} onChange={handleNumber} suffix="pcs" />
                                    <NumberInput label="Blade Gap / Cutting Gap" name="blade" value={inputs.blade} onChange={handleNumber} suffix="mm" />
                                </div>
                            </CalcStep>

                            <CalcStep number="4" title="Cost & Margin Details">
                                <div className="space-y-3">
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Processing Cost</p>
                                                <p className="text-2xl font-extrabold text-slate-950">₹{money(processingTotal)}</p>
                                            </div>
                                            <button type="button" onClick={() => setProcessingOpen(true)} className="rounded-md bg-slate-900 px-3 py-2 text-xs font-extrabold text-white hover:bg-slate-800">
                                                Add Processing Cost Details
                                            </button>
                                        </div>
                                        <p className="mt-3 text-xs text-slate-600">{processingSummary ? `${processingSummary} = ₹${money(processingTotal)}` : "No processing cost added yet. All operation values can remain zero."}</p>
                                    </div>
                                    <CostInput label="Packaging & Forwarding" type={inputs.packagingType} typeName="packagingType" valueName="packagingCost" value={inputs.packagingCost} setField={setField} handleNumber={handleNumber} />
                                    <NumberInput label="Profit" name="profit" value={inputs.profit} onChange={handleNumber} suffix="%" />
                                </div>
                            </CalcStep>

                            <button type="button" onClick={calculate} onMouseDown={calculate} onTouchStart={calculate} className="w-full bg-blue-700 hover:bg-blue-600 text-white border border-blue-700 shadow-lg shadow-blue-900/15 px-5 py-4 rounded-md font-extrabold text-sm transition-all inline-flex items-center justify-center gap-2">
                                Calculate Pricing <Icon name="calculator" className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" onClick={addCurrentItem} className="rounded-md bg-slate-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-slate-800">Add Current Item</button>
                                <button type="button" onClick={resetCurrentItem} className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50">Reset Current Item</button>
                            </div>
                            <button type="button" onClick={() => localStorage.setItem("kd_quote_draft", JSON.stringify({ items: calculatedItems }))} className="w-full rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-extrabold text-blue-800 hover:bg-blue-100">Save Draft</button>
                        </div>

                        <div className="lg:col-span-8 space-y-6">
                            <CalcStep number="5" title="Final Pricing">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Metric label="Best Orientation" value={results ? results.orientation : "-"} />
                                    <Metric label="Pieces / Sheet" value={results ? results.pieces : "0"} />
                                    <Metric label="Wastage" value={results ? `${results.wastage.toFixed(1)}%` : "0%"} />
                                    <Metric label="Final / Piece" value={results ? `INR ${money(results.finalSellingPrice)}` : "INR 0.00"} highlight />
                                </div>
                                {results && (
                                    <div className="flex flex-col sm:flex-row gap-3 mt-5 no-print">
                                        <PrimaryButton onClick={downloadCSV} icon="download" variant="outline">Download CSV</PrimaryButton>
                                        <PrimaryButton onClick={downloadPDF} icon="file-down">Download PDF</PrimaryButton>
                                    </div>
                                )}
                            </CalcStep>

                            {results && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                                    <h3 className="font-extrabold text-lg text-slate-950 mb-4">Cost Explanation</h3>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                        <Metric label="Material Cost" value={`₹${money(results.materialPerPiece)}`} />
                                        <Metric label="Processing" value={`₹${money(results.processingPerPiece)}`} />
                                        <Metric label="Packaging" value={`₹${money(results.packagingPerPiece)}`} />
                                        <Metric label="Profit" value={`${results.profitPercent}%`} />
                                        <Metric label="Final Selling Price" value={`₹${money(results.finalSellingPrice)}`} highlight />
                                        <Metric label="Total Order Value" value={`₹${money(results.totalOrderValue)}`} />
                                    </div>
                                    <p className="mt-3 text-xs text-slate-500">{processingSummary || "Processing: no operation cost added."}</p>
                                </div>
                            )}

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                    <div>
                                        <h3 className="font-extrabold text-lg text-slate-950">Layout Visualizer</h3>
                                        <p className="text-sm text-slate-500">Shows the selected best orientation after calculation.</p>
                                    </div>
                                    <Tag tone="amber">{inputs.product}</Tag>
                                </div>
                                <div className="w-full overflow-hidden bg-slate-950 border border-slate-800 rounded-xl flex justify-center items-center p-4 min-h-[360px]">
                                    <canvas ref={canvasRef}></canvas>
                                    {!results && <p className="text-slate-400 font-bold">Calculate pricing to view sheet layout</p>}
                                </div>
                            </div>

                            {results && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                                        <h3 className="font-extrabold text-slate-950">Pricing Breakdown</h3>
                                        <button onClick={copyTable} className="text-sm bg-white border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-md shadow-sm transition flex items-center gap-2 font-bold">
                                            <Icon name="copy" className="w-4 h-4" /> Copy
                                        </button>
                                    </div>
                                    <div className="p-4 overflow-x-auto">
                                        <table id="quoteTable" className="w-full text-sm text-left border-collapse">
                                            <tbody>
                                                <PriceRow label="Product" value={inputs.product} />
                                                <PriceRow label="Raw Sheet" value={`${inputs.vLen} x ${inputs.vWid} x ${inputs.thickness} mm`} />
                                                <PriceRow label="Required Cut Size" value={`${inputs.cLen} x ${inputs.cWid} x ${inputs.pieceThickness} mm`} />
                                                <PriceRow label="Pieces per Raw Sheet" value={`${results.pieces} pcs`} />
                                                <PriceRow label="Wastage Percentage" value={`${results.wastage.toFixed(1)}%`} />
                                                <PriceRow label="Material Cost / Piece" value={`INR ${money(results.materialPerPiece)}`} />
                                                <PriceRow label="Processing Cost / Piece" value={`INR ${money(results.processingPerPiece)}`} />
                                                <PriceRow label="Packaging & Forwarding / Piece" value={`INR ${money(results.packagingPerPiece)}`} />
                                                <PriceRow label="Total Before Profit" value={`INR ${money(results.costBeforeProfit)}`} />
                                                <PriceRow label="Profit Percentage" value={`${results.profitPercent}%`} />
                                                <PriceRow label="Profit Amount" value={`INR ${money(results.profitAmount)}`} />
                                                <tr className="bg-slate-900 text-white"><td className="p-3 font-extrabold">Final Selling Price / Piece</td><td className="p-3 text-right font-extrabold text-lg">INR {money(results.finalSellingPrice)}</td></tr>
                                                <PriceRow label="Quantity" value={results.quantity ? `${results.quantity} pcs` : "-"} />
                                                {results.totalOrderValue && <tr className="bg-blue-700 text-white"><td className="p-3 font-extrabold">Total Order Value</td><td className="p-3 text-right font-extrabold text-lg">INR {money(results.totalOrderValue)}</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-5">
                                <div>
                                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600">PDF / ZIP Drawing Pricing</p>
                                    <h3 className="text-2xl font-extrabold text-slate-950">Upload Product Drawings and Calculate Price</h3>
                                    <p className="text-sm text-slate-500 mt-1 max-w-3xl">
                                        Upload one PDF, multiple PDFs, or a ZIP containing drawings. The system reads available drawing text, estimates size/material/operations, and creates editable price rows for review.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input type="file" multiple accept=".pdf,.zip,application/pdf,application/zip" onChange={handleDrawingPDFUpload} className="text-sm rounded-md border border-slate-200 bg-slate-50 px-3 py-2" />
                                    <button type="button" onClick={addDrawingRowsToQuote} disabled={!drawingQuoteRows.length} className="rounded-md bg-slate-900 px-4 py-2 text-xs font-extrabold text-white disabled:opacity-50">Add Selected to Quote</button>
                                    <button type="button" onClick={exportDrawingRowsXLSX} disabled={!drawingQuoteRows.length} className="rounded-md border border-slate-300 px-4 py-2 text-xs font-extrabold text-slate-700 disabled:opacity-50">Export Table</button>
                                </div>
                            </div>
                            {(drawingUploadMessage || isReadingDrawings) && (
                                <div className={`mb-4 rounded-lg border px-4 py-3 text-sm font-bold ${isReadingDrawings ? "border-amber-100 bg-amber-50 text-amber-800" : "border-blue-100 bg-blue-50 text-blue-900"}`}>
                                    {isReadingDrawings ? "Reading PDF drawing text. Large ZIP files can take a little while..." : drawingUploadMessage}
                                </div>
                            )}
                            {drawingQuoteRows.length > 0 && (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                                        <table className="w-full min-w-[1900px] text-xs">
                                            <thead className="bg-slate-50 uppercase tracking-wider text-slate-500">
                                                <tr>
                                                    {["Use", "File", "Product", "Length", "Width", "Thick.", "Qty", "Raw Sheet", "Raw Price", "Holes", "Operations", "Pcs/Sheet", "Material", "Processing", "P&F %", "Profit %", "Final/Pc", "Total", "Review"].map(head => <th key={head} className="p-2 text-left">{head}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {drawingQuoteRows.map((row, index) => (
                                                    <tr key={`${row.fileName}-${index}`} className="border-t border-slate-100 align-top">
                                                        <td className="p-2">
                                                            <input type="checkbox" checked={row.selected !== false} onChange={(e) => updateDrawingQuoteRow(index, "selected", e.target.checked)} />
                                                        </td>
                                                        <td className="p-2 min-w-[180px]">
                                                            <div className="font-extrabold text-slate-950">{row.fileName}</div>
                                                            <input value={row.drawingNo || ""} onChange={(e) => updateDrawingQuoteRow(index, "drawingNo", e.target.value)} className="mt-1 w-full rounded border border-slate-200 px-2 py-1" placeholder="Drawing no." />
                                                        </td>
                                                        <td className="p-2">
                                                            <select value={row.product} onChange={(e) => updateDrawingQuoteRow(index, "product", e.target.value)} className="w-[170px] rounded border border-slate-200 bg-white px-2 py-1">
                                                                {Object.keys(MATERIAL_SIZES).map(product => <option key={product}>{product}</option>)}
                                                            </select>
                                                        </td>
                                                        <td className="p-2"><input type="number" value={row.cutLength || ""} onChange={(e) => updateDrawingQuoteRow(index, "cutLength", Number(e.target.value))} className="w-20 rounded border border-slate-200 px-2 py-1" /></td>
                                                        <td className="p-2"><input type="number" value={row.cutWidth || ""} onChange={(e) => updateDrawingQuoteRow(index, "cutWidth", Number(e.target.value))} className="w-20 rounded border border-slate-200 px-2 py-1" /></td>
                                                        <td className="p-2"><input type="number" value={row.cutThickness || ""} onChange={(e) => updateDrawingQuoteRow(index, "cutThickness", Number(e.target.value))} className="w-16 rounded border border-slate-200 px-2 py-1" /></td>
                                                        <td className="p-2"><input type="number" value={row.quantity || ""} onChange={(e) => updateDrawingQuoteRow(index, "quantity", Number(e.target.value))} className="w-16 rounded border border-slate-200 px-2 py-1" /></td>
                                                        <td className="p-2 min-w-[190px]">
                                                            <div className="grid grid-cols-3 gap-1">
                                                                <input type="number" title="Raw length" value={row.rawLength || ""} onChange={(e) => updateDrawingQuoteRow(index, "rawLength", Number(e.target.value))} className="w-full rounded border border-slate-200 px-2 py-1" />
                                                                <input type="number" title="Raw width" value={row.rawWidth || ""} onChange={(e) => updateDrawingQuoteRow(index, "rawWidth", Number(e.target.value))} className="w-full rounded border border-slate-200 px-2 py-1" />
                                                                <input type="number" title="Raw thickness" value={row.rawThickness || ""} onChange={(e) => updateDrawingQuoteRow(index, "rawThickness", Number(e.target.value))} className="w-full rounded border border-slate-200 px-2 py-1" />
                                                            </div>
                                                        </td>
                                                        <td className="p-2"><input type="number" value={Number(row.rawPrice || 0).toFixed(2)} onChange={(e) => updateDrawingQuoteRow(index, "rawPrice", Number(e.target.value))} className="w-24 rounded border border-slate-200 px-2 py-1" /></td>
                                                        <td className="p-2">
                                                            <div className="flex gap-1">
                                                                <input type="number" title="Hole count" value={row.holeCount || ""} onChange={(e) => updateDrawingQuoteRow(index, "holeCount", Number(e.target.value))} className="w-14 rounded border border-slate-200 px-2 py-1" />
                                                                <input type="number" title="Hole dia" value={row.holeDiameter || ""} onChange={(e) => updateDrawingQuoteRow(index, "holeDiameter", Number(e.target.value))} className="w-14 rounded border border-slate-200 px-2 py-1" />
                                                            </div>
                                                        </td>
                                                        <td className="p-2 min-w-[210px] text-slate-600">{row.operationSummary || "Review processing manually"}</td>
                                                        <td className="p-2 font-bold">{row.piecesPerSheet || 0}</td>
                                                        <td className="p-2">₹{money(row.materialPerPiece)}</td>
                                                        <td className="p-2"><input type="number" value={money(row.processingCost)} onChange={(e) => updateDrawingQuoteRow(index, "processingCost", Number(e.target.value))} className="w-20 rounded border border-slate-200 px-2 py-1" /></td>
                                                        <td className="p-2"><input type="number" value={money(row.packagingCost)} onChange={(e) => updateDrawingQuoteRow(index, "packagingCost", Number(e.target.value))} className="w-16 rounded border border-slate-200 px-2 py-1" title="P&F percentage of material cost" aria-label="P&F percentage" /></td>
                                                        <td className="p-2"><input type="number" value={row.profitPercent || 0} onChange={(e) => updateDrawingQuoteRow(index, "profitPercent", Number(e.target.value))} className="w-16 rounded border border-slate-200 px-2 py-1" /></td>
                                                        <td className="p-2"><input type="number" value={money(row.finalSellingPrice)} onChange={(e) => updateDrawingQuoteRow(index, "finalSellingPrice", Number(e.target.value))} className="w-24 rounded border border-slate-200 px-2 py-1 font-bold text-slate-950" /></td>
                                                        <td className="p-2 font-extrabold">₹{money(row.totalOrderValue)}</td>
                                                        <td className="p-2">
                                                            <span className={`rounded px-2 py-1 font-extrabold ${row.needsReview ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                                                                {row.needsReview ? "Review" : "OK"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <p className="text-xs text-slate-500 max-w-3xl">PDF extraction works best when drawing dimensions are searchable text. Scanned image-only PDFs may need manual entry after upload.</p>
                                        <div className="text-xl font-extrabold text-slate-950">Drawing Total: ₹{money(drawingGrandTotal)}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                                <div>
                                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600">Batch Costing</p>
                                    <h3 className="text-2xl font-extrabold text-slate-950">Calculated Items List</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button type="button" onClick={addCurrentItem} className="rounded-md bg-slate-900 px-3 py-2 text-xs font-extrabold text-white">Add Current Calculation to List</button>
                                    <button type="button" onClick={applySameCostingToList} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-extrabold text-slate-700">Apply Same Costing</button>
                                    <button type="button" onClick={() => setCalculatedItems([])} className="rounded-md border border-red-200 px-3 py-2 text-xs font-extrabold text-red-700">Clear All</button>
                                    <button type="button" onClick={generateCombinedPDF} className="rounded-md bg-blue-700 px-3 py-2 text-xs font-extrabold text-white">Generate Combined PDF</button>
                                    <button type="button" onClick={exportCombinedCSV} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-extrabold text-slate-700">Export Combined CSV</button>
                                    <button type="button" onClick={exportCombinedXLSX} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-extrabold text-slate-700">Export XLSX</button>
                                </div>
                            </div>
                            <input value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} placeholder="Search calculated items..." className="mb-4 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" />
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1180px] text-sm">
                                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                        <tr>
                                            {["Sr No.", "Product", "Required Size", "Thickness", "Quantity", "Pieces per sheet", "Material cost", "Processing cost", "Packaging cost", "Profit %", "Final selling price/piece", "Total item value", "Actions"].map(head => <th key={head} className="p-3 text-left">{head}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredItems.map((item, index) => (
                                            <tr key={item.id} className="border-t border-slate-100">
                                                <td className="p-3 font-bold">{index + 1}</td>
                                                <td className="p-3">{item.product}</td>
                                                <td className="p-3">{item.requiredSize}</td>
                                                <td className="p-3">{item.cutThickness} mm</td>
                                                <td className="p-3">{item.quantity}</td>
                                                <td className="p-3">{item.pieces}</td>
                                                <td className="p-3">₹{money(item.materialPerPiece)}</td>
                                                <td className="p-3">₹{money(item.processingPerPiece)}</td>
                                                <td className="p-3">₹{money(item.packagingPerPiece)}</td>
                                                <td className="p-3">{item.profitPercent}%</td>
                                                <td className="p-3 font-bold">₹{money(item.finalSellingPrice)}</td>
                                                <td className="p-3 font-bold">₹{money(item.totalOrderValue)}</td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => editItem(item)} className="text-blue-700 font-bold">Edit</button>
                                                        <button onClick={() => duplicateItem(item)} className="text-slate-700 font-bold">Duplicate</button>
                                                        <button onClick={() => deleteItem(item.id)} className="text-red-700 font-bold">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {!filteredItems.length && <tr><td colSpan="13" className="p-6 text-center text-slate-500 font-bold">No calculated items added yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 text-right text-xl font-extrabold text-slate-950">Grand Total: ₹{money(grandTotal)}</div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                                <div>
                                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600">Drawing Upload</p>
                                    <h3 className="text-2xl font-extrabold text-slate-950">Upload Drawing CSV/xlsx</h3>
                                    <p className="text-sm text-slate-500 mt-1">Upload rows, map columns, then load each item into the guided costing flow for confirmation.</p>
                                </div>
                                <input type="file" accept=".csv,.xlsx,.xls" onChange={handleDrawingUpload} className="text-sm" />
                            </div>
                            {uploadHeaders.length > 0 && (
                                <div className="space-y-4">
                                    <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                                        Operation columns are auto-read into the processing dialog when an item is loaded. Review and edit the values before final costing, especially when the upload contains counts or notes instead of INR rates.
                                    </div>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {[
                                            ["description", "Description"],
                                            ["drawingNo", "Drawing No."],
                                            ["material", "Material"],
                                            ["size", "Size / Thickness"],
                                            ["sheetCutting", "Sheet Cutting"],
                                            ["drilling", "Drilling / Holes"],
                                            ["slot", "Slot / Cutout"],
                                            ["corner", "Corner / Radius"],
                                            ["chamfering", "Chamfer"],
                                            ["tapping", "Tapping"],
                                            ["boxCutting", "Box Cutting"],
                                            ["uShapeCutting", "U-shape Cutting"],
                                            ["additionalCustomisation", "Other Operation"],
                                            ["notes", "Notes"]
                                        ].map(([key, label]) => (
                                            <label key={key} className="block">
                                                <span className="text-xs font-extrabold text-slate-500 uppercase">{label}</span>
                                                <select value={columnMapping[key] || ""} onChange={(e) => setColumnMapping(prev => ({ ...prev, [key]: e.target.value }))} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-2 text-sm">
                                                    <option value="">Not mapped</option>
                                                    {uploadHeaders.map(header => <option key={header}>{header}</option>)}
                                                </select>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button type="button" onClick={previousUploadItem} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-extrabold">Previous Item</button>
                                        <button type="button" onClick={() => loadUploadRow(selectedUploadIndex)} className="rounded-md bg-slate-900 px-3 py-2 text-xs font-extrabold text-white">Load Selected Item</button>
                                        <button type="button" onClick={nextUploadItem} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-extrabold">Next Item</button>
                                    </div>
                                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                        <table className="w-full min-w-[900px] text-xs">
                                            <thead className="bg-slate-50">
                                                <tr>{uploadHeaders.slice(0, 10).map(header => <th key={header} className="p-2 text-left">{header}</th>)}</tr>
                                            </thead>
                                            <tbody>
                                                {uploadRows.slice(0, 30).map((row, index) => (
                                                    <tr key={index} onClick={() => setSelectedUploadIndex(index)} className={`cursor-pointer border-t border-slate-100 ${selectedUploadIndex === index ? "bg-blue-50" : ""}`}>
                                                        {uploadHeaders.slice(0, 10).map(header => <td key={header} className="p-2">{row[header]}</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-xs text-slate-500">Showing up to 30 uploaded items in preview. Missing fields should be confirmed manually after loading an item. The system guides costing but does not assume final rates.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {isProcessingOpen && (
                        <ProcessingCostModal
                            values={processingDetails}
                            labels={processingLabels}
                            onChange={setProcessingField}
                            onClose={() => setProcessingOpen(false)}
                            total={processingTotal}
                            notes={processingNotes}
                            onNotesChange={setProcessingNotes}
                            presetName={presetName}
                            setPresetName={setPresetName}
                            presets={processingPresets}
                            onSavePreset={savePreset}
                            onApplyPreset={applyPreset}
                        />
                    )}
                </div>
            );
        };

        const DEFAULT_PAYSLIP_DECLARATION = "This salary slip has been prepared from KD Enterprises payroll records for the stated pay period. Amounts are subject to internal payroll verification and applicable statutory adjustments. For confirmation or verification, please contact sales@kd-enterprises.co.in.";
        const OLD_PAYSLIP_DECLARATION = "This is a computer-generated payslip for payroll records.";

        const createDefaultPayslipDraft = () => ({
            details: {
                companyName: "KD Enterprises",
                companyAddress: "St. 3, Plot No. B/41, Ballabgarh, Faridabad 121004, Haryana, India",
                companyEmail: "sales@kd-enterprises.co.in",
                companyGst: "06AGYPD8145K1ZT",
                payslipNo: `KD-PAY-${new Date().getFullYear()}-001`,
                employeeName: "Employee Name",
                employeeId: "KD-EMP-001",
                dateOfBirth: "",
                aadhaarNo: "",
                designation: "Designation",
                department: "Operations",
                location: "Faridabad",
                payPeriod: "June 2026",
                payDate: "2026-06-30",
                paidDays: 26,
                workingDays: 26,
                leaveDays: 0,
                notes: DEFAULT_PAYSLIP_DECLARATION
            },
            earnings: [
                { label: "Basic Salary", amount: 25000 },
                { label: "House Rent Allowance", amount: 10000 },
                { label: "Conveyance Allowance", amount: 2500 },
                { label: "Other Allowance", amount: 2500 }
            ],
            deductions: [
                { label: "Provident Fund", amount: 1800 },
                { label: "ESI / Insurance", amount: 0 },
                { label: "TDS", amount: 0 },
                { label: "Advance / Loan", amount: 0 }
            ]
        });

        const normalisePayslipDraft = (draft) => {
            const defaults = createDefaultPayslipDraft();
            const details = { ...defaults.details, ...(draft && draft.details ? draft.details : {}) };
            if (!details.notes || details.notes === OLD_PAYSLIP_DECLARATION) {
                details.notes = DEFAULT_PAYSLIP_DECLARATION;
            }
            return {
                details,
                earnings: Array.isArray(draft && draft.earnings) ? draft.earnings : defaults.earnings,
                deductions: Array.isArray(draft && draft.deductions) ? draft.deductions : defaults.deductions
            };
        };

        const PayslipSection = () => {
            useLucide();
            const [draft, setDraft] = useState(() => {
                try {
                    return normalisePayslipDraft(JSON.parse(localStorage.getItem("kd_payslip_draft") || "null"));
                } catch (error) {
                    return createDefaultPayslipDraft();
                }
            });
            const { details, earnings, deductions } = draft;
            const grossPay = earnings.reduce((sum, item) => sum + toAmount(item.amount), 0);
            const deductionTotal = deductions.reduce((sum, item) => sum + toAmount(item.amount), 0);
            const netPay = Math.max(0, grossPay - deductionTotal);
            const visibleEarnings = earnings.filter(item => toAmount(item.amount) !== 0);
            const visibleDeductions = deductions.filter(item => toAmount(item.amount) !== 0);
            const updateDetail = (field, value) => setDraft(prev => ({ ...prev, details: { ...prev.details, [field]: value } }));
            const setEarnings = updater => setDraft(prev => ({ ...prev, earnings: typeof updater === "function" ? updater(prev.earnings) : updater }));
            const setDeductions = updater => setDraft(prev => ({ ...prev, deductions: typeof updater === "function" ? updater(prev.deductions) : updater }));
            const saveDraft = () => localStorage.setItem("kd_payslip_draft", JSON.stringify(draft));
            const resetDraft = () => setDraft(createDefaultPayslipDraft());

            return (
                <div className="pt-32 pb-24 bg-slate-100 min-h-screen print-page-wrap">
                    <div className="no-print">
                        <SectionTitle eyebrow="Admin Access Only" title="Editable Payslip Template" subtitle="Clean payroll format with editable employee details, earnings, deductions and a print-ready payslip preview." />
                    </div>
                    <div className="payslip-page-grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid xl:grid-cols-[430px_1fr] gap-6">
                        <div className="space-y-5 no-print">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600">Payslip</p>
                                        <h3 className="text-xl font-extrabold text-slate-950">Template Details</h3>
                                    </div>
                                    <Tag tone="blue">Editable</Tag>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <AdminField label="Payslip No." value={details.payslipNo} onChange={(value) => updateDetail("payslipNo", value)} />
                                    <AdminField label="Pay Date" type="date" value={details.payDate} onChange={(value) => updateDetail("payDate", value)} />
                                    <AdminField label="Pay Period" value={details.payPeriod} onChange={(value) => updateDetail("payPeriod", value)} />
                                    <AdminField label="Location" value={details.location} onChange={(value) => updateDetail("location", value)} />
                                </div>
                                <div className="mt-3 space-y-3">
                                    <AdminField label="Company Name" value={details.companyName} onChange={(value) => updateDetail("companyName", value)} />
                                    <AdminField label="Company Address" rows="2" value={details.companyAddress} onChange={(value) => updateDetail("companyAddress", value)} />
                                    <AdminField label="Company Email" value={details.companyEmail} onChange={(value) => updateDetail("companyEmail", value)} />
                                    <AdminField label="Company GST No." value={details.companyGst} onChange={(value) => updateDetail("companyGst", value)} />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                                <h3 className="font-extrabold text-lg text-slate-950 mb-4">Employee Details</h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <AdminField label="Employee Name" value={details.employeeName} onChange={(value) => updateDetail("employeeName", value)} />
                                    <AdminField label="Employee ID" value={details.employeeId} onChange={(value) => updateDetail("employeeId", value)} />
                                    <AdminField label="Date of Birth" type="date" value={details.dateOfBirth} onChange={(value) => updateDetail("dateOfBirth", value)} />
                                    <AdminField label="Aadhaar Card No." value={details.aadhaarNo} onChange={(value) => updateDetail("aadhaarNo", value)} />
                                    <AdminField label="Designation" value={details.designation} onChange={(value) => updateDetail("designation", value)} />
                                    <AdminField label="Department" value={details.department} onChange={(value) => updateDetail("department", value)} />
                                    <AdminField label="Paid Days" type="number" value={details.paidDays} onChange={(value) => updateDetail("paidDays", value)} />
                                    <AdminField label="Working Days" type="number" value={details.workingDays} onChange={(value) => updateDetail("workingDays", value)} />
                                    <AdminField label="Leave Days" type="number" value={details.leaveDays} onChange={(value) => updateDetail("leaveDays", value)} />
                                </div>
                            </div>

                            <LineItemEditor title="Earnings" items={earnings} setItems={setEarnings} />
                            <LineItemEditor title="Deductions" items={deductions} setItems={setDeductions} />

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
                                <AdminField label="Notes" rows="3" value={details.notes} onChange={(value) => updateDetail("notes", value)} />
                                <div className="grid sm:grid-cols-3 gap-3">
                                    <button type="button" onClick={saveDraft} className="rounded-md bg-slate-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-slate-800">Save Draft</button>
                                    <button type="button" onClick={() => window.print()} className="rounded-md bg-blue-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-blue-600">Print / PDF</button>
                                    <button type="button" onClick={resetDraft} className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50">Reset</button>
                                </div>
                            </div>
                        </div>

                        <div className="print-document payslip-print-document bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                            <div className="payslip-print-header bg-white border-b-4 border-slate-950 p-7">
                                <div className="payslip-header-row flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 shrink-0"><KDLogo className="h-16 w-16" /></div>
                                        <div>
                                            <h2 className="text-3xl font-extrabold text-slate-950 leading-tight">{details.companyName}</h2>
                                            <p className="text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">{details.companyAddress}</p>
                                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                                                <span>Email: {details.companyEmail}</span>
                                                <span>GSTIN: {details.companyGst}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 min-w-[210px] md:text-right">
                                        <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-blue-700">Salary Slip</p>
                                        <p className="text-2xl font-extrabold text-slate-950 mt-2">{details.payPeriod}</p>
                                        <p className="text-sm font-bold text-slate-500 mt-1">{details.payslipNo}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="payslip-print-body p-7">
                                <div className="payslip-top-row flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-600">Employee & Payroll Details</p>
                                        <h3 className="text-xl font-extrabold text-slate-950 mt-1">{details.employeeName}</h3>
                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-slate-500">
                                            <span>DOB: {formatDate(details.dateOfBirth) || "-"}</span>
                                            <span>Aadhaar: {details.aadhaarNo || "-"}</span>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p className="font-extrabold text-slate-950">Pay Date: {formatDate(details.payDate)}</p>
                                        <p className="text-slate-500 font-bold mt-1">{details.location}</p>
                                    </div>
                                </div>

                                <div className="payslip-info-grid grid md:grid-cols-4 gap-3 mt-5 text-sm">
                                    {[
                                        ["Employee ID", details.employeeId],
                                        ["Date of Birth", formatDate(details.dateOfBirth) || "-"],
                                        ["Aadhaar No.", details.aadhaarNo || "-"],
                                        ["Designation", details.designation],
                                        ["Department", details.department],
                                        ["Paid Days", `${details.paidDays || 0} days`],
                                        ["Working Days", `${details.workingDays || 0} days`],
                                        ["Leave Days", `${details.leaveDays || 0} days`],
                                        ["Pay Period", details.payPeriod],
                                        ["Payslip No.", details.payslipNo],
                                        ["Work Location", details.location]
                                    ].map(([label, value]) => (
                                        <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">{label}</p>
                                            <p className="mt-1 font-extrabold text-slate-950 break-words">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="payslip-print-section payslip-amount-grid grid md:grid-cols-2 gap-5 mt-6">
                                    <div className={`rounded-lg border border-slate-200 overflow-hidden ${visibleDeductions.length ? "" : "md:col-span-2"}`}>
                                        <div className="bg-blue-50 px-4 py-3 flex items-center justify-between gap-3">
                                            <span className="font-extrabold text-blue-900">Earnings</span>
                                            <span className="text-xs font-extrabold text-blue-800">{formatCurrency(grossPay)}</span>
                                        </div>
                                        <table className="payslip-print-table w-full text-sm">
                                            <tbody>
                                                {visibleEarnings.map((item, index) => (
                                                    <tr key={index} className="border-t border-slate-100"><td className="p-3 text-slate-600 font-semibold">{item.label}</td><td className="p-3 text-right font-extrabold text-slate-950">{formatCurrency(item.amount)}</td></tr>
                                                ))}
                                                <tr className="bg-slate-50"><td className="p-3 font-extrabold">Gross Pay</td><td className="p-3 text-right font-extrabold">{formatCurrency(grossPay)}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {visibleDeductions.length > 0 && (
                                        <div className="rounded-lg border border-slate-200 overflow-hidden">
                                            <div className="bg-amber-50 px-4 py-3 flex items-center justify-between gap-3">
                                                <span className="font-extrabold text-amber-900">Deductions</span>
                                                <span className="text-xs font-extrabold text-amber-800">{formatCurrency(deductionTotal)}</span>
                                            </div>
                                            <table className="payslip-print-table w-full text-sm">
                                                <tbody>
                                                    {visibleDeductions.map((item, index) => (
                                                        <tr key={index} className="border-t border-slate-100"><td className="p-3 text-slate-600 font-semibold">{item.label}</td><td className="p-3 text-right font-extrabold text-slate-950">{formatCurrency(item.amount)}</td></tr>
                                                    ))}
                                                    <tr className="bg-slate-50"><td className="p-3 font-extrabold">Total Deductions</td><td className="p-3 text-right font-extrabold">{formatCurrency(deductionTotal)}</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                <div className="payslip-net-bar rounded-xl bg-slate-950 p-5 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-200">Net Payable Salary</p>
                                        <p className="text-sm text-slate-300 mt-1">{numberToWordsIndian(netPay)}</p>
                                    </div>
                                    <p className="text-3xl font-extrabold">{formatCurrency(netPay)}</p>
                                </div>

                                <div className="payslip-print-notes grid sm:grid-cols-[1fr_260px] gap-8 text-sm">
                                    <div>
                                        <p className="font-extrabold text-slate-950">Declaration</p>
                                        <p className="text-slate-600 mt-2 leading-relaxed">{details.notes}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="inline-block min-w-[240px]">
                                            <div className="signature-mark text-4xl text-slate-950 leading-none">Pankaj Sharma</div>
                                            <div className="border-t border-slate-300 pt-3 mt-2">
                                                <p className="font-extrabold text-slate-950">Pankaj Sharma</p>
                                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Authorised Signatory</p>
                                                <p className="text-xs font-bold text-slate-500 mt-1">Head of Operations</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const PDIR_AUTO_DETAIL_FIELDS = [
            "productName", "material", "finish", "drawingNo", "referenceDrawing", "modelApplication", "revision",
            "dimensionsUnit", "overallLength", "overallWidth", "thickness", "innerReferenceWidth", "horizontalHoleSpacing",
            "holeEdgeReference", "holeDiameter", "holeCount", "cornerRadius"
        ];

        const cleanPDIRValue = value => String(value || "").trim();
        const pdirDisplay = value => cleanPDIRValue(value) || "-";
        const pdirWithUnit = (value, unit = "mm") => {
            const text = cleanPDIRValue(value);
            if (!text) return "";
            if (/[a-zA-Z]/.test(text)) return text;
            return `${text} ${unit || "mm"}`;
        };
        const pdirHoleSpec = details => {
            const unit = details.dimensionsUnit || "mm";
            const diameter = pdirWithUnit(details.holeDiameter, unit);
            const count = cleanPDIRValue(details.holeCount);
            if (diameter && count) return `Dia ${diameter}, ${count} nos.`;
            return diameter || (count ? `${count} nos.` : "");
        };
        const pdirSpacingSpec = details => {
            const unit = details.dimensionsUnit || "mm";
            const spacing = pdirWithUnit(details.horizontalHoleSpacing, unit);
            const edge = pdirWithUnit(details.holeEdgeReference, unit);
            if (spacing && edge) return `${spacing} with ${edge} edge reference`;
            return spacing || edge;
        };
        const pdirInspectionRow = (parameter, specification, method, observation) => ({
            parameter,
            specification,
            method,
            observation: observation || specification || "OK",
            status: "Pass"
        });
        const createPDIRAutoChecks = (details) => {
            const unit = details.dimensionsUnit || "mm";
            const rows = [
                pdirInspectionRow("Overall Length", pdirWithUnit(details.overallLength, unit), "Vernier / Scale"),
                pdirInspectionRow("Overall Width", pdirWithUnit(details.overallWidth, unit), "Vernier / Scale"),
                pdirInspectionRow("Thickness", pdirWithUnit(details.thickness, unit), "Micrometer / Vernier"),
                pdirInspectionRow("Inner reference width", pdirWithUnit(details.innerReferenceWidth, unit), "Vernier / Scale"),
                pdirInspectionRow("Horizontal hole spacing", pdirSpacingSpec(details), "Vernier / Scale", "Pass"),
                pdirInspectionRow("Hole diameter", pdirHoleSpec(details), "Vernier / Pin Gauge", "Pass"),
                pdirInspectionRow("Corner radius", pdirWithUnit(details.cornerRadius, unit), "Radius Gauge / Visual", "Pass"),
                pdirInspectionRow("Material", cleanPDIRValue(details.material), "Material certificate / Visual", "OK"),
                pdirInspectionRow("Finish / Colour", cleanPDIRValue(details.finish), "Visual inspection", "OK"),
                pdirInspectionRow("Edge quality", "Clean edges, no sharp burrs, chips or cracks", "Visual / Touch check", "OK"),
                pdirInspectionRow("Surface condition", "No visible scratches, cracks, stains or damage", "Visual inspection", "OK"),
                pdirInspectionRow("Marking / Packing", "Packed safely to avoid scratches and transit damage", "Visual inspection", "OK")
            ];
            return rows.filter(row => row.specification || ["Edge quality", "Surface condition", "Marking / Packing"].includes(row.parameter));
        };

        const createDefaultPDIRDetails = () => ({
            companyName: "KD ENTERPRISES",
            companyWebsite: "kd-enterprises.co.in",
            companyEmail: "sales@kd-enterprises.co.in",
            companyGst: "06AGYPD8145K1ZT",
            reportNo: `PDIR/KDE/${new Date().getFullYear()}/001`,
            reportDate: new Date().toISOString().slice(0, 10),
            customerName: "Customer Name",
            supplier: "KD Enterprises",
            productName: "Custom Plastic Component",
            modelApplication: "",
            drawingNo: "Development Drawing",
            revision: "00",
            material: "PC",
            finish: "Natural / Transparent",
            referenceDrawing: "",
            dimensionsUnit: "mm",
            overallLength: "130",
            overallWidth: "97",
            thickness: "3",
            innerReferenceWidth: "85",
            horizontalHoleSpacing: "59 mm + 59 mm",
            holeEdgeReference: "6",
            holeDiameter: "5",
            holeCount: "06",
            cornerRadius: "R3",
            inspectedBy: "",
            approvedBy: "",
            remarks: "All Good."
        });

        const createDefaultPDIRDraft = () => {
            const details = createDefaultPDIRDetails();
            return { details, checks: createPDIRAutoChecks(details) };
        };

        const normalisePDIRCheck = (check) => ({
            parameter: check.parameter || "Inspection parameter",
            specification: check.specification || "",
            method: check.method || "",
            observation: check.observation || check.observed || "",
            status: check.status || (check.result === "OK" ? "Pass" : check.result || "Pass")
        });

        const normalisePDIRDraft = (draft) => {
            const defaults = createDefaultPDIRDraft();
            const details = { ...defaults.details, ...(draft && draft.details ? draft.details : {}) };
            const incomingChecks = Array.isArray(draft && draft.checks) ? draft.checks : [];
            const hasChecklistShape = incomingChecks.some(check => check.method || check.observation || check.status);
            return {
                details,
                checks: hasChecklistShape ? incomingChecks.map(normalisePDIRCheck) : createPDIRAutoChecks(details)
            };
        };

        const PDIRSection = () => {
            useLucide();
            const statusOptions = ["Pass", "Fail", "Hold", "N/A"];
            const [draft, setDraft] = useState(() => {
                try {
                    return normalisePDIRDraft(JSON.parse(localStorage.getItem("kd_pdir_draft") || "null"));
                } catch (error) {
                    return createDefaultPDIRDraft();
                }
            });
            const { details, checks } = draft;
            const updateDetail = (field, value) => setDraft(prev => {
                const nextDetails = { ...prev.details, [field]: value };
                return {
                    ...prev,
                    details: nextDetails,
                    checks: PDIR_AUTO_DETAIL_FIELDS.includes(field) ? createPDIRAutoChecks(nextDetails) : prev.checks
                };
            });
            const updateCheck = (index, field, value) => setDraft(prev => ({
                ...prev,
                checks: prev.checks.map((check, checkIndex) => checkIndex === index ? { ...check, [field]: value } : check)
            }));
            const autoGenerateChecks = () => setDraft(prev => ({ ...prev, checks: createPDIRAutoChecks(prev.details) }));
            const addCheck = () => setDraft(prev => ({ ...prev, checks: [...prev.checks, { parameter: "New inspection parameter", specification: "", method: "", observation: "", status: "Pass" }] }));
            const removeCheck = index => setDraft(prev => ({ ...prev, checks: prev.checks.filter((_, checkIndex) => checkIndex !== index) }));
            const saveDraft = () => localStorage.setItem("kd_pdir_draft", JSON.stringify(draft));
            const resetDraft = () => setDraft(createDefaultPDIRDraft());
            const hasIssue = checks.some(check => ["Fail", "Hold"].includes(check.status));
            const overallStatus = hasIssue ? "Hold for review" : "Approved for dispatch";
            const signatureDate = formatDate(details.reportDate);
            const pdirDetailRows = [
                ["PDIR No.", details.reportNo, "PDIR Date", formatDate(details.reportDate)],
                ["Customer", details.customerName, "Supplier", details.supplier],
                ["Product / Part Name", details.productName, "Model / Application", details.modelApplication],
                ["Drawing No.", details.drawingNo, "Revision", details.revision],
                ["Material", details.material, "Finish", details.finish],
                ["Reference Drawing", details.referenceDrawing, "Dimensions Unit", details.dimensionsUnit]
            ];
            const drawingNotes = [
                `All dimensions are in ${details.dimensionsUnit || "mm"}. Do not scale the drawing.`,
                "General dimensional tolerances to be considered as per drawing tolerance table unless otherwise specified.",
                `Inspection to be carried out against the supplied drawing: ${pdirDisplay(details.productName)}${details.modelApplication ? ` - ${details.modelApplication}` : ""}, Rev. ${pdirDisplay(details.revision)}.`
            ];
            const signatories = [
                { label: "Inspected By", name: cleanPDIRValue(details.inspectedBy) },
                { label: "Approved By", name: cleanPDIRValue(details.approvedBy) }
            ];

            return (
                <div className="pt-32 pb-24 bg-slate-100 min-h-screen print-page-wrap">
                    <div className="no-print">
                        <SectionTitle eyebrow="Admin Access Only" title="PDIR Generator" subtitle="Enter product details and dimensions to automatically generate a professional Pre-Dispatch Inspection Report checklist." />
                    </div>
                    <div className="pdir-page-grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid xl:grid-cols-[480px_1fr] gap-6">
                        <div className="space-y-5 no-print">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600">Pre-Dispatch</p>
                                        <h3 className="text-xl font-extrabold text-slate-950">Report Details</h3>
                                    </div>
                                    <Tag tone={overallStatus === "Approved for dispatch" ? "blue" : "amber"}>{overallStatus}</Tag>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <AdminField label="PDIR No." value={details.reportNo} onChange={(value) => updateDetail("reportNo", value)} />
                                    <AdminField label="PDIR Date" type="date" value={details.reportDate} onChange={(value) => updateDetail("reportDate", value)} />
                                    <AdminField label="Customer" value={details.customerName} onChange={(value) => updateDetail("customerName", value)} />
                                    <AdminField label="Supplier" value={details.supplier} onChange={(value) => updateDetail("supplier", value)} />
                                    <AdminField label="Product / Part Name" value={details.productName} onChange={(value) => updateDetail("productName", value)} />
                                    <AdminField label="Model / Application" value={details.modelApplication} onChange={(value) => updateDetail("modelApplication", value)} />
                                    <AdminField label="Drawing No." value={details.drawingNo} onChange={(value) => updateDetail("drawingNo", value)} />
                                    <AdminField label="Revision" value={details.revision} onChange={(value) => updateDetail("revision", value)} />
                                    <AdminField label="Material" value={details.material} onChange={(value) => updateDetail("material", value)} />
                                    <AdminField label="Finish / Colour" value={details.finish} onChange={(value) => updateDetail("finish", value)} />
                                    <AdminField label="Reference Drawing" value={details.referenceDrawing} onChange={(value) => updateDetail("referenceDrawing", value)} />
                                    <AdminField label="Dimensions Unit" value={details.dimensionsUnit} onChange={(value) => updateDetail("dimensionsUnit", value)} />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                                <h3 className="font-extrabold text-lg text-slate-950 mb-4">Product Dimensions</h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <AdminField label="Overall Length" value={details.overallLength} onChange={(value) => updateDetail("overallLength", value)} suffix={details.dimensionsUnit || "mm"} />
                                    <AdminField label="Overall Width" value={details.overallWidth} onChange={(value) => updateDetail("overallWidth", value)} suffix={details.dimensionsUnit || "mm"} />
                                    <AdminField label="Thickness" value={details.thickness} onChange={(value) => updateDetail("thickness", value)} suffix={details.dimensionsUnit || "mm"} />
                                    <AdminField label="Inner Ref. Width" value={details.innerReferenceWidth} onChange={(value) => updateDetail("innerReferenceWidth", value)} suffix={details.dimensionsUnit || "mm"} />
                                    <AdminField label="Hole Spacing" value={details.horizontalHoleSpacing} onChange={(value) => updateDetail("horizontalHoleSpacing", value)} />
                                    <AdminField label="Hole Edge Reference" value={details.holeEdgeReference} onChange={(value) => updateDetail("holeEdgeReference", value)} suffix={details.dimensionsUnit || "mm"} />
                                    <AdminField label="Hole Diameter" value={details.holeDiameter} onChange={(value) => updateDetail("holeDiameter", value)} suffix={details.dimensionsUnit || "mm"} />
                                    <AdminField label="Hole Count" value={details.holeCount} onChange={(value) => updateDetail("holeCount", value)} suffix="nos." />
                                    <AdminField label="Corner Radius" value={details.cornerRadius} onChange={(value) => updateDetail("cornerRadius", value)} />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <h3 className="font-extrabold text-lg text-slate-950">Inspection Checklist</h3>
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={autoGenerateChecks} className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700 hover:bg-blue-100">Auto-generate</button>
                                        <button type="button" onClick={addCheck} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50">Add</button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {checks.map((check, index) => (
                                        <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                            <div className="grid sm:grid-cols-2 gap-2">
                                                <input value={check.parameter} onChange={(e) => updateCheck(index, "parameter", e.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Inspection parameter" />
                                                <input value={check.specification} onChange={(e) => updateCheck(index, "specification", e.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Required specification" />
                                                <input value={check.method} onChange={(e) => updateCheck(index, "method", e.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Method / instrument" />
                                                <input value={check.observation} onChange={(e) => updateCheck(index, "observation", e.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Observation / actual" />
                                            </div>
                                            <div className="grid grid-cols-[1fr_34px] gap-2 mt-2">
                                                <select value={check.status} onChange={(e) => updateCheck(index, "status", e.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500">
                                                    {statusOptions.map(option => <option key={option}>{option}</option>)}
                                                </select>
                                                <button type="button" onClick={() => removeCheck(index)} className="rounded-md border border-red-200 bg-white text-red-700 hover:bg-red-50 flex items-center justify-center" aria-label="Remove checkpoint"><Icon name="x" className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <AdminField label="Inspected By" value={details.inspectedBy} onChange={(value) => updateDetail("inspectedBy", value)} />
                                    <AdminField label="Approved By" value={details.approvedBy} onChange={(value) => updateDetail("approvedBy", value)} />
                                </div>
                                <AdminField label="Final Remarks" rows="3" value={details.remarks} onChange={(value) => updateDetail("remarks", value)} />
                                <div className="grid sm:grid-cols-3 gap-3">
                                    <button type="button" onClick={saveDraft} className="rounded-md bg-slate-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-slate-800">Save Draft</button>
                                    <button type="button" onClick={() => window.print()} className="rounded-md bg-blue-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-blue-600">Print / PDF</button>
                                    <button type="button" onClick={resetDraft} className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50">Reset</button>
                                </div>
                            </div>
                        </div>

                        <div className="print-document pdir-print-document bg-white shadow-xl overflow-hidden">
                            <div className="pdir-sheet-frame">
                                <div className="pdir-company-header">
                                    <KDLogo className="pdir-company-logo" />
                                    <div className="pdir-company-content">
                                        <div className="pdir-company-title">{details.companyName}</div>
                                        <div className="pdir-company-meta">
                                            <span>Website: <strong>{details.companyWebsite}</strong></span>
                                            <span>Email: <strong>{details.companyEmail}</strong></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pdir-title-bar">Pre-Dispatch Inspection Report (PDIR)</div>

                                <table className="pdir-meta-table">
                                    <tbody>
                                        {pdirDetailRows.map(([leftLabel, leftValue, rightLabel, rightValue]) => (
                                            <tr key={leftLabel}>
                                                <td className="pdir-label-cell">{leftLabel}</td>
                                                <td className="pdir-value-cell">{pdirDisplay(leftValue)}</td>
                                                <td className="pdir-label-cell">{rightLabel}</td>
                                                <td className="pdir-value-cell">{pdirDisplay(rightValue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="pdir-section-bar">Inspection Checklist</div>
                                <table className="pdir-checklist-table">
                                    <colgroup>
                                        <col style={{ width: "6%" }} />
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "30%" }} />
                                        <col style={{ width: "19%" }} />
                                        <col style={{ width: "17%" }} />
                                        <col style={{ width: "8%" }} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            {["S. No.", "Inspection Parameter", "Required Specification as per Drawing", "Method / Instrument", "Observation / Actual", "Status"].map(head => <th key={head}>{head}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {checks.map((check, index) => (
                                            <tr key={index}>
                                                <td className="text-center font-bold">{index + 1}</td>
                                                <td>{pdirDisplay(check.parameter)}</td>
                                                <td>{pdirDisplay(check.specification)}</td>
                                                <td>{pdirDisplay(check.method)}</td>
                                                <td>{pdirDisplay(check.observation)}</td>
                                                <td className="pdir-status-cell">{pdirDisplay(check.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="pdir-section-bar">Drawing Notes / Acceptance Basis</div>
                                <table className="pdir-notes-table">
                                    <tbody>
                                        {drawingNotes.map(note => (
                                            <tr key={note}><td>{note}</td></tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="pdir-final-remarks">
                                    <div className="pdir-final-remarks-label">Final Remarks</div>
                                    <div className="pdir-remarks-writing">{pdirDisplay(details.remarks)}</div>
                                </div>

                                <table className="pdir-signature-table">
                                    <tbody>
                                        <tr>
                                            {signatories.map(signatory => (
                                                <React.Fragment key={signatory.label}>
                                                    <td className="pdir-signature-label">{signatory.label}</td>
                                                    <td className="pdir-signature-title">Name / Sign / Date</td>
                                                    <td className="pdir-signature-box">
                                                        <div className="pdir-signature-mark signature-mark">{signatory.name}</div>
                                                        <div>{signatory.name ? signatureDate : ""}</div>
                                                    </td>
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="pdir-footer-note">KD Enterprises</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const RMTC_THICKNESS_RANGES = {
            Bakelite: { min: 0.5, max: 80, fallback: 5 },
            GlassEpoxy: { min: 2, max: 80, fallback: 5 }
        };

        const getRMTCThicknessRange = (materialKey) => RMTC_THICKNESS_RANGES[materialKey] || RMTC_THICKNESS_RANGES.Bakelite;

        const parseRMTCThickness = (value, materialKey = "Bakelite") => {
            const range = getRMTCThicknessRange(materialKey);
            const values = String(value || "").match(/\d+(?:\.\d+)?/g) || [];
            // For a thickness range, use the upper limit to select conservative
            // tolerance and test values while retaining the full range on the certificate.
            const numeric = values.length ? Math.max(...values.map(Number)) : NaN;
            if (!Number.isFinite(numeric)) return range.fallback;
            return Math.min(range.max, Math.max(range.min, numeric));
        };

        const formatRMTCNumber = (value, decimals = 1) => {
            const fixed = Number(value).toFixed(decimals);
            return fixed.replace(/\.0$/, "");
        };

        const pickRMTCBandValue = (thickness, bands) => {
            const band = bands.find(item => thickness <= item.max) || bands[bands.length - 1];
            return band.value;
        };

        const getRMTCMaterialThicknessText = (value, materialKey) => {
            const rawValue = String(value || "").trim();
            if (!rawValue) return "";
            const allowedRange = getRMTCThicknessRange(materialKey);
            const values = rawValue.match(/\d+(?:\.\d+)?/g) || [];
            if (!values.length) return rawValue.toUpperCase();
            const normalisedValues = values.slice(0, 2).map(item => {
                const thickness = Math.min(allowedRange.max, Math.max(allowedRange.min, Number(item)));
                return formatRMTCNumber(thickness, Number.isInteger(thickness) ? 0 : 1);
            });
            return normalisedValues.length > 1
                ? `${normalisedValues[0]} MM TO ${normalisedValues[1]} MM`
                : `${normalisedValues[0]} MM`;
        };

        const hasRMTCValue = value => value !== null && value !== undefined && String(value).trim() !== "";

        const getBakeliteTolerance = (thicknessValue) => {
            const thickness = parseRMTCThickness(thicknessValue, "Bakelite");
            if (thickness <= 1) return "Thickness tolerance: +/- 0.10 mm.";
            if (thickness <= 3) return "Thickness tolerance: +/- 0.15 mm.";
            if (thickness <= 10) return "Thickness tolerance: +/- 0.25 mm.";
            if (thickness <= 25) return "Thickness tolerance: +/- 0.50 mm.";
            if (thickness <= 50) return "Thickness tolerance: +/- 0.80 mm.";
            return "Thickness tolerance: +/- 1.00 mm.";
        };

        const getBakeliteAutoTests = (thicknessValue) => {
            const thickness = parseRMTCThickness(thicknessValue, "Bakelite");
            const crossRequired = pickRMTCBandValue(thickness, [
                { max: 1, value: 142 },
                { max: 3, value: 136 },
                { max: 10, value: 132 },
                { max: 25, value: 125 },
                { max: 50, value: 118 },
                { max: 80, value: 110 }
            ]);
            const shearRequired = pickRMTCBandValue(thickness, [
                { max: 1, value: 82 },
                { max: 3, value: 79 },
                { max: 10, value: 77.9 },
                { max: 25, value: 74 },
                { max: 50, value: 70 },
                { max: 80, value: 66 }
            ]);
            const waterRequired = pickRMTCBandValue(thickness, [
                { max: 1, value: 175 },
                { max: 3, value: 220 },
                { max: 10, value: 255 },
                { max: 25, value: 320 },
                { max: 50, value: 420 },
                { max: 80, value: 520 }
            ]);
            const insulationRequired = pickRMTCBandValue(thickness, [
                { max: 3, value: 22 },
                { max: 10, value: 20 },
                { max: 25, value: 18 },
                { max: 50, value: 15 },
                { max: 80, value: 12 }
            ]);
            const electricRequired = pickRMTCBandValue(thickness, [
                { max: 1, value: 16 },
                { max: 3, value: 14 },
                { max: 10, value: 10 },
                { max: 25, value: 8 },
                { max: 50, value: 6.5 },
                { max: 80, value: 5 }
            ]);
            const specificGravity = thickness <= 10 ? "1.32" : thickness <= 30 ? "1.33" : "1.34";
            const crossBreaking = crossRequired + pickRMTCBandValue(thickness, [
                { max: 3, value: 2.6 },
                { max: 10, value: 2.2 },
                { max: 25, value: 1.8 },
                { max: 50, value: 1.5 },
                { max: 80, value: 1.2 }
            ]);
            const shear = shearRequired + pickRMTCBandValue(thickness, [
                { max: 3, value: 1.8 },
                { max: 10, value: 1.5 },
                { max: 25, value: 1.2 },
                { max: 50, value: 1 },
                { max: 80, value: 0.8 }
            ]);
            const waterAbsorption = Math.max(95, waterRequired - pickRMTCBandValue(thickness, [
                { max: 3, value: 35 },
                { max: 10, value: 45 },
                { max: 25, value: 55 },
                { max: 50, value: 65 },
                { max: 80, value: 75 }
            ]));
            const electricFlatwise = electricRequired + pickRMTCBandValue(thickness, [
                { max: 3, value: 1.2 },
                { max: 10, value: 1 },
                { max: 25, value: 0.8 },
                { max: 50, value: 0.6 },
                { max: 80, value: 0.5 }
            ]);
            return [
                { property: "Cross Breaking Strength", unit: "MPa", observed: `${formatRMTCNumber(crossBreaking)} MIN`, required: `${formatRMTCNumber(crossRequired)} MIN` },
                { property: "Shear Strength Flatwise", unit: "MPa", observed: `${formatRMTCNumber(shear)} MIN`, required: `${formatRMTCNumber(shearRequired)} MIN` },
                { property: "Water absorption at 27 C", unit: "mg", observed: `${formatRMTCNumber(waterAbsorption)} mg`, required: `${formatRMTCNumber(waterRequired)} mg MAX` },
                { property: "Insulation Resistance at 27 C", unit: "megaohms", observed: `${formatRMTCNumber(insulationRequired + 3)} megaohms MIN`, required: `${formatRMTCNumber(insulationRequired)} megaohms MIN` },
                { property: "Electric Strength in oil at 90 C - Flatwise", unit: "MV/m", observed: `${formatRMTCNumber(electricFlatwise)} MIN`, required: `${formatRMTCNumber(electricRequired)} MIN` },
                { property: "Electric Strength in oil at 90 C - Edgewise", unit: "KV", observed: "COMPLIES", required: "COMPLIES" },
                { property: "Heat Ageing Test at 275 C", unit: "Min./Hrs.", observed: "NO EFFECT", required: "26 MINIMUM" },
                { property: "Shearing & Punching", unit: "--", observed: thickness <= 12 ? "GOOD" : "GOOD / MACHINABLE", required: "GOOD" },
                { property: "Bow", unit: "%", observed: "NIL", required: "NIL" },
                { property: "Twist", unit: "%", observed: "NIL", required: "NIL" },
                { property: "Specific Gravity", unit: "gm/cc", observed: specificGravity, required: "1.32-1.40" },
                { property: "Resistance to hot oil", unit: "--", observed: "Not splitting, blistering etc.", required: "Complies" }
            ];
        };

        const getGlassEpoxyTolerance = (thicknessValue) => {
            const thickness = parseRMTCThickness(thicknessValue, "GlassEpoxy");
            if (thickness <= 3) return "Thickness tolerance: +/- 0.15 mm.";
            if (thickness <= 10) return "Thickness tolerance: +/- 0.25 mm.";
            if (thickness <= 25) return "Thickness tolerance: +/- 0.40 mm.";
            if (thickness <= 50) return "Thickness tolerance: +/- 0.60 mm.";
            return "Thickness tolerance: +/- 0.80 mm.";
        };

        const getGlassEpoxyAutoTests = (thicknessValue) => {
            const thickness = parseRMTCThickness(thicknessValue, "GlassEpoxy");
            const tensileRequired = pickRMTCBandValue(thickness, [
                { max: 3, value: 260 },
                { max: 10, value: 240 },
                { max: 25, value: 220 },
                { max: 50, value: 194 },
                { max: 80, value: 185 }
            ]);
            const glassContentRequired = pickRMTCBandValue(thickness, [
                { max: 10, value: 42 },
                { max: 25, value: 41 },
                { max: 80, value: 40 }
            ]);
            const waterRequired = pickRMTCBandValue(thickness, [
                { max: 3, value: 0.18 },
                { max: 10, value: 0.2 },
                { max: 25, value: 0.25 },
                { max: 50, value: 0.3 },
                { max: 80, value: 0.35 }
            ]);
            const dielectricRequired = pickRMTCBandValue(thickness, [
                { max: 3, value: 30 },
                { max: 10, value: 28 },
                { max: 25, value: 25 },
                { max: 50, value: 22 },
                { max: 80, value: 20 }
            ]);
            const flexuralRequired = pickRMTCBandValue(thickness, [
                { max: 3, value: 3800 },
                { max: 10, value: 3650 },
                { max: 25, value: 3500 },
                { max: 50, value: 3350 },
                { max: 80, value: 3200 }
            ]);
            const impactRequired = pickRMTCBandValue(thickness, [
                { max: 10, value: 50 },
                { max: 25, value: 48 },
                { max: 50, value: 45 },
                { max: 80, value: 42 }
            ]);
            const compressiveRequired = pickRMTCBandValue(thickness, [
                { max: 10, value: 1750 },
                { max: 25, value: 1680 },
                { max: 50, value: 1600 },
                { max: 80, value: 1500 }
            ]);
            const permittivityRequired = pickRMTCBandValue(thickness, [
                { max: 10, value: 5 },
                { max: 25, value: 5.2 },
                { max: 80, value: 5.4 }
            ]);
            return [
                { property: "Tensile strength", unit: "N/Sq.mm", observed: formatRMTCNumber(tensileRequired + 2.5), required: `${formatRMTCNumber(tensileRequired)} MIN` },
                { property: "Glass content", unit: "%", observed: `${formatRMTCNumber(glassContentRequired + 0.5)}%`, required: `${formatRMTCNumber(glassContentRequired)}% MIN` },
                { property: "Water absorption at 24 HRS", unit: "D-570", observed: `${formatRMTCNumber(Math.max(0.08, waterRequired - 0.04), 2)}%`, required: `${formatRMTCNumber(waterRequired, 2)}% MAX` },
                { property: "Insulation Resistance at room temp 230 C", unit: "MOhm at 500 volt DC", observed: "4 x 10^4 MOhm MIN", required: "1 x 10^4 MOhm MIN" },
                { property: "DI-Electric Strength in oil at 90 C", unit: "KV/mm", observed: formatRMTCNumber(dielectricRequired + 0.8, 2), required: `${formatRMTCNumber(dielectricRequired, 2)} MIN` },
                { property: "Tracking index Volts", unit: "IEC-112", observed: "635 MIN", required: "600 MIN" },
                { property: "Flexural strength", unit: "kg/sq.mm", observed: formatRMTCNumber(flexuralRequired + 45), required: `${formatRMTCNumber(flexuralRequired)} MIN` },
                { property: "Specific gravity", unit: "GM/CC", observed: thickness <= 25 ? "1.80" : "1.82", required: "1.70-1.90" },
                { property: "Impact strength IZOD", unit: "Joules", observed: formatRMTCNumber(impactRequired + 2.1, 1), required: `${formatRMTCNumber(impactRequired)} MIN` },
                { property: "Compressive strength", unit: "Kg/sq.cm", observed: formatRMTCNumber(compressiveRequired + 55), required: `${formatRMTCNumber(compressiveRequired)} MIN` },
                { property: "Permittivity at room", unit: "Seconds", observed: formatRMTCNumber(permittivityRequired - 0.15, 2), required: `${formatRMTCNumber(permittivityRequired, 1)} MAX` }
            ];
        };

        const getRMTCMaterialTolerance = (materialKey, thicknessValue) => {
            return materialKey === "GlassEpoxy" ? getGlassEpoxyTolerance(thicknessValue) : getBakeliteTolerance(thicknessValue);
        };

        const getRMTCMaterialTests = (materialKey, thicknessValue) => {
            return materialKey === "GlassEpoxy" ? getGlassEpoxyAutoTests(thicknessValue) : getBakeliteAutoTests(thicknessValue);
        };

        const RMTC_MATERIAL_TEMPLATES = {
            Bakelite: {
                label: "Bakelite / Phenolic Sheet",
                details: {
                    materialKey: "Bakelite",
                    providerName: "ARCHIDPLY INDUSTRIES LTD.",
                    providerLocation: "",
                    customerName: "K.D. ENTERPRISES",
                    refNo: `KD-RMTC-BP-${new Date().getFullYear()}-001`,
                    certificateDate: new Date().toISOString().slice(0, 10),
                    generatedDate: new Date().toISOString().slice(0, 10),
                    productName: "Bakelite / Phenolic Sheet",
                    codeNo: "P1",
                    grade: "P1",
                    thickness: "5.0",
                    lotNo: "",
                    colour: "RED / COFFEE / BLACK",
                    quantity: "",
                    invoiceNo: "",
                    specification: "Conforms to specification IS 2036-1995 for grade P1",
                    tolerance: getBakeliteTolerance("5.0"),
                    remarks: "Material supplied to K.D. Enterprises against the above product details and supplier raw material test data.",
                    authorisedBy: "",
                    authorisedRole: "Authorised Signatory",
                    showCompanyStamp: false,
                    stampText: "ARCHIDPLY INDUSTRIES LTD."
                },
                tests: getBakeliteAutoTests("5.0")
            },
            GlassEpoxy: {
                label: "Glass Epoxy Sheet",
                details: {
                    materialKey: "GlassEpoxy",
                    providerName: "FIBER GLASS INSULATION PRODUCTS",
                    providerLocation: "INDIA",
                    customerName: "K.D. ENTERPRISES",
                    refNo: `KD-RMTC-GE-${new Date().getFullYear()}-001`,
                    certificateDate: new Date().toISOString().slice(0, 10),
                    generatedDate: new Date().toISOString().slice(0, 10),
                    productName: "Glass Epoxy Sheet",
                    codeNo: "IP5001",
                    grade: "FRP & FR4",
                    thickness: "5.0",
                    lotNo: "",
                    colour: "GREY",
                    quantity: "",
                    invoiceNo: "",
                    specification: "Conforms to specification IS 2036-1995 for grade FRP & FR4",
                    tolerance: getGlassEpoxyTolerance("5.0"),
                    remarks: "Material supplied to K.D. Enterprises against the above product details and supplier raw material test data.",
                    authorisedBy: "",
                    authorisedRole: "Authorised Signatory",
                    showCompanyStamp: false,
                    stampText: "FIBER GLASS INSULATION PRODUCTS"
                },
                tests: getGlassEpoxyAutoTests("5.0")
            }
        };

        const createDefaultRMTCDraft = (materialKey = "Bakelite") => {
            const selectedKey = RMTC_MATERIAL_TEMPLATES[materialKey] ? materialKey : "Bakelite";
            const template = RMTC_MATERIAL_TEMPLATES[selectedKey];
            const today = new Date().toISOString().slice(0, 10);
            return {
                details: {
                    ...template.details,
                    materialKey: selectedKey,
                    certificateDate: today,
                    generatedDate: today,
                    tolerance: getRMTCMaterialTolerance(selectedKey, template.details.thickness)
                },
                tests: getRMTCMaterialTests(selectedKey, template.details.thickness)
            };
        };

        const normaliseRMTCDraft = (draft) => {
            const selectedKey = draft && draft.details && RMTC_MATERIAL_TEMPLATES[draft.details.materialKey] ? draft.details.materialKey : "Bakelite";
            const defaults = createDefaultRMTCDraft(selectedKey);
            return {
                details: { ...defaults.details, ...(draft && draft.details ? draft.details : {}), materialKey: selectedKey },
                tests: Array.isArray(draft && draft.tests) && draft.tests.length
                    ? draft.tests.map(test => ({ property: "", unit: "", observed: "", required: "", ...test }))
                    : defaults.tests
            };
        };

        const RMTCSection = () => {
            useLucide();
            const [draft, setDraft] = useState(() => {
                try {
                    return normaliseRMTCDraft(JSON.parse(localStorage.getItem("kd_rmtc_draft") || "null"));
                } catch (error) {
                    return createDefaultRMTCDraft();
                }
            });
            const { details, tests } = draft;
            const selectedTemplate = RMTC_MATERIAL_TEMPLATES[details.materialKey] || RMTC_MATERIAL_TEMPLATES.Bakelite;
            const materialOptions = Object.entries(RMTC_MATERIAL_TEMPLATES);
            const materialThicknessText = getRMTCMaterialThicknessText(details.thickness, details.materialKey);
            const autoValueNote = details.materialKey === "GlassEpoxy"
                ? "Glass Epoxy / FRP report values auto-populate from material thickness between 2 mm and 80 mm."
                : "Bakelite report values auto-populate from material thickness between 0.5 mm and 80 mm.";
            const updateDetail = (field, value) => setDraft(prev => {
                const nextDetails = { ...prev.details, [field]: value };
                if (field === "thickness") {
                    return {
                        ...prev,
                        details: { ...nextDetails, tolerance: getRMTCMaterialTolerance(nextDetails.materialKey, value) },
                        tests: getRMTCMaterialTests(nextDetails.materialKey, value)
                    };
                }
                return { ...prev, details: nextDetails };
            });
            const updateTest = (index, field, value) => setDraft(prev => ({
                ...prev,
                tests: prev.tests.map((test, testIndex) => testIndex === index ? { ...test, [field]: value } : test)
            }));
            const refreshAutoValues = () => setDraft(prev => ({
                ...prev,
                details: { ...prev.details, tolerance: getRMTCMaterialTolerance(prev.details.materialKey, prev.details.thickness) },
                tests: getRMTCMaterialTests(prev.details.materialKey, prev.details.thickness)
            }));
            const addTest = () => setDraft(prev => ({ ...prev, tests: [...prev.tests, { property: "New test parameter", unit: "", observed: "", required: "" }] }));
            const removeTest = index => setDraft(prev => ({ ...prev, tests: prev.tests.filter((_, testIndex) => testIndex !== index) }));
            const changeMaterial = (materialKey) => setDraft(prev => {
                const next = createDefaultRMTCDraft(materialKey);
                return {
                    ...next,
                    details: {
                        ...next.details,
                        certificateDate: prev.details.certificateDate || next.details.certificateDate,
                        generatedDate: prev.details.generatedDate || next.details.generatedDate
                    }
                };
            });
            const saveDraft = () => localStorage.setItem("kd_rmtc_draft", JSON.stringify(draft));
            const resetDraft = () => setDraft(createDefaultRMTCDraft(details.materialKey));
            const certificateRows = [
                ["Customer's Name", details.customerName],
                ["Material Type", details.productName],
                ["Code No.", details.codeNo],
                ["Grade", details.grade],
                ["Material Thickness", materialThicknessText],
                ["Lot / Load No.", details.lotNo],
                ["Colour", details.colour],
                ["Quantity", details.quantity],
                ["Invoice No.", details.invoiceNo],
                ["Specification", details.specification],
                ["Tolerance", details.tolerance]
            ].filter(([, value]) => hasRMTCValue(value));
            const visibleTests = tests.filter(test => [test.property, test.unit, test.observed, test.required].some(hasRMTCValue));
            const showStamp = Boolean(details.showCompanyStamp && hasRMTCValue(details.stampText));
            const showGeneratedDetails = hasRMTCValue(details.customerName) || hasRMTCValue(details.certificateDate);
            const showSignatureDetails = hasRMTCValue(details.providerName) || hasRMTCValue(details.authorisedBy) || hasRMTCValue(details.authorisedRole) || showStamp;

            return (
                <div className="pt-32 pb-24 bg-slate-100 min-h-screen print-page-wrap">
                    <div className="no-print">
                        <SectionTitle eyebrow="Admin Access Only" title="Raw Material Test Certificate" subtitle="Generate editable RMTC reports for Bakelite / Phenolic and Glass Epoxy sheets with supplier-wise test data." />
                    </div>
                    <div className="rmtc-page-grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid xl:grid-cols-[480px_1fr] gap-6">
                        <div className="space-y-5 no-print">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600">RMTC</p>
                                        <h3 className="text-xl font-extrabold text-slate-950">Certificate Setup</h3>
                                    </div>
                                    <Tag tone="blue">{selectedTemplate.label}</Tag>
                                </div>
                                <label className="block">
                                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Material Template</span>
                                    <select value={details.materialKey} onChange={(e) => changeMaterial(e.target.value)} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500">
                                        {materialOptions.map(([key, template]) => <option key={key} value={key}>{template.label}</option>)}
                                    </select>
                                </label>
                                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                                    <AdminField label="Certificate Date" type="date" value={details.certificateDate} onChange={(value) => updateDetail("certificateDate", value)} />
                                    <AdminField label="Generated Date" type="date" value={details.generatedDate} onChange={(value) => updateDetail("generatedDate", value)} />
                                    <AdminField label="Customer" value={details.customerName} onChange={(value) => updateDetail("customerName", value)} />
                                    <AdminField label="Material Thickness / Range" value={details.thickness} onChange={(value) => updateDetail("thickness", value)} />
                                </div>
                                <div className="mt-3 space-y-3">
                                    <AdminField label="Certificate Provider" value={details.providerName} onChange={(value) => updateDetail("providerName", value)} />
                                    <AdminField label="Provider Location" value={details.providerLocation} onChange={(value) => updateDetail("providerLocation", value)} />
                                </div>
                                <p className="mt-3 text-xs font-bold text-blue-700">{autoValueNote} Enter a single value or a range, for example 5 mm to 12 mm. Ranges use their upper value for auto-filled results.</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                                <h3 className="font-extrabold text-lg text-slate-950 mb-4">Product & Batch Details</h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <AdminField label="Product Name" value={details.productName} onChange={(value) => updateDetail("productName", value)} />
                                    <AdminField label="Code No." value={details.codeNo} onChange={(value) => updateDetail("codeNo", value)} />
                                    <AdminField label="Grade" value={details.grade} onChange={(value) => updateDetail("grade", value)} />
                                    <AdminField label="Colour" value={details.colour} onChange={(value) => updateDetail("colour", value)} />
                                    <AdminField label="Quantity" value={details.quantity} onChange={(value) => updateDetail("quantity", value)} />
                                    <AdminField label="Lot / Load No." value={details.lotNo} onChange={(value) => updateDetail("lotNo", value)} />
                                    <AdminField label="Invoice No." value={details.invoiceNo} onChange={(value) => updateDetail("invoiceNo", value)} />
                                </div>
                                <div className="mt-3 space-y-3">
                                    <AdminField label="Specification" rows="2" value={details.specification} onChange={(value) => updateDetail("specification", value)} />
                                    <AdminField label="Thickness / Size Tolerance" rows="2" value={details.tolerance} onChange={(value) => updateDetail("tolerance", value)} />
                                    <AdminField label="Remarks" rows="3" value={details.remarks} onChange={(value) => updateDetail("remarks", value)} />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <h3 className="font-extrabold text-lg text-slate-950">Test Report Values</h3>
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={refreshAutoValues} className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700 hover:bg-blue-100">Auto-fill</button>
                                        <button type="button" onClick={addTest} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50">Add Row</button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {tests.map((test, index) => (
                                        <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                            <div className="grid sm:grid-cols-[1fr_110px] gap-2">
                                                <input value={test.property} onChange={(e) => updateTest(index, "property", e.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Property" />
                                                <input value={test.unit} onChange={(e) => updateTest(index, "unit", e.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Unit" />
                                            </div>
                                            <div className="grid grid-cols-[1fr_1fr_34px] gap-2 mt-2">
                                                <input value={test.observed} onChange={(e) => updateTest(index, "observed", e.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Observed value" />
                                                <input value={test.required} onChange={(e) => updateTest(index, "required", e.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Required value" />
                                                <button type="button" onClick={() => removeTest(index)} className="rounded-md border border-red-200 bg-white text-red-700 hover:bg-red-50 flex items-center justify-center" aria-label="Remove test row"><Icon name="x" className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                                    <AdminField label="Authorised By" value={details.authorisedBy} onChange={(value) => updateDetail("authorisedBy", value)} />
                                    <AdminField label="Authorised Role" value={details.authorisedRole} onChange={(value) => updateDetail("authorisedRole", value)} />
                                </div>
                                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <label className="flex cursor-pointer items-center gap-3 text-sm font-extrabold text-slate-700">
                                        <input type="checkbox" checked={Boolean(details.showCompanyStamp)} onChange={(e) => updateDetail("showCompanyStamp", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500" />
                                        Add circular company stamp beside authorised signatory
                                    </label>
                                    {details.showCompanyStamp && <div className="mt-3"><AdminField label="Company Stamp Text" value={details.stampText} onChange={(value) => updateDetail("stampText", value)} /></div>}
                                </div>
                                <div className="grid sm:grid-cols-3 gap-3 mt-4">
                                    <button type="button" onClick={saveDraft} className="rounded-md bg-slate-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-slate-800">Save Draft</button>
                                    <button type="button" onClick={() => window.print()} className="rounded-md bg-blue-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-blue-600">Print / PDF</button>
                                    <button type="button" onClick={resetDraft} className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50">Reset</button>
                                </div>
                            </div>
                        </div>

                        <div className="print-document rmtc-print-document bg-white border border-slate-300 overflow-hidden">
                            <div className="rmtc-document-content rmtc-print-body p-10">
                                <div className="text-center">
                                    {hasRMTCValue(details.providerName) && <div className="rmtc-provider-name">{details.providerName}</div>}
                                    {hasRMTCValue(details.providerLocation) && <div className="rmtc-provider-location">{details.providerLocation}</div>}
                                </div>

                                {hasRMTCValue(details.generatedDate || details.certificateDate) && <div className="rmtc-date-row">
                                    <span>Date: {formatDate(details.generatedDate || details.certificateDate)}</span>
                                </div>}

                                {certificateRows.length > 0 && <table className="rmtc-detail-table mt-6">
                                    <tbody>
                                        {certificateRows.map(([label, value], index) => (
                                            <tr key={label}>
                                                <td className="rmtc-row-no">{index + 1})</td>
                                                <td className="rmtc-row-label">{label}</td>
                                                <td className="rmtc-row-colon">:</td>
                                                <td>{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>}

                                {visibleTests.length > 0 && <div className="rmtc-print-section mt-6">
                                    <table className="rmtc-print-table">
                                        <colgroup>
                                            <col style={{ width: "7%" }} />
                                            <col style={{ width: "39%" }} />
                                            <col style={{ width: "15%" }} />
                                            <col style={{ width: "20%" }} />
                                            <col style={{ width: "19%" }} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                {["Sr. No.", "Properties", "Units", "Observed Values", "Required Values"].map(head => <th key={head}>{head}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visibleTests.map((test, index) => (
                                                <tr key={index}>
                                                    <td className="text-center">{index + 1}</td>
                                                    <td>{test.property}</td>
                                                    <td>{test.unit}</td>
                                                    <td>{test.observed}</td>
                                                    <td>{test.required}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>}

                                {(hasRMTCValue(details.tolerance) || hasRMTCValue(details.remarks)) && <div className="rmtc-note-box mt-5 text-sm leading-snug">
                                    {hasRMTCValue(details.tolerance) && <p><strong>Note:</strong> {details.tolerance}</p>}
                                    {hasRMTCValue(details.remarks) && <p className={hasRMTCValue(details.tolerance) ? "mt-2" : ""}><strong>Remarks:</strong> {details.remarks}</p>}
                                </div>}

                                {(showGeneratedDetails || showSignatureDetails) && <div className="rmtc-signature-grid mt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 text-sm">
                                    {showGeneratedDetails && <div>
                                        {hasRMTCValue(details.customerName) && <p><strong>Generated For:</strong> {details.customerName}</p>}
                                        {hasRMTCValue(details.certificateDate) && <p className={hasRMTCValue(details.customerName) ? "mt-1" : ""}><strong>Certificate Date:</strong> {formatDate(details.certificateDate)}</p>}
                                    </div>}
                                    {showSignatureDetails && <div className="rmtc-signature-block min-w-[260px] text-right">
                                        {hasRMTCValue(details.providerName) && <p>For {details.providerName}</p>}
                                        <div className="rmtc-signature-area">
                                            {showStamp && <div className="rmtc-company-stamp" aria-label={`Company stamp: ${details.stampText}`}>
                                                <svg viewBox="0 0 110 110" role="img">
                                                    <defs><path id="rmtc-stamp-circle" d="M 55,8 A 47,47 0 1,1 54.9,8" /></defs>
                                                    <circle cx="55" cy="55" r="49" />
                                                    <circle cx="55" cy="55" r="37" />
                                                    <text className="rmtc-company-stamp-ring"><textPath href="#rmtc-stamp-circle" startOffset="50%" textAnchor="middle">{details.stampText.toUpperCase()}</textPath></text>
                                                    <text className="rmtc-company-stamp-centre" x="55" y="51" textAnchor="middle">COMPANY</text>
                                                    <text className="rmtc-company-stamp-centre" x="55" y="64" textAnchor="middle">STAMP</text>
                                                </svg>
                                            </div>}
                                            {hasRMTCValue(details.authorisedBy) && <div className="rmtc-signature-name">{details.authorisedBy}</div>}
                                        </div>
                                        {(hasRMTCValue(details.authorisedBy) || hasRMTCValue(details.authorisedRole)) && <div className="border-t border-slate-500 pt-2 mt-2">
                                            {hasRMTCValue(details.authorisedBy) && <p><strong>{details.authorisedBy}</strong></p>}
                                            {hasRMTCValue(details.authorisedRole) && <p>{details.authorisedRole}</p>}
                                        </div>
                                        }
                                    </div>}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const ProcessingCostModal = ({ values, labels, onChange, onClose, total, notes, onNotesChange, presetName, setPresetName, presets, onSavePreset, onApplyPreset }) => (
            <div className="fixed inset-0 z-[70] bg-slate-950/70 p-4 flex items-center justify-center" onClick={onClose}>
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600">Processing</p>
                            <h3 className="text-xl font-extrabold text-slate-950">Processing Cost Details</h3>
                        </div>
                        <button type="button" onClick={onClose} className="rounded-md p-2 hover:bg-slate-100"><Icon name="x" className="w-5 h-5" /></button>
                    </div>
                    <div className="p-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                            {Object.entries(labels).map(([key, label]) => (
                                <label key={key} className="block">
                                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{label}</span>
                                    <div className="mt-1 flex rounded-md border border-slate-200 bg-white overflow-hidden focus-within:border-blue-500">
                                        <input type="number" value={values[key]} onChange={(e) => onChange(key, e.target.value)} className="w-full px-3 py-2.5 outline-none" />
                                        <span className="px-3 py-2.5 bg-slate-50 text-slate-500 text-sm font-bold border-l border-slate-200">INR</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div className="mt-5 rounded-lg bg-slate-900 p-4 text-white flex items-center justify-between gap-4">
                            <span className="font-extrabold">Processing total</span>
                            <span className="text-2xl font-extrabold">₹{Number(total || 0).toFixed(2)}</span>
                        </div>
                        <label className="block mt-5">
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Processing Notes</span>
                            <textarea value={notes} onChange={(e) => onNotesChange(e.target.value)} rows="3" className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 outline-none focus:border-blue-500" placeholder="Operation notes, drawing remarks, assumptions..."></textarea>
                        </label>
                        <div className="grid sm:grid-cols-[1fr_160px] gap-3 mt-4">
                            <input value={presetName} onChange={(e) => setPresetName(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" placeholder="Preset name e.g. Solar mounting plate" />
                            <button type="button" onClick={onSavePreset} className="rounded-md border border-slate-300 px-3 py-2 font-extrabold text-slate-700 hover:bg-slate-50">Save as preset</button>
                        </div>
                        <div className="mt-3">
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Apply preset</span>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {["Simple cut", "Electrical panel cut", "Heavy drilling", "Solar mounting plate", "FRP panel cutting"].map(name => (
                                    <button key={name} type="button" onClick={() => onApplyPreset(name)} className="rounded border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50">{name}</button>
                                ))}
                                {presets.map(preset => (
                                    <button key={preset.name} type="button" onClick={() => onApplyPreset(preset.name)} className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800">{preset.name}</button>
                                ))}
                            </div>
                        </div>
                        <button type="button" onClick={onClose} className="mt-5 w-full rounded-md bg-blue-700 px-4 py-3 font-extrabold text-white hover:bg-blue-600">Done</button>
                    </div>
                </div>
            </div>
        );

        const CalcStep = ({ number, title, children }) => (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-md bg-blue-700 text-white flex items-center justify-center font-extrabold text-sm">{number}</span>
                    <h3 className="font-extrabold text-lg text-slate-950">{title}</h3>
                </div>
                {children}
            </div>
        );

        const CostInput = ({ label, type, typeName, valueName, value, setField, handleNumber }) => (
            <div>
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{label}</span>
                <div className="grid grid-cols-[120px_1fr] gap-2 mt-1">
                    <select value={type} onChange={(e) => setField(typeName, e.target.value)} className="px-3 py-2.5 rounded-md border border-slate-200 bg-white outline-none focus:border-blue-500">
                        <option value="fixed">Fixed INR</option>
                        <option value="percent">Percentage %</option>
                    </select>
                    <input name={valueName} type="number" value={value} onChange={handleNumber} className="px-3 py-2.5 rounded-md border border-slate-200 bg-white outline-none focus:border-blue-500" />
                </div>
            </div>
        );

        const Metric = ({ label, value, highlight }) => (
            <div className={`${highlight ? "bg-blue-700 text-white" : "bg-slate-50 text-slate-950"} border border-slate-200 rounded-lg p-4`}>
                <p className={`${highlight ? "text-blue-100" : "text-slate-500"} text-xs font-extrabold uppercase tracking-wider`}>{label}</p>
                <p className="text-xl font-extrabold mt-1">{value}</p>
            </div>
        );

        const PriceRow = ({ label, value }) => (
            <tr className="border-b border-slate-100">
                <td className="p-3 text-slate-600 font-semibold">{label}</td>
                <td className="p-3 text-right font-extrabold text-slate-950">{value}</td>
            </tr>
        );

        const InfoRow = ({ label, value }) => (
            <div className="grid grid-cols-[132px_1fr] gap-3 p-3">
                <span className="text-slate-600 font-semibold">{label}</span>
                <span className="text-right font-extrabold text-slate-950">{value}</span>
            </div>
        );

        const AboutUs = () => (
            <div className="pt-32 pb-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
                    <div>
                        <img src="products/warehouse.png" alt="KD Enterprises warehouse" className="rounded-xl shadow-2xl w-full border border-slate-200" />
                    </div>
                    <div>
                        <SectionTitle align="left" eyebrow="About KD Enterprises" title="Supply & Processing for Industrial Plastic Materials" subtitle="We help industrial buyers source the right sheet, rod or processed plastic component with practical support for cutting, drilling, mounting holes, slot cutting and drawing/sample-based requirements." />
                        <div className="grid sm:grid-cols-2 gap-4">
                            {["Electrical insulation", "Solar mounting plates", "Manufacturing spares", "Custom cut components"].map(item => (
                                <div key={item} className="border-l-4 border-blue-700 bg-slate-50 p-4 rounded-r-lg">
                                    <p className="font-extrabold text-slate-950">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );

        const TeamSection = () => (
            <div className="pt-32 pb-24 bg-slate-50">
                <SectionTitle eyebrow="Leadership" title="People Behind the Supply" subtitle="A practical team focused on dependable material sourcing, processing quality and dispatch coordination." />
                <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-7">
                    {TEAM.map(member => (
                        <div key={member.name} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center card-rise">
                            <img src={member.img} alt={member.name} className="w-28 h-28 mx-auto mb-6 rounded-full border-4 border-blue-50" />
                            <h3 className="text-xl font-extrabold text-slate-950">{member.name}</h3>
                            <p className="text-blue-700 font-bold mt-1">{member.role}</p>
                            <p className="text-slate-500 text-sm mt-4">Focused on reliable supply, quality processing and responsive customer coordination.</p>
                        </div>
                    ))}
                </div>
            </div>
        );

        const ContactSection = ({ quoteMessage, setQuoteMessage }) => {
            const [formStatus, setFormStatus] = useState("idle");

            const handleSubmit = async (e) => {
                e.preventDefault();
                setFormStatus("sending");
                try {
                    const response = await fetch("https://formspree.io/f/mblvdyan", {
                        method: "POST",
                        body: new FormData(e.target),
                        headers: { Accept: "application/json" }
                    });
                    if (response.ok) {
                        setFormStatus("success");
                        e.target.reset();
                        setQuoteMessage("");
                        setTimeout(() => setFormStatus("idle"), 5000);
                    } else {
                        setFormStatus("error");
                    }
                } catch (error) {
                    setFormStatus("error");
                }
            };

            return (
                <div className="min-h-screen bg-slate-100 pb-24 pt-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.85fr_1.15fr]">
                            <div className="bg-slate-900 text-white p-8 md:p-12">
                                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-blue-300 mb-4">Request Quote</p>
                                <h2 className="text-3xl font-extrabold mb-5">Share your size, thickness and quantity requirements.</h2>
                                <p className="text-slate-300 mb-10">Our team can quote sheet supply, custom cutting, drilling, mounting holes, slot cutting and drawing/sample-based components.</p>
                                <ContactItem icon="message-circle" title="Urgent Enquiries Only" lines={["For urgent enquiries only, message us on WhatsApp: +91 86830 08266"]} />
                                <ContactItem icon="mail" title="Email" lines={[
                                    { text: "kd.enterprises2009@yahoo.in", href: "mailto:kd.enterprises2009@yahoo.in" },
                                    { text: "sales@kd-enterprises.co.in", href: "mailto:sales@kd-enterprises.co.in" }
                                ]} />
                                <ContactItem icon="map-pin" title="Head Office" lines={["St. 3, Plot No. B/41, Ballabgarh,", "Faridabad 121004, Haryana, India"]} />
                                <div className="grid sm:grid-cols-2 gap-3 mt-8">
                                    <a href="https://wa.me/918683008266" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-3 font-extrabold hover:bg-emerald-500 transition">
                                        <BrandIcon brand="whatsapp" /> WhatsApp
                                    </a>
                                    {/* Replace this LinkedIn link here if the official profile changes. */}
                                    <a href="https://www.linkedin.com/company/kd-enterprises-fbd/" target="_blank" rel="noopener noreferrer" aria-label="KD Enterprises on LinkedIn" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-3 font-extrabold hover:bg-blue-600 transition">
                                        <BrandIcon brand="linkedin" /> LinkedIn
                                    </a>
                                </div>
                            </div>
                            <div className="bg-white p-8 md:p-12">
                                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-600">Quotation request</p>
                                <h2 className="mt-3 text-3xl font-extrabold text-slate-950">Send a complete requirement.</h2>
                                <p className="mt-3 text-sm leading-relaxed text-slate-500">Add a drawing or a clear part description so material and processing requirements can be reviewed together.</p>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                                        <FormField label="First Name" name="first_name" placeholder="First name" required />
                                        <FormField label="Last Name" name="last_name" placeholder="Last name" required />
                                    </div>
                                    <div className="grid gap-5 md:grid-cols-2"><FormField label="Company" name="company" placeholder="Company name" required /><FormField label="Phone" name="phone" type="tel" placeholder="Mobile or desk number" required /></div>
                                    <FormField label="Email Address" name="email" type="email" placeholder="name@company.com" required />
                                    <label className="block"><span className="text-sm font-extrabold text-slate-700">Interested In</span>
                                        <select name="interest" className="mt-2 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:border-blue-500 outline-none">
                                            <option>Bulk Order Quote</option>
                                            <option>Custom Fabrication</option>
                                            <option>Cut to Size Requirement</option>
                                            <option>Technical Support</option>
                                            <option>General Inquiry</option>
                                        </select>
                                    </label>
                                    <label className="block"><span className="text-sm font-extrabold text-slate-700">Drawing / reference file</span><input type="file" name="drawing" accept=".pdf,.jpg,.jpeg,.png,.webp" className="mt-2 block w-full border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600 file:mr-4 file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-extrabold file:text-blue-700" /></label>
                                    <label className="block">
                                        <span className="text-sm font-extrabold text-slate-700">Message</span>
                                        <textarea required rows="5" name="message" value={quoteMessage} onChange={(e) => setQuoteMessage(e.target.value)} className="mt-2 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:border-blue-500 outline-none" placeholder="Tell us material, size, thickness, quantity and service required..."></textarea>
                                    </label>
                                    {formStatus === "error" && <p className="text-red-600 font-bold text-sm">Could not send message. Please try again or contact us directly.</p>}
                                    <PrimaryButton type="submit" icon={formStatus === "success" ? "check" : "send"} className={`w-full py-4 ${formStatus === "success" ? "bg-green-700 border-green-700 hover:bg-green-700" : ""}`}>
                                        {formStatus === "sending" ? "Sending..." : formStatus === "success" ? "Message Sent" : "Send Message"}
                                    </PrimaryButton>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const ContactItem = ({ icon, title, lines }) => (
            <div className="flex items-start gap-4 mb-7">
                <div className="bg-blue-700 p-3 rounded-md"><Icon name={icon} className="w-5 h-5" /></div>
                <div>
                    <h4 className="font-extrabold">{title}</h4>
                    {lines.map(line => {
                        const value = typeof line === "string" ? { text: line } : line;
                        return value.href ? (
                            <a key={value.text} href={value.href} className="block text-slate-300 hover:text-white text-sm mt-1 underline-offset-4 hover:underline">{value.text}</a>
                        ) : (
                            <p key={value.text} className="text-slate-300 text-sm mt-1">{value.text}</p>
                        );
                    })}
                </div>
            </div>
        );

        const FormField = ({ label, name, type = "text", placeholder, required }) => (
            <label className="block">
                <span className="text-sm font-extrabold text-slate-700">{label}</span>
                <input required={required} type={type} name={name} className="mt-2 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:border-blue-500 outline-none" placeholder={placeholder} />
            </label>
        );

        const Footer = ({ setTab }) => (
            <footer className="bg-slate-950 text-white pt-14 pb-8 no-print">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-10 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-white p-1">
                                    <KDLogo className="h-full w-full" />
                                </span>
                                <span className="text-xl font-extrabold">KD Enterprises</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">Industrial plastic sheets, processed components and custom fabrication support for B2B buyers.</p>
                        </div>
                        <FooterList title="Explore" items={["Products", "Material Guide", "Services", "About", "Contact"]} setTab={setTab} />
                        <div>
                            <h4 className="font-extrabold mb-4">Materials</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>Bakelite / Phenolic</li><li>FRP & Glass Epoxy</li><li>Acrylic, Nylon, Delrin</li><li>Custom cut components</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-extrabold mb-4">Services</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>Cutting, drilling, mounting holes</li><li>Corner, slot and shape cutting</li><li>Basic deburring after cutting/drilling</li><li>Drawing/sample-based supply</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-6 text-sm text-slate-500">
                        <p>&copy; 2026 KD Enterprises. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        );

        const FooterList = ({ title, items, setTab }) => (
            <div>
                <h4 className="font-extrabold mb-4">{title}</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    {items.map(item => <li key={item}><button onClick={() => setTab(item)} className="hover:text-white transition">{item}</button></li>)}
                </ul>
            </div>
        );

        const App = () => {
            const [activeTab, setTab] = useState("Home");
            const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
            const [quoteMessage, setQuoteMessage] = useState("");
            useLucide();

            useEffect(() => { window.scrollTo(0, 0); }, [activeTab]);

            const requestQuote = (product) => {
                setQuoteMessage(`I am interested in ${product.title}. Please share quotation details for custom size/cut requirements.`);
                setTab("Contact");
            };
            const activeAdminTool = ADMIN_TOOLS.find(tool => tool.key === activeTab);

            return (
                <div className="min-h-screen flex flex-col">
                    <Navigation activeTab={activeTab} setTab={setTab} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
                    <main className="flex-grow">
                        {activeTab === "Home" && <HomePage setTab={setTab} setQuoteMessage={setQuoteMessage} />}
                        {activeTab === "Products" && <ProductGrid onQuote={requestQuote} />}
                        {activeTab === "Material Guide" && <MaterialGuidePage startQuote={(message) => { setQuoteMessage(message); setTab("Contact"); }} />}
                        {activeTab === "Services" && <ServicesPage startQuote={(message) => { setQuoteMessage(message); setTab("Contact"); }} setTab={setTab} />}
                        {activeTab === "About" && <AboutUs />}
                        {activeTab === "Team" && <TeamSection />}
                        {activeTab === "Calculator" && <AdminGate toolTitle={activeAdminTool.title} toolSubtitle="For internal estimation only. Final quotation may vary based on material availability, processing complexity and order quantity."><CalculatorSection /></AdminGate>}
                        {activeTab === "Payslip" && <AdminGate toolTitle={activeAdminTool.title} toolSubtitle="Create and print an editable employee payslip template for internal payroll records."><PayslipSection /></AdminGate>}
                        {activeTab === "PDIR" && <AdminGate toolTitle={activeAdminTool.title} toolSubtitle="Generate a pre-dispatch inspection report for internal quality and dispatch records."><PDIRSection /></AdminGate>}
                        {activeTab === "RMTC" && <AdminGate toolTitle={activeAdminTool.title}><RMTCSection /></AdminGate>}
                        {activeTab === "Contact" && <ContactSection quoteMessage={quoteMessage} setQuoteMessage={setQuoteMessage} />}
                    </main>
                    <Footer setTab={setTab} />
                </div>
            );
        };

        createRoot(document.getElementById("root")).render(<App />);
    
