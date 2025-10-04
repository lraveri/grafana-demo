# Grafana Demo - Mastering Observability with Open Source Tools

This repository contains the demo for the talk **"Mastering Observability with Open Source Tools"** by [Luca Raveri](https://lucaraveri.com).

In this demo, we'll explore how to create powerful log visualizations using **Loki** and **Grafana** to gain insights into application behavior, performance, and issues.

## 🎯 What You'll Learn

- How to set up log streaming to Grafana Cloud Loki
- Creating comprehensive dashboards for API monitoring
- Setting up alerts for error spikes and performance issues
- Analyzing database performance and query patterns
- Monitoring traffic patterns and system health

## 🚀 Quick Start

### Step 1: Create Grafana Cloud Account

1. Go to [Grafana Cloud](https://grafana.com/auth/sign-in/create-user) and create a free account (no credit card required)

2. Navigate to **My Account** → **Manage your Grafana Cloud stack**

3. Click **Details** → Select **Loki** → Grab the following information:
   - **URL**: Your Loki endpoint
   - **Username**: Your Grafana Cloud username
   - **Token**: Create a new API token with Loki permissions

### Step 2: Setup Repository

```bash
# Clone the repository
git clone <repository-url>
cd grafana-demo

# Install dependencies
npm install
```

### Step 3: Configure Environment

Create a `.env` file in the root directory with your Grafana Cloud credentials:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Grafana Cloud Loki Configuration
LOKI_HOST=https://your-instance.grafana.net/loki/api/v1/push
LOKI_USERNAME=your-username
LOKI_PASSWORD=your-api-token

# Logging Configuration
LOG_LEVEL=debug
LOG_SOURCE=grafana-demo
LOG_ENV=production
```

### Step 4: Test Connection

```bash
# Run the test to verify your connection
npm run test
```

### Step 5: Verify in Grafana

1. Go to **Grafana Cloud** → **My Account** → **Manage your Grafana Cloud stack** → **Launch**

2. Navigate to **Explore** section

3. Select **Loki** as data source

4. Run this query to see test logs:
   ```
   {source="grafana-demo"}
   ```

5. Verify you can see the test log entries

### Step 6: Run API Simulation

Once everything is configured correctly, start the API simulation:

```bash
# Start the API traffic simulation
npm run start
```

This will generate realistic API traffic with:
- HTTP requests and responses
- Database queries with varying performance
- Error spikes and traffic patterns
- Background system logs

### Step 7: Import Dashboards

1. Go to **Grafana** → **Dashboards** → **Import**

2. Import the following dashboards from the `dashboard/` folder in this repository:

#### 📋 Available Dashboards

**API Logs** (`api_logs.json`)
- View all API logs with filtering capabilities
- Search and filter by endpoint, method, status code, and request ID
- Perfect for debugging and log analysis

**Fatal Errors** (`fatal_errors.json`)
- Time series visualization of all fatal errors
- **Alert configured**: Triggers on every fatal error occurrence
- Monitor system stability and error patterns

**HTTP Responses** (`http_responses.json`)
- Filterable table showing all HTTP responses
- Columns: endpoint, status code, response time, request ID
- Sort and filter by any column for detailed analysis

**Query Executed** (`query_executed.json`)
- Filterable table of all database queries executed
- Shows query details, execution time, and affected rows
- Monitor database performance and slow queries

**Response Codes** (`response_codes.json`)
- Time series dashboard showing API response patterns
- Visual breakdown of status codes over time
- **Alert configured**: Triggers on 500 error spikes
- Monitor API health and error trends

## 📊 What the Simulation Generates

### API Traffic
- **12 different endpoints** (users, orders, products, health checks)
- **Realistic HTTP methods** (GET, POST, PUT, DELETE)
- **Status code distribution** (200, 201, 400, 401, 404, 500)
- **Request timing** with realistic delays

### Database Operations
- **6 different tables** with varying query complexity
- **4 operation types** (SELECT, INSERT, UPDATE, DELETE)
- **Performance variations** (fast queries 5-50ms, slow queries 200-2000ms)
- **Occasional errors** (5% failure rate)

### Traffic Patterns
- **Normal traffic** with random intervals
- **Traffic spikes** (0.5% probability) lasting 30-120 seconds
- **Error spikes** (1% probability) with 80% error rate
- **Background noise** (cache hits, health checks, metrics)

## 🎛️ Dashboard Features

Each dashboard is designed for specific monitoring needs:

### 📊 **API Logs Dashboard**
- **Real-time log streaming** with live updates
- **Advanced filtering** by multiple criteria
- **Log level indicators** (info, debug, error)
- **Request tracing** with unique request IDs

### ⚠️ **Fatal Errors Dashboard**
- **Real-time error monitoring** with time series
- **Automatic alerting** on every fatal error
- **Error categorization** and frequency analysis
- **Trend analysis** for error patterns

### 📋 **HTTP Responses Dashboard**
- **Tabular view** of all HTTP responses
- **Sortable columns** for easy analysis
- **Response time tracking** and performance metrics
- **Status code distribution** analysis

### 🗄️ **Database Query Dashboard**
- **Query performance monitoring** with execution times
- **Slow query identification** and analysis
- **Database operation tracking** (SELECT, INSERT, UPDATE, DELETE)
- **Query failure monitoring** and error tracking

### 📈 **Response Codes Dashboard**
- **Time series visualization** of HTTP status codes
- **Error spike detection** with automatic alerts
- **API health monitoring** over time
- **Traffic pattern analysis** and anomaly detection

## 🚨 Alerting

Pre-configured alerts include:

- **Fatal Errors**: Immediate alert on any fatal error occurrence
- **500 Error Spikes**: Alert when 500 errors exceed normal thresholds

## 🛠️ Customization

### Modify Log Patterns

Edit `src/index.js` to:
- Change endpoint configurations
- Adjust error probabilities
- Modify database query patterns
- Add custom log messages

### Environment Variables

- `LOG_LEVEL`: Set log verbosity (debug, info, warn, error)
- `LOG_SOURCE`: Change the log source label
- `LOG_ENV`: Set environment (dev, staging, production)

## 📁 Project Structure

```
grafana-demo/
├── src/
│   ├── index.js          # Main API simulation
│   ├── logger.js         # Pino logger with Loki transport
│   └── test.js           # Connection test
├── dashboard/            # Grafana dashboard JSON
├── package.json
├── .env.example          # Environment variables template
└── README.md
```

## 🔧 Troubleshooting

### Common Issues

1. **No logs appearing in Grafana**:
   - Check your `.env` file credentials
   - Verify Loki endpoint URL format
   - Ensure API token has correct permissions

2. **Connection timeouts**:
   - Check network connectivity to Grafana Cloud
   - Verify firewall settings

3. **Dashboard not loading**:
   - Ensure Loki data source is configured
   - Check that logs are being generated (`npm run test`)

### Getting Help

- Check the [Grafana Cloud documentation](https://grafana.com/docs/grafana-cloud/)
- Review [Loki query language](https://grafana.com/docs/loki/latest/query/)
- Join the [Grafana Community](https://community.grafana.com/)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📖 **Talk Slides**

The presentation slides for this demo are available in the repository:

- **Slides**: [`slide/grafana-talk.pdf`](slide/grafana-talk.pdf)

These slides accompany the live demonstration and provide additional context about observability best practices, Grafana setup, and Loki query examples.

---

**Speaker**: [Luca Raveri](https://lucaraveri.com)  
**Talk**: "Mastering Observability with Open Source Tools"
