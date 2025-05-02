import { client } from './client';

export interface SocialLink {
    _key: string;
    platform: string;
    url: string;
    linkTarget: string;
}

export interface Category {
    _key: string;
    label: string;
    url: string;
    linkTarget: string;
}

export interface QuickLink {
    _key: string;
    label: string;
    url: string;
     linkTarget: string;
}

export interface DropdownItem {
    _key: string;
    title: string;
    url: string;
}

export interface MenuItem {
    _key: string;
    title: string;
    url: string;
    highlight?: boolean;
    dropdown?: DropdownItem[];
}

export interface NavigationData {
    title: string;
    menuItems: MenuItem[];
    logo: any;
    bannerBgColor: any;
}

export interface FooterData {
    aboutText: string;
    categories: Category[];
    copyright: string;
    quickLinks: QuickLink[];
    socialLinks: SocialLink[];
    logo: any;
}

export interface HeroSlide {
    _key: string;
    title: string;
    subtitle: string;
    link: string;
    linkTarget: string;
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
    url: string;
    linkTarget: string;
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
    _updatedAt: any;
    _rev: string | number | Date;
    _key: string;
    _type: string;
    title: string;
    overview: string;
    eventType: string;
    sponsored: string;
    tags: string;
    link: string;
    image: {
        _type: 'image';
        asset: {
            _ref: string;
            _type: 'reference';
        };
    };
}

// _id,
//         _createdAt,
//         _updatedAt,
//         _rev,
//         _type,
//         title,
//         overview,
//         eventType,
//         sponsored,
//         tags
export interface HomeNewsData {
    features: any;
    mainTitle: string;
    viewAllLink: string;
    viewAllLinkText: string;
    relatedArticles: any[];
}

// Footer
export async function getFooterData(): Promise<FooterData> {
    const query = `*[_type == "footer"][0]{
        aboutText,
        categories[] { label, url, linkTarget },
        copyright,
        quickLinks[] { label, url, linkTarget },
        socialLinks[] { platform, url, linkTarget },
        logo {
            alt,
            asset->{
            url,
            },crop
        }
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
      url,
      dropdown[] {
        _key,
        title,
        url
      }
    },
    "logo": *[_type == "logo"][0]{
        alt,
        "imageUrl": image.asset->url,
        image {
        crop,
        hotspot
        }
    },
     "bannerBgColor": *[_type == "bannerBgColor"][0]{
        title,
        value {
        hex,
        rgb,
        hsl,
        hsv,
        alpha
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
      linkTarget,
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
      url
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
        _id,
        _createdAt,
        _updatedAt,
        mainTitle,
        relatedArticles[]->{
          _id,
          title,
          slug,
          _createdAt,
          image,
          overview
        },
        viewAllLink,
        viewAllLinkText
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


export interface PageData {
    title: string;
    slug: { current: string };
    seo: {
        metaTitle: string;
        metaDescription: string;
    };
    content: Array<any>;
}

export interface TopStoriesData {
    _id: string;
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    _type: "newsArticle";
    title: string;
    overview: string;
    eventType: string;
    sponsored: boolean;
    tags: string[];
    image: any[];
}


// About
export async function getPageData(slug: string): Promise<PageData> {
    const query = `*[_type == "page" && slug.current == "${slug}"][0] {
        _createdAt,
        _id,
        _rev,
        _type,
        _updatedAt,
        title,
        content,
        slug {
          current
        },
        seo {
          metaTitle,
          metaDescription
        }
      }`;

    return client.fetch(query);
}


export async function getTopStoriesData(page = 1, pageSize = 4, params = ''): Promise<any[]> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    console.log(params)
    const query = `*[_type == '${params}'] | order(_createdAt desc) [${start}...${end}] {  
        _id,
        _createdAt,
        _updatedAt,
        _rev,
        _type,
        title,
        overview,
        eventType,
        sponsored,
        image,
        tags,
        slug
      }`;


    return client.fetch(query);
}

export async function getTotalTopStoriesCount(params = ''): Promise<number> {
    const query = `count(*[_type == ${params}])`;
    return client.fetch(query);
}



export async function getStoryData(params = '', type=''): Promise<any[]> {
    console.log(params)
    const query = `*[_type == "${type}" && slug.current == "${params}"]  {  
        _id,
        _createdAt,
        _updatedAt,
        _rev,
        _type,
        title,
        content,
        eventType,
        sponsored,
        image,
        tags[]->{
        title},
        slug
      }`;


    return client.fetch(query);
}
export async function getRelatedStories(tags: string[], slug: string): Promise<any[]> {
    if (!tags || tags.length === 0) {
        return [];
    }

    const query = `*[
                        _type == "newsArticle" &&
                        slug.current != $slug &&
                        count(tags[].title[@ in $tags]) > 0
                    ][0...5] {
                        _id,
                        title,
                        overview,
                        image,
                        slug,
                        _createdAt
                    }
                    `;


    const params = {
        tags,
        slug: slug,
    };


    return client.fetch(query, params);
}
export async function getTags(): Promise<any[]> {
    const query = `*[
                        _type == "tag" 
                    ][0...10] {
                        _id,
                        title,
                        slug,
                        _createdAt
                    }
                    `;
    return client.fetch(query);
}


export async function getInsights(): Promise<any[]> {
    const query = `*[
                        _type == "insight" 
                    ][0...10] {
                        _id,
                        title,
                        slug,
                        _createdAt,
                        image
                    }
                    `;
    return client.fetch(query);
}