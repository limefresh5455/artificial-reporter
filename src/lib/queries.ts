export const postsQuery = `*[_type == "post"]{
    _id,
    title,
    slug,
    body,
    mainImage,
    publishedAt,
  } | order(publishedAt desc)`
  