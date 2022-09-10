import { makeExtendSchemaPlugin } from "graphile-utils";
import { customService } from "../../../services/customService";
import { typeDefs } from "./typeDefs";

const ExtendSchemaPlugin = makeExtendSchemaPlugin((build) => ({
  typeDefs,
  resolvers: {
    Query: {
      customQuery: (parent, args, context, info) =>
        customService(parent, args, context, info),
    },
  },
}));

export default ExtendSchemaPlugin;
