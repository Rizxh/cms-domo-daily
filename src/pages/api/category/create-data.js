import { Category, User, UserHistory } from "../../../../database/models";
var moment = require("moment");
import { v4 as uuidv4 } from "uuid";

import { apiHandler } from "../../../../helpers/api";

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return saveCategory(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function saveCategory(req, res) {
    try {
      var now = moment().local();

      const createCategory = await Category.create({
        uuid: uuidv4(),
        category: req.body.category,
        created_at: now.format("YYYY-MM-DD HH:mm"),
        updated_at: now.format("YYYY-MM-DD HH:mm"),
      });

      if (req.body.user_id) {
            const user = await User.findOne({
              where: { uuid: req.body.user_id },
            });
      
          await UserHistory.create({
            uuid: uuidv4(),
            timestamps: now.format("YYYY-MM-DD HH:mm:ss"),
            username: user.name,
            activity: "CREATE",
            environment: "Category",
            description: `Created a new category with title "${req.body.category}".`,
            created_at: now.format("YYYY-MM-DD HH:mm:ss"),
            updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
          });
        }

      if (createCategory) {
        res.status(201).json({
          success: true,
          message: "Category created successfully",
          data: createCategory,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Failed to create Category",
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
