import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc =
	"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export const extractTextFromPdfBase64 = async (base64Data) => {
	try {
		const byteCharacters = atob(base64Data);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		const pdf = await pdfjsLib.getDocument({ data: byteArray }).promise;

		let fullText = "";
		for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
			const page = await pdf.getPage(pageNum);
			const content = await page.getTextContent();
			const pageText = content.items.map((item) => item.str).join(" ");
			fullText += `\n\nPage ${pageNum}:\n${pageText}`;
		}
		return fullText;
	} catch (error) {
		console.error("Failed to extract text from PDF:", error);
		return "Could not extract resume text.";
	}
};
