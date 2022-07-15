const jwt = require('jsonwebtoken');
const { User } = require('../services/arango');

async function auth(req, res, next) {
  // Get token from header
  let token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      errors: { msg: 'No token, authorization denied.', errorCode: 'noToken' },
    });
  }
  token = token.split(' ')[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      errors: { msg: 'No token, authorization denied.', errorCode: 'noToken' },
    });
  }

  // Verify token
  try {
    jwt.verify(token, "abc", async (error, decoded) => {
      if (error) {
        return res.status(401).json({
          statusCode: 401,
          errors: { msg: 'Token is not valid', errorCode: 'invalidToken' },
        });
      } else {
        const isExist = await User.find().where({ email: decoded.email });
        if (isExist.length) {
          req.user = decoded;
        } else {
          return res.status(401).json({
            statusCode: 401,
            errors: { msg: 'Token is not valid', errorCode: 'invalidToken' },
          });
        }
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    return res.status(500).json({
      statusCode: 500,
      errors: { msg: 'Server Error', errorCode: 'serverError' },
    });
  }
};

module.exports = {
  auth
}