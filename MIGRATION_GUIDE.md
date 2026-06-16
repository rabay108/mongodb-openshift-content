# Migration Guide: movies-db → content-db

This guide explains how to migrate from the old `movies-db` namespace to the new `content-db` namespace with the flexible schema.

## Prerequisites

Before starting, ensure you have:
- ✅ OpenShift cluster access with `oc` CLI configured
- ✅ ArgoCD installed on your cluster (see `ARGOCD_SETUP.md` if not installed)
- ✅ Appropriate permissions to create/delete namespaces

## Overview

**What Changed:**
- Namespace: `movies-db` → `content-db`
- Database: `moviesdb` → `contentdb`
- Collection: `movies` → `content_001`
- Schema: Single-purpose → Flexible multi-content-type

---

## Option 1: Clean Deployment (Recommended for New Installations)

If you don't have existing data or want a fresh start:

### Step 1: Delete Old Namespace (if exists)
```bash
# This will delete everything in the old namespace
oc delete namespace content-db

# Wait for namespace to be fully deleted
oc get namespace content-db
# Should return: Error from server (NotFound)
```

### Step 2: Deploy New Application via ArgoCD
```bash
# Apply the new ArgoCD application
oc apply -f argocd/application.yaml

# Or sync via ArgoCD CLI
argocd app sync mongodb-content-app

# Monitor the deployment
oc get pods -n content-db -w
```

### What ArgoCD Will Do:
✅ Create new `content-db` namespace
✅ Deploy all resources (StatefulSet, Service, ConfigMap, Secret, PVC)
✅ Initialize MongoDB with flexible schema
✅ No conflicts with old namespace

---

## Option 2: Migration with Data Preservation

If you have existing data in `movies-db` that you want to migrate:

### Step 1: Backup Existing Data
```bash
# Port-forward to MongoDB in old namespace
oc port-forward -n content-db svc/mongodb-service 27017:27017

# In another terminal, backup the data
mongodump --uri="mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/contentdb" \
  --out=/tmp/mongodb-backup

# Verify backup
ls -lh /tmp/mongodb-backup/contentdb/
```

### Step 2: Deploy New Application
```bash
# Apply the new ArgoCD application (creates content-db namespace)
oc apply -f argocd/application.yaml

# Wait for MongoDB to be ready
oc wait --for=condition=ready pod -l app=mongodb -n content-db --timeout=300s
```

### Step 3: Restore and Transform Data
```bash
# Port-forward to new MongoDB
oc port-forward -n content-db svc/mongodb-service 27017:27017

# In another terminal, restore to new database
mongorestore --uri="mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017" \
  --nsFrom="contentdb.content_001" \
  --nsTo="contentdb.content_001_temp" \
  /tmp/mongodb-backup

# Connect to MongoDB and transform data
mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/contentdb"
```

### Step 4: Transform Data Schema (in mongosh)
```javascript
// Transform old schema to new flexible schema
db.content_001_temp.find().forEach(function(doc) {
  // Create new document with flexible schema
  var newDoc = {
    contentType: "001",  // Movies
    contentSubtype: doc.genre ? doc.genre.map(g => {
      // Map genre names to codes (you'll need to create this mapping)
      var genreMap = {
        "Action": "001", "Drama": "002", "Comedy": "003",
        "Romance": "004", "Thriller": "005", "Horror": "006",
        "Sci-Fi": "007", "Crime": "008"
      };
      return genreMap[g] || "001";
    }) : [],
    title: doc.movieName,
    year: doc.year,
    creators: doc.director ? [doc.director] : [],
    contributors: [],
    language: doc.movieLanguage,
    releaseDate: doc.releaseDate,
    rating: doc.rating,
    platforms: doc.ottPlatforms || [],
    links: doc.links || [],
    details: {
      runtime: doc.runtime,
      songs: doc.songs || [],
      boxOffice: doc.boxOffice
    },
    metadata: doc.metadata || {}
  };
  
  // Add actors and actresses as contributors
  if (doc.actors) {
    doc.actors.forEach(function(actor) {
      newDoc.contributors.push({ name: actor, role: "actor" });
    });
  }
  if (doc.actresses) {
    doc.actresses.forEach(function(actress) {
      newDoc.contributors.push({ name: actress, role: "actress" });
    });
  }
  
  // Insert into new collection
  db.content_001.insertOne(newDoc);
});

// Verify migration
print("Old collection count: " + db.content_001_temp.countDocuments());
print("New collection count: " + db.content_001.countDocuments());

// If counts match, drop temp collection
db.content_001_temp.drop();
```

### Step 5: Clean Up Old Namespace
```bash
# Once data is migrated and verified, delete old namespace
oc delete namespace content-db
```

---

## Option 3: Parallel Deployment (Zero Downtime)

Run both namespaces in parallel during migration:

### Step 1: Deploy New Application
```bash
# Deploy new content-db namespace (old movies-db remains running)
oc apply -f argocd/application.yaml

# Both namespaces now exist:
oc get namespaces | grep -E "content-db"
```

### Step 2: Migrate Data (as in Option 2)
Follow Step 3 and 4 from Option 2 above.

### Step 3: Update Application to Use New Namespace
Update your application configuration to point to:
- Service: `mongodb-service.content-db.svc.cluster.local`
- Database: `contentdb`
- Collection: `content_001`

### Step 4: Verify and Clean Up
```bash
# After verifying application works with new namespace
oc delete namespace content-db
```

---

## ArgoCD Behavior

### What ArgoCD Will Handle Automatically:
✅ **Create new namespace** (`content-db`)
✅ **Deploy all resources** in new namespace
✅ **Update resources** if you modify manifests
✅ **Prune resources** that are removed from Git (within same namespace)

### What ArgoCD Will NOT Handle:
❌ **Delete old namespace** (`movies-db`) - You must do this manually
❌ **Migrate data** between namespaces - You must do this manually
❌ **Clean up resources** in different namespace - ArgoCD only manages `content-db`

### ArgoCD Sync Policy:
```yaml
syncPolicy:
  automated:
    prune: true        # Deletes resources removed from Git
    selfHeal: true     # Corrects manual changes
```

**Important:** `prune: true` only affects resources **within the managed namespace** (`content-db`). It will NOT touch `movies-db`.

---

## Cleanup Commands Reference

### Check What Exists
```bash
# List all namespaces
oc get namespaces

# Check resources in old namespace
oc get all -n content-db

# Check resources in new namespace
oc get all -n content-db

# Check PVCs (these persist after pod deletion)
oc get pvc -n content-db
oc get pvc -n content-db
```

### Manual Cleanup (if needed)
```bash
# Delete specific resources in old namespace
oc delete statefulset mongodb -n content-db
oc delete service mongodb-service -n content-db
oc delete configmap mongodb-init-scripts -n content-db
oc delete secret mongodb-secret -n content-db
oc delete pvc mongodb-pvc -n content-db

# Or delete entire namespace (deletes everything)
oc delete namespace content-db
```

### Verify Cleanup
```bash
# Should return "NotFound"
oc get namespace content-db

# New namespace should be running
oc get pods -n content-db
oc get svc -n content-db
```

---

## Recommended Approach

### For Production:
1. **Backup data** from `movies-db`
2. **Deploy** new `content-db` namespace via ArgoCD
3. **Migrate data** using transformation script
4. **Test thoroughly** in new namespace
5. **Update applications** to use new namespace
6. **Delete** old `movies-db` namespace after verification

### For Development/Testing:
1. **Delete** old `movies-db` namespace
2. **Deploy** new `content-db` namespace via ArgoCD
3. **Start fresh** with new flexible schema

---

## Troubleshooting

### Issue: PVC Already Exists
```bash
# If PVC name conflicts, delete old PVC
oc delete pvc mongodb-pvc -n content-db

# Or use different PVC name in new namespace (already done - same name is OK in different namespace)
```

### Issue: ArgoCD Shows Out of Sync
```bash
# Force sync
argocd app sync mongodb-content-app --force

# Or via UI: Click "Sync" → "Synchronize"
```

### Issue: MongoDB Pod Not Starting
```bash
# Check pod logs
oc logs -n content-db -l app=mongodb

# Check events
oc get events -n content-db --sort-by='.lastTimestamp'

# Check PVC status
oc get pvc -n content-db
```

---

## Summary

**You Need to Manually:**
1. ✅ Delete old `movies-db` namespace (if you want to clean up)
2. ✅ Backup and migrate data (if you want to preserve it)
3. ✅ Update application configurations to use new namespace

**ArgoCD Will Automatically:**
1. ✅ Create new `content-db` namespace
2. ✅ Deploy all resources in new namespace
3. ✅ Keep new namespace in sync with Git
4. ✅ Prune/update resources within `content-db` namespace

**ArgoCD Will NOT:**
1. ❌ Touch the old `movies-db` namespace
2. ❌ Migrate data between namespaces
3. ❌ Delete resources outside its managed namespace

---

## Quick Start Commands

### Clean Start (No Data Migration)
```bash
# 1. Delete old namespace
oc delete namespace content-db

# 2. Deploy via ArgoCD
oc apply -f argocd/application.yaml

# 3. Verify
oc get pods -n content-db -w
```

### With Data Migration
```bash
# 1. Backup
mongodump --uri="mongodb://admin:PASSWORD@localhost:27017/contentdb" --out=/tmp/backup

# 2. Deploy new
oc apply -f argocd/application.yaml

# 3. Restore and transform (see Step 3-4 in Option 2)

# 4. Clean up old
oc delete namespace content-db
```

---

Made with Bob