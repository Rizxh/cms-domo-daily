module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_user_history", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.STRING,
      },

      timestamps: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
      },
      activity: {
        type: Sequelize.STRING,
      },
      environment: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("tbl_user_history");
  },
};
