/**
 * Downloads a DOM element as a PDF report using html-to-image.
 * This method creates an exact visual replica by using SVG foreignObject,
 * bypassing manual style copying and color conversion issues.
 */
export async function downloadDashboardAsPDF(elementId: string, filename: string) {
    if (typeof window === 'undefined') return;

    // Loading overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999999;font-family:sans-serif;';

    const loader = document.createElement('div');
    loader.style.cssText = 'width:60px;height:60px;border:6px solid #3b82f6;border-bottom-color:transparent;border-radius:50%;animation:spin 1s linear infinite;';
    overlay.appendChild(loader);

    const message = document.createElement('p');
    message.innerText = 'Raporunuz oluşturuluyor...';
    message.style.cssText = 'margin-top:24px;color:#1b0d0e;font-weight:700;font-size:20px;letter-spacing:-0.5px;';
    overlay.appendChild(message);

    const styleTag = document.createElement('style');
    styleTag.innerHTML = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(styleTag);
    document.body.appendChild(overlay);

    try {
        const { toPng } = await import('html-to-image');
        const { jsPDF } = await import('jspdf');

        const original = document.getElementById(elementId);
        if (!original) throw new Error("Target element not found");

        console.log("Starting high-fidelity capture...");

        // Hide non-exportable elements strictly for the capture
        const hiddenElements: HTMLElement[] = [];
        original.querySelectorAll('button, .no-export, .lucide-download, .lucide-share').forEach((el: any) => {
            if (el.style.display !== 'none') {
                el.dataset.originalDisplay = el.style.display;
                el.style.display = 'none';
                hiddenElements.push(el);
            }
        });

        // Generate PNG directly from the DOM node
        // pixelRatio 2 ensures high quality for print
        const dataUrl = await toPng(original, {
            quality: 1.0,
            pixelRatio: 2,
            backgroundColor: '#ffffff', // Ensure white background
            skipFonts: true, // Prevent CORS errors from next/font or external stylesheets
            fontEmbedCSS: '', // Disable font CSS embedding to avoid SecurityError
            style: {
                // Force a fixed width to ensure consistent layout during capture
                // This triggers the "tablet/vertical" layout if responsive
                width: '1000px',
                height: 'auto',
                margin: '0',
                padding: '40px',
                transform: 'none' // Prevent scaling issues
            },
            filter: (node) => {
                // Double safety to exclude buttons if they weren't caught above
                if (node instanceof HTMLElement && (node.tagName === 'BUTTON' || node.classList.contains('no-export'))) {
                    return false;
                }
                return true;
            }
        });

        // Restore hidden elements immediately
        hiddenElements.forEach(el => {
            el.style.display = el.dataset.originalDisplay || '';
        });

        // Multi-page PDF Splitting
        const pdf = new jsPDF('p', 'mm', 'a4');
        const img = new Image();
        img.src = dataUrl;

        await new Promise((resolve) => {
            img.onload = () => {
                const a4W = 210;
                const a4H = 297;
                const margin = 10;
                const contentW = a4W - (margin * 2);
                const contentH = a4H - (margin * 2);

                const imgW = img.width;
                const imgH = img.height;

                // Calculate height in PDF units
                const fullImgHInPdf = (imgH * contentW) / imgW;

                let hLeft = fullImgHInPdf;
                let yPos = margin;
                let pg = 1;

                // First page
                pdf.addImage(dataUrl, 'PNG', margin, yPos, contentW, fullImgHInPdf);
                hLeft -= contentH;

                // Subsequent pages
                while (hLeft > 0) {
                    yPos = margin - (pg * contentH);
                    pdf.addPage();
                    pdf.addImage(dataUrl, 'PNG', margin, yPos, contentW, fullImgHInPdf);
                    hLeft -= contentH;
                    pg++;
                }

                pdf.save(filename);
                console.log(`High-fidelity report generated: ${pg} pages`);
                resolve(null);
            };
        });

    } catch (error) {
        console.error("PDF Native Capture Error:", error);
        alert("Rapor oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
        if (overlay?.parentNode) document.body.removeChild(overlay);
        if (styleTag?.parentNode) document.head.removeChild(styleTag);
    }
}
