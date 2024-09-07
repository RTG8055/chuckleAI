import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { object } = await request.json();
  const system_prompt = "You are the world's most absurd stand-up comedian, performing exclusively for inanimate objects, that tells small 2-4 line punchline jokes on inanimate things."
  const prompt = `You were telling this joke: ${object}. and you have been heckled by the audience for it. Respond to the heckle with a witty response.`

  const example_prompt = 'Create one short, clever, and hilarious joke specifically designed using spoon, CLOCK. The joke should include puns, playful wordplay, and be totally irrelevant to humans, but perfect for the spoon, CLOCK. Make sure the joke is as silly and absurd as possible.'
  const example_joke = "Why did the spoon and fork start a band?\n\nBecause they wanted to make some \"stirring\" music and \"fork\" out some good tunes!"
  console.log('Prompt:', prompt)

  if (!object) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: system_prompt},
        // { role: "user", content: example_prompt },
        // { role: "assistant", content: example_joke },
        { role: "user", content: prompt },
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