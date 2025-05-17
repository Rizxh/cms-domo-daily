module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_article", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      assets: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      uuid_category: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "tbl_category",
          key: "uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      link: {
        type: Sequelize.STRING,
      },
      uploaded_by: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "tbl_user",
          key: "uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["Published", "Draft"],
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("tbl_article");
  },
};
