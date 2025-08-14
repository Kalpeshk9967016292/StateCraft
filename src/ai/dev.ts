import { config } from 'dotenv';
config();

import '@/ai/flows/ai-advisor.ts';
import '@/ai/flows/policy-impact-model.ts';
import '@/ai/flows/outcome-calculation.ts';
import '@/ai/flows/state-data-fetcher.ts';
import '@/ai/flows/crisis-generator.ts';
