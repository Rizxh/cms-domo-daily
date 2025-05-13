import { Article, User, UserHistory } from "../../../../database/models";
import { IncomingForm } from "formidable";
import fs from "fs/promises";
import moment from "moment";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

import { apiHandler } from "../../../../helpers/api";

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return saveArticle(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function saveArticle(req, res) {
  try {
    const now = moment().local();
    const form = new IncomingForm();

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    console.log("Fields:", fields);
    console.log("Files:", files);

    const title = fields.title[0];
    const status = fields.status[0];
    const description = fields.description[0];
    const link = fields.link[0];
    const uuidCategory = fields.uuid_category[0];
    const uploadedBy = fields.uploaded_by[0];
    
    const assetFile = files.asset[0];
    console.log("value", JSON.stringify(assetFile));
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await fs.mkdir(uploadDir, { recursive: true });

    const fileExt = path.extname(assetFile.originalFilename);
    const newFilename = `${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDir, newFilename);

    await fs.rename(assetFile.filepath, filePath);

    const newArticle = await Article.create({
      uuid: uuidv4(),
      uuid_category: uuidCategory,
      asset: `/uploads/${newFilename}`,
      title: title,
      description: description,
      link: link,
      uploaded_by: uploadedBy,
      status: status,
      created_at: now.format("YYYY-MM-DD HH:mm:ss"),
      updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
    });

    if (fields.user_id) {
          const user = await User.findOne({
            where: { uuid: fields.user_id[0] },
          });
    
        await UserHistory.create({
          uuid: uuidv4(),
          timestamps: now.format("YYYY-MM-DD HH:mm:ss"),
          username: user.name,
          activity: "CREATE",
          environment: "Article",
          description: `Created new content on Article with title "${title}".`,
          created_at: now.format("YYYY-MM-DD HH:mm:ss"),
          updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
        });
      }

    return res.status(200).json({
      success: true,
      message: "Article created successfully",
      data: newArticle,
    });
  } catch (error) {
    console.error("Error creating Article:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
