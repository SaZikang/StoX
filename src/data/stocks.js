export const MARKET_INDICES = [
  { symbol: '^GSPC', name: 'S&P 500', price: 5842.10, change: 48.30, changePercent: 0.83, positive: true },
  { symbol: '^IXIC', name: 'NASDAQ', price: 18518.61, change: 215.40, changePercent: 1.18, positive: true },
  { symbol: '^DJI', name: 'Dow Jones', price: 43239.05, change: 112.10, changePercent: 0.26, positive: true },
  { symbol: '^KLSE', name: 'FTSE Bursa Malaysia KLCI', price: 1628.40, change: 12.50, changePercent: 0.77, positive: true },
];

export const COUNTRY_STOCKS = {
  malaysia: [
    { symbol: '1155.KL', name: 'Malayan Banking Berhad (Maybank)', price: 10.42, change: 0.12, changePercent: 1.16, positive: true, sector: 'Banking', country: 'Malaysia', marketCap: '125.4B MYR' },
    { symbol: '1295.KL', name: 'Public Bank Berhad', price: 4.52, change: 0.04, changePercent: 0.89, positive: true, sector: 'Banking', country: 'Malaysia', marketCap: '87.9B MYR' },
    { symbol: '5347.KL', name: 'Tenaga Nasional Berhad', price: 14.10, change: 0.22, changePercent: 1.58, positive: true, sector: 'Utilities', country: 'Malaysia', marketCap: '81.2B MYR' },
    { symbol: '1023.KL', name: 'CIMB Group Holdings', price: 8.15, change: -0.06, changePercent: -0.73, positive: false, sector: 'Banking', country: 'Malaysia', marketCap: '87.4B MYR' },
    { symbol: '5183.KL', name: 'Petronas Chemicals', price: 5.48, change: -0.10, changePercent: -1.79, positive: false, sector: 'Chemicals', country: 'Malaysia', marketCap: '43.8B MYR' }
  ],
  us: [
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 139.50, change: 6.80, changePercent: 5.13, positive: true, sector: 'Semiconductors', country: 'United States', marketCap: '3.42T' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 235.60, change: 3.40, changePercent: 1.46, positive: true, sector: 'Consumer Electronics', country: 'United States', marketCap: '3.58T' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 422.50, change: 5.10, changePercent: 1.22, positive: true, sector: 'Cloud & AI', country: 'United States', marketCap: '3.14T' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 218.40, change: -11.60, changePercent: -5.04, positive: false, sector: 'Automotive', country: 'United States', marketCap: '698.2B' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 186.40, change: 3.20, changePercent: 1.75, positive: true, sector: 'E-Commerce', country: 'United States', marketCap: '1.94T' }
  ],
  china: [
    { symbol: 'BABA', name: 'Alibaba Group Holding Ltd', price: 98.40, change: 4.20, changePercent: 4.45, positive: true, sector: 'E-Commerce', country: 'China', marketCap: '236.5B' },
    { symbol: 'TCEHY', name: 'Tencent Holdings Limited', price: 52.10, change: 1.80, changePercent: 3.58, positive: true, sector: 'Internet & Gaming', country: 'China', marketCap: '489.2B' },
    { symbol: 'BIDU', name: 'Baidu, Inc.', price: 92.30, change: -2.10, changePercent: -2.22, positive: false, sector: 'AI & Search', country: 'China', marketCap: '32.1B' },
    { symbol: 'JD', name: 'JD.com, Inc.', price: 34.20, change: 0.90, changePercent: 2.70, positive: true, sector: 'E-Commerce', country: 'China', marketCap: '53.4B' }
  ],
  others: [
    { symbol: 'TSM', name: 'Taiwan Semiconductor (TSMC)', price: 194.50, change: 6.20, changePercent: 3.29, positive: true, sector: 'Semiconductors', country: 'Taiwan', marketCap: '1.01T' },
    { symbol: 'ASML', name: 'ASML Holding N.V.', price: 782.10, change: 15.30, changePercent: 2.00, positive: true, sector: 'Semiconductor Equip', country: 'Netherlands', marketCap: '312.4B' },
    { symbol: 'SHEL', name: 'Shell plc', price: 68.40, change: -0.40, changePercent: -0.58, positive: false, sector: 'Energy', country: 'United Kingdom', marketCap: '218.5B' }
  ]
};

export const STOCKS_DATA = [
  ...COUNTRY_STOCKS.malaysia,
  ...COUNTRY_STOCKS.us,
  ...COUNTRY_STOCKS.china,
  ...COUNTRY_STOCKS.others,
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
    description: 'NVIDIA Corporation designs graphics processing units for gaming and professional markets, as well as AI data centers.',
    sparkline: [131, 132.5, 131.8, 134, 136.2, 135.5, 139.5],
    history: { '1H': [139.1, 139.2, 139.3, 139.5], '1D': [132.7, 134.2, 138.1, 139.5], '1W': [128.0, 132.5, 137.2, 139.5], '1M': [118.0, 125.4, 135.0, 139.5] },
    news: [{ id: 1, title: 'NVIDIA Blackwell Chips See Unprecedented Enterprise Demand', time: '2h ago', source: 'Bloomberg', sentiment: 'bullish' }]
  },
  {
    symbol: 'NOW',
    name: 'ServiceNow, Inc.',
    price: 945.20,
    change: 18.40,
    changePercent: 1.98,
    positive: true,
    category: 'growth',
    highGrowth: true,
    marketCap: '194.5B',
    peRatio: 92.4,
    high52: 960.00,
    low52: 650.10,
    volume: '2.1M',
    sector: 'Enterprise Cloud Software',
    description: 'ServiceNow provides cloud computing platforms that help companies manage digital workflows.',
    sparkline: [920, 925, 930, 935, 940, 942, 945.2],
    history: { '1H': [944, 944.8, 945.2], '1D': [925, 935, 940, 945.2], '1W': [910, 925, 935, 945.2], '1M': [880, 900, 920, 945.2] },
    news: [{ id: 1, title: 'ServiceNow Expands AI Workflow Suite', time: '3h ago', source: 'WSJ', sentiment: 'bullish' }]
  },
  {
    symbol: 'MU',
    name: 'Micron Technology, Inc.',
    price: 108.30,
    change: 4.60,
    changePercent: 4.43,
    positive: true,
    category: 'gainer',
    highGrowth: true,
    marketCap: '120.1B',
    peRatio: 28.5,
    high52: 157.54,
    low52: 62.15,
    volume: '28.4M',
    sector: 'Semiconductors & Memory',
    description: 'Micron Technology is a world leader in innovative memory and storage solutions.',
    sparkline: [101, 103, 102.5, 105, 106.8, 107.5, 108.3],
    history: { '1H': [108.0, 108.3], '1D': [101.5, 105.0, 108.3], '1W': [98.0, 104.0, 108.3], '1M': [92.0, 102.0, 108.3] },
    news: [{ id: 1, title: 'HBM3E Memory Demand Surges for AI Servers', time: '4h ago', source: 'Bloomberg', sentiment: 'bullish' }]
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
    description: 'Tesla designs and manufactures electric vehicles and energy storage systems.',
    sparkline: [230.0, 228.5, 226.0, 224.2, 221.0, 220.0, 218.4],
    history: { '1H': [219.0, 218.4], '1D': [230.0, 225.0, 218.4], '1W': [242.0, 230.0, 218.4], '1M': [250.0, 235.0, 218.4] },
    news: [{ id: 1, title: 'Tesla Faces Margin Pressures Amid Global EV Price Wars', time: '2h ago', source: 'WSJ', sentiment: 'bearish' }]
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
    description: 'Apple designs and manufactures smartphones, personal computers, and services.',
    sparkline: [232.2, 233.0, 232.8, 234.1, 234.8, 235.0, 235.6],
    history: { '1H': [235.2, 235.6], '1D': [232.2, 234.5, 235.6], '1W': [228.0, 232.0, 235.6], '1M': [220.0, 230.0, 235.6] },
    news: [{ id: 1, title: 'Apple Intelligence Rollout Drives Strong iPhone 16 Upgrade Cycle', time: '3h ago', source: '9to5Mac', sentiment: 'bullish' }]
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
    description: 'Microsoft develops and supports software, services, devices and solutions.',
    sparkline: [417.4, 418.5, 419.2, 420.1, 421.0, 421.8, 422.5],
    history: { '1H': [422.0, 422.5], '1D': [417.4, 420.5, 422.5], '1W': [410.0, 418.0, 422.5], '1M': [400.0, 415.0, 422.5] },
    news: [{ id: 1, title: 'Azure Cloud Growth Accelerates Due to Enterprise AI', time: '4h ago', source: 'CNBC', sentiment: 'bullish' }]
  }
];

export const FINANCIAL_NEWS = [
  {
    id: 1,
    title: 'Federal Reserve Signals Potential Rate Cut Amid Cooling Inflation Metrics',
    summary: 'Central bank officials indicate growing confidence that inflation is returning to the 2% target, paving the way for monetary easing across global debt markets.',
    fullContent: `Federal Reserve Chairman Jerome Powell noted in today's address that incoming economic data suggests inflation is sustainably cooling toward the 2% objective, giving the central bank flexibility to consider adjustments to the federal funds rate in the coming months.\n\nAnalysts across Wall Street, London, and Asian financial centers are currently pricing in an aggressive 75 basis point reduction spread over the next two quarters. Government bond yields dipped across the curve immediately following the announcement, with the 10-year Treasury yield sliding to 3.82%.\n\nHigh-growth equities, real estate investment trusts, and emerging market currencies rallied sharply in response to the dovish pivot. Institutional portfolio managers report reallocating capital into growth-oriented tech stocks and multinational financial institutions as borrowing costs soften. However, some conservative economists warn that persistent labor market resilience could trigger renewed wage pressures if monetary policy eases too rapidly.`,
    source: 'Financial Times',
    time: '35m ago',
    category: 'Macro',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    related: ['^GSPC', '^IXIC', '^KLSE'],
    impact: 'positive'
  },
  {
    id: 2,
    title: 'Bursa Malaysia Reaches New Highs Driven by Strong Banking and Utilities Sectors',
    summary: 'Maybank and Tenaga Nasional lead local institutional buying momentum as foreign capital returns to Southeast Asian equities.',
    fullContent: `Bursa Malaysia touched multi-month highs today, underpinned by robust buying in heavyweight banking counters like Malayan Banking Berhad (Maybank: 1155.KL) and Public Bank Berhad (1295.KL). Tenaga Nasional Berhad (5347.KL) also surged following strategic announcements regarding the National Energy Transition Roadmap.\n\nForeign net inflows into Malaysian equities reached RM1.2 billion this month, reflecting renewed international confidence in Malaysia's fiscal consolidation efforts, currency stability, and burgeoning semiconductor packaging hub in Penang.\n\nLocal fund managers emphasize that Malaysian blue-chip equities continue to offer attractive dividend yields compared to regional peers, making them a preferred destination for defensive capital rotation amidst global macroeconomic volatility.`,
    source: 'The Edge Malaysia',
    time: '1h ago',
    category: 'Bursa Malaysia',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    related: ['1155.KL', '5347.KL', '1295.KL'],
    impact: 'positive'
  },
  {
    id: 3,
    title: 'Global Semiconductor Supply Chains Rebound as AI Chip Demand Skyrockets',
    summary: 'Leading foundries including TSMC and ASML report record utilization rates as hyperscalers expand capital expenditure budgets.',
    fullContent: `Semiconductor manufacturers across Taiwan, the United States, and Europe are experiencing unprecedented demand for advanced node 3nm and 2nm silicon wafers. Taiwan Semiconductor Manufacturing Company (TSMC: TSM) and ASML Holding (ASML) reported order books filled well into late 2027.\n\nThe unprecedented surge is driven by enterprise generative AI training clusters, large language model inference datacenters, and next-generation automotive computing platforms. Hyperscale cloud providers have collectively increased their capital expenditure forecasts by 35% year-over-year.\n\nIndustry analysts note that while fabrication capacity remains tight, equipment makers like ASML are successfully accelerating the delivery of High-NA EUV lithography systems to key foundry partners, alleviating bottleneck concerns across the global tech supply chain.`,
    source: 'Wall Street Journal',
    time: '2h ago',
    category: 'Semiconductors',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    related: ['NVDA', 'TSM', 'ASML', 'MU'],
    impact: 'positive'
  },
  {
    id: 4,
    title: 'Alibaba and Tencent Rally Following New Monetary Stimulus Measures in China',
    summary: 'Chinese tech giants gain as Beijing announces comprehensive liquidity injections to boost consumer spending and property stabilization.',
    fullContent: `Hong Kong and mainland Chinese equities posted their sharpest weekly gains in over a year after the People's Bank of China unveiled a comprehensive package of monetary easing and liquidity injection measures.\n\nAlibaba Group (BABA) and Tencent Holdings (TCEHY) surged over 4% each as international institutional investors welcomed renewed regulatory clarity and direct government support for the digital economy, e-commerce, and domestic consumption.\n\nMarket strategists point out that Chinese tech valuations had previously lagged global peers due to real estate headwinds. However, the latest coordinated fiscal and monetary stimulus has successfully restored market sentiment and sparked aggressive short-covering across major exchange-traded funds.`,
    source: 'Bloomberg',
    time: '4h ago',
    category: 'China Markets',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    related: ['BABA', 'TCEHY', 'JD'],
    impact: 'positive'
  }
];
