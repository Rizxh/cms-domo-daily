import { Category, User, UserHistory } from "../../../../database/models";
import { apiHandler } from "../../../../helpers/api";
var moment = require("moment");
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return deleteCategory();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function deleteCategory() {
    try {
      var now = moment().local();

      const findCategory = await Category.findOne({
        where: {
          uuid: req.body.uuid,
        },
      });

      if (findCategory) {
        const deleteCategory = await Category.destroy({
          where: {
            uuid: req.body.uuid,
          },
        });

        const user = await User.findOne({
                  where: { uuid: req.body.user_id },
                });
        
                if (user) {
                  const now = dayjs();
                  await UserHistory.create({
                    uuid: uuidv4(),
                    timestamps: now.format("YYYY-MM-DD HH:mm:ss"),
                    username: user.name,
                    activity: "DELETE",
                    environment: "Category",
                    description: `Deleted category on title "${findCategory.category}".`,
                    created_at: now.format("YYYY-MM-DD HH:mm:ss"),
                    updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
                  });
                }

        res.status(200).json({
          success: true,
          message: "Category deleted successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Delete Category Failed!",
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
