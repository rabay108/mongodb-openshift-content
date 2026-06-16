# MongoDB Data Reload Scripts

This directory contains scripts to reload MongoDB data with the updated schema.

## Scripts

### 1. `reload-data-simple.sh` (Recommended)
Simple script that reloads data directly in the MongoDB pod.

**Usage:**
```bash
cd mongodb-openshift-content/scripts
chmod +x reload-data-simple.sh
./reload-data-simple.sh
```

**What it does:**
1. ✅ Backs up existing data to `movies_backup` collection
2. ✅ Drops the `movies` collection
3. ✅ Recreates collection with updated schema
4. ✅ Reloads sample data with new fields
5. ✅ Verifies the new fields are present

### 2. `reload-data.sh` (Advanced)
More detailed script with additional checks and verification.

**Usage:**
```bash
cd mongodb-openshift-content/scripts
chmod +x reload-data.sh
./reload-data.sh
```

## Prerequisites

- `kubectl` CLI installed and configured
- Access to the OpenShift/Kubernetes cluster
- MongoDB pod running in `movies-db` namespace
- Pod name: `mongodb-0`

## Manual Reload (Alternative)

If you prefer to reload data manually, follow these steps:

### Step 1: Connect to MongoDB Pod
```bash
kubectl exec -it mongodb-0 -n movies-db -- mongosh moviesdb
```

### Step 2: Backup Existing Data (Optional)
```javascript
db.movies.find().forEach(function(doc) {
  db.movies_backup.insertOne(doc);
});
```

### Step 3: Drop Collection
```javascript
db.movies.drop();
```

### Step 4: Exit and Reload Scripts
```bash
exit
kubectl exec mongodb-0 -n movies-db -- mongosh < /docker-entrypoint-initdb.d/init-schema.js
kubectl exec mongodb-0 -n movies-db -- mongosh < /docker-entrypoint-initdb.d/sample-data.js
```

### Step 5: Verify
```bash
kubectl exec mongodb-0 -n movies-db -- mongosh moviesdb --eval "db.movies.findOne()"
```

## After ArgoCD Sync

After ArgoCD syncs the updated ConfigMap:

1. **Wait for pod restart** (ArgoCD will trigger this automatically)
2. **New pods will run** the updated initialization scripts
3. **Data will be fresh** with all new fields

**OR** run the reload script immediately:
```bash
./reload-data-simple.sh
```

## Restore from Backup

If you need to restore the backup:

```bash
kubectl exec mongodb-0 -n movies-db -- mongosh moviesdb --eval "
  db.movies.drop();
  db.movies_backup.find().forEach(function(doc) {
    db.movies.insertOne(doc);
  });
"
```

## New Fields Added

The updated schema includes:

- ✅ `movieLanguage` (renamed from `language`)
- ✅ `releaseDate` (Date type)
- ✅ `ottPlatforms` (Array of platform objects)
- ✅ `links` (Array of link objects for trailers, songs, etc.)

## Troubleshooting

### Pod not found
```bash
# Check pod name
kubectl get pods -n movies-db

# If different name, update the scripts
```

### Permission denied
```bash
# Make scripts executable
chmod +x *.sh
```

### Connection issues
```bash
# Check pod status
kubectl get pod mongodb-0 -n movies-db
kubectl logs mongodb-0 -n movies-db
```

## Notes

- 🔒 **Backup is automatic** - Old data is saved to `movies_backup` collection
- 🔄 **Idempotent** - Safe to run multiple times
- ⚡ **Fast** - Takes only a few seconds to complete
- ✅ **Verified** - Automatically checks new fields after reload

---

**Made with Bob** 🤖