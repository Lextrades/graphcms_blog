[https://youtu.be/HYv55DhgTuA?si=1Pr47AM2KqfwCqf5](https://youtu.be/HYv55DhgTuA?si=1Pr47AM2KqfwCqf5


Create hygraph studio schema at https://app.hygraph.com/:

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
  })
