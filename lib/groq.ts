import Groq from 'groq-sdk';
import { AnalysisResult } from '@/types';
import { GroqError } from './errors';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.1-70b-versatile';

export async function analyzeTextWithGroq(text: string): Promise<AnalysisResult> {
  if (!process.env.GROQ_API_KEY) {
    throw new GroqError('GROQ_API_KEY is not configured', 500);
  }

  const truncatedText = text.slice(0, 15000); // Limit to prevent token overflow

  const prompt = `Analyze the following document and provide a structured response in JSON format:

Document:
"""
${truncatedText}
"""

Please provide a JSON response with this exact structure:
{
  "summary": "One sharp, impactful sentence summarizing the entire document",
  "keyInsights": [
    "First key insight - specific and actionable",
    "Second key insight - specific and actionable",
    "Third key insight - specific and actionable"
  ],
  "actionItems": [
    "First specific action item with clear next step",
    "Second specific action item with clear next step",
    "Third specific action item with clear next step",
    "Fourth specific action item with clear next step",
    "Fifth specific action item with clear next step"
  ]
}

Requirements:
- Summary must be exactly ONE sentence, impactful and comprehensive
- Key insights must be 3 bullet points, each unique and valuable
- Action items must be 5 specific, actionable tasks derived from the content
- Return ONLY valid JSON, no markdown formatting, no explanation text`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert document analyzer. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: MODEL,
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new GroqError('Empty response from Groq API', 500);
    }

    const parsedResult: AnalysisResult = JSON.parse(responseContent);

    // Validate the response structure
    if (!parsedResult.summary || !Array.isArray(parsedResult.keyInsights) || !Array.isArray(parsedResult.actionItems)) {
      throw new GroqError('Invalid response structure from Groq API', 500);
    }

    return parsedResult;
  } catch (error) {
    if (error instanceof GroqError) {
      throw error;
    }
    
    if (error instanceof SyntaxError) {
      throw new GroqError('Failed to parse Groq API response as JSON', 500);
    }

    throw new GroqError(
      error instanceof Error ? error.message : 'Unknown Groq API error',
      500
    );
  }
}
