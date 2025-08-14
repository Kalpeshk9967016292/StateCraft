import type { State, PolicyDecision } from '@/lib/types';

export const initialStates: State[] = [
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    description: 'A coastal state with a strong agricultural base and a growing IT sector.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 60,
      publicOpinion: 58,
      policeStrength: 55,
      oppositionStrength: 42,
      unemploymentRate: 12.1,
    },
    politicalClimate: ''
  },
  {
    id: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    description: 'A scenic, mountainous state with rich biodiversity and a focus on tourism and hydropower.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 45,
      publicOpinion: 68,
      policeStrength: 65,
      oppositionStrength: 35,
      unemploymentRate: 10.5,
    },
    politicalClimate: ''
  },
  {
    id: 'assam',
    name: 'Assam',
    description: 'Famous for its tea plantations and wildlife, this state is a gateway to Northeast India.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 55,
      publicOpinion: 52,
      policeStrength: 62,
      oppositionStrength: 48,
      unemploymentRate: 17.8,
    },
    politicalClimate: ''
  },
  {
    id: 'bihar',
    name: 'Bihar',
    description: 'A state with immense potential, battling issues of poverty, governance, and infrastructure development.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 30,
      publicOpinion: 40,
      policeStrength: 40,
      oppositionStrength: 60,
      unemploymentRate: 25.2,
    },
    politicalClimate: ''
  },
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    description: 'A resource-rich state known for its forests and tribal culture, facing Naxal insurgency challenges.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 58,
      publicOpinion: 48,
      policeStrength: 70,
      oppositionStrength: 40,
      unemploymentRate: 14.9,
    },
    politicalClimate: ''
  },
  {
    id: 'goa',
    name: 'Goa',
    description: 'A popular tourist destination with beautiful beaches and a vibrant culture.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 65,
      publicOpinion: 70,
      policeStrength: 58,
      oppositionStrength: 30,
      unemploymentRate: 8.7,
    },
    politicalClimate: ''
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    description: 'An industrial powerhouse with a long coastline and a strong entrepreneurial spirit.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 75,
      publicOpinion: 62,
      policeStrength: 65,
      oppositionStrength: 38,
      unemploymentRate: 5.4,
    },
    politicalClimate: ''
  },
  {
    id: 'haryana',
    name: 'Haryana',
    description: 'An agricultural state that is also a major manufacturing and IT hub.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 68,
      publicOpinion: 55,
      policeStrength: 60,
      oppositionStrength: 45,
      unemploymentRate: 9.0,
    },
    politicalClimate: ''
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    description: 'A Himalayan state known for its tourism, apples, and hydropower.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 52,
      publicOpinion: 72,
      policeStrength: 68,
      oppositionStrength: 28,
      unemploymentRate: 11.2,
    },
    politicalClimate: ''
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    description: 'Rich in mineral resources, this state is working to overcome poverty and political instability.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 48,
      publicOpinion: 45,
      policeStrength: 55,
      oppositionStrength: 55,
      unemploymentRate: 18.0,
    },
    politicalClimate: ''
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    description: 'Home to India\'s Silicon Valley, with a diverse economy spanning IT, manufacturing, and agriculture.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 72,
      publicOpinion: 58,
      policeStrength: 60,
      oppositionStrength: 42,
      unemploymentRate: 7.8,
    },
    politicalClimate: ''
  },
  {
    id: 'kerala',
    name: 'Kerala',
    description: 'Known for its high literacy and social development, but struggles with industrial growth and brain drain.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 50,
      publicOpinion: 65,
      policeStrength: 50,
      oppositionStrength: 50,
      unemploymentRate: 9.8,
    },
    politicalClimate: ''
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    description: 'The "Heart of India", a large state with significant agricultural and mineral wealth.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 55,
      publicOpinion: 50,
      policeStrength: 58,
      oppositionStrength: 50,
      unemploymentRate: 16.5,
    },
    politicalClimate: ''
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    description: 'A bustling state with a major financial hub, facing challenges of urban infrastructure and rural distress.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 70,
      publicOpinion: 55,
      policeStrength: 60,
      oppositionStrength: 45,
      unemploymentRate: 15.3,
    },
    politicalClimate: ''
  },
  {
    id: 'manipur',
    name: 'Manipur',
    description: 'A state known for its rich culture and sports achievements, dealing with insurgency and ethnic conflicts.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 40,
      publicOpinion: 42,
      policeStrength: 75,
      oppositionStrength: 58,
      unemploymentRate: 13.6,
    },
    politicalClimate: ''
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    description: 'The "Abode of Clouds", a picturesque state with unique matrilineal societies.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 47,
      publicOpinion: 66,
      policeStrength: 60,
      oppositionStrength: 34,
      unemploymentRate: 9.5,
    },
    politicalClimate: ''
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    description: 'A peaceful state with a high literacy rate and a strong sense of community.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 50,
      publicOpinion: 75,
      policeStrength: 62,
      oppositionStrength: 25,
      unemploymentRate: 8.9,
    },
    politicalClimate: ''
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    description: 'A vibrant state with diverse tribes and a long history of seeking greater political autonomy.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 42,
      publicOpinion: 55,
      policeStrength: 72,
      oppositionStrength: 45,
      unemploymentRate: 15.7,
    },
    politicalClimate: ''
  },
  {
    id: 'odisha',
    name: 'Odisha',
    description: 'A state rich in culture and minerals, frequently hit by natural disasters like cyclones.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 62,
      publicOpinion: 60,
      policeStrength: 55,
      oppositionStrength: 40,
      unemploymentRate: 14.1,
    },
    politicalClimate: ''
  },
  {
    id: 'punjab',
    name: 'Punjab',
    description: 'The "Granary of India", a prosperous agricultural state facing issues of drug abuse and water depletion.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 58,
      publicOpinion: 53,
      policeStrength: 64,
      oppositionStrength: 47,
      unemploymentRate: 10.2,
    },
    politicalClimate: ''
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    description: 'The "Land of Kings", a vast desert state with a rich history and a thriving tourism industry.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 63,
      publicOpinion: 56,
      policeStrength: 60,
      oppositionStrength: 44,
      unemploymentRate: 12.8,
    },
    politicalClimate: ''
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    description: 'A small, pristine state in the Himalayas, known for its organic farming and stunning landscapes.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 55,
      publicOpinion: 78,
      policeStrength: 65,
      oppositionStrength: 22,
      unemploymentRate: 7.5,
    },
    politicalClimate: ''
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    description: 'A major manufacturing and automotive hub with a rich cultural and linguistic heritage.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 68,
      publicOpinion: 60,
      policeStrength: 58,
      oppositionStrength: 40,
      unemploymentRate: 6.9,
    },
    politicalClimate: ''
  },
  {
    id: 'telangana',
    name: 'Telangana',
    description: 'A newly formed state with a booming IT sector and a focus on irrigation projects.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 65,
      publicOpinion: 62,
      policeStrength: 60,
      oppositionStrength: 38,
      unemploymentRate: 8.2,
    },
    politicalClimate: ''
  },
  {
    id: 'tripura',
    name: 'Tripura',
    description: 'A hilly state in Northeast India with a history of ethnic diversity and political change.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 49,
      publicOpinion: 54,
      policeStrength: 63,
      oppositionStrength: 46,
      unemploymentRate: 16.3,
    },
    politicalClimate: ''
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    description: 'India\'s most populous state, with significant political influence and a diverse economy.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 45,
      publicOpinion: 48,
      policeStrength: 50,
      oppositionStrength: 52,
      unemploymentRate: 19.8,
    },
    politicalClimate: ''
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    description: 'A Himalayan state known for its religious tourism and natural beauty, facing environmental challenges.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 53,
      publicOpinion: 64,
      policeStrength: 66,
      oppositionStrength: 36,
      unemploymentRate: 10.8,
    },
    politicalClimate: ''
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    description: 'A state with a rich literary and cultural history, known for its political fervor.',
    demographics: {
      population: 0,
      gdp: 0,
      literacyRate: 0,
      crimeRate: 0,
    },
    initialStats: {
      budget: 50,
      publicOpinion: 51,
      policeStrength: 55,
      oppositionStrength: 49,
      unemploymentRate: 17.4,
    },
    politicalClimate: ''
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
