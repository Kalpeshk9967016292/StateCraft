'use server';

/**
 * @fileOverview Predicts the impact of a policy decision on state statistics.
 *
 * - policyImpactPrediction - A function that predicts the impact of a policy decision.
 * - PolicyImpactInput - The input type for the policyImpactPrediction function.
 * - PolicyImpactOutput - The return type for the policyImpactPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PolicyImpactInputSchema = z.object({
  policyDescription: z
    .string()
    .describe('Detailed description of the policy decision to be evaluated.'),
  currentStateStats: z
    .string()
    .describe(
      'A JSON string representing the current state statistics including Budget, Public Opinion, Police Strength, Opposition Strength, and Unemployment Rate.'
    ),\n  politicalClimate: z
    .string()
    .describe(
      'A description of the current political climate in the state, including ruling party strength vs opposition strength, past election history, and voter issues.'
    ),
});
export type PolicyImpactInput = z.infer<typeof PolicyImpactInputSchema>;

const PolicyImpactOutputSchema = z.object({
  predictedImpact: z
    .string()
    .describe(
      'A JSON string representing the predicted impact of the policy decision on the state statistics, including approval rating, budget, law & order, media coverage, and opposition morale.'
    ),
});
export type PolicyImpactOutput = z.infer<typeof PolicyImpactOutputSchema>;

export async function policyImpactPrediction(
  input: PolicyImpactInput
): Promise<PolicyImpactOutput> {
  return policyImpactFlow(input);
}

const prompt = ai.definePrompt({
  name: 'policyImpactPrompt',
  input: {schema: PolicyImpactInputSchema},
  output: {schema: PolicyImpactOutputSchema},
  prompt: `You are an expert policy analyst specializing in predicting the impacts of policy decisions on state statistics.

You will use the policy description, the current state statistics, and the political climate to predict the impact of the policy on various state statistics.

Specifically, you will predict the impact on approval rating, budget, law & order, media coverage, and opposition morale.

Policy Description: {{{policyDescription}}}
Current State Statistics: {{{currentStateStats}}}
Political Climate: {{{politicalClimate}}}

Present your prediction as a JSON string.
`,
});

const policyImpactFlow = ai.defineFlow(
  {
    name: 'policyImpactFlow',
    inputSchema: PolicyImpactInputSchema,
    outputSchema: PolicyImpactOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
