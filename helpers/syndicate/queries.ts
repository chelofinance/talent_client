export const SYNDICATE_DAOS_GIVEN_OWNER = `
  query SyndicateDaos($ownerAddress: String = "") {
    syndicateDAOs(
      where: {ownerAddress: $ownerAddress}
    ) {
      id
      members {
        depositAmount
        member {
          memberAddress
        }
      }
      ownerAddress
      name
    }
  }
`;

export const SYNDICATE_DAOS_GIVEN_MEMBER = `
  query SyndicateDaos($member: String = "") {
    syndicateDAOs(
      where: {members_: {member: $member}}
    ) {
      id
      members {
        depositAmount
        member {
          memberAddress
        }
      }
      ownerAddress
      name
    }
  }
`;

export type SyndicateDaoInfo = {
  id: string;
  ownerAddress: string;
  members: {
    depositAmount: string;
    member: {
      memberAddress: string;
    };
  }[];
  name: string;
  startTime: string;
};

export const SYNDICATE_DAO = `
  query MyQuery($ownerAddress: String = "") {
    syndicateDAOs(where: {ownerAddress: $ownerAddress}) {
      id
      ownerAddress
      members {
        depositAmount
        member {
          memberAddress
        }
      }
      name
      startTime
    }
    token(id: "") {
      tokenAddress
    }
  }
`;
