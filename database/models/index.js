import User from "./user";

const models = {
  User,
};

// Create associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { User };
