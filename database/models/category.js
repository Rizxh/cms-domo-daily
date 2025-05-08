import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initDatabase = (sequelize, Types) => {
  class Category extends Model {}
  Category.init(
    {
      uuid: Types.STRING,
      category: Types.STRING(50),

      created_at: Types.DATE,
      updated_at: Types.DATE,
    },
    {
      timestamps: false,
      sequelize,
      modelName: "Category",
      tableName: "tbl_category",
    }
  );
  return Category;
};

export default initDatabase(connection, DataTypes);
