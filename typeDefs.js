module.exports = `
  type Query {
    getAllPosts:[Post!]!
  }
  type Post {
    _id:ID!
    title: String!
    body:String!
    createdAt:String!
    updatedAt:String!
  }

  type Mutation {
    createPost(title:String!,body:String!):Post!
    updatePost(_id:ID!,title:String!,body:String!): Post!
    deletePost(_id:ID!):[Post!]! 
  },
  type Subscription {
    postCreated:Post!
    postUpdated:Post!
    postDeleted:[Post!]!
  }

`;
