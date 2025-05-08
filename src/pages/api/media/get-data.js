import { Media } from "../../../../database/models";
import { apiHandler } from "../../../../helpers/api";

const { Op } = require("sequelize");

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return getBanner();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getBanner() {
    try {
      const keywordCondition = req.query.keywords
        ? {
            [Op.or]: [
              {
                title: {
                  [Op.like]: `%${req.query.keywords}%`,
                },
              },
              {
                link: {
                  [Op.like]: `%${req.query.keywords}%`,
                },
              },
            ],
          }
        : {};

      const findBanner = await Media.findAndCountAll({
        where: keywordCondition,
      });

      return res.status(200).json({
        success: true,
        message: "Success",
        data: findBanner.rows,
        total: findBanner.count,
      });
    } catch (e) {
      return res.status(404).json({
        success: false,
        message: e.message,
      });
    }
  }
}
