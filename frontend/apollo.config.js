module.exports = {
  client: {
    excludes: ["node_modules", "__tests__", `hooks.ts`],
    includes: [
      `${__dirname}/containers/**/*.{ts,tsx,js,jsx,graphql,gql}`,
      `${__dirname}/components/**/*.{ts,tsx,js,jsx,graphql,gql}`,
      `${__dirname}/pages/**/*.{ts,tsx,js,jsx,graphql,gql}`,
      `${__dirname}/graphql/**/*.{ts,tsx,js,jsx,graphql,gql}`,
      `${__dirname}/context/**/*.{ts,tsx,js,jsx,graphql,gql}`,
      `${__dirname}/lib/**/*.{ts,tsx,js,jsx,graphql,gql}`,
    ],
    service: {
      name: "schema",
      localSchemaFile: `${__dirname}/../api/schema.graphql`,
    },
  },
};
