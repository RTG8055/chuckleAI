import { NextRequest, NextResponse } from 'next/server';
import { getAudioStream } from '../../services/deepgram-client';

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  
  try {
    const stream = await getAudioStream(text);
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const audioBuffer = Buffer.concat(chunks);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
      },
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
  }
}