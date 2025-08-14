'use server';

/**
 * @fileOverview Calculates the impact of a policy decision on various state statistics.
 *
 * - calculatePolicyOutcomes - A function that takes a policy decision as input and returns the calculated outcomes.
 * - PolicyDecisionInput - The input type for the calculatePolicyOutcomes function.
 * - PolicyOutcomesOutput - The return type for the calculatePolicyOutcomes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PolicyDecisionInputSchema = z.object({
  decision: z.string().describe('The policy decision made by the player.'),
  currentState: z
    .string()
    .describe('The current state of the state, as a string.'),
});
export type PolicyDecisionInput = z.infer<typeof PolicyDecisionInputSchema>;

const PolicyOutcomesOutputSchema = z.object({
  approvalRatingChange: z
    .number()
    .describe('The change in approval rating as a result of the decision.'),
  budgetChange: z.number().describe('The change in budget as a result of the decision.'),
  lawAndOrderChange: z
    .number()
    .describe('The change in law and order as a result of the decision.'),
  mediaCoverage: z.string().describe('A summary of the media coverage of the decision.'),
  oppositionMoraleChange: z
    .number()
    .describe('The change in opposition morale as a result of the decision.'),
});
export type PolicyOutcomesOutput = z.infer<typeof PolicyOutcomesOutputSchema>;

export async function calculatePolicyOutcomes(
  input: PolicyDecisionInput
): Promise<PolicyOutcomesOutput> {
  return calculatePolicyOutcomesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculatePolicyOutcomesPrompt',
  input: {schema: PolicyDecisionInputSchema},
  output: {schema: PolicyOutcomesOutputSchema},
  prompt: `You are an AI advisor tasked with calculating the outcomes of policy decisions.

  Given the following policy decision and the current state, calculate the effect on approval rating, budget, law & order, media coverage, and opposition morale.

  Policy Decision: {{{decision}}}
  Current State: {{{currentState}}}

  Consider real-world formulas and relationships when calculating the outcomes. For example, cutting fuel taxes may increase public approval but reduce the budget.

  Return the outcomes in JSON format.
  Be concise in the media coverage summary.

  Outcomes:
  `,
});

const calculatePolicyOutcomesFlow = ai.defineFlow(
  {
    name: 'calculatePolicyOutcomesFlow',
    inputSchema: PolicyDecisionInputSchema,
    outputSchema: PolicyOutcomesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
