// src/ai/flows/smart-task-prioritization.ts
'use server';

/**
 * @fileOverview An AI-powered tool that intelligently suggests task priorities based on due dates and categories.
 *
 * - prioritizeTasks - A function that prioritizes tasks.
 * - PrioritizeTasksInput - The input type for the prioritizeTasks function.
 * - PrioritizeTasksOutput - The return type for the prioritizeTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeTasksInputSchema = z.object({
  tasks: z.array(
    z.object({
      name: z.string().describe('The name of the task.'),
      dueDate: z.string().describe('The due date of the task (ISO format).'),
      category: z.string().describe('The category of the task (e.g., personal, work, study).'),
    })
  ).describe('A list of tasks to prioritize.'),
});
export type PrioritizeTasksInput = z.infer<typeof PrioritizeTasksInputSchema>;

const PrioritizeTasksOutputSchema = z.array(
  z.object({
    name: z.string().describe('The name of the task.'),
    priority: z.number().describe('The priority of the task (1 being highest).'),
    reason: z.string().describe('The reason for the assigned priority.'),
  })
);
export type PrioritizeTasksOutput = z.infer<typeof PrioritizeTasksOutputSchema>;

export async function prioritizeTasks(input: PrioritizeTasksInput): Promise<PrioritizeTasksOutput> {
  return prioritizeTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeTasksPrompt',
  input: {schema: PrioritizeTasksInputSchema},
  output: {schema: PrioritizeTasksOutputSchema},
  prompt: `You are a personal assistant helping users prioritize their to-do list.

Given the following list of tasks, each with a name, due date, and category, determine the priority of each task.
Prioritize tasks based on their due date (closer due dates are higher priority) and category (consider work/study tasks higher priority than personal tasks unless the due date is near).

Return an array of tasks, each with the original task name, a priority (1 being the highest), and a brief reason for the assigned priority.

Tasks:
{{#each tasks}}
- Name: {{this.name}}, Due Date: {{this.dueDate}}, Category: {{this.category}}
{{/each}}`,
});

const prioritizeTasksFlow = ai.defineFlow(
  {
    name: 'prioritizeTasksFlow',
    inputSchema: PrioritizeTasksInputSchema,
    outputSchema: PrioritizeTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
