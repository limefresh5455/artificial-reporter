import { client } from './client';

export interface SocialLink {
  _key: string;
  platform: string;
  url: string;
}

export interface Category {
  _key: string;
  label: string;
  url: string;
}

export interface QuickLink {
  _key: string;
  label: string;
  url: string;
}

export interface DropdownItem {
  _key: string;
  title: string;
}

export interface MenuItem {
  _key: string;
  title: string;
  highlight?: boolean;
  dropdown?: DropdownItem[];
}

export interface NavigationData {
  title: string;
  menuItems: MenuItem[];
}

export interface FooterData {
  aboutText: string;
  categories: Category[];
  copyright: string;
  quickLinks: QuickLink[];
  socialLinks: SocialLink[];
}

export interface HeroSlide {
  _key: string;
  title: string;
  subtitle: string;
  link: string;
  image: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
}

export interface HeroData {
  slides: HeroSlide[];
}

export interface TrendingItem {
  _key: string;
  title: string;
  slug: string;
}

export interface TrendingData {
  items: TrendingItem[];
}

export interface ImageBlock {
  _id: string;
  title: string;
  alt: string;
  fullWidth: boolean;
  caption?: string;
  image: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
}

export interface TopStory {
  description: any;
  _createdAt: any;
  publishedAt: any;
  date: string | number | Date;
  _key: string;
  title: string;
  link: string;
  backgroundImage: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
}

export interface HomeNewsData {
  features: any;
  mainTitle: string;
  viewAllLink: string;
  viewAllLinkText: string;
  stories: TopStory[];
}

// Footer
export async function getFooterData(): Promise<FooterData> {
  const query = `*[_type == "footer"][0]{
    aboutText,
    categories[] { label, url },
    copyright,
    quickLinks[] { label, url },
    socialLinks[] { platform, url }
  }`;

  return client.fetch(query);
}

// Navigation
export async function getNavigationData(): Promise<NavigationData> {
  const query = `*[_type == "navigation"][0]{
    title,
    menuItems[] {
      _key,
      title,
      highlight,
      dropdown[] {
        _key,
        title
      }
    }
  }`;

  return client.fetch(query);
}

// Hero
export async function getHeroData(): Promise<HeroData> {
  const query = `*[_type == "hero"][0]{
    slides[] {
      _key,
      title,
      subtitle,
      link,
      image {
        _type,
        asset {
          _ref,
          _type
        }
      }
    }
  }`;

  return client.fetch(query);
}

// Trending
export async function getTrendingData(): Promise<TrendingData> {
  const query = `*[_type == "tranding"][0]{
    items[] {
      _key,
      title,
      "slug": slug.current
    }
  }`;

  return client.fetch(query);
}

export async function getImageBlocks(): Promise<ImageBlock[]> {
  const query = `*[_type == "imageBlock"]{
    _id,
    title,
    alt,
    fullWidth,
    caption,
    image {
      _type,
      asset {
        _ref,
        _type
      }
    }
  }`;

  return client.fetch(query);
}


export async function getNewsData(): Promise<{ topStories: HomeNewsData, features: HomeNewsData, popular: HomeNewsData, latest: HomeNewsData }> {
  const query = `*[_type == "news"]{
    mainTitle,
    "viewAllLink": viewAllLink,
    "viewAllLinkText": viewAllLinkText,
    stories[] {
      _key,
      title,
      publishedAt,
      _createdAt,
      link,
      description,
      backgroundImage {
        _type,
        asset {
          _ref,
          _type
        }
      }
    }
  }`;

  const response = await client.fetch(query);
  
  const topStories = response.find((item: any) => item.mainTitle === "Top Stories");
  const features = response.find((item: any) => item.mainTitle === "Features");
  const popular = response.find((item: any) => item.mainTitle === "Popular");
  const latest = response.find((item: any) => item.mainTitle === "Latest");

  return { topStories, features, popular, latest };
}

export async function getTopStories(): Promise<HomeNewsData> {
  const data = await getNewsData();
  return data.topStories;
}

export async function getFeatures(): Promise<HomeNewsData> {
  const data = await getNewsData();
  return data.features;
}

export async function getPopular(): Promise<HomeNewsData> {
  const data = await getNewsData();
  return data.popular;
}

export async function getLatest(): Promise<HomeNewsData> {
  const data = await getNewsData();
  return data.latest;
}

