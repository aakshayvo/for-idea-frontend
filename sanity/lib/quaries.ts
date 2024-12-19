import { gql } from "@apollo/client";

export const GET_STARTUPS = gql`
  query GetStartups {
    allStartup(sort: { _createdAt: DESC }) {
      title
      _id
      slug {
        current
      }
      _createdAt
      author {
        _id
        name
      }
      views
      description
      category
      image
    }
  }
`;

export const GET_STARTUP_BY_ID = gql`
  query GetStartupById($id: ID!) {
    allStartup(where: { _id: { eq: $id } }) {
      _id
      title
      slug {
        current
      }
      _createdAt
      author {
        _id
        name
        username
        image
        bio
      }
      views
      description
      category
      image
      pitch
    }
  }
`;

export const STARTUP_VIEWS_QUERY = gql`
  query StartupViewsQuery($id: ID!) {
    allStartup(where: { _id: { eq: $id } }) {
      _id
      views
    }
  }
`;
