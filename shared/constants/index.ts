export const DEFAULT_SETTINGS = Object.freeze({
  minApr: "0",
  maxApr: "0",
  minDuration: "0",
  maxDuration: "0",
  maxPools: "0",
  maxDefaulted: "0",
  managerDuration: "0",
});

export const ROUTES = Object.freeze([
  {
    name: "home",
    route: "/",
    title: "",
  },
  {
    name: "dashboard",
    route: "/dashboard",
    title: "Dashboard",
  },
  {
    name: "add_mini_dao",
    route: "/add-mini-dao",
    title: "Add Mini DAO",
  },
  {
    name: "mini_dao",
    route: "/mini_dao",
    title: "Mini DAO",
  },
  {
    name: "loan",
    route: "/mini_dao/loans/[id]",
    title: "Loans",
  },
  {
    name: "votes",
    route: "/mini_dao/votes",
    title: "Votes",
  },
  {
    name: "vote",
    route: "/mini_dao/votes/[vote_id]",
    title: "Vote",
  },
  {
    name: "settings",
    route: "/mini_dao/settings",
    title: "Settings",
  },
  {
    name: "members",
    route: "/mini_dao/members",
    title: "Members",
  },
  {
    name: "create_mini_dao",
    title: "Add Mini DAO",
    route: "/add_mini_dao",
  },
]);

export const TIME_SECONDS = {
  MINUTE: 60,
  HOUR: 3600,
  DAY: 3600 * 24,
  MONTH: 3600 * 24 * 31,
  YEAR: 3600 * 24 * 365,
};
