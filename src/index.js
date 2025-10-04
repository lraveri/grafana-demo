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
  
  // Definisce diverse tabelle con probabilità diverse
  const tableDefinitions = [
    { name: 'users', weight: 40, fastQuery: true },
    { name: 'orders', weight: 30, fastQuery: true },
    { name: 'products', weight: 13, fastQuery: true },
    { name: 'payments', weight: 10, fastQuery: true },
    { name: 'user_analytics', weight: 1, fastQuery: false }, // Query lenta, poco probabile
    { name: 'audit_logs', weight: 1, fastQuery: false }      // Query lenta, poco probabile
  ];
  
  // Seleziona tabella basata sui pesi
  const random = Math.random() * 100;
  let cumulativeWeight = 0;
  let selectedTable = tableDefinitions[0];
  
  for (const table of tableDefinitions) {
    cumulativeWeight += table.weight;
    if (random <= cumulativeWeight) {
      selectedTable = table;
      break;
    }
  }
  
  // Tempo di query basato sul tipo di tabella
  const baseTime = selectedTable.fastQuery ? randomDelay(5, 50) : randomDelay(200, 2000);
  const queryTime = baseTime;
  
  // Simula il tempo di esecuzione
  await new Promise(resolve => setTimeout(resolve, queryTime));
  
  const endTime = Date.now();
  const executionTime = endTime - startTime;
  
  // Simula occasionali errori DB (5% di probabilità)
  const hasError = Math.random() < 0.05;
  
  // Genera query specifiche per tabella
  let query, rowsAffected;
  
  switch (selectedTable.name) {
    case 'users':
      query = `${operation} * FROM users WHERE status = 'active' AND created_at > NOW() - INTERVAL 30 DAY`;
      rowsAffected = operation === 'SELECT' ? Math.floor(Math.random() * 500) + 10 : 1;
      break;
    case 'orders':
      query = `${operation} * FROM orders WHERE order_status IN ('pending', 'completed') ORDER BY created_at DESC`;
      rowsAffected = operation === 'SELECT' ? Math.floor(Math.random() * 1000) + 50 : 1;
      break;
    case 'products':
      query = `${operation} * FROM products WHERE category_id = ${Math.floor(Math.random() * 10) + 1} AND in_stock = true`;
      rowsAffected = operation === 'SELECT' ? Math.floor(Math.random() * 200) + 20 : 1;
      break;
    case 'payments':
      query = `${operation} * FROM payments WHERE payment_status = 'completed' AND amount > 10.00`;
      rowsAffected = operation === 'SELECT' ? Math.floor(Math.random() * 300) + 30 : 1;
      break;
    case 'user_analytics':
      query = `${operation} COUNT(*) FROM user_analytics WHERE event_date >= CURDATE() - INTERVAL 7 DAY GROUP BY user_segment`;
      rowsAffected = operation === 'SELECT' ? Math.floor(Math.random() * 10) + 5 : 1;
      break;
    case 'audit_logs':
      query = `${operation} * FROM audit_logs WHERE action_type = 'user_login' AND created_at >= NOW() - INTERVAL 1 HOUR`;
      rowsAffected = operation === 'SELECT' ? Math.floor(Math.random() * 50) + 10 : 1;
      break;
  }
  
  if (hasError) {
    const errors = [
      'Connection timeout',
      'Deadlock detected',
      'Table locked',
      'Constraint violation',
      'Query execution timeout',
      'Index not found',
      'Disk space insufficient'
    ];
    const randomError = errors[Math.floor(Math.random() * errors.length)];
    
    logger.error('Database query failed', {
      requestId,
      operation,
      table: selectedTable.name,
      query,
      error: randomError,
      queryTime: executionTime
    });
  } else {
    logger.debug('Database query executed', {
      requestId,
      operation,
      table: selectedTable.name,
      query,
      queryTime: executionTime,
      rowsAffected
    });
  }
  
  return executionTime;
}

async function simulateHttpRequest(method, endpoint, requestId, isTrafficSpike = false) {
  const startTime = Date.now();
  
  await new Promise(resolve => setTimeout(resolve, randomDelay(1, 15)));
  
  logger.info('HTTP request received', {
    requestId,
    method,
    endpoint,
    userAgent: 'Mozilla/5.0 (compatible; API-Client/1.0)',
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
  });
  
  await new Promise(resolve => setTimeout(resolve, randomDelay(5, 20)));
  
  const dbOperations = Math.floor(Math.random() * 4) + 1; // 1-4 operazioni
  for (let i = 0; i < dbOperations; i++) {
    // Operazioni con probabilità diverse (SELECT più comune, DELETE più raro)
    const operations = [
      { op: 'SELECT', weight: 60 },
      { op: 'INSERT', weight: 20 },
      { op: 'UPDATE', weight: 15 },
      { op: 'DELETE', weight: 5 }  // DELETE più raro e potenzialmente più lento
    ];
    
    // Seleziona operazione basata sui pesi
    const random = Math.random() * 100;
    let cumulativeWeight = 0;
    let selectedOperation = operations[0];
    
    for (const op of operations) {
      cumulativeWeight += op.weight;
      if (random <= cumulativeWeight) {
        selectedOperation = op;
        break;
      }
    }
    
    await simulateDatabaseQuery(selectedOperation.op, requestId);
    
    if (i < dbOperations - 1) {
      await new Promise(resolve => setTimeout(resolve, randomDelay(2, 8)));
    }
  }
  
  const processingTime = randomDelay(50, 300);
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  
  // Simula spike di errori 500
  let statusCode = 200;
  let isErrorSpike = false;
  
  // Durante spike di traffico, aumenta la probabilità di errori 500
  const errorSpikeProbability = isTrafficSpike ? 0.05 : 0.01; // 5% durante traffico, 1% normale
  const isSpike = Math.random() < errorSpikeProbability;
  
  if (isSpike) {
    // Durante uno spike, 80% di probabilità di errore 500
    statusCode = Math.random() < 0.8 ? 500 : 200;
    isErrorSpike = true;
    
    logger.error('Server spike detected', {
      requestId,
      method,
      endpoint,
      spikeType: 'high_error_rate',
      errorProbability: 0.8,
      trafficSpike: isTrafficSpike
    });
  } else {
    // Distribuzione normale degli status code
    const statusCodes = [200, 201, 400, 401, 404, 500];
    // Durante traffic spike, aumenta leggermente la probabilità di errori
    const weights = isTrafficSpike ? [60, 12, 10, 5, 8, 5] : [65, 15, 8, 4, 6, 2];
    const random = Math.random() * 100;
    let cumulativeWeight = 0;
    
    for (let i = 0; i < statusCodes.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        statusCode = statusCodes[i];
        break;
      }
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, randomDelay(1, 5)));
  
  logger.info('HTTP response sent', {
    requestId,
    method,
    endpoint,
    statusCode,
    requestTime: totalTime,
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
  });
  
  await new Promise(resolve => setTimeout(resolve, randomDelay(500, 1500)));
  
  let isTrafficSpike = false;
  let spikeEndTime = 0;
  
  setInterval(async () => {
    // Simula spike di traffico (0.5% di probabilità)
    const now = Date.now();
    if (!isTrafficSpike && Math.random() < 0.005) {
      isTrafficSpike = true;
      spikeEndTime = now + randomDelay(30000, 120000); // Spike dura 30-120 secondi
      
      logger.error('Traffic spike detected', {
        message: 'High traffic volume detected',
        spikeDuration: spikeEndTime - now,
        expectedImpact: 'increased_response_times'
      });
    }
    
    // Fine dello spike
    if (isTrafficSpike && now > spikeEndTime) {
      isTrafficSpike = false;
      logger.info('Traffic spike ended', {
        message: 'Traffic volume returned to normal'
      });
    }
    
    const requestId = generateShortUUID();
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    
    await simulateHttpRequest(endpoint.method, endpoint.path, requestId, isTrafficSpike);
    
    // Genera log di disturbo occasionalmente (30% di probabilità)
    if (Math.random() < 0.3) {
      generateNoiseLogs();
    }
    
    // Durante uno spike, intervallo più breve tra le richieste
    const baseDelay = isTrafficSpike ? randomDelay(20, 100) : randomDelay(50, 200);
    await new Promise(resolve => setTimeout(resolve, baseDelay));
  }, randomDelay(100, 2000));
}

async function main() {
  logger.info('Application started', {
    message: 'Grafana demo application starting',
    version: '1.0.0',
  });
  
  await generateTraffic();
  
  process.on('SIGINT', () => {
    logger.error('Application crashed', {
      message: 'Received SIGINT, shutting down gracefully',
    });
    process.exit(0);
  });
}

main().catch((err) => {
  logger.error('Application error', {
    message: 'Unhandled error in main function',
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});
