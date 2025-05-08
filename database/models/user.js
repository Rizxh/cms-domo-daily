import { DataTypes, Model } from "sequelize";
import connection from "../connection";

const initDatabase = (sequelize, Types) => {
  class User extends Model {}
  User.init(
    {
      uuid: Types.STRING,
      name: Types.STRING,
      email: Types.STRING,
      password: Types.STRING,
      role: Types.ENUM("Super Admin", "Admin", "Copywriter"),

      created_at: Types.DATE,
      updated_at: Types.DATE,
    },
    {
      timestamps: false,
      sequelize,
      modelName: "User",
      tableName: "tbl_user",
    }
  );
  return User;
};

export default initDatabase(connection, DataTypes);
