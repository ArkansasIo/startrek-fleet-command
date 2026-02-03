// GalacticNewsSystem.ts
// News broadcasting and information dissemination system

export type NewsCategory =
  | 'politics'
  | 'war'
  | 'economy'
  | 'exploration'
  | 'technology'
  | 'culture'
  | 'scandal'
  | 'achievement';
export type NewsSource = 'federation' | 'klingon' | 'romulan' | 'ferengi' | 'neutral' | 'player';
export type NewsImpact = 'local' | 'regional' | 'galactic';

export interface NewsArticle {
  id: string;
  headline: string;
  content: string;
  author: string;
  source: NewsSource;
  category: NewsCategory;
  publishedAt: number;
  impact: NewsImpact;
  affectedFactions?: string[];
  affectedSectors?: string[];
  priority: number; // 1-10
  views: number;
  shares: number;
  relatedStories: string[];
  multimedia?: {
    images: string[];
    video?: string;
  };
}

export interface NewsChannel {
  id: string;
  name: string;
  owner: string; // Faction or player ID
  description: string;
  focus: NewsCategory[];
  subscribers: number;
  createdAt: number;
  articles: string[]; // Article IDs
  bias: NewsSource;
  reliability: number; // 0-100
  influence: number; // 0-100
}

export interface NewsHeadline {
  articleId: string;
  headline: string;
  category: NewsCategory;
  impact: NewsImpact;
  priority: number;
  timestamp: number;
}

export interface GalacticNews {
  id: string;
  currentHeadlines: NewsHeadline[];
  archives: string[]; // Article IDs
  channels: NewsChannel[];
  bulletins: NewsBulletin[];
  specialReports: SpecialReport[];
  lastUpdated: number;
}

export interface NewsBulletin {
  id: string;
  type: 'alert' | 'warning' | 'update' | 'breaking';
  title: string;
  content: string;
  issuedAt: number;
  expiresAt: number;
  priority: number;
  affectedAreas: string[];
}

export interface SpecialReport {
  id: string;
  title: string;
  description: string;
  publishedAt: number;
  deadline?: number;
  importance: number; // 1-10
  relatedArticles: string[];
  summary: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  description: string;
  popularity: number; // 0-100
  recentArticles: string[];
  topAuthors: string[];
}

// Create news article
export function createNewsArticle(
  headline: string,
  content: string,
  author: string,
  source: NewsSource,
  category: NewsCategory,
  impact: NewsImpact = 'local'
): NewsArticle {
  return {
    id: `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    headline,
    content,
    author,
    source,
    category,
    publishedAt: Date.now(),
    impact,
    priority: calculateArticlePriority(category, impact),
    views: 0,
    shares: 0,
    relatedStories: [],
  };
}

// Calculate article priority
function calculateArticlePriority(category: NewsCategory, impact: NewsImpact): number {
  const categoryScore: Record<NewsCategory, number> = {
    politics: 8,
    war: 10,
    economy: 7,
    exploration: 6,
    technology: 6,
    culture: 4,
    scandal: 7,
    achievement: 5,
  };

  const impactScore: Record<NewsImpact, number> = {
    local: 1,
    regional: 2,
    galactic: 3,
  };

  return Math.min(10, categoryScore[category] * impactScore[impact] / 2);
}

// Create news channel
export function createNewsChannel(
  name: string,
  owner: string,
  focus: NewsCategory[],
  bias: NewsSource
): NewsChannel {
  return {
    id: `channel_${Date.now()}`,
    name,
    owner,
    description: `The ${name} news channel`,
    focus,
    subscribers: 0,
    createdAt: Date.now(),
    articles: [],
    bias,
    reliability: 75 + Math.random() * 25,
    influence: 50,
  };
}

// Publish article
export function publishArticle(
  channel: NewsChannel,
  article: NewsArticle
): { channel: NewsChannel; article: NewsArticle } {
  return {
    channel: {
      ...channel,
      articles: [...channel.articles, article.id],
    },
    article,
  };
}

// View article
export function viewArticle(article: NewsArticle, increment: number = 1): NewsArticle {
  return {
    ...article,
    views: article.views + increment,
  };
}

// Share article
export function shareArticle(article: NewsArticle, amount: number = 1): NewsArticle {
  return {
    ...article,
    shares: article.shares + amount,
    views: article.views + Math.floor(amount * 2), // Shares increase views
  };
}

// Subscribe to channel
export function subscribeToChannel(channel: NewsChannel): NewsChannel {
  return {
    ...channel,
    subscribers: channel.subscribers + 1,
  };
}

// Unsubscribe from channel
export function unsubscribeFromChannel(channel: NewsChannel): NewsChannel {
  return {
    ...channel,
    subscribers: Math.max(0, channel.subscribers - 1),
  };
}

// Create news bulletin
export function createNewsBulletin(
  type: NewsBulletin['type'],
  title: string,
  content: string,
  affectedAreas: string[],
  duration: number = 86400000 // 24 hours
): NewsBulletin {
  return {
    id: `bulletin_${Date.now()}`,
    type,
    title,
    content,
    issuedAt: Date.now(),
    expiresAt: Date.now() + duration,
    priority: type === 'alert' ? 10 : type === 'warning' ? 8 : type === 'breaking' ? 9 : 5,
    affectedAreas,
  };
}

// Create special report
export function createSpecialReport(
  title: string,
  description: string,
  importance: number,
  relatedArticles: string[] = []
): SpecialReport {
  return {
    id: `report_${Date.now()}`,
    title,
    description,
    publishedAt: Date.now(),
    importance: Math.min(10, Math.max(1, importance)),
    relatedArticles,
    summary: `Special report on ${title}`,
  };
}

// Create galactic news system
export function createGalacticNewsSystem(): GalacticNews {
  return {
    id: `news_${Date.now()}`,
    currentHeadlines: [],
    archives: [],
    channels: [],
    bulletins: [],
    specialReports: [],
    lastUpdated: Date.now(),
  };
}

// Add headline
export function addHeadline(news: GalacticNews, article: NewsArticle): GalacticNews {
  const headline: NewsHeadline = {
    articleId: article.id,
    headline: article.headline,
    category: article.category,
    impact: article.impact,
    priority: article.priority,
    timestamp: article.publishedAt,
  };

  // Keep only top 20 headlines
  const headlines = [headline, ...news.currentHeadlines].sort((a, b) => b.priority - a.priority).slice(0, 20);

  return {
    ...news,
    currentHeadlines: headlines,
    archives: [...news.archives, article.id],
    lastUpdated: Date.now(),
  };
}

// Add bulletin
export function addBulletin(news: GalacticNews, bulletin: NewsBulletin): GalacticNews {
  return {
    ...news,
    bulletins: [...news.bulletins.filter((b) => b.expiresAt > Date.now()), bulletin],
    lastUpdated: Date.now(),
  };
}

// Add special report
export function addSpecialReport(news: GalacticNews, report: SpecialReport): GalacticNews {
  return {
    ...news,
    specialReports: [...news.specialReports, report],
    lastUpdated: Date.now(),
  };
}

// Add channel
export function addChannel(news: GalacticNews, channel: NewsChannel): GalacticNews {
  return {
    ...news,
    channels: [...news.channels, channel],
  };
}

// Get trending articles
export function getTrendingArticles(articles: NewsArticle[], limit: number = 10): NewsArticle[] {
  return articles
    .sort((a, b) => {
      const engagementA = a.views + a.shares * 2;
      const engagementB = b.views + b.shares * 2;
      return engagementB - engagementA;
    })
    .slice(0, limit);
}

// Get articles by category
export function getArticlesByCategory(
  articles: NewsArticle[],
  category: NewsCategory
): NewsArticle[] {
  return articles.filter((a) => a.category === category).sort((a, b) => b.publishedAt - a.publishedAt);
}

// Get articles by impact
export function getArticlesByImpact(articles: NewsArticle[], impact: NewsImpact): NewsArticle[] {
  return articles.filter((a) => a.impact === impact).sort((a, b) => b.priority - a.priority);
}

// Get channel statistics
export interface ChannelStatistics {
  totalArticles: number;
  totalViews: number;
  totalShares: number;
  averageViews: number;
  engagementRate: number;
  reachPercentage: number;
}

export function getChannelStatistics(channel: NewsChannel, articles: NewsArticle[]): ChannelStatistics {
  const channelArticles = articles.filter((a) => channel.articles.includes(a.id));
  const totalViews = channelArticles.reduce((sum, a) => sum + a.views, 0);
  const totalShares = channelArticles.reduce((sum, a) => sum + a.shares, 0);
  const totalEngagement = totalViews + totalShares * 2;

  return {
    totalArticles: channelArticles.length,
    totalViews,
    totalShares,
    averageViews: channelArticles.length > 0 ? totalViews / channelArticles.length : 0,
    engagementRate: channelArticles.length > 0 ? totalEngagement / channelArticles.length : 0,
    reachPercentage: (channel.subscribers / 1000000) * 100, // Assuming 1M max audience
  };
}

// Generate news headlines
export function generateNewsHeadlines(impactLevel: NewsImpact = 'galactic'): string[] {
  const headlines: Record<NewsImpact, string[]> = {
    local: [
      'Local sector reports increased pirate activity',
      'New trading post established in sector',
      'Scientific discovery in local space',
      'Local guild declares territorial expansion',
    ],
    regional: [
      'Regional conflict erupts between two powers',
      'Stargate network expansion announced',
      'Regional economic summit held',
      'Multi-sector alliance formed',
    ],
    galactic: [
      'Federation announces new exploration initiative',
      'Klingon fleet movements raise tensions',
      'Romulan embassy opens dialogue channels',
      'Ferengi banking consortium announces merger',
      'Ancient artifact discovered in galactic core',
      'Supernova threatens multiple sectors',
    ],
  };

  return headlines[impactLevel] || [];
}

// Generate news report
export function generateNewsReport(news: GalacticNews, channels: NewsChannel[]): string {
  const topHeadlines = news.currentHeadlines.slice(0, 5);
  const totalChannels = channels.length;
  const totalBulletins = news.bulletins.length;

  return `
╔════════════════════════════════════════════════════════════════╗
║                   GALACTIC NEWS REPORT                         ║
╚════════════════════════════════════════════════════════════════╝

CURRENT HEADLINES:
${topHeadlines.map((h, i) => `  ${i + 1}. ${h.headline} [${h.impact}]`).join('\n')}

ACTIVE BULLETINS: ${totalBulletins}
NEWS CHANNELS: ${totalChannels}
SPECIAL REPORTS: ${news.specialReports.length}

LAST UPDATED: ${new Date(news.lastUpdated).toLocaleString()}

═══════════════════════════════════════════════════════════════════
`;
}

// Generate channel profile
export function generateChannelProfile(channel: NewsChannel): string {
  return `
╔════════════════════════════════════════════════════════════════╗
║                   CHANNEL PROFILE                              ║
╚════════════════════════════════════════════════════════════════╝

CHANNEL: ${channel.name}
Owner: ${channel.owner}
Bias: ${channel.bias.toUpperCase()}
Created: ${new Date(channel.createdAt).toLocaleDateString()}

STATISTICS:
  Subscribers: ${channel.subscribers.toLocaleString()}
  Articles Published: ${channel.articles.length}
  Reliability: ${channel.reliability.toFixed(1)}%
  Influence: ${channel.influence.toFixed(1)}%

FOCUS AREAS:
${channel.focus.map((f) => `  • ${f.toUpperCase()}`).join('\n')}

═══════════════════════════════════════════════════════════════════
`;
}
