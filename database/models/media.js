import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initDatabase = (sequelize, Types) => {
  class Media extends Model {}
  Media.init(
    {
      uuid: Types.STRING,
      asset: Types.STRING,
      title: Types.STRING,
      link: Types.STRING,
      status: Types.ENUM("Active", "Inactive"),

      created_at: Types.DATE,
      updated_at: Types.DATE,
    },
    {
      timestamps: false,
      sequelize,
      modelName: "Media",
      tableName: "tbl_media",
    }
  );
  return Media;
};

export default initDatabase(connection, DataTypes);
