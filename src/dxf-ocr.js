// Recognition runs in a local browser worker. Only the OCR engine and language
// model are downloaded; the drawing image is not uploaded to a service.
export async function readOutlinedText(pdfjs, file, pageNumber, onProgress) {
    const { createWorker } = await import("tesseract.js");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data: bytes }).promise;
    let worker;
    try {
        const page = await pdf.getPage(pageNumber);
        const base = page.getViewport({ scale: 1 });
        const scale = Math.min(2.5, 3000 / Math.max(base.width, base.height));
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("Could not prepare the drawing for text recognition.");
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: context, viewport, background: "white" }).promise;
        worker = await createWorker("eng", 1, { logger: progress => {
            if (progress.status === "recognizing text") onProgress?.(Math.round(progress.progress * 100));
        } });
        const { data } = await worker.recognize(canvas);
        return data.text || "";
    } finally {
        if (worker) await worker.terminate();
        await pdf.destroy();
    }
}
