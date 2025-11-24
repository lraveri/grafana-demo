const pino = require("pino");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logger = pino(
  {
    level: process.env.LOG_LEVEL || "debug",
    base: null,
    nestedKey: "payload",
    formatters: {
      level(label, number) {
        return { level: label };
      },
    },
    hooks: {
      logMethod(inputArgs, method, level) {
        if (inputArgs.length === 1) {
          const arg = inputArgs[0];
          if (typeof arg === "string") return method.call(this, {}, arg);
          if (typeof arg === "object" && arg !== null)
            return method.call(this, arg, "");
        }
        if (inputArgs.length >= 2) {
          const arg1 = inputArgs.shift();
          const arg2 = inputArgs.shift();
          return method.call(this, arg2, arg1, ...inputArgs);
        }
        return method.apply(this, inputArgs);
      },
    },
  },
  pino.destination({
    dest: path.join(logsDir, "app.log"),
    sync: false,
    mkdir: true
  })
);

module.exports = { logger };