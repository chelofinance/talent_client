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
