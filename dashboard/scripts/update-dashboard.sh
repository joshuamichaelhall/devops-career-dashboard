#!/bin/bash
#
# update-dashboard.sh - Run weekly review and update dashboard data
#
# This script runs your weekly review and then updates the dashboard data.

# Get directory paths using relative paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASHBOARD_DIR="$(dirname "$SCRIPT_DIR")"
REPO_ROOT="$(dirname "$DASHBOARD_DIR")"

if [ ! -d "$REPO_ROOT/tracking" ]; then
  echo "Error: Repository structure not found."
  exit 1
fi

# Run the weekly review script
if [ -f "$REPO_ROOT/tracking/scripts/create-weekly-review.sh" ]; then
  echo "Running weekly review script..."
  "$REPO_ROOT/tracking/scripts/create-weekly-review.sh"
fi

# Update progress data
if [ -f "$REPO_ROOT/tracking/scripts/update-progress.sh" ]; then
  echo "Updating progress data..."
  "$REPO_ROOT/tracking/scripts/update-progress.sh"
fi

# Generate dashboard data
echo "Generating dashboard data..."
"$SCRIPT_DIR/generate-dashboard-data.sh"

echo "Weekly review completed and dashboard data updated!"