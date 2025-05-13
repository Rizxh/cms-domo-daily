import { Article, User, UserHistory } from "../../../../database/models";
import { IncomingForm } from "formidable";
import { apiHandler } from "../../../../helpers/api";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return updateArticle();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function updateArticle() {
    try {
      const now = moment().local();

      const form = new IncomingForm();
      form.uploadDir = "./public/uploads";
      form.keepExtensions = true;
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      const findArticle = await Article.findOne({
        where: {
          uuid: fields.uuid[0],
        },
      });

      if (!findArticle) {
        return res.status(404).json({
          success: false,
          message: "Article not found!",
        });
      }

      let assetArticle = findArticle.asset;

      if (files.asset?.[0]) {
        const assetFile = files.asset[0];
        const fileExt = path.extname(assetFile.originalFilename);
        const newFileName = `${uuidv4()}${fileExt}`;
        const newFilePath = path.join(form.uploadDir, newFileName);
        fs.rename(assetFile.filepath, newFilePath);
        assetArticle = `/uploads/${newFileName}`;
      }

      const updateArticle = {
        asset: assetArticle,
        title: fields.title?.[0],
        content: fields.content?.[0],
        uuid_category: fields.uuid_category?.[0],
        status: fields.status?.[0],
        uploaded_by: fields.uploaded_by?.[0],
        updated_at: now.format("YYYY-MM-DD HH:mm"),
      };

      const updatedArticle = await findArticle.update(updateArticle);

      if (fields.user_id) {
        const user = await User.findOne({
          where: { uuid: fields.user_id[0] },
        });

        await UserHistory.create({
          uuid: uuidv4(),
          timestamps: now.format("YYYY-MM-DD HH:mm:ss"),
          username: user.name,
          activity: "UPDATE",
          environment: "Article",
          description: `Update a Article on title "${fields.title}".`,
          created_at: now.format("YYYY-MM-DD HH:mm:ss"),
          updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      return res.status(200).json({
        success: true,
        message: "Article updated successfully",
        data: updatedArticle,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
