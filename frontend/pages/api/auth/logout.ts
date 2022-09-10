import auth from "../../../lib/firebase-admin";
import { getCookie, deleteCookie } from "../../../lib/cookies";

const Logout = async (req, res) => {
  const { returnTo } = req.body;
  const { session } = getCookie(req);

  /**
   * If no session we don't need to cancel anything
   */
  if (!session) {
    return res.json({
      returnTo,
    });
  }

  try {
    /**
     * Check if the session is valid
     */
    const decodedClaims = await auth().verifySessionCookie(session);

    /**
     * Revoke this token
     */
    await auth().revokeRefreshTokens(decodedClaims.sub);

    /**
     * Delete the cookie
     */
    deleteCookie(res, "session");
  } catch (error) {
    console.log("Logout error", error);
  }

  return res.json({
    returnTo,
  });
};

export default Logout;
