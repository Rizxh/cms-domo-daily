import { User } from "../../../../database/models";
import getConfig from "next/config";
import { apiHandler } from "../../../../helpers/api";

var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { serverRuntimeConfig } = getConfig();

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return authenticate();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function authenticate() {
    try {
      const checkUser = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (checkUser) {
        const checkUser = await User.findOne({
          where: {
            email: req.body.email,
          },
        }).then(async function (obj) {
          if (obj) {
            const passwordCheck = bcrypt.compareSync(
              req.body.password,
              obj.password
            );
            if (passwordCheck) {
              // create a jwt token that is valid for 7 days
              const token = jwt.sign(
                { sub: obj.id },
                serverRuntimeConfig.secret,
                {
                  expiresIn: "7d",
                }
              );
              // return basic user details and token
              return res.status(200).json({
                success: true,
                id: obj.uuid,
                email: obj.email,
                role: obj.role,
                token,
              });
            } else {
              res.status(200).json({
                success: false,
                message: "Password is incorrect!",
              });
            }
          }
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Account not Found!",
        });
      }
    } catch (e) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }
}
