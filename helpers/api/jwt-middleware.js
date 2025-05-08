const { expressjwt: expressJwt } = require("express-jwt");
const util = require("util");
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

export { jwtMiddleware };

function jwtMiddleware(req, res) {
  const middleware = expressJwt({
    secret: serverRuntimeConfig.secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      // public routes that don't require authentication
      `/api/admin/authenticate`,
      `/api/member/authenticate`,
      `/api/membership-request/create-data`,
      `/api/membership-request/get-data`,
    ],
  });

  return util.promisify(middleware)(req, res);
}
