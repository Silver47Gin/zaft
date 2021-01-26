const path = require("path");

const EXEC_PATH = process.cwd();

const SRC_PATH = path.join(__dirname, "..");

const COMMAND_DIR = path.join(SRC_PATH, "commands");

module.exports = {
  EXEC_PATH,
  PROJECT_PATH: SRC_PATH,
  COMMAND_DIR,
};
