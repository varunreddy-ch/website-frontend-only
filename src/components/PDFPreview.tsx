import { useState } from "react";

interface PDFPreviewProps {
  pdfUrl: string;
}

export default function PDFPreview({ pdfUrl }: PDFPreviewProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading PDF preview...</div>
        </div>
      )}
      <iframe
        src={pdfUrl}
        className="w-full h-full"
        onLoad={() => setLoading(false)}
        title="PDF Preview"
      />
    </div>
  );
}