import {graphql} from "__generated__/gql";
import gql from "graphql-tag";

export const GET_ACCOUNT = graphql(/* GraphQL */ `
  query GetAccount($id: ID!) {
    account(id: $id) {
      id
    }
  }
`);

export const GET_ALL_GIVEN_OWNER = /* GraphQL */ gql`
  query GovernorsForOwner($id: ID!) {
    proposalRounds {
      id
      endBlock
      description
      startBlock
    }
    account(id: $id) {
      ownerOf {
        id
        name
        votingDelay
        votingPeriod
        quorum
        token {
          id
          asERC20 {
            name
            symbol
            decimals
            asAccount {
              id
            }
            totalSupply {
              value
            }
            balances {
              account {
                id
              }
              value
              valueExact
            }
          }
          asERC721 {
            asAccount {
              id
            }
            supportsMetadata
            name
            symbol
            tokens {
              owner {
                id
              }
              identifier
              uri
            }
          }
        }
        proposals {
          proposalId
          round {
            id
          }
          proposer {
            id
          }
          startBlock
          endBlock
          description
          canceled
          queued
          executed
          votecast {
            id
            voter {
              id
            }
            receipt {
              reason
              weight
              support {
                support
              }
            }
            timestamp
          }
        }
      }
    }
  }
`;
