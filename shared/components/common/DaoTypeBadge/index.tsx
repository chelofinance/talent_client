import React from "react";

const DAO_COLORS_BY_TYPE = {
  snapshot: "yellow-300",
  aragon: "sky-400",
  syndicate: "purple-400",
};

const DAO_MESSAGE_BY_TYPE = {
  snapshot: "Snapshot",
  aragon: "Aragon",
  syndicate: "Syndicate",
};

export const DaoTypeBadge: React.FunctionComponent<{type: DaoType}> = (props) => {
  const {type} = props;

  return (
    <div className={`text-sm rounded-full px-1 bg-${DAO_COLORS_BY_TYPE[type]} text-white`}>
      {DAO_MESSAGE_BY_TYPE[type]}
    </div>
  );
};

const MINI_COLORS_BY_TYPE = {
  membership: "green",
  company: "red",
  reputation: "blue",
};

const MINI_MESSAGE_BY_TYPE = {
  membership: "Membership",
  company: "Company",
  reputation: "Reputation",
};

export const MiniDaoTypeBadge: React.FunctionComponent<{type: MiniDaoType}> = (props) => {
  const {type} = props;

  return (
    <div
      className={`text-sm font-semibold rounded-full px-1 bg-${MINI_COLORS_BY_TYPE[type]}-200 text-${MINI_COLORS_BY_TYPE[type]}-400 text-white`}
    >
      {MINI_MESSAGE_BY_TYPE[type]}
    </div>
  );
};
