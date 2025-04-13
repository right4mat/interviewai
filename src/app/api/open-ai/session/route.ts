import { NextRequest, NextResponse } from 'next/server';
import requireAuth from '../../_require-auth';

export const GET = requireAuth(async (req: NextRequest, user: any) => {
  try {
    // Get OpenAI API key from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "OpenAI API key is not configured",
        },
        { status: 500 }
      );
    }

    // Make request to OpenAI API
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17", // Default model
        voice: "verse", // Default voice
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to get ephemeral key from OpenAI",
          details: errorData,
        },
        { status: response.status }
      );
    }

    // Return the OpenAI response
    const data = await response.json();
    return NextResponse.json({ status: "success", data: data });
    
  } catch (error: any) {
    console.log("open-ai route error", error);

    // Return error response
    return NextResponse.json(
      { 
        status: "error", 
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
});
