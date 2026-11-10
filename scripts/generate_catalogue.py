"""Build the admin catalogue from the products and size options in src/app.jsx."""

import json
import subprocess
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / "src" / "app.jsx").read_text()
PRODUCTS_SOURCE = SOURCE[SOURCE.index("const PRODUCTS = "):SOURCE.index("const TEAM = ")]
SIZES_SOURCE = SOURCE[SOURCE.index("const MATERIAL_SIZES = "):SOURCE.index("const PRODUCT_FILTERS = ")]
NODE_EXTRACT = """
const vm = require('node:vm');
let input = '';
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  const data = vm.runInNewContext(`${input}\n({ PRODUCTS, MATERIAL_SIZES })`);
  process.stdout.write(JSON.stringify(data));
});
"""
data = json.loads(subprocess.run(["node", "-e", NODE_EXTRACT], input=PRODUCTS_SOURCE + SIZES_SOURCE,
                                 text=True, capture_output=True, check=True).stdout)

SIZE_KEYS = {
    "Acrylic Products": "Acrylic Sheet",
    "Nylon Products": "Nylon Sheet",
    "Industrial Rods & Sheets": "Polycarbonate Sheet",
    "Glass Epoxy Sheet": "Glass Epoxy Sheet",
    "Bakelite / Phenolic Sheet": "Bakelite / Phenolic Sheet",
    "Acrylic Sheets": "Acrylic Sheet",
    "Nylon Sheets": "Nylon Sheet",
    "FRP Sheets": "FRP Sheet",
    "Delrin / Acetal Sheets": "Delrin Sheet",
}

navy = colors.HexColor("#102A43")
blue = colors.HexColor("#1D4ED8")
gold = colors.HexColor("#F59E0B")
slate = colors.HexColor("#475569")
paper = colors.HexColor("#F8FAFC")
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CoverTitleKD", fontName="Helvetica-Bold", fontSize=26, leading=30, textColor=navy, spaceAfter=10))
styles.add(ParagraphStyle(name="CoverSubKD", fontName="Helvetica", fontSize=12, leading=17, textColor=slate, spaceAfter=16))
styles.add(ParagraphStyle(name="SectionKD", fontName="Helvetica-Bold", fontSize=15, leading=19, textColor=navy, spaceBefore=15, spaceAfter=5))
styles.add(ParagraphStyle(name="BodyKD", fontName="Helvetica", fontSize=9, leading=13, textColor=slate, spaceAfter=5))
styles.add(ParagraphStyle(name="LabelKD", fontName="Helvetica-Bold", fontSize=8, leading=11, textColor=blue, spaceAfter=3))
styles.add(ParagraphStyle(name="SmallKD", fontName="Helvetica", fontSize=8, leading=11, textColor=slate, spaceAfter=3))
styles.add(ParagraphStyle(name="CenterKD", parent=styles["BodyKD"], alignment=TA_CENTER))


def txt(value):
    return escape(str(value))


def footer(canvas, document):
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(colors.HexColor("#CBD5E1"))
    canvas.line(18 * mm, 17 * mm, width - 18 * mm, 17 * mm)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(slate)
    canvas.drawString(18 * mm, 12 * mm, "KD Enterprises  |  Internal product catalogue")
    canvas.drawRightString(width - 18 * mm, 12 * mm, f"Page {document.page}")
    canvas.restoreState()


output = ROOT / "assets" / "kd-product-catalogue.pdf"
doc = SimpleDocTemplate(str(output), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                        topMargin=20 * mm, bottomMargin=23 * mm, title="KD Enterprises Product Catalogue")
story = []
logo = ROOT / "assets" / "kd-logo-v2.png"
if logo.exists():
    story.append(Image(str(logo), width=45 * mm, height=45 * mm))
    story.append(Spacer(1, 3 * mm))
story.append(Paragraph("Industrial Materials<br/>Product Catalogue", styles["CoverTitleKD"]))
story.append(Paragraph("Sheets, rods and drawing-based industrial plastic components", styles["CoverSubKD"]))
story.append(Paragraph("This catalogue reflects the products and size choices currently listed on the KD Enterprises website. Exact grades, thicknesses, stock availability and processing requirements are confirmed against each enquiry or drawing.", styles["BodyKD"]))

summary = Table([
    [Paragraph("PRODUCTS", styles["LabelKD"]), Paragraph("LISTED SHEET SIZE OPTIONS", styles["LabelKD"]), Paragraph("SERVICES", styles["LabelKD"])],
    [Paragraph(str(len(data["PRODUCTS"])), styles["SectionKD"]),
     Paragraph(str(sum(len(v) for v in data["MATERIAL_SIZES"].values())), styles["SectionKD"]),
     Paragraph("Cutting · drilling · drawing-based supply", styles["SmallKD"])],
], colWidths=[42 * mm, 60 * mm, 70 * mm])
summary.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), paper), ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 9),
    ("RIGHTPADDING", (0, 0), (-1, -1), 9), ("TOPPADDING", (0, 0), (-1, -1), 9),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
]))
story.extend([Spacer(1, 8 * mm), summary, Spacer(1, 8 * mm), Paragraph("Material range", styles["SectionKD"])])
story.append(Paragraph(", ".join(txt(product["title"]) for product in data["PRODUCTS"]), styles["BodyKD"]))
story.append(PageBreak())

for product in data["PRODUCTS"]:
    key = SIZE_KEYS.get(product["title"])
    sizes = data["MATERIAL_SIZES"].get(key, [])
    size_labels = [size["label"] for size in sizes if not size.get("custom")]
    if any(size.get("custom") for size in sizes):
        size_labels.append("Custom size on enquiry")
    size_text = ", ".join(size_labels) if size_labels else "No standard size is listed; enquire with the drawing or specification."
    entries = [
        Paragraph(txt(product["title"]), styles["SectionKD"]),
        Paragraph(txt(product["material"]), styles["LabelKD"]),
        Paragraph(txt(product["desc"]), styles["BodyKD"]),
        Paragraph("<b>Listed sheet sizes:</b> " + txt(size_text), styles["BodyKD"]),
        Paragraph("<b>Applications:</b> " + txt(", ".join(dict.fromkeys(product["applications"]))), styles["BodyKD"]),
        Paragraph("<b>Properties:</b> " + txt(", ".join(dict.fromkeys(product["properties"]))), styles["BodyKD"]),
        Paragraph("<b>Industries:</b> " + txt(", ".join(dict.fromkeys(product["suitableIndustries"]))), styles["BodyKD"]),
        Spacer(1, 3 * mm),
    ]
    story.append(KeepTogether(entries))

story.append(Spacer(1, 5 * mm))
story.append(Paragraph("Size and availability notes", styles["SectionKD"]))
story.append(Paragraph("Dimensions are in millimetres where shown. Some listings provide length and width only; thickness is selected per enquiry. Rod diameters, pipe sizes, tolerances and material grade options are not published in the current website data and should be confirmed with KD Enterprises before ordering.", styles["BodyKD"]))
story.append(Paragraph("Contact: sales@kd-enterprises.co.in  |  kd.enterprises2009@yahoo.in  |  www.kd-enterprises.co.in", styles["SmallKD"]))
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(f"Created {output}")
