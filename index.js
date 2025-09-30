const { logger } = require('./src/logger');
const { randomUUID } = require('node:crypto');

async function main() {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const d = (min = 40, max = 160) => delay(Math.floor(Math.random() * (max - min + 1)) + min);

  logger.info({ requestId: randomUUID(), service: 'orders-api', env: 'local', version: '0.1.0', messageId: randomUUID() }, 'service boot');
  await d(150, 300);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/health', ip: '127.0.0.1', ua: 'k6/0.49.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(30, 80);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/health', statusCode: 200, durationMs: 5 }, 'request completed');
  await d();

  logger.debug({ requestId: randomUUID(), sql: 'SELECT 1', db: 'postgres', rows: 1, dbDurationMs: 2 }, 'sql execution');
  await d();

  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/users', ip: '192.168.1.10', ua: 'insomnia/2024.2', traceId: randomUUID(), spanId: randomUUID(), bodyBytes: 342, contentType: 'application/json' }, 'incoming request');
  await d(60, 120);
  logger.debug({ requestId: randomUUID(), sql: 'insert into users (email, name) values ($1, $2) returning id', params: ['harriet.hodge@example.com', 'Harriet Hodge'], db: 'postgres', rows: 1, dbDurationMs: 18 }, 'sql execution');
  await d(30, 70);
  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/users', statusCode: 201, location: '/api/users/2847', durationMs: 43 }, 'request completed');
  await d(120, 280);

  logger.error({ requestId: randomUUID(), clientId: 'demo-client-01', window: '1m', used: 92, limit: 100 }, 'rate limit nearing');
  await d(60, 140);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/users/2847', ip: '192.168.1.10', ua: 'insomnia/2024.2', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(40, 90);
  logger.debug({ requestId: randomUUID(), sql: 'select id, email, name from users where id = $1', params: [2847], db: 'postgres', rows: 1, dbDurationMs: 9 }, 'sql execution');
  await d(20, 60);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/users/2847', statusCode: 200, durationMs: 21, cache: 'MISS' }, 'request completed');
  await d();

  logger.info({ requestId: randomUUID(), method: 'PATCH', path: '/api/users/2847', ip: '192.168.1.10', ua: 'insomnia/2024.2', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(50, 100);
  logger.debug({ requestId: randomUUID(), sql: 'update users set name=$1 where id = $2', params: ['Harriet H.', 2847], db: 'postgres', rows: 1, dbDurationMs: 14 }, 'sql execution');
  await d(30, 80);
  logger.info({ requestId: randomUUID(), method: 'PATCH', path: '/api/users/2847', statusCode: 204, durationMs: 39 }, 'request completed');
  await d(120, 220);

  logger.error({ requestId: randomUUID(), method: 'GET', path: '/api/users/9999', statusCode: 500, errorName: 'TypeError', errorMessage: 'Cannot read properties of null (reading "id")', traceId: randomUUID(), spanId: randomUUID() }, 'unhandled application error');
  await d(80, 160);
  logger.debug({ requestId: randomUUID(), sql: 'select id from users where id = $1', params: [9999], db: 'postgres', rows: 0, dbDurationMs: 6 }, 'sql execution');
  await d(30, 70);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/users/9999', statusCode: 404, durationMs: 14 }, 'request completed');
  await d();

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/orders/5012', ip: '10.0.0.6', ua: 'curl/8.6.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(40, 80);
  logger.debug({ requestId: randomUUID(), key: 'order:5012', backend: 'redis', hit: true, durationMs: 1 }, 'cache get');
  await d(20, 40);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/orders/5012', statusCode: 200, durationMs: 7, cache: 'HIT' }, 'request completed');
  await d();

  logger.error({ requestId: randomUUID(), sql: 'select * from line_items where order_id = $1', params: [5012], dbDurationMs: 213, thresholdMs: 200 }, 'slow query detected');
  await d(140, 260);

  logger.info({ requestId: randomUUID(), method: 'DELETE', path: '/api/orders/99999', ip: '10.0.0.7', ua: 'PostmanRuntime/7.42.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(40, 80);
  logger.info({ requestId: randomUUID(), method: 'DELETE', path: '/api/orders/99999', statusCode: 404, durationMs: 16 }, 'request completed');
  await d();

  logger.error({ requestId: randomUUID(), method: 'POST', path: '/api/payments', statusCode: 502, provider: 'stripe', durationMs: 3050 }, 'payment gateway timeout');
  await d(120, 220);
  logger.debug({ requestId: randomUUID(), sql: 'insert into payment_attempts(order_id, provider, status) values ($1, $2, $3)', params: [5012, 'stripe', 'timeout'], rows: 1, dbDurationMs: 19 }, 'sql execution');
  await d(40, 80);
  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/payments', statusCode: 504, durationMs: 3112, reason: 'gateway timeout' }, 'request completed');
  await d(140, 260);

  logger.info({ requestId: randomUUID(), method: 'PUT', path: '/api/orders/5012/status', ip: '10.0.0.8', ua: 'Mozilla/5.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(50, 100);
  logger.debug({ requestId: randomUUID(), sql: 'update orders set status = $1 where id = $2', params: ['failed', 5012], rows: 1, dbDurationMs: 12 }, 'sql execution');
  await d(30, 80);
  logger.info({ requestId: randomUUID(), method: 'PUT', path: '/api/orders/5012/status', statusCode: 200, durationMs: 44 }, 'request completed');
  await d();

  logger.error({ requestId: randomUUID(), node: 'api-01', filesystem: '/dev/disk3s1s1', percentUsed: 91 }, 'disk space low');
  await d(60, 140);

  logger.debug({ requestId: randomUUID(), sql: 'select count(*) as n from orders where status=$1', params: ['failed'], rows: 1, dbDurationMs: 34 }, 'sql execution');
  await d(30, 70);
  logger.info({ requestId: randomUUID(), httpReqPerMin: 612, dbQps: 102.4, cacheHitRate: 0.87, cpuPct: 0.41, memRssMb: 324 }, 'metrics snapshot');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/catalog/search?q=wireless+headphones&page=1', ip: '172.16.0.23', ua: 'Safari/17.5', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(50, 100);
  logger.debug({ requestId: randomUUID(), sql: 'select id, name, price_cents from products where to_tsvector(name) @@ plainto_tsquery($1) limit 20 offset 0', params: ['wireless headphones'], rows: 20, dbDurationMs: 57 }, 'sql execution');
  await d(40, 80);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/catalog/search', statusCode: 200, durationMs: 83, cache: 'MISS' }, 'request completed');
  await d();

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/products/1234', ip: '203.0.113.22', ua: 'PostmanRuntime/7.28.4', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(40, 80);
  logger.debug({ requestId: randomUUID(), sql: 'select id, name, price from products where id = $1', params: [1234], db: 'postgres', rows: 1, dbDurationMs: 8 }, 'sql execution');
  await d(20, 60);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/products/1234', statusCode: 200, durationMs: 15, cache: 'MISS' }, 'request completed');
  await d();

  logger.info({ requestId: randomUUID(), method: 'PUT', path: '/api/users/501/profile', ip: '198.51.100.7', ua: 'curl/8.6.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(40, 80);
  logger.debug({ requestId: randomUUID(), sql: 'update users set bio = $1 where id = $2', params: ['Hello world', 501], db: 'postgres', rows: 1, dbDurationMs: 12 }, 'sql execution');
  await d(30, 70);
  logger.info({ requestId: randomUUID(), method: 'PUT', path: '/api/users/501/profile', statusCode: 204, durationMs: 38 }, 'request completed');
  await d(120, 220);

  logger.error({ requestId: randomUUID(), clientId: 'client-77', window: '5m', used: 495, limit: 500 }, 'rate limit nearing');
  await d(60, 140);

  logger.error({ requestId: randomUUID(), method: 'POST', path: '/api/checkout', statusCode: 500, errorName: 'PaymentError', errorMessage: 'card declined', traceId: randomUUID(), spanId: randomUUID() }, 'checkout failed');
  await d(80, 160);
  logger.debug({ requestId: randomUUID(), sql: 'insert into payment_attempts(order_id, provider, status) values ($1, $2, $3)', params: [901, 'stripe', 'declined'], rows: 1, dbDurationMs: 14 }, 'sql execution');
  await d(40, 80);
  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/checkout', statusCode: 502, durationMs: 2200, reason: 'payment provider error' }, 'request completed');
  await d(140, 260);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/reports/summary?date=2025-09-01', ip: '10.10.0.5', ua: 'Tableau/2025.2', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(60, 120);
  logger.debug({ requestId: randomUUID(), sql: 'select sum(amount) from orders where date = $1', params: ['2025-09-01'], rows: 500, dbDurationMs: 150 }, 'sql execution');
  await d(100, 200);
  logger.error({ requestId: randomUUID(), durationMs: 4800, thresholdMs: 3000 }, 'report generation slow');
  await d(120, 240);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/reports/summary', statusCode: 200, durationMs: 4852, cache: 'MISS' }, 'request completed');
  await d(140, 260);

  logger.info({ requestId: randomUUID(), method: 'DELETE', path: '/api/cart/items/sku-XYZ', ip: '172.16.0.12', ua: 'curl/8.7.1', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(40, 80);
  logger.debug({ requestId: randomUUID(), sql: 'delete from cart_items where user_id = $1 and sku = $2', params: ['u_3200', 'sku-XYZ'], rows: 1, db: 'postgres', dbDurationMs: 9 }, 'sql execution');
  await d(30, 70);
  logger.info({ requestId: randomUUID(), method: 'DELETE', path: '/api/cart/items/sku-XYZ', statusCode: 204, durationMs: 27 }, 'request completed');
  await d();

  logger.info({ requestId: randomUUID(), method: 'PATCH', path: '/api/orders/602/status', ip: '10.0.0.9', ua: 'Mozilla/5.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(50, 100);
  logger.debug({ requestId: randomUUID(), sql: 'update orders set status = $1 where id = $2', params: ['shipped', 602], rows: 1, db: 'postgres', dbDurationMs: 11 }, 'sql execution');
  await d(30, 80);
  logger.info({ requestId: randomUUID(), method: 'PATCH', path: '/api/orders/602/status', statusCode: 200, durationMs: 36 }, 'request completed');
  await d();

  logger.error({ requestId: randomUUID(), disk: '/', percentUsed: 92, node: 'api-02' }, 'disk space low');
  await d(60, 140);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/search?q=usb+c+cable&page=2', ip: '192.0.2.10', ua: 'Safari/17.3', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(50, 100);
  logger.debug({ requestId: randomUUID(), sql: 'select id, name from products where name ilike $1 limit 20 offset 20', params: ['%usb c cable%'], rows: 20, dbDurationMs: 34 }, 'sql execution');
  await d(40, 80);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/search', statusCode: 200, durationMs: 72, cache: 'MISS' }, 'request completed');
  await d();

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/auth/me', ip: '203.0.113.12', ua: 'MobileApp/6.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(40, 80);
  logger.debug({ requestId: randomUUID(), sql: 'select id, email, roles from users where id = $1', params: ['u_901'], db: 'postgres', rows: 1, dbDurationMs: 7 }, 'sql execution');
  await d(20, 60);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/auth/me', statusCode: 200, durationMs: 14, cache: 'MISS' }, 'request completed');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/sessions', ip: '198.51.100.44', ua: 'Chrome/129.0', traceId: randomUUID(), spanId: randomUUID(), contentType: 'application/json' }, 'incoming request');
  await d(50, 100);
  logger.debug({ requestId: randomUUID(), sql: 'insert into sessions(user_id, token, expires_at) values ($1, $2, $3) returning id', params: ['u_901', 'tok_' + randomUUID(), new Date(Date.now() + 3600_000).toISOString()], db: 'postgres', rows: 1, dbDurationMs: 12 }, 'sql execution');
  await d(30, 70);
  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/sessions', statusCode: 201, durationMs: 33, location: '/api/sessions/s_' + Math.trunc(Math.random()*1e6) }, 'request completed');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/products/8861', ip: '203.0.113.22', ua: 'PostmanRuntime/7.42.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(40, 80);
  logger.debug({ requestId: randomUUID(), key: 'product:8861', backend: 'redis', hit: false, durationMs: 1 }, 'cache get');
  await d(20, 40);
  logger.debug({ requestId: randomUUID(), sql: 'select id, name, price_cents, stock from products where id = $1', params: [8861], db: 'postgres', rows: 1, dbDurationMs: 9 }, 'sql execution');
  await d(30, 70);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/products/8861', statusCode: 200, durationMs: 22, cache: 'MISS' }, 'request completed');
  await d();

  logger.info({ requestId: randomUUID(), method: 'PATCH', path: '/api/products/8861', ip: '203.0.113.22', ua: 'PostmanRuntime/7.42.0', traceId: randomUUID(), spanId: randomUUID(), contentType: 'application/json' }, 'incoming request');
  await d(40, 80);
  logger.debug({ requestId: randomUUID(), sql: 'update products set stock = stock - $1 where id = $2 and stock >= $1', params: [1, 8861], db: 'postgres', rows: 1, dbDurationMs: 13 }, 'sql execution');
  await d(30, 70);
  logger.info({ requestId: randomUUID(), method: 'PATCH', path: '/api/products/8861', statusCode: 204, durationMs: 28 }, 'request completed');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/orders', ip: '172.16.10.5', ua: 'Safari/17.5', traceId: randomUUID(), spanId: randomUUID(), contentType: 'application/json' }, 'incoming request');
  await d(50, 100);
  logger.debug({ requestId: randomUUID(), sql: 'insert into orders(user_id, total_cents, status) values ($1, $2, $3) returning id', params: ['u_901', 4599, 'processing'], db: 'postgres', rows: 1, dbDurationMs: 18 }, 'sql execution');
  await d(40, 90);
  logger.debug({ requestId: randomUUID(), sql: 'insert into line_items(order_id, sku, qty, price_cents) values ($1, $2, $3, $4)', params: [Math.trunc(Math.random()*1e6), 'SKU-CABLE-USB-C', 1, 4599], db: 'postgres', rows: 1, dbDurationMs: 10 }, 'sql execution');
  await d(30, 70);
  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/orders', statusCode: 201, durationMs: 61, location: '/api/orders/70001' }, 'request completed');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/orders/70001', ip: '172.16.10.5', ua: 'Safari/17.5', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(40, 80);
  logger.debug({ requestId: randomUUID(), key: 'order:70001', backend: 'redis', hit: true, durationMs: 1 }, 'cache get');
  await d(20, 40);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/orders/70001', statusCode: 200, durationMs: 9, cache: 'HIT' }, 'request completed');
  await d();

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/search?q=gaming+laptop&page=1', ip: '192.0.2.20', ua: 'Chrome/129.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(50, 100);
  logger.debug({ requestId: randomUUID(), sql: 'select id, name, price_cents from products where to_tsvector(\'english\', coalesce(name, \'\') || \' \' || coalesce(description, \'\')) @@ plainto_tsquery($1) order by popularity desc limit 20 offset 0', params: ['gaming laptop'], db: 'postgres', rows: 20, dbDurationMs: 63 }, 'sql execution');
  await d(40, 80);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/search', statusCode: 200, durationMs: 88, cache: 'MISS' }, 'request completed');
  await d();

  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/payments', ip: '172.16.10.9', ua: 'Chrome/129.0', traceId: randomUUID(), spanId: randomUUID(), contentType: 'application/json' }, 'incoming request');
  await d(50, 100);
  logger.error({ requestId: randomUUID(), method: 'POST', path: '/api/payments', statusCode: 500, provider: 'stripe', errorName: 'PaymentIntentError', errorMessage: 'unexpected status requires_action', durationMs: 1320 }, 'payment processing failed');
  await d(80, 160);
  logger.debug({ requestId: randomUUID(), sql: 'insert into payment_attempts(order_id, provider, status, details) values ($1, $2, $3, $4)', params: [70001, 'stripe', 'failed', 'requires_action'], db: 'postgres', rows: 1, dbDurationMs: 16 }, 'sql execution');
  await d(40, 80);
  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/payments', statusCode: 500, durationMs: 1339, reason: 'payment error' }, 'request completed');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/admin/users?role=manager&limit=50', ip: '10.0.0.21', ua: 'Firefox/130.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(50, 100);
  logger.debug({ requestId: randomUUID(), sql: 'select u.id, u.email, array_agg(r.name) roles from users u join user_roles ur on ur.user_id = u.id join roles r on r.id = ur.role_id where r.name = $1 group by u.id, u.email order by u.email asc limit 50', params: ['manager'], db: 'postgres', rows: 37, dbDurationMs: 41 }, 'sql execution');
  await d(40, 80);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/admin/users', statusCode: 200, durationMs: 56 }, 'request completed');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/bulk/products/import', ip: '10.0.0.31', ua: 'curl/8.7.1', traceId: randomUUID(), spanId: randomUUID(), contentType: 'text/csv', bodyBytes: 1048576 }, 'incoming request');
  await d(60, 120);
  logger.debug({ requestId: randomUUID(), sql: 'with up as (update products p set name = s.name, price_cents = s.price_cents from (select * from staging_products where batch_id = $1) s where p.sku = s.sku returning p.sku) insert into products(sku, name, price_cents) select s.sku, s.name, s.price_cents from staging_products s left join up on up.sku = s.sku where up.sku is null and s.batch_id = $1', params: ['b_' + randomUUID()], db: 'postgres', rows: 1200, dbDurationMs: 2287 }, 'sql execution');
  await d(400, 800);
  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/bulk/products/import', statusCode: 202, durationMs: 2315 }, 'request completed');
  await d(140, 260);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/reports/sales?from=2025-01-01&to=2025-09-30', ip: '10.0.0.41', ua: 'Tableau/2025.2', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(60, 120);
  logger.debug({ requestId: randomUUID(), sql: 'select m, sum_total from (select date_trunc(\'month\', o.created_at) m, sum(o.total_cents) as sum_total from orders o where o.created_at between $1 and $2 group by 1) t order by m asc', params: ['2025-01-01', '2025-09-30'], db: 'postgres', rows: 9, dbDurationMs: 512 }, 'sql execution');
  await d(180, 320);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/reports/sales', statusCode: 200, durationMs: 530 }, 'request completed');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/webhooks/stripe', ip: '54.187.0.11', ua: 'Stripe/1.0', traceId: randomUUID(), spanId: randomUUID(), contentType: 'application/json' }, 'incoming request');
  await d(40, 80);
  logger.error({ requestId: randomUUID(), method: 'POST', path: '/api/webhooks/stripe', statusCode: 500, errorName: 'SignatureError', errorMessage: 'invalid signature header', eventId: randomUUID() }, 'webhook validation failed');
  await d(80, 160);
  logger.debug({ requestId: randomUUID(), sql: 'insert into webhook_events(id, provider, status, error) values ($1, $2, $3, $4)', params: ['evt_' + randomUUID(), 'stripe', 'failed', 'invalid signature'], db: 'postgres', rows: 1, dbDurationMs: 14 }, 'sql execution');
  await d(40, 80);
  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/webhooks/stripe', statusCode: 500, durationMs: 47 }, 'request completed');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/catalog/facets?q=ssd+1tb', ip: '203.0.113.50', ua: 'Edge/129.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(50, 100);
  logger.debug({ requestId: randomUUID(), sql: 'select brand, count(*) from products where name ilike $1 group by brand order by count(*) desc limit 10', params: ['%ssd 1tb%'], db: 'postgres', rows: 10, dbDurationMs: 73 }, 'sql execution');
  await d(40, 80);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/catalog/facets', statusCode: 200, durationMs: 92 }, 'request completed');
  await d();

  logger.info({ requestId: randomUUID(), method: 'PUT', path: '/api/users/me/password', ip: '198.51.100.100', ua: 'Firefox/130.0', traceId: randomUUID(), spanId: randomUUID(), contentType: 'application/json' }, 'incoming request');
  await d(50, 100);
  logger.error({ requestId: randomUUID(), method: 'PUT', path: '/api/users/me/password', statusCode: 500, errorName: 'HashingError', errorMessage: 'argon2 internal error', durationMs: 61 }, 'password update failed');
  await d(80, 160);
  logger.debug({ requestId: randomUUID(), sql: 'update users set password_hash = $1 where id = $2', params: ['hash_' + randomUUID(), 'u_901'], db: 'postgres', rows: 0, dbDurationMs: 5 }, 'sql execution');
  await d(40, 80);
  logger.info({ requestId: randomUUID(), method: 'PUT', path: '/api/users/me/password', statusCode: 500, durationMs: 64 }, 'request completed');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/analytics/retention?cohort=2025-09-01', ip: '10.2.0.10', ua: 'Chrome/129.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(60, 120);
  logger.debug({ requestId: randomUUID(), sql: 'select c.week, c.retention from calculate_retention($1) c', params: ['2025-09-01'], db: 'postgres', rows: 8, dbDurationMs: 182 }, 'sql execution');
  await d(100, 200);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/analytics/retention', statusCode: 200, durationMs: 197 }, 'request completed');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/notifications/email', ip: '10.3.0.7', ua: 'curl/8.7.1', traceId: randomUUID(), spanId: randomUUID(), contentType: 'application/json' }, 'incoming request');
  await d(40, 80);
  logger.debug({ requestId: randomUUID(), topic: 'emails', messageId: randomUUID(), durationMs: 2 }, 'queue publish');
  await d(20, 40);
  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/notifications/email', statusCode: 202, durationMs: 12 }, 'request completed');
  await d();

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/recommendations?userId=u_901', ip: '203.0.113.88', ua: 'MobileApp/6.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(50, 100);
  logger.debug({ requestId: randomUUID(), provider: 'ml-service', endpoint: '/v1/reco', durationMs: 402 }, 'http client call');
  await d(80, 160);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/recommendations', statusCode: 200, durationMs: 418, cache: 'MISS' }, 'request completed');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/audit/exports?from=2025-09-20&to=2025-09-29', ip: '192.0.2.77', ua: 'curl/8.6.0', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(60, 120);
  logger.debug({ requestId: randomUUID(), sql: 'select a.id, a.action, a.actor_id, a.created_at from audit_logs a where a.created_at between $1 and $2 order by a.created_at desc limit 1000', params: ['2025-09-20', '2025-09-29'], db: 'postgres', rows: 1000, dbDurationMs: 905 }, 'sql execution');
  await d(300, 600);
  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/audit/exports', statusCode: 200, durationMs: 921, bytes: 524288 }, 'request completed');
  await d(140, 260);

  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/geo/resolve', ip: '198.51.100.200', ua: 'curl/8.7.1', traceId: randomUUID(), spanId: randomUUID(), contentType: 'application/json' }, 'incoming request');
  await d(40, 80);
  logger.debug({ requestId: randomUUID(), sql: 'insert into geo_cache(ip, country, city) values ($1, $2, $3) on conflict (ip) do update set country = excluded.country, city = excluded.city', params: ['1.1.1.1', 'AU', 'Sydney'], db: 'postgres', rows: 1, dbDurationMs: 6 }, 'sql execution');
  await d(30, 70);
  logger.info({ requestId: randomUUID(), method: 'POST', path: '/api/geo/resolve', statusCode: 200, durationMs: 19 }, 'request completed');
  await d(120, 220);

  logger.info({ requestId: randomUUID(), method: 'GET', path: '/api/reports/heavy?year=2024', ip: '10.0.0.60', ua: 'Tableau/2025.2', traceId: randomUUID(), spanId: randomUUID() }, 'incoming request');
  await d(60, 120);
  logger.debug({ requestId: randomUUID(), sql: 'select d, revenue, cost, profit from (select date_trunc(\'day\', o.created_at) d, sum(o.total_cents) revenue, sum(o.cost_cents) cost, sum(o.total_cents - o.cost_cents) profit from orders o where o.created_at >= $1 and o.created_at < $2 group by 1) t order by d asc', params: ['2024-01-01', '2025-01-01'], db: 'postgres', rows: 366, dbDurationMs: 2749 }, 'sql execution');
  await d(500, 900);

  await delay(3000);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
