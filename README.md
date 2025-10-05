# Grafana Demo - Mastering Observability with Open Source Tools

This repository contains the demo for the talk **"Mastering Observability with Open Source Tools"** by [Luca Raveri](https://lucaraveri.com).

In this demo, we'll explore how to create powerful log visualizations using **Loki** and **Grafana** to gain insights into application behavior, performance, and issues.

## 🎯 What You'll Learn

- How to set up log streaming to Grafana Cloud Loki
- Creating comprehensive dashboards on Grafana
- Setting up alerts for error spikes and fatal errors

## 🚀 Quick Start

### Step 1: Create Grafana Cloud Account

1. Go to [Grafana Cloud](https://grafana.com/auth/sign-in/create-user) and create a free account (no credit card required)

2. Go back to [Grafana Cloud](https://grafana.com/products/cloud) and Navigate to **My Account** → **Manage your Grafana Cloud stack**

3. Click **Details** → Select **Loki** → Grab the following information:
   - **URL**: Your Loki endpoint (e.g. https://logs-prod-012.grafana.net)
   - **User**: Your Grafana Cloud user id (e.g. 1059329)
   - **Name**: Your Loki datasource name (e.g. grafanacloud-lucaraveri993-logs)

4. Create a new token:
   - In the same page under the section "Sending Logs to Grafana Cloud using Grafana Alloy"
   - Click on "Generate new token"
   - Make sure the token has the scope "logs:write"


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
LOKI_HOST=https://logs-prod-***.grafana.net
LOKI_USERNAME=1234567
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

3. Select **Loki** as data source (the datasource to be selected has the name from step 3, e.g. grafanacloud-lucaraveri993-logs)

4. Run this query to see test logs:
   ```
   {source="grafana-demo"}
   ```

5. Verify you can see the test log entries

#### Troubleshooting

If you don't see logs in Grafana, try running the test script with debug mode:

**Windows:**
```bash
$env:NODE_DEBUG = "pino-loki"; npm run test
```

**Mac/Linux:**
```bash
NODE_DEBUG=pino-loki npm run test
```

### Step 6: Run API Simulation

Once everything is configured correctly, start the API simulation:

```bash
# Start the API traffic simulation
npm run start
```

This will generate realistic API traffic with:
- HTTP requests and responses
- Database queries with varying performance
- Error patterns and spikes
- Background system logs

### Step 7: Import Dashboards

1. Go to **Grafana** → **Dashboards** → **Import**

2. Import the dashboards from the `dashboard/` folder in this repository:

#### 📋 Available Dashboards

- **API Logs** - Real-time log streaming with filtering capabilities
- **Fatal Errors** - Time series visualization with automatic alerting
- **HTTP Responses** - Filterable table of all HTTP responses with performance metrics
- **Query Executed** - Database query monitoring with execution times
- **Response Codes** - Time series showing API health and error patterns

### Step 8: Import Alerts

Import alerts from the `alert/` folder:

- **Fatal Errors**: Immediate alert on any fatal error occurrence
- **500 Error Spikes**: Alert when 500 errors exceed normal thresholds

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
