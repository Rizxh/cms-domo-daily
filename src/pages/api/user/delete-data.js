import { User, UserLog } from "database/models";
import { apiHandler } from "helpers/api";
var moment = require("moment");
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return deleteUser();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function deleteUser() {
    try {
      var now = moment().local();

      const findUser = await User.findOne({
        where: {
          uuid: req.body.uuid,
        },
      });

      if (findUser) {
        const deleteUser = await User.destroy({
          where: {
            uuid: req.body.uuid,
          },
        });

        const user = await User.findOne({
                  where: { uuid: req.body.user_id },
                });
        
                if (user) {
                  const now = dayjs();
                  await UserLog.create({
                    uuid: uuidv4(),
                    timestamps: now.format("YYYY-MM-DD HH:mm:ss"),
                    username: user.name,
                    activity: "DELETE",
                    environment: "User",
                    description: `Deleted Use with name "${findUser.name}".`,
                    created_at: now.format("YYYY-MM-DD HH:mm:ss"),
                    updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
                  });
                }

        res.status(200).json({
          success: true,
          message: "User deleted successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Delete User Failed!",
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
