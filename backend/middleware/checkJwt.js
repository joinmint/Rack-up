const { auth } = require("express-oauth2-jwt-bearer");
const checkJwt = auth({
  issuerBaseURL: "https://fresh-forward-consulting.us.auth0.com",
  audience: "fresh-api-identifier",
});

module.exports = checkJwt;
