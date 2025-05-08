import { UserHistory } from "../../../../database/models";
import { apiHandler } from "../../../../helpers/api";

const { Op } = require("sequelize");

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const { page = 1, limit = 10 } = req.query;
      return getData(parseInt(page), parseInt(limit));
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getData(page, limit) {
    try {
      const keywordsCondition = req.query.keywords
        ? {
          [Op.or]: [
            {
              timestamps: {
                [Op.like]: `%${req.query.keywords}%`,
              },
            },
            {
              username: {
                [Op.like]: `%${req.query.keywords}%`,
              },
            },
            {
              activity: {
                [Op.like]: `%${req.query.keywords}%`,
              },
            },
            {
              environment: {
                [Op.like]: `%${req.query.keywords}%`,
              },
            },
            {
              description: {
                [Op.like]: `%${req.query.keywords}%`,
              },
            },
          ],
        }
        : {};

      const offset = (page - 1) * limit;
      const findLogs = await UserHistory.findAndCountAll({
        where: {
          ...keywordsCondition,
        },
        offset,
        limit,
        order: [["id", "DESC"]],
      });

      const totalPages = Math.ceil(findLogs.count / limit);

      if (findLogs) {
        res.status(200).json({
          success: true,
          message: "Success",
          data: findLogs.rows,
          total: findLogs.count,
          totalPages: totalPages,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Get Data Failed!",
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
