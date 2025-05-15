import { Article, Category, User } from "../../../../database/models";
import { apiHandler } from "../../../../helpers/api";

const { Op } = require("sequelize");

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const { page = 1, limit = 10 } = req.query;
      return getArticle(parseInt(page), parseInt(limit));
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getArticle(page, limit) {
    try {
      const status = req.query.status && req.query.status !== "All" ? req.query.status : null;

      const whereConditions = {
        ...(status && { status }),
        ...(req.query.keywords || req.query.category
          ? {
              [Op.or]: [
                req.query.keywords && {
                  title: { [Op.like]: `%${req.query.keywords}%` },
                },
                req.query.category && {
                  "$category.name$": { [Op.like]: `%${req.query.category}%` },
                },
              ].filter(Boolean),
            }
          : {}),
      };

      const offset = (page - 1) * limit;
      const findArticle = await Article.findAndCountAll({
        include: [
          {
            model: Category,
            as: "category",
          },
          {
            model: User,
            as: "user",
          },
        ],
        where: whereConditions,
        offset,
        limit,
        order: [["id", "DESC"]],
      });
      

      const totalPages = Math.ceil(findArticle.count / limit);

      return res.status(200).json({
        success: true,
        message: "Success",
        data: findArticle.rows,
        total: findArticle.count,
        totalPages: totalPages,
      });
    } catch (e) {
      return res.status(404).json({
        success: false,
        message: e.message,
      });
    }
  }
}
