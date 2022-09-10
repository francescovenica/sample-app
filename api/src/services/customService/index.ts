export const customService = (
  parent: any,
  args: any,
  context: any,
  info: any
) => {

  /**
   * This is a custom resolver, it doesn't do too much, only return
   * the input we sent in our mutation
   */
  return {
    message: args.input.message,
  }
};
