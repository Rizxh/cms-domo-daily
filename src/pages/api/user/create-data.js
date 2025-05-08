import { User, UserLog } from "database/models";
import { apiHandler } from "helpers/api";
import { v4 as uuidv4 } from "uuid";
var moment = require("moment");
var bcrypt = require("bcryptjs");
export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return saveUser(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function saveUser(req, res) {
    try {
      var now = moment().local();

      // Hash password sebelum disimpan
      const saltRounds = 10; // Tentukan jumlah salt rounds
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      const createUser = await User.create({
        uuid: uuidv4(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword, // Simpan password yang sudah di-hash
        role: req.body.role,
        created_at: now.format("YYYY-MM-DD HH:mm"),
        updated_at: now.format("YYYY-MM-DD HH:mm"),
      });

      if (req.body.user_id) {
        const user = await User.findOne({
          where: { uuid: req.body.user_id },
        });
  
      await UserLog.create({
        uuid: uuidv4(),
        timestamps: now.format("YYYY-MM-DD HH:mm:ss"),
        username: user.name,
        activity: "CREATE",
        environment: "User",
        description: `Created a new user with name "${req.body.name}".`,
        created_at: now.format("YYYY-MM-DD HH:mm:ss"),
        updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
      });
    }

      if (createUser) {
        res.status(201).json({
          success: true,
          message: "User created successfully",
          data: createUser,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Failed to create user",
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
