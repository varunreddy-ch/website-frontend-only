export default function PDFPreview({ pdfUrl }) {
  return pdfUrl ? (
    <iframe src={pdfUrl} className="w-full h-96 border rounded" title="PDF Preview" />
  ) : (
    <p className="text-gray-500 italic">No PDF to preview.</p>
  );
}