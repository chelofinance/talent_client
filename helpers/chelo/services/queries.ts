export type DAOInfo = {
  address: {
    id: string;
  };
  miniDaos: {
    id: string;
    address: {id: string};
    creation: {
      id: string;
      timestamp: string;
      blockNumber: string;
    };
    token: {
      name: string;
      symbol: string;
      decimals: number;
      totalSupply: {
        valueExact: string;
      };
      asAccount: {
        id: string;
      };
      balances: {
        valueExact: string;
        account: {
          id: string;
        };
      }[];
    };
    agent: {
      id: string;
    };
    managers: {
      collateralReceiver: {
        id;
      };
      address: {
        id: string;
      };
      settings: Setting;
      pools: {
        id: string;
        unpaidAmount: string;
        value: string;
        liquidValue: string;
        minPrincipal: string;
        maxPrincipal: string;
        address: {
          id: string;
        };
        token: {
          asAccount: {
            id: string;
          };
          name: string;
          symbol: string;
          decimals: number;
          totalSupply: {
            valueExact: string;
          };
        };
      }[];
      loans: {
        amountRepaid: string;
        principal: string;
        repaymentAmount: string;
        repaymentDate: number;
        collateralId: string;
        duration: string;
        status: number;
        hasCollateral: boolean;
        borrower: {
          id: string;
        };
        token: {
          totalSupply: {
            valueExact: string;
          };
          asAccount: {
            id: string;
          };
          name: string;
          symbol: string;
          decimals: number;
        };
        pool: {
          id: string;
        };
      }[];
    }[];
  }[];
};

export const ARAGON_DAO_INFO = `
  query Organizations($id: ID!){
    daoWallet(id: $id){
      address{
        id
      }
      miniDaos{
        id 
        creation{
          id
          timestamp
          blockNumber
        }
        token{
          name
          symbol 
          decimals 
          totalSupply{
            valueExact
          }
          asAccount{
            id
          }
          balances{
            valueExact
            account{
              id
            }
          }
        }
        address{
          id
        }
        agent{
          id
        }
        managers{
          collateralReceiver{
            id
          }
          address {
            id
          }
          settings{
            minApr
            maxApr
            minDuration
            maxDuration
            maxPools 
            maxDefaulted
            managerDuration
          }
          pools{
            id 
            unpaidAmount 
            value 
            liquidValue
            minPrincipal
            maxPrincipal
            address{
              id
            } 
            token{
              name 
              symbol 
              decimals
              totalSupply{
                valueExact
              }
              asAccount{
                id
              }
              totalSupply {
                value
              }
            }
          }
          loans{
            amountRepaid 
            principal 
            repaymentAmount 
            repaymentDate
            collateralId 
            duration 
            status 
            hasCollateral
            borrower {
              id
            }
            token{ 
              asAccount{ 
                id
              }
              totalSupply{
                valueExact
              }
              name 
              symbol
              decimals  
            } 
            pool {
              id 
            }
          }
        }
      }
    }
  }
`;

export type WrapperInfo = {
  tokens: {
    identifier: string;
    uri: string;
    metadata: string;
    owner: {
      id: string;
    };
    contract: {
      asAccount: {
        id: string;
      };
    };
    erc20Deposits: {
      balance: string;
      token: {
        id: string;
        name: string;
        symbol: string;
        decimals: number;
      };
    }[];
    erc721Deposits: {
      token: {
        identifier: string;
        uri: string;
        contract: {
          name: string;
          symbol: string;
          asAccount: {
            id: string;
          };
        };
      };
    }[];
  }[];
};

export const WRAPPER_INFO = `
  query ERC721Contracts($id: ID!){
    erc721Contract(id: $id){
      tokens{
        identifier 
        uri
        metadata
        owner{
          id
        }
        contract{
          asAccount{
            id
          }
        }
        erc20Deposits{
          balance
          token{
            id
            name 
            symbol 
            decimals
          }
        }
        erc721Deposits{
          token{
            identifier
            uri 
            contract{
              name 
              symbol
              asAccount{
                id
              }
            }
          }
        }
      }
    }
  }
`;

export type SnapshotDaoInfo = {
  id: string;
  name: string;
  network: string;
  members: string[];
  admins: string[];
};

export const SNAPSHOT_DAO_INFO = `
  query Spaces($id_in: [String]) {
    spaces(where: { id_in: $id_in }) {
      id
      name
      network
      members
      admins
    }
  }
`;

export type SnapshotFollowInfo = {
  id: string;
  follower: string;
  space: SnapshotDaoInfo;
  created: number;
};

export const SNAPSHOT_USER_DAO_INFO = `
  query Follows($follower_in: [String]) {
    follows (where: { follower_in: $follower_in}) {
      id
      follower
      space {
        id
        name
        network
        members
        admins
      }
      created
    }
  }
`;

export type UserDaos = {
  ERC20balances: {
    contract: {
      organization: {
        id: string;
        txInput: string;
      };
    };
  }[];
};

export const USER_DAOS_QUERY = `
  query UserDaos($id: ID!) {
    accounts(where:{id: $id}){
      ERC20balances{
        contract{
          organization{
            id
            txInput
          }
        }
      }
    }
  }
`;

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
