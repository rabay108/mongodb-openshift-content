#!/bin/bash
# Script to reload MongoDB data with updated schema
# This script drops the existing movies collection and reloads it with new data

set -e

echo "=========================================="
echo "MongoDB Data Reload Script"
echo "=========================================="

# Configuration
NAMESPACE="movies-db"
STATEFULSET_NAME="mongodb"
POD_NAME="${STATEFULSET_NAME}-0"
DB_NAME="moviesdb"
COLLECTION_NAME="movies"

# Check if pod exists
echo "Checking if MongoDB pod is running..."
if ! kubectl get pod ${POD_NAME} -n ${NAMESPACE} &> /dev/null; then
    echo "❌ Error: Pod ${POD_NAME} not found in namespace ${NAMESPACE}"
    exit 1
fi

echo "✅ Pod ${POD_NAME} found"

# Check pod status
POD_STATUS=$(kubectl get pod ${POD_NAME} -n ${NAMESPACE} -o jsonpath='{.status.phase}')
if [ "$POD_STATUS" != "Running" ]; then
    echo "❌ Error: Pod is not running (Status: ${POD_STATUS})"
    exit 1
fi

echo "✅ Pod is running"

# Backup existing data (optional)
echo ""
echo "Creating backup of existing data..."
kubectl exec ${POD_NAME} -n ${NAMESPACE} -- mongosh --quiet --eval "
  use ${DB_NAME};
  print('Backing up ' + db.${COLLECTION_NAME}.countDocuments() + ' documents...');
  db.${COLLECTION_NAME}.find().forEach(function(doc) {
    db.${COLLECTION_NAME}_backup.insertOne(doc);
  });
  print('✅ Backup created in ${COLLECTION_NAME}_backup collection');
"

# Drop the movies collection
echo ""
echo "Dropping existing movies collection..."
kubectl exec ${POD_NAME} -n ${NAMESPACE} -- mongosh --quiet --eval "
  use ${DB_NAME};
  db.${COLLECTION_NAME}.drop();
  print('✅ Collection dropped');
"

# Recreate schema with validation
echo ""
echo "Recreating collection with updated schema..."
kubectl exec ${POD_NAME} -n ${NAMESPACE} -- mongosh --quiet < /docker-entrypoint-initdb.d/init-schema.js

# Reload sample data
echo ""
echo "Reloading sample data with new fields..."
kubectl exec ${POD_NAME} -n ${NAMESPACE} -- mongosh --quiet < /docker-entrypoint-initdb.d/sample-data.js

# Verify the reload
echo ""
echo "Verifying data reload..."
kubectl exec ${POD_NAME} -n ${NAMESPACE} -- mongosh --quiet --eval "
  use ${DB_NAME};
  const count = db.${COLLECTION_NAME}.countDocuments();
  print('✅ Total documents: ' + count);
  
  // Check if new fields exist
  const sampleDoc = db.${COLLECTION_NAME}.findOne({}, {movieLanguage: 1, releaseDate: 1, ottPlatforms: 1, links: 1});
  print('');
  print('Sample document fields:');
  print('  - movieLanguage: ' + (sampleDoc.movieLanguage ? '✅ Present' : '❌ Missing'));
  print('  - releaseDate: ' + (sampleDoc.releaseDate ? '✅ Present' : '❌ Missing'));
  print('  - ottPlatforms: ' + (sampleDoc.ottPlatforms ? '✅ Present (' + sampleDoc.ottPlatforms.length + ' platforms)' : '❌ Missing'));
  print('  - links: ' + (sampleDoc.links ? '✅ Present (' + sampleDoc.links.length + ' links)' : '❌ Missing'));
"

echo ""
echo "=========================================="
echo "✅ Data reload completed successfully!"
echo "=========================================="
echo ""
echo "Note: Old data is backed up in '${COLLECTION_NAME}_backup' collection"
echo "To restore backup if needed, run:"
echo "  kubectl exec ${POD_NAME} -n ${NAMESPACE} -- mongosh --eval 'use ${DB_NAME}; db.${COLLECTION_NAME}_backup.find().forEach(function(doc) { db.${COLLECTION_NAME}.insertOne(doc); })'"

# Made with Bob
