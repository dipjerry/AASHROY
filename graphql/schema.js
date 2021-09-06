const {buildSchema} = require('graphql');
module.exports = buildSchema(
    `
    type Post {
        _id: ID!
        title: String!
        cordinate: String!
        imageUrl: String!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }
    
    type postData{
        posts:[Post!]!
        totalPosts: Int!
    }

    type ngoData {
        _id: ID!,
        name: String!
        workd: String!
        place: String!,
        createdAt: String!
        updatedAt: String!
    }

    input NgoInputData {
        name: String!
        works: String!
        place: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        cordinate: String!
        imageUrl: String
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts(page : Int!): postData!
        post(postId:ID!): Post!
        user : User!
        ngo : ngoData!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
        createNgo(ngoInput: NgoInputData) : ngoData!  
        updatePost(postId: ID!, postInput: PostInputData): Post!
        deletePost(postId: ID!): Boolean
        updateStatus(status : String) : User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`,
);
