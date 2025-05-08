import { Category, User, UserHistory } from "../../../../database/models";
import { IncomingForm } from "formidable";
import { apiHandler } from "helpers/api";
var moment = require("moment");
var mv = require("mv");
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return updateCategory();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function updateCategory() {
    try {
      var now = moment().local();

      await new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.parse(req, async (err, fields) => {
          if (err) return reject(err);

          const findCategory = await Category.findOne({
            where: {
              uuid: fields.uuid[0],
            },
          });

          if (findCategory) {
            const updateCategory = {
              category: fields.category[0],
              updated_at: now.format("YYYY-MM-DD HH:mm"),
            };

            const updatedCategory = await findCategory.update(updateCategory);

            if (fields.user_id) {
              const user = await User.findOne({
                where: { uuid: fields.user_id[0] },
              });

              await UserHistory.create({
                uuid: uuidv4(),
                timestamps: now.format("YYYY-MM-DD HH:mm:ss"),
                username: user.name,
                activity: "UPDATE",
                environment: "Category",
                description: `Update a category on title "${fields.category}".`,
                created_at: now.format("YYYY-MM-DD HH:mm:ss"),
                updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
              });
            }

            if (updatedCategory) {
              res.status(200).json({
                success: true,
                message: "Category updated successfully",
                data: updatedCategory,
              });
            } else {
              res.status(200).json({
                success: false,
                message: "Failed to update Category",
                data: updatedCategory,
              });
            }
          } else {
            res.status(404).json({
              success: false,
              message: "Category not found!",
            });
          }
        });
      });
    } catch (e) {
      res.status(404).json({
        success: false,
        message: e.message,
      });
    }
  }
}
