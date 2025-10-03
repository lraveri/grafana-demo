const pino = require("pino");

require("dotenv").config();

const logger = pino(
  {
    level: process.env.LOG_LEVEL || "debug",
    base: null,
    nestedKey: "payload",
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
  pino.transport({
    target: "pino-loki",
    options: {
      batching: false,
      host: process.env.LOKI_HOST || "http://localhost:3100",
      basicAuth: {
        username: process.env.LOKI_USERNAME || "admin",
        password: process.env.LOKI_PASSWORD || "admin",
      },
      labels: {
        source: process.env.LOG_SOURCE || "grafana-demo",
        environment: process.env.LOG_ENV || "local",
      },
    },
  })
);

module.exports = { logger };