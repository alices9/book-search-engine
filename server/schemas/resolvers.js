const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    getSingleUser: async (parent, {username}) => {
      return await User.findOne({ _id: username });
    },
  },

  Mutation: {
    createUser: async ({ body }, res) => {
        const user = await User.create(body);
        const token = signToken(user);
        return { token, user };
    },
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError('No user found with this username');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },


    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: book } },
            { new: true}
          );

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    deleteBook: async (parent, { bookId }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: bookId } },
              { new: true}
            );
  
          return updatedUser;
        }
        throw new AuthenticationError('You need to be logged in!');
      },
  },
};

module.exports = resolvers;
