import { consumeStream, convertToModelMessages, generateObject, streamText, type UIMessage } from "ai"
import { openai } from '@ai-sdk/openai';
import z from "zod";


export const maxDuration = 30

export async function POST(req: Request) {
    const { message }: { message: string } = await req.json();

    // 1️⃣ Check the latest user message
    const lastMessage = message.toString().toLowerCase();


    const result = await generateObject({
        model: openai("gpt-5-nano"),
        system:
            "You are an expert project planner. When users describe a goal, you output tasks in structured JSON.",
        prompt: `Generate a list of actionable tasks for: "${lastMessage}"`,
        schema: z.object({
            tasks: z.array(
                z.object({
                    title: z.string(),
                    description: z.string(),
                })
            ),
        })

    });


    // You can return the tasks as a "message" so your frontend chat can render them
    return Response.json({
        type: "tasks",
        tasks: result.object.tasks,
    });

}
