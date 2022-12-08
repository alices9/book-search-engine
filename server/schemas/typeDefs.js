const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    _id: ID
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    getSingleUser: User
  }

  type Mutation {
    createUser(username: String, email: String, password: String): Auth
    login(username: String!, password: String!): Auth
    saveBook(book: book): User
    deleteBook(bookId: ID): User
  }
`;

module.exports = typeDefs;
