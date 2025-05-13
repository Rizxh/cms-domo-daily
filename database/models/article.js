import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initDatabase = (sequelize, Types) => {
    class Article extends Model {
        static associate(models) {
            // Define association to Category
            Article.belongsTo(models.Category, {
                foreignKey: "uuid_category",
                targetKey: "uuid",
                as: "category",
            });

            // Define association to User
            Article.belongsTo(models.User, {
                foreignKey: "uploaded_by",
                targetKey: "uuid",
                as: "user",
            });
        }
    }
    Article.init(
        {
            uuid: Types.STRING,
            assets: Types.STRING,
            title: Types.STRING,
            uuid_category: Types.STRING(100),
            description: Types.STRING(100),
            link: Types.STRING(100),
            status: Types.ENUM("Published", "Draft"),

            created_at: Types.DATE,
            updated_at: Types.DATE,
        },
        {
            timestamps: false,
            sequelize,
            modelName: "article",
            tableName: "tbl_article",
        }
    );
    return Article;
};

export default initDatabase(connection, DataTypes);
