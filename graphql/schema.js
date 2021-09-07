const {buildSchema} = require('graphql');
module.exports = buildSchema(
    `
    type Peoples {
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
    }
    type Donation {
        _id: ID!
        item: String!
      }

      
    type NGO{
        _id: ID!
        name: String!
        works: String!
        place: String!
    }
    type AuthData {
        token: String!
        userId: String!
    }
    
    type peopleData{
        posts:[Peoples!]!
        totalPosts: Int!
    }


    type ngoData{
        ngos:[NGO!]!
        totalNgo: Int!
        
    }
    type donationData {
        donations:[Donation!]!
        totalDonations: Int!
            }

    input NgoInputData {
        name: String!
        works: String!
        place: String!
    }

    input DonationInputData {
        item: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PeopleInputData {
        title: String!
        cordinate: String!
        imageUrl: String
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        peoples(page : Int!): peopleData!
        people(postId: ID!): Peoples!
        user: User!
        ngo: ngoData!
        donations : donationData!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPeoples(peopleInput: PeopleInputData): Peoples!
        createNgo(ngoInput: NgoInputData): NGO!  
        createDonation(donationInput: DonationInputData) : Donation!  
        updatePost(postId: ID!, postInput: PeopleInputData): Peoples!
        deletePost(postId: ID!): Boolean
        updateStatus(status: String) : User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`,
);
