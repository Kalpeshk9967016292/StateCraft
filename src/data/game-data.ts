import type { State, PolicyDecision } from '@/lib/types';

export const initialStates: State[] = [
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    description: 'A coastal state with a strong agricultural base and a growing IT sector.',
    demographics: {
      population: 53_000_000,
      gdp: 130_000_000_000,
      literacyRate: 67.4,
      crimeRate: 28.5,
    },
    initialStats: {
      budget: 60,
      publicOpinion: 58,
      policeStrength: 55,
      oppositionStrength: 42,
      unemploymentRate: 12.1,
    },
    politicalClimate: 'Competitive two-party system. Key issues include special status, irrigation projects, and industrial development.'
  },
  {
    id: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    description: 'A scenic, mountainous state with rich biodiversity and a focus on tourism and hydropower.',
    demographics: {
      population: 1_500_000,
      gdp: 4_000_000_000,
      literacyRate: 65.4,
      crimeRate: 25.1,
    },
    initialStats: {
      budget: 45,
      publicOpinion: 68,
      policeStrength: 65,
      oppositionStrength: 35,
      unemploymentRate: 10.5,
    },
    politicalClimate: 'Politics are influenced by regional factors and infrastructure development is a primary concern for voters.'
  },
  {
    id: 'assam',
    name: 'Assam',
    description: 'Famous for its tea plantations and wildlife, this state is a gateway to Northeast India.',
    demographics: {
      population: 35_000_000,
      gdp: 50_000_000_000,
      literacyRate: 72.2,
      crimeRate: 38.9,
    },
    initialStats: {
      budget: 55,
      publicOpinion: 52,
      policeStrength: 62,
      oppositionStrength: 48,
      unemploymentRate: 17.8,
    },
    politicalClimate: 'Complex political landscape with ethnic and immigration issues dominating the discourse.'
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
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    description: 'A resource-rich state known for its forests and tribal culture, facing Naxal insurgency challenges.',
    demographics: {
      population: 30_000_000,
      gdp: 45_000_000_000,
      literacyRate: 70.3,
      crimeRate: 36.4,
    },
    initialStats: {
      budget: 58,
      publicOpinion: 48,
      policeStrength: 70,
      oppositionStrength: 40,
      unemploymentRate: 14.9,
    },
    politicalClimate: 'Focused on balancing industrial growth with tribal rights. Security is a major electoral issue.'
  },
  {
    id: 'goa',
    name: 'Goa',
    description: 'A popular tourist destination with beautiful beaches and a vibrant culture.',
    demographics: {
      population: 1_500_000,
      gdp: 12_000_000_000,
      literacyRate: 88.7,
      crimeRate: 45.3,
    },
    initialStats: {
      budget: 65,
      publicOpinion: 70,
      policeStrength: 58,
      oppositionStrength: 30,
      unemploymentRate: 8.7,
    },
    politicalClimate: 'Environmental conservation vs. tourism development is a central political theme.'
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    description: 'An industrial powerhouse with a long coastline and a strong entrepreneurial spirit.',
    demographics: {
      population: 70_000_000,
      gdp: 250_000_000_000,
      literacyRate: 78.0,
      crimeRate: 22.1,
    },
    initialStats: {
      budget: 75,
      publicOpinion: 62,
      policeStrength: 65,
      oppositionStrength: 38,
      unemploymentRate: 5.4,
    },
    politicalClimate: 'Dominated by a single party for decades. Focus is on economic growth and large-scale infrastructure projects.'
  },
  {
    id: 'haryana',
    name: 'Haryana',
    description: 'An agricultural state that is also a major manufacturing and IT hub.',
    demographics: {
      population: 30_000_000,
      gdp: 110_000_000_000,
      literacyRate: 75.6,
      crimeRate: 40.1,
    },
    initialStats: {
      budget: 68,
      publicOpinion: 55,
      policeStrength: 60,
      oppositionStrength: 45,
      unemploymentRate: 9.0,
    },
    politicalClimate: 'Jat politics and agricultural issues often determine election outcomes. Water sharing is a contentious issue.'
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    description: 'A Himalayan state known for its tourism, apples, and hydropower.',
    demographics: {
      population: 7_500_000,
      gdp: 25_000_000_000,
      literacyRate: 82.8,
      crimeRate: 29.8,
    },
    initialStats: {
      budget: 52,
      publicOpinion: 72,
      policeStrength: 68,
      oppositionStrength: 28,
      unemploymentRate: 11.2,
    },
    politicalClimate: 'A two-party state where government changes frequently. Tourism and environmental policies are key.'
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    description: 'Rich in mineral resources, this state is working to overcome poverty and political instability.',
    demographics: {
      population: 39_000_000,
      gdp: 40_000_000_000,
      literacyRate: 66.4,
      crimeRate: 35.2,
    },
    initialStats: {
      budget: 48,
      publicOpinion: 45,
      policeStrength: 55,
      oppositionStrength: 55,
      unemploymentRate: 18.0,
    },
    politicalClimate: 'Tribal rights and industrial displacement are major political issues. Governance is often fragmented.'
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    description: 'Home to India\'s Silicon Valley, with a diverse economy spanning IT, manufacturing, and agriculture.',
    demographics: {
      population: 68_000_000,
      gdp: 280_000_000_000,
      literacyRate: 75.4,
      crimeRate: 32.7,
    },
    initialStats: {
      budget: 72,
      publicOpinion: 58,
      policeStrength: 60,
      oppositionStrength: 42,
      unemploymentRate: 7.8,
    },
    politicalClimate: 'Multi-cornered political contests are common. Water disputes and urban infrastructure are major issues.'
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
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    description: 'The "Heart of India", a large state with significant agricultural and mineral wealth.',
    demographics: {
      population: 85_000_000,
      gdp: 120_000_000_000,
      literacyRate: 69.3,
      crimeRate: 34.5,
    },
    initialStats: {
      budget: 55,
      publicOpinion: 50,
      policeStrength: 58,
      oppositionStrength: 50,
      unemploymentRate: 16.5,
    },
    politicalClimate: 'A bipolar political system. Agricultural distress and tribal welfare are key election planks.'
  },
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
    id: 'manipur',
    name: 'Manipur',
    description: 'A state known for its rich culture and sports achievements, dealing with insurgency and ethnic conflicts.',
    demographics: {
      population: 3_200_000,
      gdp: 4_500_000_000,
      literacyRate: 79.2,
      crimeRate: 48.7,
    },
    initialStats: {
      budget: 40,
      publicOpinion: 42,
      policeStrength: 75,
      oppositionStrength: 58,
      unemploymentRate: 13.6,
    },
    politicalClimate: 'Volatile political environment due to ethnic tensions and demands for greater autonomy. AFSPA is a major issue.'
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    description: 'The "Abode of Clouds", a picturesque state with unique matrilineal societies.',
    demographics: {
      population: 3_300_000,
      gdp: 5_000_000_000,
      literacyRate: 74.4,
      crimeRate: 27.6,
    },
    initialStats: {
      budget: 47,
      publicOpinion: 66,
      policeStrength: 60,
      oppositionStrength: 34,
      unemploymentRate: 9.5,
    },
    politicalClimate: 'Coalition politics are common. Illegal mining and tribal rights are key political issues.'
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    description: 'A peaceful state with a high literacy rate and a strong sense of community.',
    demographics: {
      population: 1_200_000,
      gdp: 3_500_000_000,
      literacyRate: 91.3,
      crimeRate: 24.1,
    },
    initialStats: {
      budget: 50,
      publicOpinion: 75,
      policeStrength: 62,
      oppositionStrength: 25,
      unemploymentRate: 8.9,
    },
    politicalClimate: 'Dominated by regional parties. The Mizo peace accord is a cornerstone of its stability.'
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    description: 'A vibrant state with diverse tribes and a long history of seeking greater political autonomy.',
    demographics: {
      population: 2_200_000,
      gdp: 4_000_000_000,
      literacyRate: 79.6,
      crimeRate: 18.2,
    },
    initialStats: {
      budget: 42,
      publicOpinion: 55,
      policeStrength: 72,
      oppositionStrength: 45,
      unemploymentRate: 15.7,
    },
    politicalClimate: 'The Naga political issue and the ongoing peace talks heavily influence state politics.'
  },
  {
    id: 'odisha',
    name: 'Odisha',
    description: 'A state rich in culture and minerals, frequently hit by natural disasters like cyclones.',
    demographics: {
      population: 46_000_000,
      gdp: 75_000_000_000,
      literacyRate: 72.9,
      crimeRate: 29.3,
    },
    initialStats: {
      budget: 62,
      publicOpinion: 60,
      policeStrength: 55,
      oppositionStrength: 40,
      unemploymentRate: 14.1,
    },
    politicalClimate: 'Dominated by a strong regional party. Disaster management and industrial investment are key priorities.'
  },
  {
    id: 'punjab',
    name: 'Punjab',
    description: 'The "Granary of India", a prosperous agricultural state facing issues of drug abuse and water depletion.',
    demographics: {
      population: 30_000_000,
      gdp: 80_000_000_000,
      literacyRate: 75.8,
      crimeRate: 31.9,
    },
    initialStats: {
      budget: 58,
      publicOpinion: 53,
      policeStrength: 64,
      oppositionStrength: 47,
      unemploymentRate: 10.2,
    },
    politicalClimate: 'Farm laws, drug menace, and sacrilege incidents are sensitive and influential political issues.'
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    description: 'The "Land of Kings", a vast desert state with a rich history and a thriving tourism industry.',
    demographics: {
      population: 81_000_000,
      gdp: 140_000_000_000,
      literacyRate: 66.1,
      crimeRate: 36.8,
    },
    initialStats: {
      budget: 63,
      publicOpinion: 56,
      policeStrength: 60,
      oppositionStrength: 44,
      unemploymentRate: 12.8,
    },
    politicalClimate: 'A two-party state where power alternates. Water scarcity and tourism are major concerns.'
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    description: 'A small, pristine state in the Himalayas, known for its organic farming and stunning landscapes.',
    demographics: {
      population: 700_000,
      gdp: 4_000_000_000,
      literacyRate: 81.4,
      crimeRate: 22.5,
    },
    initialStats: {
      budget: 55,
      publicOpinion: 78,
      policeStrength: 65,
      oppositionStrength: 22,
      unemploymentRate: 7.5,
    },
    politicalClimate: 'Dominated by a regional party for a long time. Focus on environmental issues and sustainable development.'
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    description: 'A major manufacturing and automotive hub with a rich cultural and linguistic heritage.',
    demographics: {
      population: 77_000_000,
      gdp: 300_000_000_000,
      literacyRate: 80.1,
      crimeRate: 25.6,
    },
    initialStats: {
      budget: 68,
      publicOpinion: 60,
      policeStrength: 58,
      oppositionStrength: 40,
      unemploymentRate: 6.9,
    },
    politicalClimate: 'Dravidian politics, language, and social justice are central to the state\'s political identity.'
  },
  {
    id: 'telangana',
    name: 'Telangana',
    description: 'A newly formed state with a booming IT sector and a focus on irrigation projects.',
    demographics: {
      population: 39_000_000,
      gdp: 140_000_000_000,
      literacyRate: 66.5,
      crimeRate: 33.4,
    },
    initialStats: {
      budget: 65,
      publicOpinion: 62,
      policeStrength: 60,
      oppositionStrength: 38,
      unemploymentRate: 8.2,
    },
    politicalClimate: 'Dominated by the party that led the statehood movement. Welfare schemes and agricultural growth are priorities.'
  },
  {
    id: 'tripura',
    name: 'Tripura',
    description: 'A hilly state in Northeast India with a history of ethnic diversity and political change.',
    demographics: {
      population: 4_100_000,
      gdp: 8_000_000_000,
      literacyRate: 87.2,
      crimeRate: 30.1,
    },
    initialStats: {
      budget: 49,
      publicOpinion: 54,
      policeStrength: 63,
      oppositionStrength: 46,
      unemploymentRate: 16.3,
    },
    politicalClimate: 'Has seen a major political shift in recent years. Connectivity and tribal welfare are key issues.'
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    description: 'India\'s most populous state, with significant political influence and a diverse economy.',
    demographics: {
      population: 240_000_000,
      gdp: 250_000_000_000,
      literacyRate: 67.7,
      crimeRate: 39.5,
    },
    initialStats: {
      budget: 45,
      publicOpinion: 48,
      policeStrength: 50,
      oppositionStrength: 52,
      unemploymentRate: 19.8,
    },
    politicalClimate: 'Complex caste and religious equations drive politics. Law and order is a major and recurring electoral issue.'
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    description: 'A Himalayan state known for its religious tourism and natural beauty, facing environmental challenges.',
    demographics: {
      population: 11_000_000,
      gdp: 35_000_000_000,
      literacyRate: 78.8,
      crimeRate: 28.1,
    },
    initialStats: {
      budget: 53,
      publicOpinion: 64,
      policeStrength: 66,
      oppositionStrength: 36,
      unemploymentRate: 10.8,
    },
    politicalClimate: 'Environmental conservation and pilgrimage management are key issues. Politics are competitive.'
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    description: 'A state with a rich literary and cultural history, known for its political fervor.',
    demographics: {
      population: 99_000_000,
      gdp: 190_000_000_000,
      literacyRate: 76.3,
      crimeRate: 33.7,
    },
    initialStats: {
      budget: 50,
      publicOpinion: 51,
      policeStrength: 55,
      oppositionStrength: 49,
      unemploymentRate: 17.4,
    },
    politicalClimate: 'Intense and often violent political competition. Issues of political violence and industrial revival are prominent.'
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
