import { graphql } from "__generated__/gql";
import gql from "graphql-tag";

export const GET_ACCOUNT = graphql(/* GraphQL */ `
  query GetAccount($id: ID!) {
    account(id: $id) {
      id
    }
  }
`);

export const GET_ALL_GIVEN_OWNER = /* GraphQL */ gql`
  query Governors {
    proposalRounds {
      id
      endBlock
      description
      startBlock
      executeThreshold
      roleVotes {
        maxVotes
        roleId
      }
    }
    governors {
      id
      name
      votingDelay
      votingPeriod
      quorum
      token {
        id
        asERC1155 {
          asAccount {
            id
          }
          balances {
            account {
              id
            }
            value
            valueExact
          }
        }
      }
      proposals {
        proposalId
        startBlock
        endBlock
        description
        canceled
        queued
        executed
        calls {
          calldata
          value
          target {
            id
          }
        }
        round {
          id
        }
        proposer {
          id
        }
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
`;
