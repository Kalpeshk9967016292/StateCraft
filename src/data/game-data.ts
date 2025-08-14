import type { State, PolicyDecision } from '@/lib/types';

export const initialStates: State[] = [
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    description: 'A bustling state with a major financial hub, facing challenges of urban infrastructure and rural distress.',
    demographics: {
      population: 126_000_000,
      gdp: 400_000_000_000, // in USD
      literacyRate: 82.3,
      crimeRate: 35.1,
    },
    initialStats: {
      budget: 70,
      publicOpinion: 55,
      policeStrength: 60,
      oppositionStrength: 45,
      unemploymentRate: 15.3,
    },
    politicalClimate: 'Strong ruling coalition but faces a vocal opposition. Key voter issues include farmer rights and urban development.'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    description: 'Known for its high literacy and social development, but struggles with industrial growth and brain drain.',
    demographics: {
      population: 35_000_000,
      gdp: 120_000_000_000,
      literacyRate: 94,
      crimeRate: 70.5,
    },
    initialStats: {
      budget: 50,
      publicOpinion: 65,
      policeStrength: 50,
      oppositionStrength: 50,
      unemploymentRate: 9.8,
    },
    politicalClimate: 'Highly politicized environment with strong, alternating coalitions. Environmental regulations and public sector employment are major issues.'
  },
  {
    id: 'bihar',
    name: 'Bihar',
    description: 'A state with immense potential, battling issues of poverty, governance, and infrastructure development.',
    demographics: {
      population: 124_000_000,
      gdp: 94_000_000_000,
      literacyRate: 61.8,
      crimeRate: 42.0,
    },
    initialStats: {
      budget: 30,
      publicOpinion: 40,
      policeStrength: 40,
      oppositionStrength: 60,
      unemploymentRate: 25.2,
    },
    politicalClimate: 'Politics dominated by caste-based alliances. Key issues are law and order, job creation, and special status demands.'
  },
];

export const policyDecisions: PolicyDecision[] = [
    { id: 'tax_cut_fuel', title: 'Cut Fuel Taxes', description: 'Reduce state taxes on petrol and diesel to lower prices for consumers.' },
    { id: 'invest_infra', title: 'Invest in Infrastructure', description: 'Launch a major project to build new highways and bridges across the state.' },
    { id: 'increase_msp', title: 'Increase Farm Subsidies', description: 'Increase the Minimum Support Price (MSP) for key crops to support farmers.' },
    { id: 'police_reform', title: 'Modernize Police Force', description: 'Invest in new equipment, training, and technology for the state police.' },
    { id: 'build_schools', title: 'Build New Schools', description: 'Fund the construction of 100 new public schools in underserved areas.' },
    { id: 'industry_incentive', title: 'Offer Industrial Incentives', description: 'Provide tax breaks and land concessions to attract new manufacturing industries.' },
    { id: 'welfare_scheme', title: 'Launch a Welfare Scheme', description: 'Start a direct cash transfer scheme for underprivileged families.' },
    { id: 'environmental_reg', title: 'Strengthen Environmental Laws', description: 'Impose stricter regulations on industries to curb pollution.'},
    { id: 'healthcare_investment', title: 'Boost Healthcare Funding', description: 'Increase the budget for public hospitals and primary health centers.'},
    { id: 'tourism_campaign', title: 'Launch Tourism Campaign', description: 'Promote the state as a prime tourist destination to boost the local economy.'},
];
