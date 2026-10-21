export const MARKET_INDICES = [
  { symbol: '^GSPC', name: 'S&P 500', price: 5842.10, change: 48.30, changePercent: 0.83, positive: true },
  { symbol: '^IXIC', name: 'NASDAQ', price: 18518.61, change: 215.40, changePercent: 1.18, positive: true },
  { symbol: '^DJI', name: 'Dow Jones', price: 43239.05, change: 112.10, changePercent: 0.26, positive: true },
  { symbol: 'BTC-USD', name: 'Bitcoin', price: 68420.00, change: 2310.50, changePercent: 3.49, positive: true },
  { symbol: 'ETH-USD', name: 'Ethereum', price: 2750.80, change: -42.10, changePercent: -1.51, positive: false },
];

export const STOCKS_DATA = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 139.50,
    change: 6.80,
    changePercent: 5.13,
    positive: true,
    category: 'gainer',
    highGrowth: true,
    marketCap: '3.42T',
    peRatio: 65.4,
    high52: 140.76,
    low52: 39.23,
    volume: '64.2M',
    sector: 'Semiconductors & AI',
    description: 'NVIDIA Corporation designs graphics processing units for the gaming and professional markets, as well as system on a chip units for the mobile computing and automotive market.',
    sparkline: [131, 132.5, 131.8, 134, 136.2, 135.5, 139.5],
    history: {
      '1H': [139.1, 139.2, 139.3, 139.0, 139.4, 139.5],
      '1D': [132.7, 133.5, 134.2, 136.0, 135.8, 138.1, 139.5],
      '1W': [128.0, 130.2, 132.5, 131.0, 135.0, 137.2, 139.5],
      '1M': [118.0, 122.5, 120.0, 125.4, 130.2, 135.0, 139.5],
    },
    news: [
      { id: 1, title: 'NVIDIA Blackwell Chips See Unprecedented Enterprise Demand Heading Into Q4', time: '2h ago', source: 'Bloomberg', sentiment: 'bullish' },
      { id: 2, title: 'Why Wall Street Analysts Just Raised NVIDIA Price Target to $165', time: '5h ago', source: 'Reuters', sentiment: 'bullish' },
      { id: 3, title: 'AI Infrastructure Spending Surges Across Hyperscalers', time: '1d ago', source: 'CNBC', sentiment: 'neutral' }
    ]
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies Inc.',
    price: 45.20,
    change: 2.75,
    changePercent: 6.47,
    positive: true,
    category: 'gainer',
    highGrowth: true,
    marketCap: '101.4B',
    peRatio: 112.8,
    high52: 45.95,
    low52: 15.68,
    volume: '52.8M',
    sector: 'Software & AI',
    description: 'Palantir Technologies builds software that empowers organizations to effectively integrate their data, decisions, and operations.',
    sparkline: [42.4, 43.1, 42.9, 44.0, 44.8, 44.5, 45.2],
    history: {
      '1H': [45.0, 45.1, 45.05, 45.15, 45.2],
      '1D': [42.45, 43.1, 43.8, 44.2, 44.9, 45.2],
      '1W': [39.5, 40.2, 41.5, 42.1, 43.8, 45.2],
      '1M': [34.0, 36.5, 38.2, 41.0, 43.5, 45.2],
    },
    news: [
      { id: 1, title: 'Palantir Wins Major Defense Contract Expansion Worth $450M', time: '1h ago', source: 'Defense Daily', sentiment: 'bullish' },
      { id: 2, title: 'Commercial AIP Bootcamps Drive Record Enterprise Customer Acquisition', time: '4h ago', source: 'TechCrunch', sentiment: 'bullish' }
    ]
  },
  {
    symbol: 'ARM',
    name: 'Arm Holdings plc',
    price: 152.80,
    change: 7.10,
    changePercent: 4.88,
    positive: true,
    category: 'gainer',
    highGrowth: true,
    marketCap: '156.7B',
    peRatio: 125.0,
    high52: 188.75,
    low52: 46.50,
    volume: '28.4M',
    sector: 'Semiconductors',
    description: 'Arm Holdings architects, develops, and licenses high-performance, low-cost, and energy-efficient CPU products and related technology.',
    sparkline: [145.7, 147.2, 146.8, 149.0, 151.2, 150.5, 152.8],
    history: {
      '1H': [152.0, 152.3, 152.5, 152.8],
      '1D': [145.7, 148.2, 149.5, 151.0, 152.8],
      '1W': [140.0, 142.5, 146.0, 149.2, 152.8],
      '1M': [130.0, 135.0, 142.0, 148.0, 152.8],
    },
    news: [
      { id: 1, title: 'Arm Architecture Dominates Next-Gen Windows Laptops', time: '3h ago', source: 'The Verge', sentiment: 'bullish' }
    ]
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 218.40,
    change: -11.60,
    changePercent: -5.04,
    positive: false,
    category: 'loser',
    highGrowth: false,
    marketCap: '698.2B',
    peRatio: 58.2,
    high52: 271.00,
    low52: 138.80,
    volume: '78.5M',
    sector: 'Automotive & Clean Energy',
    description: 'Tesla designs, develops, manufactures, sells, and leases high-performance fully electric vehicles, energy generation and storage systems.',
    sparkline: [230.0, 228.5, 226.0, 224.2, 221.0, 220.0, 218.4],
    history: {
      '1H': [219.2, 219.0, 218.8, 218.4],
      '1D': [230.0, 227.5, 225.0, 221.5, 218.4],
      '1W': [242.0, 238.5, 230.0, 225.0, 218.4],
      '1M': [250.0, 242.0, 235.0, 228.0, 218.4],
    },
    news: [
      { id: 1, title: 'Tesla Faces Margin Pressures Amid Global EV Price Wars', time: '2h ago', source: 'Wall Street Journal', sentiment: 'bearish' },
      { id: 2, title: 'Robotaxi Regulatory Approval Timeline Discussed in Latest Earnings Call', time: '6h ago', source: 'Financial Times', sentiment: 'neutral' }
    ]
  },
  {
    symbol: 'INTC',
    name: 'Intel Corporation',
    price: 22.15,
    change: -1.25,
    changePercent: -5.34,
    positive: false,
    category: 'loser',
    highGrowth: false,
    marketCap: '95.1B',
    peRatio: -18.4,
    high52: 45.00,
    low52: 18.51,
    volume: '45.1M',
    sector: 'Semiconductors',
    description: 'Intel Corporation engages in the design and manufacturing of digital technology platforms, focusing on computing and communications.',
    sparkline: [23.4, 23.2, 23.0, 22.8, 22.5, 22.3, 22.15],
    history: {
      '1H': [22.3, 22.2, 22.18, 22.15],
      '1D': [23.4, 23.1, 22.8, 22.4, 22.15],
      '1W': [24.0, 23.8, 23.2, 22.7, 22.15],
      '1M': [21.5, 22.5, 23.0, 22.8, 22.15],
    },
    news: [
      { id: 1, title: 'Intel Foundry Strategy Under Scrutiny as Competitors Gain Ground', time: '5h ago', source: 'Reuters', sentiment: 'bearish' }
    ]
  },
  {
    symbol: 'PFE',
    name: 'Pfizer Inc.',
    price: 28.45,
    change: -0.95,
    changePercent: -3.23,
    positive: false,
    category: 'loser',
    highGrowth: false,
    marketCap: '161.2B',
    peRatio: 31.5,
    high52: 32.70,
    low52: 24.52,
    volume: '31.2M',
    sector: 'Healthcare & Pharmaceuticals',
    description: 'Pfizer discovers, develops, manufactures, and distributes biopharmaceuticals, including vaccines and targeted therapeutics.',
    sparkline: [29.4, 29.2, 29.0, 28.9, 28.7, 28.5, 28.45],
    history: {
      '1H': [28.5, 28.48, 28.46, 28.45],
      '1D': [29.4, 29.1, 28.9, 28.6, 28.45],
      '1W': [30.1, 29.8, 29.2, 28.8, 28.45],
      '1M': [27.5, 28.2, 29.0, 29.5, 28.45],
    },
    news: [
      { id: 1, title: 'Pfizer Reports Mixed Results on Experimental Obesity Drug Trials', time: '7h ago', source: 'STAT News', sentiment: 'neutral' }
    ]
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 235.60,
    change: 3.40,
    changePercent: 1.46,
    positive: true,
    category: 'growth',
    highGrowth: true,
    marketCap: '3.58T',
    peRatio: 35.2,
    high52: 237.23,
    low52: 165.67,
    volume: '42.1M',
    sector: 'Consumer Electronics',
    description: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services.',
    sparkline: [232.2, 233.0, 232.8, 234.1, 234.8, 235.0, 235.6],
    history: {
      '1H': [235.2, 235.3, 235.5, 235.6],
      '1D': [232.2, 233.1, 233.9, 234.5, 235.6],
      '1W': [228.0, 230.5, 232.0, 234.0, 235.6],
      '1M': [220.0, 225.0, 230.0, 233.0, 235.6],
    },
    news: [
      { id: 1, title: 'Apple Intelligence Rollout Drives Strong iPhone 16 Upgrade Cycle', time: '3h ago', source: '9to5Mac', sentiment: 'bullish' },
      { id: 2, title: 'Services Revenue Hits Record High in Latest Fiscal Quarter', time: '1d ago', source: 'Bloomberg', sentiment: 'bullish' }
    ]
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 422.50,
    change: 5.10,
    changePercent: 1.22,
    positive: true,
    category: 'growth',
    highGrowth: true,
    marketCap: '3.14T',
    peRatio: 36.8,
    high52: 468.35,
    low52: 326.53,
    volume: '21.5M',
    sector: 'Software & Cloud',
    description: 'Microsoft develops and supports software, services, devices and solutions, best known for its Windows operating systems and Azure cloud platform.',
    sparkline: [417.4, 418.5, 419.2, 420.1, 421.0, 421.8, 422.5],
    history: {
      '1H': [422.0, 422.2, 422.4, 422.5],
      '1D': [417.4, 419.0, 420.5, 421.2, 422.5],
      '1W': [410.0, 414.0, 418.0, 420.5, 422.5],
      '1M': [400.0, 408.0, 415.0, 420.0, 422.5],
    },
    news: [
      { id: 1, title: 'Azure Cloud Growth Accelerates Due to Enterprise AI Adoption', time: '4h ago', source: 'CNBC', sentiment: 'bullish' }
    ]
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 168.30,
    change: 2.10,
    changePercent: 1.26,
    positive: true,
    category: 'growth',
    highGrowth: true,
    marketCap: '2.10T',
    peRatio: 24.1,
    high52: 191.75,
    low52: 120.21,
    volume: '24.8M',
    sector: 'Internet & Services',
    description: 'Alphabet offers various products and platforms in the United States, Europe, the Middle East, Africa, Asia-Pacific, Canada, and Latin America, including Google Search and YouTube.',
    sparkline: [166.2, 166.9, 167.4, 167.2, 167.8, 168.0, 168.3],
    history: {
      '1H': [168.0, 168.1, 168.2, 168.3],
      '1D': [166.2, 167.0, 167.5, 167.9, 168.3],
      '1W': [162.0, 164.5, 166.0, 167.2, 168.3],
      '1M': [155.0, 160.0, 164.0, 166.5, 168.3],
    },
    news: [
      { id: 1, title: 'Google Gemini 1.5 Pro Updates Unveiled for Cloud Enterprise Developers', time: '6h ago', source: 'TechCrunch', sentiment: 'bullish' }
    ]
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 186.40,
    change: 3.20,
    changePercent: 1.75,
    positive: true,
    category: 'growth',
    highGrowth: true,
    marketCap: '1.94T',
    peRatio: 43.5,
    high52: 201.20,
    low52: 118.35,
    volume: '34.6M',
    sector: 'E-Commerce & Cloud',
    description: 'Amazon focuses on retail sale of consumer products and subscriptions through online and physical stores, alongside AWS cloud computing.',
    sparkline: [183.2, 184.0, 184.5, 185.1, 185.8, 186.0, 186.4],
    history: {
      '1H': [186.1, 186.2, 186.3, 186.4],
      '1D': [183.2, 184.4, 185.0, 185.8, 186.4],
      '1W': [178.0, 181.0, 183.5, 185.0, 186.4],
      '1M': [170.0, 176.0, 181.0, 184.5, 186.4],
    },
    news: [
      { id: 1, title: 'AWS Announces Major Expansion of European Sovereign Cloud Regions', time: '5h ago', source: 'ZDNet', sentiment: 'bullish' }
    ]
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 156.20,
    change: 4.30,
    changePercent: 2.83,
    positive: true,
    category: 'growth',
    highGrowth: true,
    marketCap: '252.4B',
    peRatio: 115.2,
    high52: 227.30,
    low52: 92.50,
    volume: '41.2M',
    sector: 'Semiconductors',
    description: 'AMD operates as a semiconductor company worldwide, offering x86 microprocessors, GPUs, chipsets, and embedded processors.',
    sparkline: [151.9, 153.0, 152.5, 154.2, 155.0, 155.8, 156.2],
    history: {
      '1H': [155.8, 156.0, 156.1, 156.2],
      '1D': [151.9, 153.2, 154.1, 155.0, 156.2],
      '1W': [148.0, 150.5, 153.0, 155.0, 156.2],
      '1M': [140.0, 145.0, 150.0, 154.0, 156.2],
    },
    news: [
      { id: 1, title: 'AMD MI300X AI Accelerators Gain Traction Among Tier-2 Cloud Providers', time: '4h ago', source: 'EE Times', sentiment: 'bullish' }
    ]
  },
  {
    symbol: 'NFLX',
    name: 'Netflix, Inc.',
    price: 725.10,
    change: 14.20,
    changePercent: 2.00,
    positive: true,
    category: 'growth',
    highGrowth: true,
    marketCap: '312.8B',
    peRatio: 45.6,
    high52: 735.50,
    low52: 344.73,
    volume: '4.8M',
    sector: 'Entertainment & Streaming',
    description: 'Netflix provides entertainment services, offering TV series, documentaries, feature games and films across a wide variety of genres and languages.',
    sparkline: [710.9, 715.0, 713.5, 718.0, 720.2, 722.5, 725.1],
    history: {
      '1H': [724.0, 724.5, 724.8, 725.1],
      '1D': [710.9, 716.2, 719.0, 722.0, 725.1],
      '1W': [690.0, 700.0, 710.0, 718.0, 725.1],
      '1M': [670.0, 685.0, 702.0, 715.0, 725.1],
    },
    news: [
      { id: 1, title: 'Netflix Live Sports Strategy Pays Off with Record Ad-Tier Signups', time: '2h ago', source: 'Variety', sentiment: 'bullish' }
    ]
  }
];

export const FINANCIAL_NEWS = [
  {
    id: 1,
    title: 'Federal Reserve Signals Potential Rate Cut Amid Cooling Inflation Metrics',
    summary: 'Central bank officials indicate growing confidence that inflation is returning to the 2% target, paving the way for monetary easing.',
    source: 'Financial Times',
    time: '35m ago',
    category: 'Macro',
    related: ['^GSPC', '^IXIC', '^DJI'],
    impact: 'positive'
  },
  {
    id: 2,
    title: 'Global Semiconductor Supply Chains Rebound as AI Chip Demand Skyrockets',
    summary: 'Leading foundries report record utilization rates as hyperscalers expand capital expenditure budgets for next-generation data centers.',
    source: 'Wall Street Journal',
    time: '2h ago',
    category: 'Semiconductors',
    related: ['NVDA', 'ARM', 'AMD', 'INTC'],
    impact: 'positive'
  },
  {
    id: 3,
    title: 'EV Market Consolidation Accelerates as Legacy Automakers Shift Strategy',
    summary: 'Stricter emission standards and shifting consumer preferences force manufacturers to reevaluate electric vehicle production targets.',
    source: 'Bloomberg',
    time: '4h ago',
    category: 'Automotive',
    related: ['TSLA'],
    impact: 'negative'
  },
  {
    id: 4,
    title: 'Cloud Giants Record Massive Q3 Infrastructure Revenue Growth Driven by Enterprise AI',
    summary: 'AWS, Azure, and Google Cloud exceed consensus estimates as corporate clients migrate legacy workloads to accelerated computing environments.',
    source: 'Reuters',
    time: '5h ago',
    category: 'Cloud',
    related: ['MSFT', 'AMZN', 'GOOGL', 'AAPL'],
    impact: 'positive'
  }
];
