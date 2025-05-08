import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initDatabase = (sequelize, Types) => {
  class UserHistory extends Model {}
  UserHistory.init(
    {
      uuid: Types.STRING,

      timestamps: Types.STRING,
      username: Types.STRING,
      activity: Types.STRING,
      environment: Types.STRING,
      description: Types.STRING,

      created_at: Types.TEXT,
      updated_at: Types.TEXT,
    },
    {
      timestamps: false,
      sequelize,
      modelName: "UserHistory",
      tableName: "tbl_user_history",
    }
  );
  return UserHistory;
};

export default initDatabase(connection, DataTypes);
