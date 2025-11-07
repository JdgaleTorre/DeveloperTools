import { z } from "zod"

const aiTaskSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
})

export type AITaskResponse = z.infer<typeof aiTaskSchema>