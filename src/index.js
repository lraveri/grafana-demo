const { logger } = require('./logger');
const { randomUUID } = require('node:crypto');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a short UUID (12 chars) for request tracking
 */
function generateRequestUUID() {
  return randomUUID().replace(/-/g, '').substring(0, 12);
}

/**
 * Generate a short UUID for internal identifiers
 */
function generateShortUUID() {
  return randomUUID().replace(/-/g, '').substring(0, 12);
}

/**
 * Generate a random delay between min and max milliseconds
 */
function randomDelay(min = 10, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Simulate an async delay
 */
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// NOISE LOGS GENERATOR
// ============================================================================

/**
 * Generate realistic noise logs with UUID
 */
function generateNoiseLogs() {
  const requestId = generateRequestUUID();
  const sessionId = generateShortUUID();
  const userId = Math.floor(Math.random() * 1000) + 1;
  
  const noiseLogs = [
    () => logger.info('Cache hit', { 
      requestId, 
      cacheKey: `user_session_${sessionId}`, 
      hitRate: 0.85 
    }),
    () => logger.debug('Memory usage check', { 
      requestId, 
      used: '45MB', 
      total: '512MB', 
      percentage: 8.8 
    }),
    () => logger.info('Health check passed', { 
      requestId, 
      service: 'database', 
      responseTime: randomDelay(1, 10) 
    }),
    () => logger.debug('Connection pool status', { 
      requestId, 
      active: 5, 
      idle: 10, 
      waiting: 0 
    }),
    () => logger.info('Scheduled task executed', { 
      requestId, 
      task: 'cleanup_temp_files', 
      duration: randomDelay(100, 500) 
    }),
    () => logger.debug('Rate limit check', { 
      requestId, 
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`, 
      allowed: true 
    }),
    () => logger.info('Session created', { 
      requestId, 
      sessionId: generateShortUUID(), 
      userId 
    }),
    () => logger.debug('File uploaded', { 
      requestId, 
      filename: `document_${Math.floor(Math.random() * 100)}.pdf`, 
      size: randomDelay(1024, 1048576) 
    }),
    () => logger.info('Background job started', { 
      requestId, 
      jobType: 'email_sender', 
      queueSize: Math.floor(Math.random() * 50) 
    }),
    () => logger.debug('Configuration reloaded', { 
      requestId, 
      configFile: 'app.config', 
      version: '1.2.3' 
    }),
    () => logger.info('User logged in', { 
      requestId, 
      userId, 
      ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` 
    }),
    () => logger.debug('Metrics collected', { 
      requestId, 
      cpu: Math.random() * 100, 
      memory: Math.random() * 100, 
      disk: Math.random() * 100 
    })
  ];
  
  // Generate 1-3 random noise logs
  const numLogs = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numLogs; i++) {
    const randomLog = noiseLogs[Math.floor(Math.random() * noiseLogs.length)];
    setTimeout(() => randomLog(), randomDelay(10, 1000));
  }
}

// ============================================================================
// DATABASE SIMULATION
// ============================================================================

/**
 * Simulate a database query with UUID and appropriate logging
 */
async function simulateDatabaseQuery(operation, requestId) {
  const startTime = Date.now();
  
  // Define different tables with different probabilities
  const tableDefinitions = [
    { name: 'users', weight: 40, fastQuery: true },
    { name: 'orders', weight: 30, fastQuery: true },
    { name: 'products', weight: 13, fastQuery: true },
    { name: 'payments', weight: 10, fastQuery: true },
    { name: 'user_analytics', weight: 1, fastQuery: false }, // Slow query, unlikely
    { name: 'audit_logs', weight: 1, fastQuery: false }      // Slow query, unlikely
  ];
  
  // Select table based on weights
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
  
  // Query time based on table type
  const baseTime = selectedTable.fastQuery ? randomDelay(5, 50) : randomDelay(200, 2000);
  const queryTime = baseTime;
  
  // Simulate execution time
  await sleep(queryTime);
  
  const endTime = Date.now();
  const executionTime = endTime - startTime;
  
  // Simulate occasional DB errors (5% probability)
  const hasError = Math.random() < 0.05;
  
  // Generate specific queries for table
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
    
    // ERROR level for query errors
    logger.error('Database query failed', {
      requestId,
      operation,
      table: selectedTable.name,
      query,
      error: randomError,
      queryTime: executionTime
    });
  } else {
    // DEBUG level for normal queries
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

// ============================================================================
// HTTP REQUEST SIMULATION
// ============================================================================

/**
 * Handle errors in exception handler (only for 500 errors)
 */
function handleExceptionError(requestId, method, endpoint) {
  const exceptions = [
    'TypeError: Cannot read property of undefined',
    'ReferenceError: variable is not defined',
    'SyntaxError: Unexpected token',
    'RangeError: Maximum call stack exceeded',
    'EvalError: eval() function is not allowed',
    'URIError: URI malformed',
    'TypeError: Cannot read property \'length\' of null',
    'ReferenceError: Cannot access before initialization',
    'TypeError: undefined is not a function',
    'RangeError: Invalid array length',
    'SyntaxError: Unexpected end of input',
    'TypeError: Cannot convert undefined to object',
    'ReferenceError: assignment to undeclared variable',
    'TypeError: Cannot read property \'map\' of undefined',
    'Error: Maximum call stack size exceeded'
  ];
  
  const exception = exceptions[Math.floor(Math.random() * exceptions.length)];
  
  // Generate random file and line for stack trace
  const files = [
    'src/controllers/userController.js',
    'src/services/productService.js',
    'src/middleware/authMiddleware.js',
    'src/utils/databaseHelper.js',
    'src/routes/apiRoutes.js',
    'src/models/User.js',
    'src/validators/requestValidator.js',
    'src/config/database.js',
    'src/helpers/responseHelper.js',
    'src/middleware/errorHandler.js'
  ];
  
  const fileName = files[Math.floor(Math.random() * files.length)];
  const lineNumber = Math.floor(Math.random() * 200) + 1;
  const columnNumber = Math.floor(Math.random() * 50) + 1;
  
  logger.error('Exception handler caught error', {
    requestId,
    method,
    endpoint,
    exception: exception,
    errorType: 'internal_server_error',
    stackTrace: `${exception}\n    at ${endpoint} (${fileName}:${lineNumber}:${columnNumber})\n    at handleRequest (src/app.js:45:12)\n    at processRequest (src/server.js:123:8)`,
  });
}

/**
 * Simulate an HTTP request with UUID and correct error handling
 */
async function simulateHttpRequest(method, endpoint) {
  const requestId = generateRequestUUID();
  const startTime = Date.now();
  
  await sleep(randomDelay(1, 15));
  
  logger.info('HTTP request received', {
    requestId,
    method,
    endpoint,
    userAgent: 'Mozilla/5.0 (compatible; API-Client/1.0)',
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
  });
  
  await sleep(randomDelay(5, 20));
  
  const dbOperations = Math.floor(Math.random() * 4) + 1; // 1-4 operations
  for (let i = 0; i < dbOperations; i++) {
    // Operations with different probabilities (SELECT more common, DELETE rarer)
    const operations = [
      { op: 'SELECT', weight: 60 },
      { op: 'INSERT', weight: 20 },
      { op: 'UPDATE', weight: 15 },
      { op: 'DELETE', weight: 5 }  // DELETE rarer and potentially slower
    ];
    
    // Select operation based on weights
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
      await sleep(randomDelay(2, 8));
    }
  }
  
  const processingTime = randomDelay(50, 300);
  await sleep(processingTime);
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  
  // Normal status code distribution
  const statusCodes = [200, 201, 400, 401, 404, 500];
  const weights = [65, 15, 4, 4, 6, 6]; // 6% probability for 500 errors
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
  
  // FUNDAMENTAL RULE: If there's a 500 error, there MUST be an exception handler
  if (statusCode === 500) {
    handleExceptionError(requestId, method, endpoint);
  }
  
  await sleep(randomDelay(1, 5));
  
  // Response logging - correct status code handling
  if (statusCode >= 400 && statusCode < 500) {
    // All 4xx errors treated as 200 but with different status
    logger.info('HTTP response sent', {
      requestId,
      method,
      endpoint,
      statusCode,
      requestTime: totalTime,
    });
  } else if (statusCode >= 500) {
    // For 5xx errors, log as error
    await sleep(randomDelay(2, 10));
    
    logger.error('HTTP request failed', {
      requestId,
      method,
      endpoint,
      statusCode,
      error: 'Internal Server Error',
      requestTime: totalTime
    });
  } else {
    // For successes (200, 201), log "HTTP response sent"
    logger.info('HTTP response sent', {
      requestId,
      method,
      endpoint,
      statusCode,
      requestTime: totalTime,
    });
  }
  
  return totalTime;
}

// ============================================================================
// TRAFFIC GENERATION
// ============================================================================

/**
 * Define available API endpoints
 */
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

/**
 * Generate continuous API traffic
 */
async function generateTraffic() {
  const trafficId = generateRequestUUID();
  
  logger.info('Starting API traffic simulation', {
    requestId: trafficId,
    message: 'Traffic generator initialized',
    endpoints: endpoints.length,
  });
  
  await sleep(randomDelay(500, 1500));
  
  setInterval(async () => {
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    
    await simulateHttpRequest(endpoint.method, endpoint.path);
    
    // Generate noise logs occasionally (30% probability)
    if (Math.random() < 0.3) {
      generateNoiseLogs();
    }
    
    // Interval between requests
    await sleep(randomDelay(50, 200));
  }, randomDelay(100, 2000));
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================

/**
 * Main application function
 */
async function main() {
  const appId = generateRequestUUID();
  
  logger.info('Application started', {
    requestId: appId,
    message: 'Grafana demo application starting',
    version: '2.0.0',
  });
  
  await generateTraffic();
  
  process.on('SIGINT', () => {
    logger.error('Application crashed', {
      requestId: generateRequestUUID(),
      message: 'Shutting down the application',
    });
    process.exit(0);
  });
}

/**
 * Handle unhandled errors
 */
main().catch((err) => {
  logger.error('Application error', {
    requestId: generateRequestUUID(),
    message: 'Unhandled error in main function',
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});
