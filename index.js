const { logger } = require('./src/logger');

async function main() {
  logger.info({ msg: 'Applicazione avviata' });
  logger.warn({ msg: 'Questo è un avviso di esempio' });
  logger.error({ msg: 'Questo è un errore di esempio' });

  // attende che il batch venga inviato
  await new Promise((r) => setTimeout(r, 1500));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


