import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ReasoningStrategy, StructuredPrompt } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    system_role: {
      type: Type.STRING,
      description: "Defines who the AI is, its persona, and core objectives.",
    },
    context_variables: {
      type: Type.STRING,
      description: "Background information and dynamic variables (e.g., {variable}).",
    },
    instructions_constraints: {
      type: Type.STRING,
      description: "Specific step-by-step actions the AI must take and negative constraints.",
    },
    few_shot_examples: {
      type: Type.STRING,
      description: "Input/Output examples to guide the model.",
    },
    reasoning_strategy: {
      type: Type.STRING,
      description: "The specific thinking process the AI should use (e.g., Let's think step by step).",
    },
    output_format: {
      type: Type.STRING,
      description: "The required JSON schema or format of the final response.",
    },
  },
  required: [
    "system_role",
    "context_variables",
    "instructions_constraints",
    "few_shot_examples",
    "reasoning_strategy",
    "output_format",
  ],
};

export const generateStructuredPrompt = async (
  rawPrompt: string,
  strategies: ReasoningStrategy[],
  stepBackAnswer?: string
): Promise<StructuredPrompt> => {
  const strategiesText = strategies.join(", ");
  
  let additionalContext = "";
  if (stepBackAnswer) {
    additionalContext = `
    The user has performed a "Step-back Prompting" exercise. 
    Here is the General/Macro Knowledge provided by the user to ground the prompt:
    "${stepBackAnswer}"
    
    Please incorporate this high-level knowledge into the generated prompt, specifically in the reasoning strategy or instructions.
    `;
  }

  const prompt = `
    You are an expert Prompt Engineer and System Architect.
    Your task is to take a raw, unstructured user intent and transform it into a high-quality, structured, production-ready system prompt.

    Input Raw Prompt: "${rawPrompt}"
    
    Selected Reasoning Strategies to Embed: ${strategiesText || "Standard reasoning"}

    ${additionalContext}

    Please restructure this into the following specific sections:
    1. System & Role: Define the persona.
    2. Context & Variables: Define the background and variables like {var_name}.
    3. Instructions & Constraints: Clear steps and negative constraints.
    4. Few-Shot Examples: Provide 1-2 realistic examples.
    5. Reasoning Strategy: Embed the specific logic for ${strategiesText}.
    6. Output Format: Define the JSON schema for the output.

    IMPORTANT: 
    The content of all generated fields must be in Simplified Chinese (简体中文). 
    Even if the input prompt is in English, translate and adapt the structured output into Chinese.

    Ensure the tone is professional and the instructions are precise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as StructuredPrompt;
    }
    throw new Error("Empty response from model");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};