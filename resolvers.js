module.exports = {
  Query: {
    getAllPosts: async (parent, args, { Post }) => {
      const post = await Post.find();
      return post;
    },
  },
  Mutation: {
    createPost: async (_, { title, body }, { Post, pubsub }) => {
      const post = await Post.create({ title, body });
      pubsub.publish("POST_CREATED", { postCreated: post });
      return post;
    },
  },
  Subscription: {
    postCreated: {
      subscribe: (parent, args, { ctx: { pubsub, post } }, info) => {
        return pubsub.asyncIterator(["POST_CREATED"]);
      },
    },
  },
};
