/**
 *
 * This is an helper function to check if an email has the right format
 *
 * @param email string
 * @returns boolean
 */
export const isEmail = (email: string) => {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(emailFormat)) {
    return true;
  }

  return false;
};
