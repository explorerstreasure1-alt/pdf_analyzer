import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function analyzePDFText(text: string) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert document analyzer. Analyze the provided text and return a JSON response with the following structure:
{
  "summary": "A sharp, one-sentence summary of the document",
  "insights": [
    "Key insight 1",
    "Key insight 2",
    "Key insight 3"
  ],
  "actionItems": [
    "Action item 1",
    "Action item 2",
    "Action item 3",
    "Action item 4",
    "Action item 5"
  ]
}

Ensure the summary is concise and actionable. Insights should be the most important takeaways. Action items should be specific, practical steps based on the document content.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.5,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from Groq');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}
