import User from "./user";
import UserHistory from "./user-history";

const models = {
  UserHistory,
  User,
};

// Create associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { User, UserHistory };
