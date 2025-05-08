const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const moment = require("moment");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_user", {
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
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM,
        values: ["Super Admin", "Admin", "Copywriter"],
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

    // Create predefined user
    const hashedPassword = await bcrypt.hashSync("DomoDaily_01!", 10);
    await queryInterface.bulkInsert("tbl_user", [
      {
        uuid: uuid(),
        name: "Domo Managemen Group",
        email: "domodaily@domo.com",
        password: hashedPassword,
        role: "Super Admin",
        created_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("tbl_user");
  },
};
