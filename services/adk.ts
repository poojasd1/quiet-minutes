
import { GoogleGenAI, GenerateContentResponse, Tool, Schema } from "@google/genai";

/**
 * Agent Development Kit (ADK)
 * A lightweight framework for defining and orchestrating Gemini-powered agents.
 */

export interface AgentConfig {
  /** Name of the agent for logging and debugging */
  name: string;
  /** The model identifier (e.g., 'gemini-2.5-flash') */
  model: string;
  /** System instructions to define the agent's persona and constraints */
  systemInstruction?: string;
  /** Array of tools (e.g., googleSearch) available to the agent */
  tools?: Tool[];
  /** JSON Schema for structured output enforcement */
  responseSchema?: Schema;
  /** MIME type for the response (e.g., 'application/json') */
  responseMimeType?: string;
  /** Optional API Key override */
  apiKey?: string;
}

export class Agent {
  private ai: GoogleGenAI | null = null;
  public config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    const key = config.apiKey || process.env.API_KEY;
    if (key) {
      this.ai = new GoogleGenAI({ apiKey: key });
    } else {
      console.warn(`[ADK] Agent '${config.name}' initialized without API Key.`);
    }
  }

  /**
   * Executes the agent with a given prompt and context.
   * @param content The prompt or content to send to the model.
   * @returns The raw GenerateContentResponse or null if execution fails/no key.
   */
  async run(content: string): Promise<GenerateContentResponse | null> {
    if (!this.ai) {
      console.warn(`[ADK] Agent '${this.config.name}' cannot run: Missing API Key.`);
      return null;
    }

    try {
      console.log(`[ADK] Running Agent: ${this.config.name}`);
      const response = await this.ai.models.generateContent({
        model: this.config.model,
        contents: content,
        config: {
          systemInstruction: this.config.systemInstruction,
          tools: this.config.tools,
          responseSchema: this.config.responseSchema,
          responseMimeType: this.config.responseMimeType,
        }
      });
      return response;
    } catch (error) {
      console.error(`[ADK] Agent '${this.config.name}' failed:`, error);
      throw error;
    }
  }

  /**
   * Helper to extract text from a response safely.
   */
  static getText(response: GenerateContentResponse | null): string {
    return response?.text || "";
  }

  /**
   * Helper to extract grounding metadata (Search URLs) safely.
   */
  static getGroundingChunks(response: GenerateContentResponse | null): any[] {
    return response?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  }
}
