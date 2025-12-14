import { GoogleGenAI } from "@google/genai";
import { AspectRatio, Resolution, GenerationConfig } from "../types";

/**
 * Generates an image based on the provided configuration.
 * Automatically switches between 'gemini-2.5-flash-image' and 'gemini-3-pro-image-preview'
 * based on the requested resolution.
 */
export const generateImage = async (config: GenerationConfig): Promise<string> => {
  // Determine model based on resolution. 
  // 1K -> Nano Banana (Flash Image)
  // 2K/4K -> Pro Image (Requires paid/selected key)
  const isHighRes = config.resolution === Resolution.RES_2K || config.resolution === Resolution.RES_4K;
  const modelName = isHighRes ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

  // If high res, ensure key is selected via AI Studio popup
  if (isHighRes && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
        // We throw a specific error to let the UI know it needs to prompt the user
        throw new Error("API_KEY_REQUIRED");
    }
  }

  // Initialize Client
  // Note: For gemini-3-pro-image-preview with window.aistudio, the key is injected automatically into process.env.API_KEY
  // after selection. For Flash, we rely on the env var being present or the same mechanism.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const parts: any[] = [];
  
  // Add reference image if it exists
  if (config.referenceImage) {
    // Strip header if present (e.g., "data:image/png;base64,")
    const base64Data = config.referenceImage.split(',')[1] || config.referenceImage;
    parts.push({
      inlineData: {
        mimeType: 'image/png', // Assuming PNG for upload standardization, or detect from string
        data: base64Data
      }
    });
  }

  // Add text prompt
  parts.push({ text: config.prompt });

  // Prepare configuration
  const requestConfig: any = {
    imageConfig: {
      aspectRatio: config.aspectRatio,
    }
  };

  // Only add imageSize if using the Pro model
  if (isHighRes) {
    requestConfig.imageConfig.imageSize = config.resolution;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: parts
      },
      config: requestConfig
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          // Return the full data URL
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    
    throw new Error("No image generated in response.");

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const promptApiKeySelection = async () => {
    if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
    } else {
        console.warn("AI Studio client library not loaded.");
    }
}

export const checkHasApiKey = async (): Promise<boolean> => {
    if ((window as any).aistudio) {
        return await (window as any).aistudio.hasSelectedApiKey();
    }
    return !!process.env.API_KEY;
}