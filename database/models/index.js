import Media from "./media";
import Category from "./category";
import User from "./user";
import UserHistory from "./user-history";
import Article from "./article";

const models = {
  Article,
  Media,
  Category,
  UserHistory,
  User,
};

// Create associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { User, UserHistory, Category, Media, Article };
