import {
  makeWrapResolversPlugin,
  makePluginByCombiningPlugins,
} from "graphile-utils";

import { createAccount } from "../../../services/account";

/**
 * This is how we can wrap a resolver and add our custom code
 */
const WrapPlugin = makePluginByCombiningPlugins(
  makeWrapResolversPlugin({
    Mutation: {
      /**
       * this is the name of the mutation we want to wrap
       */
      createAccount: {
        async resolve(
          resolve: any,
          source,
          args: any,
          context: any,
          resolveInfo
        ) {
          return createAccount(resolve, source, args, context, resolveInfo);
        },
      },
    },
  })
);

export default WrapPlugin;
