
/**
 * 
 * This is an helper function to redirect google emails to different pages 
 * based on reset password or email verification
 * 
 * @param req 
 * @param res 
 * @returns 
 */
const loginHandler = async (req, res) => {
  const { query } = req

  const queryString = new URLSearchParams(query).toString()

  if (query.mode === 'verifyEmail') {
    res.setHeader('Location', `/auth/verify-email?${queryString}`)
  } else if (query.mode === 'resetPassword') {
    res.setHeader('Location', `/auth/reset-password?${queryString}`)
  }

  res.statusCode = 302

  return res.end()
}

export default loginHandler
