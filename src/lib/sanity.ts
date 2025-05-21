import { client } from './client';
import { subDays, format } from 'date-fns'; // if using date-fns

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
    slug: any;
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

// Ad Apace
export const getActiveHeaderAd = async () => {
    const now = new Date().toISOString();
    const query = `*[_type == "adSpaceBlock" && placement == "header" && active == true && startDate <= $now && endDate >= $now][0]{
      title,
      link,
      alt,
      adType,
      googleAdScript,
      customEmbedCode,
      "imageUrl": image.asset->url
    }`;
    return await client.fetch(query, { now });
};

export const getActiveSidebarAd = async () => {
    const now = new Date().toISOString();
    const query = `*[_type == "adSpaceBlock" && placement == "sidebar" && active == true && startDate <= $now && endDate >= $now][0]{
      title,
      link,
      alt,
      adType,
      googleAdScript,
      customEmbedCode,
      "imageUrl": image.asset->url
    }`;
    return await client.fetch(query, { now });
};


export const getActiveSidebarAdVerticle = async () => {
    const now = new Date().toISOString();
    const query = `*[_type == "adSpaceBlock" && placement == "sidebar-vertical" && active == true && startDate <= $now && endDate >= $now][0]{
      title,
      link,
      alt,
      adType,
      googleAdScript,
      customEmbedCode,
      "imageUrl": image.asset->url
    }`;
    return await client.fetch(query, { now });
};



// Trending Verticle
export async function getTrendingData(): Promise<TrendingData> {
    const query = `*[_type == "tranding"][0]{
    items[] {
      _key,
      title,
      url,
      linkTarget
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
    slug,
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

export async function getNewsByCategory(categorySlug: string): Promise<any[]> {
    const query = `
        *[
            _type == "newsArticle" &&
            $categorySlug in newsCategory[]->value.current
        ][0...6] {
            _id,
            title,
            overview,
            image,
            slug,
            _createdAt,
            newsCategory[0]->{
                title,
                value
            },
        }
        `;


    const params = { categorySlug };

    const articles = await client.fetch(query, params);
    return articles;
}

export async function getNewsData(param: string): Promise<any> {
    const query = `*[_type == "news"]{
        _id,
        _createdAt,
        _updatedAt,
        mainTitle,
        newsCategory->{
        title,
        value
        },
        viewAllLink,
        viewAllLinkText
      }`;


    const response = await client.fetch(query);



    const data = response.find((item: any) => item.mainTitle === param);
    // const features = response.find((item: any) => item.mainTitle === "Features");
    // const popular = response.find((item: any) => item.mainTitle === "Popular");
    // const latest = response.find((item: any) => item.mainTitle === "Latest");

    const responseArticle = await getNewsByCategory(data.newsCategory.value.current)

    return { relatedArticles: responseArticle, ...data };
}

export async function getTopStories(): Promise<HomeNewsData> {
    const data = await getNewsData("Top Stories");
    return data;
}

export async function getFeatures(): Promise<HomeNewsData> {
    const data = await getNewsData("Features");
    return data;
}

export async function getPopular(): Promise<HomeNewsData> {
    const data = await getNewsData("Popular");
    return data;
}

export async function getLatest(): Promise<HomeNewsData> {
    const data = await getNewsData("Latest");
    return data;
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


export async function getTopStoriesData(
    page = 1,
    pageSize = 4,
    params = '',
    category: string | null = null
): Promise<any[]> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const query = `
      *[
        _type == $typeParam
        ${category ? '&& $category in newsCategory[]->value.current' : ''}
      ] | order(featured desc, _createdAt desc) [${start}...${end}] {
        _id,
        _createdAt,
        _updatedAt,
        publishedAt,
        date,
        _rev,
        _type,
        title,
        overview,
        eventType,
        newsCategory[0]->{
        value},
        sponsored,
        image,
        tags,
        slug,
        featured
      }
    `;

    const fetchParams: any = {
        typeParam: params,
    };

    if (category) {
        fetchParams.category = category;
    }

    return client.fetch(query, fetchParams);
}


export async function getTotalTopStoriesCount(
    params = '',
    category: string | null = null
): Promise<number> {
    const query = `
      count(*[
        _type == $typeParam
        ${category ? '&& $category in newsCategory[]->value.current' : ''}
      ])
    `;

    const fetchParams: any = {
        typeParam: params,
    };

    if (category) {
        fetchParams.category = category;
    }

    return client.fetch(query, fetchParams);
}

export async function getCategoryTitleByValue(value: string): Promise<string | null> {
    const query = `
      *[_type == "newsCategory" && value.current == $value][0] {
        title
      }
    `;

    const params = { value };

    const result = await client.fetch(query, params);

    return result?.title || null;
}


export async function getStoryData(params = '', type = ''): Promise<any[]> {
    const query = `*[_type == "${type}" && slug.current == "${params}"]  {  
        _id,
        _createdAt,
        _updatedAt,
        date,
        _rev,
        _type,
        title,
        content,
        eventType,
        overview,
        sponsored,
        editor->{
        name,
        image,
        slug
        },
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
                        newsCategory[0]->{
                        value},
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
      ] | order(featured desc, _createdAt desc)[0...10] {
        _id,
        title,
        slug,
        _createdAt,
        image,
        featured
      }`;

    return client.fetch(query);
}

export async function getSponsors(): Promise<any[]> {
    const query = `*[_type == "page" && slug.current == "sponsors"] {
        _id,
        title,
        slug,
        _createdAt,
        content,
        "collectionItem": collectionItem->{
        sponsors,
          _key,
          groupTitle,
        }
      }`;


    return client.fetch(query);
}





function getDateFromLabel(label: string): string | null {
    const daysMap: Record<string, number> = {
        'Last 24 hours': 1,
        'Last 3 days': 3,
        'Last 7 days': 7,
        'Last 14 days': 14,
    };

    const days = daysMap[label];
    if (!days) return null;

    const date = subDays(new Date(), days);
    return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
}

interface Filters {
    [key: string]: string | string[] | undefined;
}

export async function getJobs(
    page = 1,
    pageSize = 10,
    filters: Record<string, any> = {}
): Promise<any[]> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    // Build GROQ filter conditions
    const conditions: string[] = [];
    const payAmountMapping: Record<string, string> = {
        '$0 – $10,000': '$0 – $10,000',
        '$10,000 – $20,000': '$10,000 – $20,000',
        '$20,000 – $30,000': '$20,000 – $30,000',
        '$30,000 – $50,000': '$30,000 – $50,000',
        '$50,000 – $100,000': '$50,000 – $100,000',
        '$100,000+': '$100,000+',
        '$130,000+': '$130,000+',
        '$150,000+': '$150,000+',
        '$170,000+': '$170,000+',
        '$200,000+': '$200,000+',
    };


    // Handle payAmount filtering
    if (filters.pay) {
        if (Array.isArray(filters.pay)) {
            // If it's an array, map over the values
            filters.pay.forEach((amount) => {
                const payAmountValue = payAmountMapping[amount];
                if (payAmountValue !== undefined) {
                    conditions.push(`payAmount == "${payAmountValue}"`); // treat payAmount as string
                }
            });
        } else {
            // If it's a single string, handle it normally
            const payAmountValue = payAmountMapping[filters.pay];
            if (payAmountValue !== undefined) {
                conditions.push(`payAmount == "${payAmountValue}"`); // treat payAmount as string
            }
        }
    }

    if (filters.title && typeof filters.title === "string") {
        conditions.push(`title match "*${filters.title}*"`);
    }


    if (filters.datePosted && typeof filters.datePosted === 'string') {
        const date = getDateFromLabel(filters.datePosted);
        if (date) {
            conditions.push(`datePosted >= "${date}"`);
        }
    }


    if (filters.remote) {
        // Assume: 'Remote', 'Hybrid', 'On-site' mapped to remoteWork field
        conditions.push(`remoteWork == ${filters.remote == 'True' ? true : false}`);
    }



    if (filters.jobType) {
        const types = Array.isArray(filters.jobType) ? filters.jobType : [filters.jobType];
        conditions.push(`jobType in ${JSON.stringify(types)}`);
    }

    if (filters.experience) {
        const levels = Array.isArray(filters.experience) ? filters.experience : [filters.experience];
        conditions.push(`experienceLevel in ${JSON.stringify(levels)}`);
    }

    if (filters.education) {
        conditions.push(`education == "${filters.education}"`);
    }

    if (filters.company) {
        conditions.push(`company->name == "${filters.company}"`);
    }

    let locationConditions = [];

    if (filters.locationCountry) {
        locationConditions.push(`company->locationCountry == "${filters.locationCountry}"`);
    }

    if (filters.locationState) {
        locationConditions.push(`company->locationState == "${filters.locationState}"`);
    }

    if (filters.locationCity) {
        locationConditions.push(`company->locationCity == "${filters.locationCity}"`);
    }

    // More filters can be added as needed...

    let finalCondition = "";

    if (locationConditions.length) {
        finalCondition += `(${locationConditions.join(" || ")})`;
    }

    if (conditions.length) {
        if (finalCondition) {
            finalCondition += " && ";
        }
        finalCondition += conditions.join(" && ");
    }
    

    const whereClause = finalCondition.length > 0
        ? `*[ _type == "jobListing" && ${finalCondition} ]`
        : `*[ _type == "jobListing" ]`;


    const sortMap: Record<string, string> = {
        Latest: "_createdAt desc",
        "Job Title": "title asc",
        Location: "location desc"
    };

    const sortBy = sortMap[filters.sortBy] || "_createdAt desc"; // default to latest

    const query = `
        ${whereClause} | order(${sortBy}) [${start}...${end}] {
        _id,
        title,
        jobTitle,
        slug,
        jobType,
        location,
        payAmount,
        remoteWork,
        datePosted,
        dateUpdated,
        hourlyOrSalary,
        experienceLevel,
        education,
        jobDescription,
        hiringManagerName,
        hiringManagerEmail,
        hiringManagerPhone,
        company->{
          _id,
          aiType,
          industry,
          firmType,
          employeeSize,
          revenueSize,
          companyUrl,
          description,
          advertiserLevel,
          logo {
            asset->{
              _id,
              url
            }
          }
        }
      }
    `;

    //     const query = `
    //   *[_type == "jobListing" && datePosted >= "2025-05-05T00:00:00.000Z"] {
    //     _id,
    //     jobTitle,
    //     datePosted,
    //     // other fields
    //   }
    // `;

    return await client.fetch(query);
}



export async function getTotalJobsCount(filters: Filters): Promise<number> {
    const conditions: string[] = [];

    if (filters.remote) {
        // Assume: 'Remote', 'Hybrid', 'On-site' mapped to remoteWork field
        conditions.push(`remoteWork == ${filters.remote == 'True' ? true : false}`);
    }

    if (filters.datePosted && typeof filters.datePosted === 'string') {
        const date = getDateFromLabel(filters.datePosted);
        if (date) {
            conditions.push(`datePosted >= "${date}"`);
        }
    }

    const payAmountMapping: Record<string, string> = {
        '$0 – $10,000': '$0 – $10,000',
        '$10,000 – $20,000': '$10,000 – $20,000',
        '$20,000 – $30,000': '$20,000 – $30,000',
        '$30,000 – $50,000': '$30,000 – $50,000',
        '$50,000 – $100,000': '$50,000 – $100,000',
        '$100,000+': '$100,000+',
        '$130,000+': '$130,000+',
        '$150,000+': '$150,000+',
        '$170,000+': '$170,000+',
        '$200,000+': '$200,000+',
    };


    // Handle payAmount filtering
    if (filters.pay) {
        if (Array.isArray(filters.pay)) {
            // If it's an array, map over the values
            filters.pay.forEach((amount) => {
                const payAmountValue = payAmountMapping[amount];
                if (payAmountValue !== undefined) {
                    conditions.push(`payAmount == "${payAmountValue}"`); // treat payAmount as string
                }
            });
        } else {
            // If it's a single string, handle it normally
            const payAmountValue = payAmountMapping[filters.pay];
            if (payAmountValue !== undefined) {
                conditions.push(`payAmount == "${payAmountValue}"`); // treat payAmount as string
            }
        }
    }

    if (filters.title && typeof filters.title === "string") {
        conditions.push(`title match "*${filters.title}*"`);
    }




    if (filters.jobType) {
        const types = Array.isArray(filters.jobType) ? filters.jobType : [filters.jobType];
        conditions.push(`jobType in ${JSON.stringify(types)}`);
    }

    if (filters.experience) {
        const levels = Array.isArray(filters.experience) ? filters.experience : [filters.experience];
        conditions.push(`experienceLevel in ${JSON.stringify(levels)}`);
    }

    if (filters.education) {
        conditions.push(`education == "${filters.education}"`);
    }

    if (filters.company) {
        conditions.push(`company->name == "${filters.company}"`);
    }

    let locationConditions = [];

    if (filters.locationCountry) {
        locationConditions.push(`company->locationCountry == "${filters.locationCountry}"`);
    }

    if (filters.locationState) {
        locationConditions.push(`company->locationState == "${filters.locationState}"`);
    }

    if (filters.locationCity) {
        locationConditions.push(`company->locationCity == "${filters.locationCity}"`);
    }

    // same filter conditions as above...

    let finalCondition = "";

    if (locationConditions.length) {
        finalCondition += `(${locationConditions.join(" || ")})`;
    }

    if (conditions.length) {
        if (finalCondition) {
            finalCondition += " && ";
        }
        finalCondition += conditions.join(" && ");
    }
    

    const whereClause = finalCondition.length > 0
        ? `*[ _type == "jobListing" && ${finalCondition} ]`
        : `*[ _type == "jobListing" ]`;

    const query = `count(${whereClause})`;
    return await client.fetch(query);
}



export async function getCompanies(
    page = 1,
    pageSize = 10,
    filters: Record<string, any> = {}
): Promise<any[]> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const conditions: string[] = [];

    if (filters.name && typeof filters.name === "string") {
        conditions.push(`name match "*${filters.name}*"`);
    }

    let locationConditions = [];

    if (filters.locationCountry) {
        locationConditions.push(`locationCountry == "${filters.locationCountry}"`);
    }

    if (filters.locationState) {
        locationConditions.push(`locationState == "${filters.locationState}"`);
    }

    if (filters.locationCity) {
        locationConditions.push(`locationCity == "${filters.locationCity}"`);
    }

    if (filters.employees) {


        const cleanedCount = filters.employees + "".replace('+', '');

        conditions.push(`employeeCount > ${parseInt(cleanedCount)}`);
    }

    if (filters.isAICompany !== undefined) {
        conditions.push(`isAICompany == ${filters.isAICompany == 'True' ? true : false}`);
    }

    if (filters.category) {
        conditions.push(`category->title == "${filters.category}"`);
    }
    let finalCondition = "";

    if (locationConditions.length) {
        finalCondition += `(${locationConditions.join(" || ")})`;
    }

    if (conditions.length) {
        if (finalCondition) {
            finalCondition += " && ";
        }
        finalCondition += conditions.join(" && ");
    }


    const whereClause = finalCondition.length > 0
        ? `*[ _type == "aiCompany" && ${finalCondition} ]`
        : `*[ _type == "aiCompany" ]`;


    const sortMap: Record<string, string> = {
        Latest: "_createdAt desc",
        "Company Type": "category->title asc",
        Employees: "employeeCount desc"
    };

    const sortBy = sortMap[filters.sortBy] || "_createdAt desc"; // default to latest

    const query = `
        ${whereClause} | order(${sortBy}) [${start}...${end}] {
            _id,
            name,
            description,
            employeeCount,
            isAICompany,
            logo,
            linkedin,
            website,
            locationCity,
            locationState,
            locationCountry,
            slug,
            category->{ _id, title }
        }
        `;

    //     const query = `
    //     ${whereClause} | order(_createdAt desc) [${start}...${end}] {
    //       _id,
    //       name,
    //       description,
    //       employeeCount,
    //       isAICompany,
    //       logo,
    //       linkedin,
    //       website,
    //       locationCity,
    //       locationState,
    //       locationCountry,
    //       _createdAt,
    //       category->{ _id, title }
    //     }
    //   `;

    return await client.fetch(query);
}

export async function getTotalCompaniesCount(
    filters: Filters): Promise<any[]> {

    const conditions: string[] = [];

    if (filters.name && typeof filters.name === "string") {
        conditions.push(`name match "*${filters.name}*"`);
    }

    let locationConditions = [];

    if (filters.locationCountry) {
        locationConditions.push(`locationCountry == "${filters.locationCountry}"`);
    }

    if (filters.locationState) {
        locationConditions.push(`locationState == "${filters.locationState}"`);
    }

    if (filters.locationCity) {
        locationConditions.push(`locationCity == "${filters.locationCity}"`);
    }

    if (filters.employees) {
        const cleanedCount = filters.employees + "".replace('+', '');
        conditions.push(`employeeCount > ${parseInt(cleanedCount)}`);
    }

    if (filters.isAICompany !== undefined) {
        conditions.push(`isAICompany == ${filters.isAICompany == 'True' ? true : false}`);
    }

    if (filters.category) {
        conditions.push(`category->title == "${filters.category}"`);
    }


    let finalCondition = "";

    if (locationConditions.length) {
        finalCondition += `(${locationConditions.join(" || ")})`;
    }

    if (conditions.length) {
        if (finalCondition) {
            finalCondition += " && ";
        }
        finalCondition += conditions.join(" && ");
    }


    const whereClause = finalCondition.length > 0
        ? `*[ _type == "aiCompany" && ${finalCondition} ]`
        : `*[ _type == "aiCompany" ]`;

    const query = `count(${whereClause})`;
    return await client.fetch(query);
}

export async function getCompanyData(params: string): Promise<any> {
    const query = `*[_type == "aiCompany" && slug.current == "${params}"]{
  _id,
  name,
  description,
  employeeCount,
  isAICompany,
  logo,
  linkedin,
  website,
  locationCity,
  locationState,
  locationCountry,
  category->{ _id, title }
}`;


    return client.fetch(query);
}

export async function getJobData(slug: string): Promise<any> {
    const query = `*[_type == "jobListing" && slug.current == "${slug}"][0]{
  _id,
  title,
  jobTitle,
  slug,
  jobType,
  location,
  payAmount,
  remoteWork,
  datePosted,
  dateUpdated,
  hourlyOrSalary,
  experienceLevel,
  education,
  jobDescription,
  hiringManagerName,
  hiringManagerEmail,
  hiringManagerPhone,
  company->{
    _id,
    name,
    description,
    employeeCount,
    isAICompany,
    logo {
      asset->{
        _id,
        url
      }
    },
    linkedin,
    website,
    locationCity,
    locationState,
    locationCountry,
    category->{ _id, title }
  }
}`;

    return client.fetch(query);


}

export async function getSiteLogo(): Promise<any> {
    const query = `*[_type == "logo"][0]{
        alt,
        "imageUrl": image.asset->url,
        image {
        crop,
        hotspot
        }
    }`;

    return client.fetch(query);
}



export async function getCompaniesLocations(searchTerm: string): Promise<any> {
    const query = `
  *[_type == "aiCompany" && (locationCity match "*${searchTerm}*" || locationState match "*${searchTerm}*" || locationCountry match "*${searchTerm}*")] {
    locationCity,
    locationState,
    locationCountry
  }`;

    const params = { searchTerm }; // Dynamic searchTerm passed to query

    // Execute the query
    const results = await client.fetch(query, params);

    // Remove duplicates based on the company name

    const deduplicatedResults = results.filter((value: any, index: any, self: any) => {
        return index === self.findIndex((t: any) => (
            t.locationCity === value.locationCity ||
            t.locationState === value.locationState ||
            t.locationCountry === value.locationCountry
        ));
    });

    return deduplicatedResults
}

export async function getPodcastData(): Promise<any> {
    const query = `*[_type == "podcast" ][0]{
    _id,
    title,
    slug,
    body,
    image {
      asset->{
        _id,
        url
      }
    }
  }`;

    const data = await client.fetch(query);
    return data;
}


export async function getPodcast(platform?: string): Promise<any> {

    var platformFilter = platform ? `&& platform match "*${platform}*"` : '';

    if (platform == "All") {
        platformFilter = '';
    }

    const query = `*[_type == "podcastEpisode" ${platformFilter}]{
    _id,
    title,
    duration,
    platform,
    platformUrl,
    embedCode,
    audioFile{
      asset->{
        url
      }
    },
    coverImage{
      asset->{
        url
      }
    },
    body
  }`;

    const data = await client.fetch(query);
    return data;
}



export async function getPodcastCount(platform?: string): Promise<any> {
    var platformFilter = platform ? `&& platform match "*${platform}*"` : '';

    if (platform == "All") {
        platformFilter = '';
    }

    const query = `count(*[_type == "podcastEpisode" ${platformFilter}])`;


    const data = await client.fetch(query);
    return data;
}


export async function getSearchResult(query: string): Promise<any[]> {
    const results = await client.fetch(
        `*[(_type == "page" || _type == "newsArticle" || _type == "insight" || _type == "aiCompany" || _type == "podcastEpisode" || _type == "newsCategory" || _type == "jobListing") && (title match $q || body match $q || name match $q)][0...10]{
        _id,
        title,
        name,
        logo,
        value,
        coverImage,
        newsCategory[0]->{
        value},
        _type,
        slug,
        image
      }`,
        { q: `*${query}*` }
    );

    return results;
}

export async function getContributorUser(slug: string): Promise<any[]> {
    const query =
        `*[
            _type == "newsArticle" &&
            editor->slug.current == $slug 
        ] {
            _id,
            title,
            overview,
            eventType,
            date,
            image,
            editor->{
            name,
            image,
            bio
            },
            newsCategory[0]->{
            value},
            slug,
            _createdAt
                    }`;

    const params = { slug };

    const results = await client.fetch(query, params);
    return results;
}

export async function getPopup(): Promise<any[]> {
    const query = `*[_type == "popup" && enabled == true]{
    title,
    slug,
    type,
    image,
    target
  }`;

    const data = await client.fetch(query);
    console.log(data)
    return data;
};


export async function getWhitepaperCategories(): Promise<any[]> {
    const query = `*[_type == "whitepaperCategory"]{
    _id,
    title,
    slug
  }`;

    const categories = await client.fetch(query);
    return categories;
}

// Get whitepapers by category ID (or all if not specified)
export async function getAllWhitepapers(categoryId: string | null = null) {
    const query = categoryId
        ? `*[_type == "whitepaper" && references($categoryId)]{
        _id,
        title,
        slug,
        format,
        publishDate,
        description,
        thumbnail{
          asset->{
            _id,
            url
          }
        },
        vendor->{
          _id,
          title
        },
        categories[]->{
          _id,
          title,
          slug
        }
      }`
        : `*[_type == "whitepaper"]{
        _id,
        title,
        slug,
        format,
        publishDate,
        description,
        thumbnail{
          asset->{
            _id,
            url
          }
        },
        vendor->{
          _id,
          title
        },
        categories[]->{
          _id,
          title,
          slug
        }
      }`;

    const whitepapers = await client.fetch(query, { categoryId });
    return whitepapers;
}

export async function getWhitepaperBySlug(slug: string) {
    const query = `*[_type == "whitepaper" && slug.current == "${slug}"][0]{
    _id,
    title,
    slug,
    format,
    publishDate,
    description,
    thumbnail{
      asset->{
        _id,
        url
      }
    },
    vendor->{
      _id,
      name
    },
    categories[]->{
      _id,
      title,
      slug
    }
  }`;

    const whitepaper = await client.fetch(query);
    return whitepaper;
}

export async function getNewsLetter() {
    const query = `*[_type == "newsletter"][0]{
    _id,
    title,
    description
  }`;

    const whitepaper = await client.fetch(query);
    return whitepaper;
}