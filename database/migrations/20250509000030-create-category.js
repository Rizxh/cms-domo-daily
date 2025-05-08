const { v4: uuid } = require("uuid");
const moment = require("moment");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_category", {
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
      category: {
        type: Sequelize.STRING(50),
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

    // Create predefined categories
    await queryInterface.bulkInsert("tbl_category", [
      {
        uuid: uuid(),
        category: "Racing",
        created_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        uuid: uuid(),
        category: "News",
        created_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        uuid: uuid(),
        category: "Entertaiment",
        created_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        uuid: uuid(),
        category: "Club",
        created_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        uuid: uuid(),
        category: "Event",
        created_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("tbl_category");
  },
};
