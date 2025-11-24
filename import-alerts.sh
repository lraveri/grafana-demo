#!/bin/bash

# Wait for Grafana to be ready
echo "Waiting for Grafana to be ready..."
until curl -s http://grafana:3000/api/health > /dev/null 2>&1; do
  sleep 2
done

echo "Grafana is ready. Setting up alert configuration..."

# Get email from environment variable or use default
ALERT_EMAIL="${ALERT_EMAIL:-demo@example.com}"
echo "Alert email: $ALERT_EMAIL"

# Create contact point for email notifications
echo "Creating email contact point..."
CONTACT_POINT_RESPONSE=$(curl -s -X POST http://admin:admin@grafana:3000/api/v1/provisioning/contact-points \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Email Alerts\",
    \"type\": \"email\",
    \"settings\": {
      \"addresses\": \"$ALERT_EMAIL\"
    },
    \"disableResolveMessage\": false
  }")

if echo "$CONTACT_POINT_RESPONSE" | grep -q '"uid"'; then
  echo "✓ Email contact point created"
else
  echo "ℹ Contact point may already exist (this is okay)"
fi

# Set the default notification policy to use the email contact point
echo "Configuring notification policy..."
curl -s -X PUT http://admin:admin@grafana:3000/api/v1/provisioning/policies \
  -H "Content-Type: application/json" \
  -d '{
    "receiver": "Email Alerts",
    "group_by": ["alertname", "grafana_folder"],
    "group_wait": "30s",
    "group_interval": "5m",
    "repeat_interval": "12h"
  }' > /dev/null

echo "✓ Notification policy configured"

echo ""
echo "Importing alert rules..."

# Create alert folder if it doesn't exist
FOLDER_NAME="Grafana Demo Alerts"
echo "Creating alert folder: $FOLDER_NAME"

FOLDER_RESPONSE=$(curl -s -X POST http://admin:admin@grafana:3000/api/folders \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"$FOLDER_NAME\"}")

FOLDER_UID=$(echo $FOLDER_RESPONSE | grep -o '"uid":"[^"]*' | cut -d'"' -f4)

if [ -z "$FOLDER_UID" ]; then
  # Folder might already exist, try to get it
  FOLDER_UID=$(curl -s http://admin:admin@grafana:3000/api/folders | jq -r ".[] | select(.title==\"$FOLDER_NAME\") | .uid" | head -1)
fi

echo "Folder UID: $FOLDER_UID"

# Import each alert rule file
for alert_file in /alerts/*.json; do
  if [ -f "$alert_file" ]; then
    filename=$(basename "$alert_file")
    echo "Processing $filename..."
    
    # Extract rules from the file and import each one
    cat "$alert_file" | jq -c --arg folderUID "$FOLDER_UID" '
      .groups[0].rules[] | 
      {
        uid: .uid,
        title: .title,
        condition: .condition,
        data: .data,
        noDataState: (.noDataState // "NoData"),
        execErrState: (.execErrState // "Alerting"),
        for: (.for // "0s"),
        annotations: (.annotations // {}),
        labels: (.labels // {}),
        folderUID: $folderUID,
        ruleGroup: "My Eval Group"
      }
    ' | while read -r rule; do
      # Get rule title for logging
      RULE_TITLE=$(echo "$rule" | jq -r '.title')
      
      # Import the alert rule
      response=$(curl -s -X POST http://admin:admin@grafana:3000/api/v1/provisioning/alert-rules \
        -H "Content-Type: application/json" \
        -H "X-Disable-Provenance: true" \
        -d "$rule")
      
      # Check if import was successful
      if echo "$response" | grep -q '"uid"'; then
        echo "  ✓ Imported: $RULE_TITLE"
      else
        echo "  ✗ Failed: $RULE_TITLE"
        echo "     Error: $response"
      fi
    done
  fi
done

echo "Alert rules import completed!"

