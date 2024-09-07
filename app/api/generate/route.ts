import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { object } = await request.json();
  const prompt = `Create a small punch line joke using ${object}.`

  if (!object) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a comic that creates small 2 sentence punchline jokes on useless objects like in a home/office." },
        { role: "user", content: prompt }
      ],
      // temperature: 0.7,  // Uncomment if you want to adjust creativity
    });

    const joke = response.choices[0].message.content?.trim();
    return NextResponse.json({ joke });
  } catch (error) {
    console.error('Error generating joke:', error);
    return NextResponse.json({ error: 'Error generating joke' }, { status: 500 });
  }
}