require('dotenv').config();

const pino = require('pino');

const {
  LOKI_URL,
  LOKI_USERNAME,
  LOKI_PASSWORD,
  LOKI_STREAM_LABELS,
} = process.env;

const streamLabels = (() => {
  try {
    if (LOKI_STREAM_LABELS) {
      return JSON.parse(LOKI_STREAM_LABELS);
    }
  } catch (error) {
    // Se le etichette non sono un JSON valido, ignora e usa default
  }
  return { app: 'grafana-demo', env: 'local' };
})();

const transport = pino.transport({
  target: 'pino-loki',
  options: {
    host: LOKI_URL,
    batching: true,
    interval: 1000,
    labels: streamLabels,
    basicAuth: {
      username: LOKI_USERNAME,
      password: LOKI_PASSWORD,
    },
  },
});

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    base: { service: 'grafana-demo' },
  },
  transport
);

module.exports = {
  logger,
};


