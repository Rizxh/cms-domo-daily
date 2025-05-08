import { Category } from "../../../../database/models";

const { Op } = require("sequelize");

export default handler;

async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const { page = 1, limit = 10 } = req.query;
      return getCategory(parseInt(page), parseInt(limit));
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getCategory(page, limit) {
    try {
      const keywordCondition = req.query.keywords
        ? {
            [Op.or]: [
              {
                category: {
                  [Op.like]: `%${req.query.keywords}%`,
                },
              },
            ],
          }
        : {};

      const offset = (page - 1) * limit;
      const findCategory = await Category.findAndCountAll({
        where: keywordCondition,
        offset,
        limit,
      });

      const totalPages = Math.ceil(findCategory.count / limit);

      if (findCategory) {
        res.status(200).json({
          success: true,
          message: "Success",
          data: findCategory.rows,
          total: findCategory.count,
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
