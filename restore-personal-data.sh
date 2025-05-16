#!/bin/bash
# Restore Personal Dashboard Data
# This script restores your personal dashboard data from a private git repository

PERSONAL_REPO_DIR="personal-data-repo"
DATA_DIR="dashboard/src/data"

# Check if personal repo exists
if [ ! -d "$PERSONAL_REPO_DIR" ]; then
    echo "❌ Personal data repository not found at $PERSONAL_REPO_DIR"
    echo "You may need to clone it first:"
    echo "git clone git@github.com:YOUR-USERNAME/devops-dashboard-personal-data.git personal-data-repo"
    exit 1
fi

echo "🔄 Restoring personal dashboard data..."

# Pull latest changes from remote
cd "$PERSONAL_REPO_DIR"
if ! git pull; then
    echo "⚠️  Warning: Could not pull latest changes from remote"
    echo "Continuing with local data..."
fi

cd ..

# Check if data files exist in personal repo
if [ ! -f "$PERSONAL_REPO_DIR/data.json" ]; then
    echo "❌ No data.json file found in personal repository"
    exit 1
fi

# Backup current data if it exists
if [ -f "$DATA_DIR/data.json" ]; then
    BACKUP_DIR="$DATA_DIR/backups"
    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
    cp "$DATA_DIR/data.json" "$BACKUP_DIR/data-before-restore-$TIMESTAMP.json"
    echo "📦 Backed up current data to $BACKUP_DIR/data-before-restore-$TIMESTAMP.json"
fi

# Restore data files
cp "$PERSONAL_REPO_DIR/data.json" "$DATA_DIR/"
echo "✅ Restored data.json"

# Restore clay config if it exists
if [ -f "$PERSONAL_REPO_DIR/clay-config.json" ]; then
    cp "$PERSONAL_REPO_DIR/clay-config.json" "$DATA_DIR/"
    echo "✅ Restored clay-config.json"
fi

echo "✅ Successfully restored personal dashboard data"
echo ""
echo "You can now start the dashboard with:"
echo "./start-personal.sh"