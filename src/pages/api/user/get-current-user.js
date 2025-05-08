import { User } from "../../../../database/models";
import { apiHandler } from "../../../../helpers/api";

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return getUser();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getUser() {
    try {
      const { uuid } = req.body;

      if (!uuid) {
        return res.status(400).json({
          success: false,
          message: "UUID is required",
        });
      }

      const findUser = await User.findOne({
        where: {
          uuid: uuid,
        },
      });

      if (findUser) {
        res.status(200).json({
          success: true,
          message: "Success",
          data: findUser,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
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