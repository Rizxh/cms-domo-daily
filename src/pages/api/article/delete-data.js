import { Article, User, UserHistory } from "../../../../database/models";
import fs from "fs/promises";
import { apiHandler } from "../../../../helpers/api";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return deleteArticle();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function deleteArticle() {
    try {
      const findArticle = await Article.findOne({
        where: {
          uuid: req.body.uuid
        },
      });

      if (findArticle) {
        // Delete the banner image file
        const assetPath = path.join(process.cwd(), "public", findArticle.assets);
        try {
          await fs.unlink(assetPath);
        } catch (err) {
          console.error("Error deleting article file:", err);
        }

        // Delete the banner record
        await Article.destroy({
          where: {
            uuid: req.body.uuid
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
            environment: "Article",
            description: `Deleted Article content on title "${findArticle.title}".`,
            created_at: now.format("YYYY-MM-DD HH:mm:ss"),
            updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
          });
        }

        return res.status(200).json({
          success: true,
          message: "Article deleted successfully",
        });
      }

      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }
}
