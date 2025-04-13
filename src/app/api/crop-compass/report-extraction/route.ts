import { NextRequest, NextResponse } from 'next/server';
import requireAuth from '../../_require-auth';
import openai from '../../_openAI';

export const POST = requireAuth(async (req: NextRequest, user: any) => {
  try {
    const body = await req.json();
    
    if (!body.reportText && !body.reportImage) {
      return NextResponse.json(
        { status: "error", message: "Report text or image is required" },
        { status: 400 }
      );
    }

    // Prepare the prompt for OpenAI
    let promptText = '';
    
    if (body.reportText) {
      promptText = `
      Extract nutrient data from the following sap or dry tissue report. 
      Follow these rules:
      1. Results can be in PPM or % but not both for the same element even if both are present PPM is preferred.
      2. If an element is not present in the results, leave it blank.
      3. For dry tissue tests, input the total N percentage into the nitrate cell, do not use nitrate PPM.
      4. Ensure chloride is included for proper functioning.
      5. PPM or % values should always be either a valid number or an empty string "".
      6. if the number is represneted with something like < .05 then use 0

      Report text:
      ${body.reportText}

      Return the data in JSON format as an array of objects with this structure:
      [
        { id: 1, element: "Nitrate", ppm: number or "", percent: number or "" },
        { id: 2, element: "Ammonium", ppm: number or "", percent: number or "" },
        { id: 3, element: "Phosphate", ppm: number or "", percent: number or "" },
        { id: 4, element: "Potassium", ppm: number or "", percent: number or "" },
        { id: 5, element: "Calcium", ppm: number or "", percent: number or "" },
        { id: 6, element: "Magnesium", ppm: number or "", percent: number or "" },
        { id: 7, element: "Sulphate", ppm: number or "", percent: number or "" },
        { id: 8, element: "Zinc", ppm: number or "", percent: number or "" },
        { id: 9, element: "Copper", ppm: number or "", percent: number or "" },
        { id: 10, element: "Manganese", ppm: number or "", percent: number or "" },
        { id: 11, element: "Iron", ppm: number or "", percent: number or "" },
        { id: 12, element: "Boron", ppm: number or "", percent: number or "" },
        { id: 13, element: "Molybdenum", ppm: number or "", percent: number or "" },
        { id: 14, element: "Chloride", ppm: number or "", percent: number or "" },
        { id: 15, element: "Sodium", ppm: number or "", percent: number or "" },
        { id: 16, element: "Silicon", ppm: number or "", percent: number or "" },
        { id: 17, element: "Aluminium", ppm: number or "", percent: number or "" }
      ]
      `;
    } else if (body.reportImage) {
      promptText = `
      Extract nutrient data from this sap or dry tissue report image. 
      Follow these rules:
      1. Results can be in PPM or % but not both for the same element even if both are present PPM is preferred.
      2. If an element is not present in the results, leave it blank like this: "".
      3. For dry tissue tests, input the total N percentage into the nitrate cell, do not use nitrate PPM.
      4. Ensure chloride is included for proper functioning.
      5. PPM or % values should always be either a valid number or an empty string "".
      6. if the number is represneted with something like < .05 then use 0


      Return the data in JSON format as an array of objects with this structure:
      [
        { id: 1, element: "Nitrate", ppm: number or "", percent: number or "" },
        { id: 2, element: "Ammonium", ppm: number or "", percent: number or "" },
        { id: 3, element: "Phosphate", ppm: number or "", percent: number or "" },
        { id: 4, element: "Potassium", ppm: number or "", percent: number or "" },
        { id: 5, element: "Calcium", ppm: number or "", percent: number or "" },
        { id: 6, element: "Magnesium", ppm: number or "", percent: number or "" },
        { id: 7, element: "Sulphate", ppm: number or "", percent: number or "" },
        { id: 8, element: "Zinc", ppm: number or "", percent: number or "" },
        { id: 9, element: "Copper", ppm: number or "", percent: number or "" },
        { id: 10, element: "Manganese", ppm: number or "", percent: number or "" },
        { id: 11, element: "Iron", ppm: number or "", percent: number or "" },
        { id: 12, element: "Boron", ppm: number or "", percent: number or "" },
        { id: 13, element: "Molybdenum", ppm: number or "", percent: number or "" },
        { id: 14, element: "Chloride", ppm: number or "", percent: number or "" },
        { id: 15, element: "Sodium", ppm: number or "", percent: number or "" },
        { id: 16, element: "Silicon", ppm: number or "", percent: number or "" },
        { id: 17, element: "Aluminium", ppm: number or "", percent: number or "" }
      ]
      `;
    }

    // Call OpenAI API to extract data
    let response;
    
    if (body.reportText) {
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a specialized assistant that extracts nutrient data from agricultural lab reports."
          },
          {
            role: "user",
            content: promptText
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      });
    } else if (body.reportImage) {
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a specialized assistant that extracts nutrient data from agricultural lab reports."
          },
          {
            role: "user",
            content: [
              { type: "text", text: promptText },
              { type: "image_url", image_url: { url: body.reportImage } }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      });
    }

    // Parse the response
    const content = response?.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { status: "error", message: "Failed to extract data from the report" },
        { status: 400 }
      );
    }
    
    // Extract JSON from the response, handling potential markdown code blocks
    let jsonContent = content.trim();
    // Remove markdown code block syntax if present
    if (jsonContent.startsWith("```json")) {
      jsonContent = jsonContent.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.replace(/^```\n/, "").replace(/\n```$/, "");
    }
    
    const extractedData = JSON.parse(jsonContent);

    // Validate that chloride is present (required per instructions)
    const chlorideEntry = extractedData.find((item: any) => item.element === "Chloride");
    if (!chlorideEntry || (chlorideEntry.ppm === "" && chlorideEntry.percent === "")) {
      return NextResponse.json(
        { status: "error", message: "Chloride data is required for proper analysis" },
        { status: 400 }
      );
    }

    // Return the extracted data
    return NextResponse.json({ 
      status: "success", 
      data: extractedData 
    });

  } catch (error: any) {
    console.log("crop-compass/report-extraction error", error);

    // Return error response
    return NextResponse.json(
      { status: "error", code: error.code, message: error.message },
      { status: 400 }
    );
  }
});
