const { logger } = require('./logger');
const { randomUUID } = require('node:crypto');

function generateShortUUID() {
  return randomUUID().replace(/-/g, '').substring(0, 8);
}

function randomDelay(min = 10, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function simulateDatabaseQuery(operation, requestId) {
  const startTime = Date.now();
  const queryTime = randomDelay(5, 150);
  logger.debug(`Executing database query`, {
    requestId,
    operation,
    table: operation === 'SELECT' ? 'users' : 'logs',
    query: `${operation} * FROM ${operation === 'SELECT' ? 'users' : 'logs'} WHERE active = true`
  });
  
  await new Promise(resolve => setTimeout(resolve, randomDelay(1, 10)));
  
  await new Promise(resolve => setTimeout(resolve, queryTime));
  
  const endTime = Date.now();
  
  await new Promise(resolve => setTimeout(resolve, randomDelay(1, 5)));
  
  logger.info(`Database query completed`, {
    requestId,
    operation,
    queryTime: endTime - startTime,
    rowsAffected: operation === 'SELECT' ? Math.floor(Math.random() * 100) : 1
  });
  
  return endTime - startTime;
}

async function simulateHttpRequest(method, endpoint, requestId) {
  const startTime = Date.now();
  
  await new Promise(resolve => setTimeout(resolve, randomDelay(1, 15)));
  
  logger.info(`Incoming ${method} request`, {
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
  
  logger.info(`Response sent`, {
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
    
    logger.error(`Request failed`, {
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
