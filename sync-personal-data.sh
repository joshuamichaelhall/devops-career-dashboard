#!/bin/bash
# Sync Personal Dashboard Data
# This script syncs your personal dashboard data to a private git repository

PERSONAL_REPO_DIR="devops-dashboard-personal-data"
DATA_DIR="dashboard/src/data"

# Check if personal repo exists
if [ ! -d "$PERSONAL_REPO_DIR" ]; then
    echo "❌ Personal data repository not found at $PERSONAL_REPO_DIR"
    echo "Please set up your personal data repository first."
    echo "See devops-dashboard-personal-data/README.md for instructions."
    exit 1
fi

# Check if data files exist
if [ ! -f "$DATA_DIR/data.json" ]; then
    echo "❌ No data.json file found"
    exit 1
fi

echo "🔄 Syncing personal dashboard data..."

# Copy data files to personal repo
cp "$DATA_DIR/data.json" "$PERSONAL_REPO_DIR/"

# Copy clay config if it exists
if [ -f "$DATA_DIR/clay-config.json" ]; then
    cp "$DATA_DIR/clay-config.json" "$PERSONAL_REPO_DIR/"
fi

# Navigate to personal repo
cd "$PERSONAL_REPO_DIR"

# Check if there are changes
if git diff --quiet && git diff --staged --quiet; then
    echo "✅ No changes to sync"
    exit 0
fi

# Add and commit changes
git add .
git commit -m "Dashboard sync: $(date '+%Y-%m-%d %H:%M:%S')"

# Push to remote
if git push; then
    echo "✅ Successfully synced data to private repository"
else
    echo "❌ Failed to push to remote repository"
    echo "Please check your internet connection and repository access"
    exit 1
fi