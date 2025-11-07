import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"
import { openai } from '@ai-sdk/openai';


export const maxDuration = 30

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json()

    const prompt = convertToModelMessages(messages)

    const result = streamText({
        model: openai('gpt-5-nano'),
        prompt,
        abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse({
        onFinish: async ({ isAborted }) => {
            if (isAborted) {
                console.log("Chat request aborted")
            }
        },
        consumeSseStream: consumeStream,
    })
}
