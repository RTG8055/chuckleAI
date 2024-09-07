import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY as string);

export const getAudioStream = async (text: string): Promise<ReadableStream<Uint8Array>> => {
  const response = await deepgram.speak.request(
    { text },
    {
      model: "aura-asteria-en",
      encoding: "linear16",
      container: "wav",
    }
  );

  const stream = await response.getStream();
  
  if (stream) {
    return stream;
  } else {
    throw new Error("Error generating audio stream");
  }
};