const { logger } = require('./src/logger');
const { randomUUID } = require('node:crypto');

async function main() {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const d = (min = 40, max = 160) => delay(Math.floor(Math.random() * (max - min + 1)) + min);

  const generateRequestId = () => randomUUID();

  logger.info({ 
    requestId: generateRequestId(), 
    service: 'orders-api', 
    env: 'local', 
    version: '0.1.0',
    config: {
      database: {
        host: 'localhost',
        port: 5432,
        name: 'ecommerce'
      },
      cache: {
        type: 'redis',
        cluster: ['redis-01', 'redis-02']
      }
    }
  }, 'service boot');
  await d(150, 300);

  const healthRequestId = generateRequestId();
  logger.info({ 
    requestId: healthRequestId, 
    method: 'GET', 
    path: '/api/health', 
    ip: '127.0.0.1', 
    ua: 'k6/0.49.0',
    headers: {
      'x-forwarded-for': '127.0.0.1',
      'accept': 'application/json'
    }
  }, 'incoming request');
  await d(30, 80);
  logger.info({ 
    requestId: healthRequestId, 
    method: 'GET', 
    path: '/api/health', 
    statusCode: 200, 
    durationMs: 5,
    payload: {
      status: 'healthy',
      uptime: 3600,
      checks: {
        database: 'connected',
        cache: 'available'
      }
    }
  }, 'request completed');
  await d();

  logger.debug({ 
    requestId: generateRequestId(), 
    sql: 'SELECT 1', 
    db: 'postgres', 
    rows: 1, 
    dbDurationMs: 2 
  }, 'sql execution');
  await d();

  const createUserRequestId = generateRequestId();
  logger.info({ 
    requestId: createUserRequestId, 
    method: 'POST', 
    path: '/api/users', 
    ip: '192.168.1.10', 
    ua: 'insomnia/2024.2', 
    bodyBytes: 342, 
    contentType: 'application/json',
    payload: {
      email: 'harriet.hodge@example.com',
      name: 'Harriet Hodge',
      preferences: {
        notifications: true,
        marketing: false
      }
    }
  }, 'incoming request');
  await d(60, 120);
  logger.debug({ 
    requestId: createUserRequestId, 
    sql: 'insert into users (email, name) values ($1, $2) returning id', 
    params: ['harriet.hodge@example.com', 'Harriet Hodge'], 
    db: 'postgres', 
    rows: 1, 
    dbDurationMs: 18 
  }, 'sql execution');
  await d(30, 70);
  logger.info({ 
    requestId: createUserRequestId, 
    method: 'POST', 
    path: '/api/users', 
    statusCode: 201, 
    location: '/api/users/2847', 
    durationMs: 43,
    payload: {
      id: 2847,
      email: 'harriet.hodge@example.com',
      name: 'Harriet Hodge',
      createdAt: '2025-09-30T10:15:30Z'
    }
  }, 'request completed');
  await d(120, 280);

  logger.error({ 
    requestId: generateRequestId(), 
    clientId: 'demo-client-01', 
    window: '1m', 
    used: 92, 
    limit: 100,
    rateLimitDetails: {
      remainingRequests: 8,
      resetTime: '2025-09-30T10:16:00Z',
      bucketKey: 'api:rate_limit:demo-client-01'
    }
  }, 'rate limit nearing');
  await d(60, 140);

  const getUserRequestId = generateRequestId();
  logger.info({ 
    requestId: getUserRequestId, 
    method: 'GET', 
    path: '/api/users/2847', 
    ip: '192.168.1.10', 
    ua: 'insomnia/2024.2' 
  }, 'incoming request');
  await d(40, 90);
  logger.debug({ 
    requestId: getUserRequestId, 
    sql: 'select id, email, name from users where id = $1', 
    params: [2847], 
    db: 'postgres', 
    rows: 1, 
    dbDurationMs: 9 
  }, 'sql execution');
  await d(20, 60);
  logger.info({ 
    requestId: getUserRequestId, 
    method: 'GET', 
    path: '/api/users/2847', 
    statusCode: 200, 
    durationMs: 21, 
    cache: 'MISS',
    payload: {
      id: 2847,
      email: 'harriet.hodge@example.com',
      name: 'Harriet Hodge',
      profile: {
        avatar: null,
        bio: null
      }
    }
  }, 'request completed');
  await d();

  const updateUserRequestId = generateRequestId();
  logger.info({ 
    requestId: updateUserRequestId, 
    method: 'PATCH', 
    path: '/api/users/2847', 
    ip: '192.168.1.10', 
    ua: 'insomnia/2024.2',
    payload: {
      name: 'Harriet H.'
    }
  }, 'incoming request');
  await d(50, 100);
  logger.debug({ 
    requestId: updateUserRequestId, 
    sql: 'update users set name=$1 where id = $2', 
    params: ['Harriet H.', 2847], 
    db: 'postgres', 
    rows: 1, 
    dbDurationMs: 14 
  }, 'sql execution');
  await d(30, 80);
  logger.info({ 
    requestId: updateUserRequestId, 
    method: 'PATCH', 
    path: '/api/users/2847', 
    statusCode: 204, 
    durationMs: 39 
  }, 'request completed');
  await d(120, 220);

  const errorRequestId = generateRequestId();
  logger.error({ 
    requestId: errorRequestId, 
    method: 'GET', 
    path: '/api/users/9999', 
    statusCode: 500, 
    errorName: 'TypeError', 
    errorMessage: 'Cannot read properties of null (reading "id")',
    stackTrace: 'TypeError: Cannot read properties of null\n    at getUserById (/app/controllers/users.js:42:12)',
    context: {
      userId: 9999,
      operation: 'getUserById'
    }
  }, 'unhandled application error');
  await d(80, 160);
  logger.debug({ 
    requestId: errorRequestId, 
    sql: 'select id from users where id = $1', 
    params: [9999], 
    db: 'postgres', 
    rows: 0, 
    dbDurationMs: 6 
  }, 'sql execution');
  await d(30, 70);
  logger.info({ 
    requestId: errorRequestId, 
    method: 'GET', 
    path: '/api/users/9999', 
    statusCode: 404, 
    durationMs: 14,
    payload: {
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    }
  }, 'request completed');
  await d();

  const orderRequestId = generateRequestId();
  logger.info({ 
    requestId: orderRequestId, 
    method: 'GET', 
    path: '/api/orders/5012', 
    ip: '10.0.0.6', 
    ua: 'curl/8.6.0' 
  }, 'incoming request');
  await d(40, 80);
  logger.debug({ 
    requestId: orderRequestId, 
    key: 'order:5012', 
    backend: 'redis', 
    hit: true, 
    durationMs: 1,
    ttl: 3600
  }, 'cache get');
  await d(20, 40);
  logger.info({ 
    requestId: orderRequestId, 
    method: 'GET', 
    path: '/api/orders/5012', 
    statusCode: 200, 
    durationMs: 7, 
    cache: 'HIT',
    payload: {
      id: 5012,
      userId: 'u_901',
      status: 'processing',
      items: [
        { sku: 'PROD-123', qty: 2, price: 1999 }
      ],
      total: 3998
    }
  }, 'request completed');
  await d();

  logger.error({ 
    requestId: generateRequestId(), 
    sql: 'select * from line_items where order_id = $1', 
    params: [5012], 
    dbDurationMs: 213, 
    thresholdMs: 200,
    queryPlan: {
      type: 'Seq Scan',
      cost: 125.45,
      estimatedRows: 1000
    }
  }, 'slow query detected');
  await d(140, 260);

  const deleteOrderRequestId = generateRequestId();
  logger.info({ 
    requestId: deleteOrderRequestId, 
    method: 'DELETE', 
    path: '/api/orders/99999', 
    ip: '10.0.0.7', 
    ua: 'PostmanRuntime/7.42.0' 
  }, 'incoming request');
  await d(40, 80);
  logger.info({ 
    requestId: deleteOrderRequestId, 
    method: 'DELETE', 
    path: '/api/orders/99999', 
    statusCode: 404, 
    durationMs: 16,
    payload: {
      error: 'Order not found',
      code: 'ORDER_NOT_FOUND'
    }
  }, 'request completed');
  await d();

  const paymentRequestId = generateRequestId();
  logger.error({ 
    requestId: paymentRequestId, 
    method: 'POST', 
    path: '/api/payments', 
    statusCode: 502, 
    provider: 'stripe', 
    durationMs: 3050,
    paymentDetails: {
      amount: 4599,
      currency: 'USD',
      paymentMethod: 'card',
      intentId: 'pi_' + randomUUID()
    }
  }, 'payment gateway timeout');
  await d(120, 220);
  logger.debug({ 
    requestId: paymentRequestId, 
    sql: 'insert into payment_attempts(order_id, provider, status) values ($1, $2, $3)', 
    params: [5012, 'stripe', 'timeout'], 
    rows: 1, 
    dbDurationMs: 19 
  }, 'sql execution');
  await d(40, 80);
  logger.info({ 
    requestId: paymentRequestId, 
    method: 'POST', 
    path: '/api/payments', 
    statusCode: 504, 
    durationMs: 3112, 
    reason: 'gateway timeout',
    payload: {
      error: 'Payment gateway timeout',
      code: 'GATEWAY_TIMEOUT',
      retryAfter: 30
    }
  }, 'request completed');
  await d(140, 260);

  const statusUpdateRequestId = generateRequestId();
  logger.info({ 
    requestId: statusUpdateRequestId, 
    method: 'PUT', 
    path: '/api/orders/5012/status', 
    ip: '10.0.0.8', 
    ua: 'Mozilla/5.0',
    payload: {
      status: 'failed',
      reason: 'payment_failed'
    }
  }, 'incoming request');
  await d(50, 100);
  logger.debug({ 
    requestId: statusUpdateRequestId, 
    sql: 'update orders set status = $1 where id = $2', 
    params: ['failed', 5012], 
    rows: 1, 
    dbDurationMs: 12 
  }, 'sql execution');
  await d(30, 80);
  logger.info({ 
    requestId: statusUpdateRequestId, 
    method: 'PUT', 
    path: '/api/orders/5012/status', 
    statusCode: 200, 
    durationMs: 44,
    payload: {
      id: 5012,
      status: 'failed',
      updatedAt: '2025-09-30T10:20:15Z'
    }
  }, 'request completed');
  await d();

  logger.error({ 
    requestId: generateRequestId(), 
    node: 'api-01', 
    filesystem: '/dev/disk3s1s1', 
    percentUsed: 91,
    diskInfo: {
      totalGB: 500,
      usedGB: 455,
      availableGB: 45
    }
  }, 'disk space low');
  await d(60, 140);

  logger.debug({ 
    requestId: generateRequestId(), 
    sql: 'select count(*) as n from orders where status=$1', 
    params: ['failed'], 
    rows: 1, 
    dbDurationMs: 34 
  }, 'sql execution');
  await d(30, 70);
  logger.info({ 
    requestId: generateRequestId(), 
    httpReqPerMin: 612, 
    dbQps: 102.4, 
    cacheHitRate: 0.87, 
    cpuPct: 0.41, 
    memRssMb: 324,
    metrics: {
      responseTimeP95: 120,
      responseTimeP99: 250,
      activeConnections: 45,
      queueLength: 3
    }
  }, 'metrics snapshot');
  await d(120, 220);

  await delay(3000);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
