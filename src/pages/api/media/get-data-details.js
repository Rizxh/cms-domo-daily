import { Media } from "../../../../database/models";
import { apiHandler } from "../../../../helpers/api";

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return getMediaDetails(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getMediaDetails(req, res) {
  const uuid = req.query.uuid;

  console.log(uuid)

  // Validasi input parameter
  if (!uuid) {
    return res.status(400).json({
      success: false,
      message: "Media UUID is required",
    });
  }

  try {
    const banner = await Media.findOne({
      where: {
        uuid: uuid
      }
    });

    // Jika Media tidak ditemukan
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    // Mengembalikan detail banner
    res.status(200).json({
      success: true,
      message: "Success",
      data: banner,
    });
  } catch (e) {
    // Menangani error jika terjadi
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}
