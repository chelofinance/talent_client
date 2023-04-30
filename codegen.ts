import {CodegenConfig} from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://api.thegraph.com/subgraphs/name/rcontre360/talent_subgraph",
  //schema: "http://localhost:8000/subgraphs/name/rcontre360/talent_subgraph",
  //schema: [
  //{
  //'lib/schema.ts': {
  //noRequire: true,
  //},
  //},
  //],
  documents: ["./pages/**/*.tsx", "./helpers/**/*.ts"],
  generates: {
    "./__generated__/gql/": {
      preset: "client",
      plugins: [],
    },
    "./__generated__/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
