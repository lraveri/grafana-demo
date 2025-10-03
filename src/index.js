const { logger } = require('./logger');
const { randomUUID } = require('node:crypto');

function generateShortUUID() {
  return randomUUID().replace(/-/g, '').substring(0, 12);
}

function randomDelay(min = 10, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Genera log di disturbo casuali
function generateNoiseLogs() {
  const noiseLogs = [
    () => logger.info('Cache hit', { cacheKey: 'user_session_123', hitRate: 0.85 }),
    () => logger.debug('Memory usage check', { used: '45MB', total: '512MB', percentage: 8.8 }),
    () => logger.info('Health check passed', { service: 'database', responseTime: randomDelay(1, 10) }),
    () => logger.debug('Connection pool status', { active: 5, idle: 10, waiting: 0 }),
    () => logger.info('Scheduled task executed', { task: 'cleanup_temp_files', duration: randomDelay(100, 500) }),
    () => logger.debug('Rate limit check', { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, allowed: true }),
    () => logger.info('Session created', { sessionId: generateShortUUID(), userId: Math.floor(Math.random() * 1000) }),
    () => logger.debug('File uploaded', { filename: `document_${Math.floor(Math.random() * 100)}.pdf`, size: randomDelay(1024, 1048576) }),
    () => logger.info('Background job started', { jobType: 'email_sender', queueSize: Math.floor(Math.random() * 50) }),
    () => logger.debug('Configuration reloaded', { configFile: 'app.config', version: '1.2.3' }),
    () => logger.info('User logged in', { userId: Math.floor(Math.random() * 1000), ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` }),
    () => logger.debug('Metrics collected', { cpu: Math.random() * 100, memory: Math.random() * 100, disk: Math.random() * 100 })
  ];
  
  // Genera 1-3 log di disturbo casuali
  const numLogs = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numLogs; i++) {
    const randomLog = noiseLogs[Math.floor(Math.random() * noiseLogs.length)];
    setTimeout(() => randomLog(), randomDelay(10, 1000));
  }
}

async function simulateDatabaseQuery(operation, requestId) {
  const startTime = Date.now();
  const queryTime = randomDelay(5, 150);
  
  // Simula il tempo di esecuzione
  await new Promise(resolve => setTimeout(resolve, queryTime));
  
  const endTime = Date.now();
  const executionTime = endTime - startTime;
  
  // Simula occasionali errori DB (5% di probabilità)
  const hasError = Math.random() < 0.05;
  
  if (hasError) {
    const errors = [
      'Connection timeout',
      'Deadlock detected',
      'Table locked',
      'Constraint violation',
      'Query execution timeout'
    ];
    const randomError = errors[Math.floor(Math.random() * errors.length)];
    
    logger.error('Database query failed', {
      requestId,
      operation,
      table: operation === 'SELECT' ? 'users' : 'logs',
      query: `${operation} * FROM ${operation === 'SELECT' ? 'users' : 'logs'} WHERE active = true`,
      error: randomError,
      queryTime: executionTime
    });
  } else {
    logger.debug('Database query executed', {
      requestId,
      operation,
      table: operation === 'SELECT' ? 'users' : 'logs',
      query: `${operation} * FROM ${operation === 'SELECT' ? 'users' : 'logs'} WHERE active = true`,
      queryTime: executionTime,
      rowsAffected: operation === 'SELECT' ? Math.floor(Math.random() * 100) : 1
    });
  }
  
  return executionTime;
}

async function simulateHttpRequest(method, endpoint, requestId) {
  const startTime = Date.now();
  
  await new Promise(resolve => setTimeout(resolve, randomDelay(1, 15)));
  
  logger.info('HTTP request received', {
    requestId,
    method,
    endpoint,
    userAgent: 'Mozilla/5.0 (compatible; API-Client/1.0)',
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
    timestamp: new Date().toISOString()
  });
  
  await new Promise(resolve => setTimeout(resolve, randomDelay(5, 20)));
  
  const dbOperations = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < dbOperations; i++) {
    const operations = ['SELECT', 'INSERT', 'UPDATE'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    await simulateDatabaseQuery(operation, requestId);
    
    if (i < dbOperations - 1) {
      await new Promise(resolve => setTimeout(resolve, randomDelay(2, 8)));
    }
  }
  
  const processingTime = randomDelay(50, 300);
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  
  const statusCodes = [200, 201, 400, 401, 404, 500];
  const weights = [60, 15, 10, 5, 7, 3];
  const random = Math.random() * 100;
  let cumulativeWeight = 0;
  let statusCode = 200;
  
  for (let i = 0; i < statusCodes.length; i++) {
    cumulativeWeight += weights[i];
    if (random <= cumulativeWeight) {
      statusCode = statusCodes[i];
      break;
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, randomDelay(1, 5)));
  
  logger.info('HTTP response sent', {
    requestId,
    method,
    endpoint,
    statusCode,
    requestTime: totalTime,
    responseSize: Math.floor(Math.random() * 2048) + 100,
    timestamp: new Date().toISOString()
  });
  
  if (statusCode >= 400) {
    await new Promise(resolve => setTimeout(resolve, randomDelay(2, 10)));
    
    logger.error('HTTP request failed', {
      requestId,
      method,
      endpoint,
      statusCode,
      error: statusCode === 404 ? 'Not Found' : 
             statusCode === 401 ? 'Unauthorized' :
             statusCode === 400 ? 'Bad Request' : 'Internal Server Error',
      requestTime: totalTime
    });
  }
  
  return totalTime;
}

const endpoints = [
  { method: 'GET', path: '/api/users' },
  { method: 'GET', path: '/api/users/123' },
  { method: 'POST', path: '/api/users' },
  { method: 'PUT', path: '/api/users/123' },
  { method: 'DELETE', path: '/api/users/123' },
  { method: 'GET', path: '/api/orders' },
  { method: 'GET', path: '/api/orders/456' },
  { method: 'POST', path: '/api/orders' },
  { method: 'GET', path: '/api/products' },
  { method: 'GET', path: '/api/products/789' },
  { method: 'GET', path: '/api/health' },
  { method: 'GET', path: '/api/metrics' }
];

async function generateTraffic() {
  logger.info('Starting API traffic simulation', {
    message: 'Traffic generator initialized',
    endpoints: endpoints.length,
    timestamp: new Date().toISOString()
  });
  
  await new Promise(resolve => setTimeout(resolve, randomDelay(500, 1500)));
  
  setInterval(async () => {
    const requestId = generateShortUUID();
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    
    await simulateHttpRequest(endpoint.method, endpoint.path, requestId);
    
    // Genera log di disturbo occasionalmente (30% di probabilità)
    if (Math.random() < 0.3) {
      generateNoiseLogs();
    }
    
    await new Promise(resolve => setTimeout(resolve, randomDelay(50, 200)));
  }, randomDelay(100, 2000));
}

async function main() {
  logger.info('Application started', {
    message: 'Grafana demo application starting',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
  
  await generateTraffic();
  
  process.on('SIGINT', () => {
    logger.info('Application shutting down', {
      message: 'Received SIGINT, shutting down gracefully',
      timestamp: new Date().toISOString()
    });
    process.exit(0);
  });
}

main().catch((err) => {
  logger.error('Application error', {
    message: 'Unhandled error in main function',
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});
