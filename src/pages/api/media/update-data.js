import { Media, User, UserHistory } from "../../../../database/models";
import { IncomingForm } from "formidable";
import { apiHandler } from "../../../../helpers/api";
import moment from "moment";

import fs from "fs/promises";
import path from "path";
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
      return updateMedia();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function updateMedia() {
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

      const findMedia = await Media.findOne({
        where: {
          uuid: fields.uuid[0],
        },
      });

      if (!findMedia) {
        return res.status(404).json({
          success: false,
          message: "Media not found!",
        });
      }

      let assetMedia = findMedia.asset;

      if (files.file?.[0]) {
        const assetFile = files.file[0];
        const fileExt = path.extname(assetFile.originalFilename);
        const newFileName = `${uuidv4()}${fileExt}`;
        const newFilePath = path.join(form.uploadDir, newFileName);
        fs.rename(assetFile.filepath, newFilePath);
        assetMedia = `/api/uploads/${newFileName}`;
      }

      const updateMedia = {
        asset: assetMedia,
        title: fields.title?.[0],
        link: fields.link?.[0],
        status: fields.status?.[0],
        updated_at: now.format("YYYY-MM-DD HH:mm"),
      };

      const updatedMedia = await findMedia.update(updateMedia);

      if (fields.user_id) {
            const user = await User.findOne({
              where: { uuid: fields.user_id[0] },
            });
      
          await UserHistory.create({
            uuid: uuidv4(),
            timestamps: now.format("YYYY-MM-DD HH:mm:ss"),
            username: user.name,
            activity: "UPDATE",
            environment: "Media Management",
            description: `Update a media on title "${fields.title}, number ${fields.id}".`,
            created_at: now.format("YYYY-MM-DD HH:mm:ss"),
            updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
          });
        }

      return res.status(200).json({
        success: true,
        message: "Media updated successfully",
        data: updatedMedia,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
