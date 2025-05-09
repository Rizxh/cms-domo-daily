import { Media, User, UserHistory } from "../../../../database/models";
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
      return saveMedia(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function saveMedia(req, res) {
  try {
    const now = moment().local();
    const form = new IncomingForm();

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const title = fields.title[0];
    const link = fields.link[0] || null;
    const status = fields.status[0];
    // const username = fields.username ? fields.username[0] : "unknown";

    const assetFile = files.asset[0];
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const fileExt = path.extname(assetFile.originalFilename);
    const newFilename = `${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDir, newFilename);

    await fs.rename(assetFile.filepath, filePath);

    const newMedia = await Media.create({
      uuid: uuidv4(),
      asset: `/api/uploads/${newFilename}`,
      title: title,
      link: link,
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
      environment: "Media Management",
      description: `Created a new media with title "${title}".`,
      created_at: now.format("YYYY-MM-DD HH:mm:ss"),
      updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
    });
  }

    return res.status(200).json({
      success: true,
      message: "Media created successfully",
      data: newMedia,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
}
