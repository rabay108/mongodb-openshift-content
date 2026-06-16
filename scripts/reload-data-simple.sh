#!/bin/bash
# Simple script to reload MongoDB data with updated schema
# This script connects to the MongoDB pod and reloads the data

set -e

echo "=========================================="
echo "MongoDB Data Reload Script (Simple)"
echo "=========================================="

# Configuration
NAMESPACE="content-db"
POD_NAME="mongodb-0"

echo ""
echo "Step 1: Backing up existing data..."
kubectl exec ${POD_NAME} -n ${NAMESPACE} -- mongosh contentdb --quiet --eval "
  const count = db.content_001.countDocuments();
  print('Current documents: ' + count);
  if (count > 0) {
    db.content_001.find().forEach(function(doc) {
      db.movies_backup.insertOne(doc);
    });
    print('✅ Backed up ' + count + ' documents to movies_backup collection');
  }
"

echo ""
echo "Step 2: Dropping movies collection..."
kubectl exec ${POD_NAME} -n ${NAMESPACE} -- mongosh contentdb --quiet --eval "
  db.content_001.drop();
  print('✅ Collection dropped');
"

echo ""
echo "Step 3: Running init-schema.js..."
kubectl exec ${POD_NAME} -n ${NAMESPACE} -- mongosh < /docker-entrypoint-initdb.d/init-schema.js

echo ""
echo "Step 4: Running sample-data.js..."
kubectl exec ${POD_NAME} -n ${NAMESPACE} -- mongosh < /docker-entrypoint-initdb.d/sample-data.js

echo ""
echo "Step 5: Verifying reload..."
kubectl exec ${POD_NAME} -n ${NAMESPACE} -- mongosh contentdb --quiet --eval "
  const count = db.content_001.countDocuments();
  print('✅ Total documents: ' + count);
  
  const sample = db.content_001.findOne();
  print('');
  print('New fields verification:');
  print('  movieLanguage: ' + (sample.movieLanguage ? '✅' : '❌'));
  print('  releaseDate: ' + (sample.releaseDate ? '✅' : '❌'));
  print('  ottPlatforms: ' + (sample.ottPlatforms ? '✅ (' + sample.ottPlatforms.length + ')' : '❌'));
  print('  links: ' + (sample.links ? '✅ (' + sample.links.length + ')' : '❌'));
"

echo ""
echo "=========================================="
echo "✅ Data reload completed!"
echo "=========================================="

# Made with Bob
