module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_media", {
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
      asset: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      link: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["Active", "Inactive", "Deleted"],
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
    await queryInterface.dropTable("tbl_media");
  },
};
