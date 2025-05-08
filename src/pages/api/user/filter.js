import { User } from "../../../../database/models";
import { apiHandler } from "../../../../helpers/api";

const { Op } = require("sequelize");

export default handler;

async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const { page = 1, limit = 10 } = req.query;
      return getUser(parseInt(page), parseInt(limit));
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getUser(page, limit) {
    try {
      const keywordCondition = req.query.keywords
        ? {
            [Op.or]: [
              {
                name: {
                  [Op.like]: `%${req.query.keywords}%`,
                },
              },
              {
                email: {
                  [Op.like]: `%${req.query.keywords}%`,
                },
              },
            ],
          }
        : {};

      const offset = (page - 1) * limit;
      const findUser = await User.findAndCountAll({
        where: keywordCondition,
        offset,
        limit,
      });

      const totalPages = Math.ceil(findUser.count / limit);

      if (findUser) {
        res.status(200).json({
          success: true,
          message: "Success",
          data: findUser.rows,
          total: findUser.count,
          totalPages: totalPages,
        });
      }
    } catch (e) {
      res.status(404).json({
        success: false,
        message: e.message,
      });
    }
  }
}
