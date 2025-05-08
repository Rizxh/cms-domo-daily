import { User, UserLog } from "database/models";
import { IncomingForm } from "formidable";
import { apiHandler } from "helpers/api";
import moment from "moment";
var bcrypt = require("bcryptjs");
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
      return updateUser(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function updateUser(req, res) {
  try {
    const now = moment().local();

    const form = new IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Form parsing error" });
      }

      const { uuid, name, email, role } = fields;

      if (!uuid || !email || !name || !role) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      const findUser = await User.findOne({ where: { uuid } });

      if (!findUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const updatedData = {
        name: name[0],
        email: email[0],
        role: role[0],
        updated_at: now.format("YYYY-MM-DD HH:mm"),
      };

      if (fields.password) {
        updatedData.password = bcrypt.hashSync(fields.password[0], 10);
      }

      const updatedUser = await findUser.update(updatedData);

      if (fields.user_id) {
        const user = await User.findOne({
          where: { uuid: fields.user_id },
        });
  
      await UserLog.create({
        uuid: uuidv4(),
        timestamps: now.format("YYYY-MM-DD HH:mm:ss"),
        username: user.name,
        activity: "UPDATE",
        environment: "User",
        description: `Update a user with name "${fields.name}".`,
        created_at: now.format("YYYY-MM-DD HH:mm:ss"),
        updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
      });
    }

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}
