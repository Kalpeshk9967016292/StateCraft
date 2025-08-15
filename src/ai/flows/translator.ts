'use server';
/**
 * @fileOverview A flow for translating text to a target language.
 *
 * - translateText - A function that translates text.
 * - TranslateRequest - The input type for the translateText function.
 * - TranslateResponse - The return type for the translateText function.
 */

import { ai } from '@/ai/genkit';
import type { TranslateRequest, TranslateResponse } from '@/lib/types';
import { TranslateRequestSchema, TranslateResponseSchema } from '@/lib/types';


export async function translateText(input: TranslateRequest): Promise<TranslateResponse> {
  return translatorFlow(input);
}

const translatorPrompt = ai.definePrompt({
  name: 'translatorPrompt',
  input: { schema: TranslateRequestSchema },
  output: { schema: TranslateResponseSchema },
  prompt: `Translate the following text into {{targetLanguage}}.

Text:
"{{textToTranslate}}"

Return only the translated text.`,
});

const translatorFlow = ai.defineFlow(
  {
    name: 'translatorFlow',
    inputSchema: TranslateRequestSchema,
    outputSchema: TranslateResponseSchema,
  },
  async (input) => {
    const { output } = await translatorPrompt(input);
    return output!;
  }
);
