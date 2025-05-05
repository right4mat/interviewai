import { useRef, useEffect } from "react";
import supabase from "./supabase";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();


// Make an API request to `/api/{path}`
export async function apiRequest(path: string, method: string = "GET", data?: any): Promise<any> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session ? session.access_token : undefined;

  return fetch(`/api/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  })
    .then((response) => response.json())
    .then((response) => {
      console.log('response',response);
      if (response.status === "error") {
        // Automatically signout user if accessToken is no longer valid
        if (response.code === "auth/invalid-user-token") {
          supabase.auth.signOut();
        }

        throw CustomError(response.code, response.message);
      } else {
        console.log('response.data',response.data);
        return response.data;
      }
    });
}

// Make an API request to any external URL
export function apiRequestExternal(url: string, method: string = "GET", data?: any): Promise<any> {
  return fetch(url, {
    method: method,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  }).then((response) => response.json());
}

// Create an Error with custom message and code
export function CustomError(code: string, message: string): Error {
  const error = new Error(message) as Error & { code?: string };
  error.code = code;
  return error;
}

// Hook that returns previous value of state
export function usePrevious<T>(state: T): T | undefined {
  const ref = useRef<T>(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref.current;
}

export const scrollToSection = (id: string): void => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

// Get waveform data from base64 audio for visualization
export const getAudioWaveform = async (base64Audio: string): Promise<{ waveform: number[], duration: number }> => {
  const audioContext = new AudioContext();
  const audioData = atob(base64Audio.split(',')[1]); // Remove data URL prefix and decode
  const arrayBuffer = new ArrayBuffer(audioData.length);
  const view = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < audioData.length; i++) {
    view[i] = audioData.charCodeAt(i);
  }

  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createBufferSource();
  
  source.buffer = audioBuffer;
  analyser.fftSize = 256;
  source.connect(analyser);
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Float32Array(bufferLength);
  
  analyser.getFloatTimeDomainData(dataArray);
  return {
    waveform: Array.from(dataArray),
    duration: audioBuffer.duration
  };
};

// Function to convert PDF pages to array of images
export async function convertPdfToImageArray(file: File): Promise<string[]> {
  try {
    // Load the PDF file
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    // Initialize PDF.js
    const loadingTask = pdfjs.getDocument({ data });
    const pdf = await loadingTask.promise;

    const images: string[] = [];

    // Convert each page to an image
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context!,
        viewport: viewport
      }).promise;

      images.push(canvas.toDataURL("image/jpeg"));
    }

    return images;
  } catch (error) {
    console.error("Error converting PDF to images:", error);
    throw new Error("Failed to process PDF file");
  }
}

// Function to convert image to base64
export async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
