# Grafana Demo

This repository contains the demo for the talk **"Mastering Observability with Open Source Tools"** by [Luca Raveri](https://lucaraveri.com).

In this demo, we'll explore how to create powerful log visualizations using **Grafana Alloy**, **Loki**, and **Grafana** to gain insights into application behavior, performance, and issues.

## 🎯 What You'll Learn

- How to set up a complete observability stack
- Configure Grafana Alloy to collect logs from files
- Stream logs to Loki for aggregation and indexing
- Create comprehensive dashboards in Grafana
- Query and analyze logs with LogQL

## 🏗️ Architecture

```
Node.js App → Log File → Grafana Alloy → Loki → Grafana
```

### Components

1. **Node.js Application**: Generates realistic API traffic and logs to file
2. **Grafana Alloy**: Reads logs from file and forwards them to Loki
3. **Loki**: Aggregates and indexes logs
4. **Grafana**: Visualizes and analyzes logs with dashboards

## 🚀 Quick Start

### Prerequisites

- Docker installed


### Step 1: Clone and Configure

```bash
# Clone the repository
git clone <repository-url>
cd grafana-demo

# (Optional) Configure alert email
# Create .env file with your email for receiving alerts
echo "ALERT_EMAIL=your-email@example.com" > .env
```

### Step 2: Start All Services

```bash
# Start all services
docker-compose up -d
```

This command will:
- Build the Node.js application
- Start Loki, Alloy, and Grafana
- Automatically configure Loki as datasource in Grafana
- Import all dashboards into Grafana
- Import alert rules and configure email notifications

### Step 3: Access Grafana

1. Open your browser at: [http://localhost:3000](http://localhost:3000)
2. Login with:
   - **Username**: `admin`
   - **Password**: `admin`

### Step 4: View Logs

In Grafana:

1. Go to **Explore** (compass icon in the sidebar)
2. Select **Loki** as datasource (already configured)
3. Try these LogQL queries:

```logql
# All logs
{job="grafana-demo"}

# Only errors
{job="grafana-demo"} | json | level="error"

# HTTP requests
{job="grafana-demo"} |= "HTTP request"

# Slow queries (>100ms)
{job="grafana-demo"} | json | queryTime > 100

# Error rate per minute
sum(rate({job="grafana-demo"} | json | level="error" [1m]))
```

### Step 5: Explore Dashboards

All dashboards are automatically imported into the **"Grafana Demo"** folder:

1. Click on **Dashboards** (squares icon in the sidebar)
2. Open the **"Grafana Demo"** folder
3. Available dashboards:
   - **API Logs** - Real-time log streaming with filtering
   - **Fatal Errors** - Time series visualization of critical errors
   - **HTTP Responses** - All HTTP responses with performance metrics
   - **Query Executed** - Database query monitoring
   - **Response Codes** - API health and error patterns
   - **EmailService - Email Sent** - Email service logs (sent/errored)
   - **EmailService Logs** - All EmailService activity

### Step 6: View Alert Rules

Alert rules are automatically imported and configured:

1. Go to **Alerting** → **Alert rules** (bell icon in the sidebar)
2. You'll find the rules in the **"Grafana Demo Alerts"** folder:
   - **FATAL ERROR** - Triggers when application crashes
   - **500 Error Spike** - Triggers when too many 500 errors occur

Email notifications are automatically configured to: `${ALERT_EMAIL}` (from your `.env` file)

To test alerts, the application generates occasional errors and crashes.

### Stop Services

```bash
# Stop but keep data
docker-compose stop

# Stop and remove containers (keeps volumes)
docker-compose down

# Remove everything including data (⚠️ deletes all logs and dashboard updates!)
docker-compose down -v
```

## 🔍 Service URLs

- **Grafana UI**: http://localhost:3000
- **Loki API**: http://localhost:3100
- **Alloy UI**: http://localhost:12345

## 📖 **Talk Slides**

The presentation slides for this demo are available in the repository:

- **Slides**: [`slide/grafana-talk.pdf`](slide/grafana-talk.pdf)

These slides accompany the live demonstration and provide additional context about observability best practices, Grafana setup, and Loki query examples.

---

**Speaker**: [Luca Raveri](https://lucaraveri.com)  
**Talk**: "Mastering Observability with Open Source Tools"

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🌟 Star this repo if you find it useful!**
