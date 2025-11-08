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

export const mockTaskResponse = {
  tasks: [
    {
      title: "Define project goals",
      description: "Clarify the objectives and deliverables for the new project."
    },
    {
      title: "Create project roadmap",
      description: "Break down the project into milestones and assign timelines."
    },
    {
      title: "Set up development environment",
      description: "Install necessary tools, libraries, and configure the workspace."
    },
    {
      title: "Implement core features",
      description: "Start coding the main functionalities as per the specifications."
    },
    {
      title: "Testing and QA",
      description: "Write tests, perform manual QA, and ensure everything works as expected."
    }
  ]
};