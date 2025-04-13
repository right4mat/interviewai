import { useMutation } from '@tanstack/react-query';
import * as pdfjs from 'pdfjs-dist';
import { apiRequest } from "@/utils/util";

// Function to convert PDF to text
async function convertPdfToText(file: File): Promise<string> {
  // Load the PDF file
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  
  // Initialize PDF.js
  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  
  // Extract text from each page
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    
    fullText += pageText + '\n';
  }
  
  return fullText.trim();
}

// Function to convert image to base64
async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Mutation to send converted text or image to the API
export function useReportExtraction() {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileType = file.type;
      
      if (fileType === 'application/pdf') {
        // Handle PDF file
        const text = await convertPdfToText(file);
        return apiRequest("crop-compass/report-extraction", "POST", { reportText: text });
      } else if (fileType.startsWith('image/')) {
        // Handle image file (jpg, png, etc.)
        const base64Image = await convertImageToBase64(file);
        return apiRequest("crop-compass/report-extraction", "POST", { reportImage: base64Image });
      } else {
        throw new Error('Unsupported file type');
      }
    }
  });
}
