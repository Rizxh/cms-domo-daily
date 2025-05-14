import { Article, Category, User } from "../../../../database/models";
import { apiHandler } from "../../../../helpers/api";

export default apiHandler(handler);

async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return getArticleDetails(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getArticleDetails(req, res) {
  const uuid = req.query.uuid;

  console.log("UUID" + uuid)

  if (!uuid) {
    return res.status(400).json({
      success: false,
      message: "Article UUID is required",
    });
  }

  try {
    const article = await Article.findOne({
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: User,
          as: 'user',
        },
      ],
      where: {
        uuid: uuid
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Success",
      data: article,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}
