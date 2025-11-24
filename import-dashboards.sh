#!/bin/bash

# Wait for Grafana to be ready
echo "Waiting for Grafana to be ready..."
until curl -s http://grafana:3000/api/health > /dev/null 2>&1; do
  sleep 2
done

echo "Grafana is ready. Importing dashboards..."

# Create folder
FOLDER_RESPONSE=$(curl -s -X POST http://admin:admin@grafana:3000/api/folders \
  -H "Content-Type: application/json" \
  -d '{"title":"Grafana Demo"}')

FOLDER_UID=$(echo $FOLDER_RESPONSE | grep -o '"uid":"[^"]*' | cut -d'"' -f4)

if [ -z "$FOLDER_UID" ]; then
  # Folder might already exist, try to get it
  FOLDER_UID=$(curl -s http://admin:admin@grafana:3000/api/folders | grep -o '"uid":"[^"]*","title":"Grafana Demo"' | cut -d'"' -f4 | head -1)
fi

echo "Folder UID: $FOLDER_UID"

# Import each dashboard
for dashboard_file in /dashboards/*.json; do
  if [ -f "$dashboard_file" ]; then
    filename=$(basename "$dashboard_file")
    echo "Importing $filename..."
    
    # Read dashboard JSON and wrap it
    dashboard_json=$(cat "$dashboard_file")
    
    # Create import payload
    import_payload=$(jq -n \
      --arg folder "$FOLDER_UID" \
      --argjson dashboard "$dashboard_json" \
      '{dashboard: $dashboard, folderUid: $folder, overwrite: true}')
    
    # Import dashboard
    response=$(curl -s -X POST http://admin:admin@grafana:3000/api/dashboards/db \
      -H "Content-Type: application/json" \
      -d "$import_payload")
    
    # Check if import was successful
    if echo "$response" | grep -q '"status":"success"'; then
      echo "✓ Imported $filename"
    else
      echo "✗ Failed to import $filename"
      echo "   Error: $response"
    fi
  fi
done

echo "All dashboards imported successfully!"

