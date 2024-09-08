import { request, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export const getPosts = async () => {
  const query = gql`
    query MyQuery {
    postsConnection {
      edges {
        node {
          author {
            bio
            name
            id
            photo {
              url
            }
          }
          createdAt
          slug
          title
          excerpt
          featuredImage {
            url
          }
          categories {
            name
            slug
          }
        }
      }
    }
  }
  `;

  const result = await request(graphqlAPI, query);

  return result.postsConnection.edges;
};

export const getCategories = async () => {
  const query = gql`
    query GetGategories {
        categories {
          name
          slug
        }
    }
  `;

  const result = await request(graphqlAPI, query);

  return result.categories;
};

export const getPostDetails = async (slug) => {
  const query = gql`
    query GetPostDetails($slug : String!) {
    post(where: {slug: $slug}) {
      author {
            bio
            name
            id
            photo {
              url
            }
          }
          createdAt
          slug
          title
          excerpt
          featuredImage {
            url
          }
          categories {
            name
            slug
          }
          content {
              raw
          }
        }
      }    
  `;

  const result = await request(graphqlAPI, query, { slug });

  return result.post;
};

export const getSimilarPosts = async (categories, slug) => {
  const query = gql`
    query GetPostDetails($slug: String!, $categories: [String!]) {
      posts(
        where: {slug_not: $slug, AND: {categories_some: {slug_in: $categories}}}
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;
  const result = await request(graphqlAPI, query, { slug, categories });

  return result.posts;
};

export const getAdjacentPosts = async (createdAt, slug) => {
  const query = gql`
    query GetAdjacentPosts($createdAt: DateTime!,$slug:String!) {
      next:posts(
        first: 1
        orderBy: createdAt_ASC
        where: {slug_not: $slug, AND: {createdAt_gte: $createdAt}}
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
      previous:posts(
        first: 1
        orderBy: createdAt_DESC
        where: {slug_not: $slug, AND: {createdAt_lte: $createdAt}}
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug, createdAt });

  return { next: result.next[0], previous: result.previous[0] };
};

export const getCategoryPost = async (slug) => {
  const query = gql`
    query GetCategoryPost($slug: String!) {
      postsConnection(where: {categories_some: {slug: $slug}}) {
        edges {
          cursor
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug });

  return result.postsConnection.edges;
};

export const getFeaturedPosts = async () => {
  const query = gql`
    query GetFeaturedPosts {
      posts(where: {featuredPost: true}) {
        id
        title
        slug
        createdAt
        author {
          name
          photo {
            url
          }
        }
        featuredImage {
          url
        }
      }
    }
  `;

  try {
    const result = await request(graphqlAPI, query);
    console.log('GraphQL Response:', JSON.stringify(result, null, 2));
    return result.posts;
  } catch (error) {
    console.error('GraphQL Error:', error);
    console.error('GraphQL Stack:', error.stack);
    console.error('GraphQL Response:', error.response);
    throw error;
  }
};

export const submitComment = async (obj) => {
  const result = await fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  });

  return result.json();
};

export const getComments = async (slug) => {
  const query = gql`
    query GetComments($slug: String!) {
      commentsConnection(where: { post: { slug: $slug } }) {
        edges {
          node {
            name
            createdAt
            comment
          }
        }
      }
    }
  `;

  try {
    const result = await request(graphqlAPI, query, { slug });
    console.log('GraphQL Response:', JSON.stringify(result, null, 2));
    return result.commentsConnection.edges.map(edge => edge.node);
  } catch (error) {
    console.error('GraphQL Error:', error.message);
    console.error('GraphQL Stack:', error.stack);
    console.error('GraphQL Response:', error.response);
    throw error;
  }
};

//How to query manualley without graphql
export const getRecentPosts = async () => {
  const query = gql`
    query GetRecentPosts {
      postsConnection(
      orderBy: createdAt_ASC,
      last: 3
      ) {
        edges {
          node {
            title
            featuredImage {
              url
            }
            createdAt
            slug
          }
        }
      }
    }
  `;

  try {
    const result = await request(graphqlAPI, query);
    console.log('GraphQL Response:', JSON.stringify(result, null, 2));
    return result.postsConnection.edges.map(edge => edge.node);
  } catch (error) {
    console.error('GraphQL Error:', error.message);
    console.error('GraphQL Stack:', error.stack);
    throw error;
  }
};
