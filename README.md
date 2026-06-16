# MongoDB Content Database - OpenShift Deployment

A complete MongoDB deployment setup for OpenShift/Kubernetes with a pre-configured content database schema. This deployment includes schema validation, indexes, and sample data for a production-ready content database.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Deployment Steps](#deployment-steps)
- [Accessing MongoDB](#accessing-mongodb)
- [Verification](#verification)
- [Sample Queries](#sample-queries)
- [Extending the Schema](#extending-the-schema)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)
- [Security Considerations](#security-considerations)

## 🎯 Overview

This project provides a complete MongoDB deployment for OpenShift with:
- **Database**: `contentdb`
- **Collection**: `content_001`
- **MongoDB Version**: 7.0
- **Storage**: 10Gi persistent volume
- **Sample Data**: 10 pre-loaded content items

## ✨ Features

- ✅ **Schema Validation**: JSON Schema validation for data integrity
- ✅ **Optimized Indexes**: 5 indexes for fast queries
- ✅ **Persistent Storage**: 10Gi PVC for data persistence
- ✅ **Resource Management**: CPU and memory limits configured
- ✅ **Health Checks**: Liveness and readiness probes
- ✅ **Secure Authentication**: Secret-based credentials
- ✅ **Extensible Schema**: Metadata field for future additions
- ✅ **Sample Data**: 10 content items with complete information
- ✅ **Production Ready**: Best practices for OpenShift deployment

## 📦 Prerequisites

Before deploying, ensure you have:

1. **OpenShift/Kubernetes Cluster Access**
   ```bash
   # Verify cluster access
   oc whoami
   # or
   kubectl cluster-info
   ```

2. **Required Tools**
   - OpenShift CLI (`oc`) or kubectl
   - Access to create namespaces and resources
   - Sufficient cluster resources (1 CPU, 2Gi RAM, 10Gi storage)

3. **Permissions**
   - Ability to create namespaces
   - Ability to create PVCs
   - Ability to deploy StatefulSets

## 📁 Project Structure

```
mongodb-openshift-content/
├── k8s/                          # Kubernetes manifests
│   ├── namespace.yaml            # Namespace definition
│   ├── secret.yaml               # MongoDB credentials
│   ├── persistentvolumeclaim.yaml # Storage claim
│   ├── statefulset.yaml          # MongoDB StatefulSet
│   └── service.yaml              # Service definition
├── init/                         # Initialization scripts
│   ├── init-schema.js            # Schema and indexes
│   └── sample-data.js            # Sample movie data
├── configmap.yaml                # ConfigMap with init scripts
└── README.md                     # This file
```

## 🗄️ Database Schema

### Content Collection Schema

```javascript
{
  movieName: String (required),      // Movie title
  actors: [String],                  // Array of actor names
  actresses: [String],               // Array of actress names
  songs: [{                          // Array of song objects
    title: String (required),
    singer: String (required),
    duration: String (optional)
  }],
  year: Integer (required),          // Release year (1888-2100)
  director: String,                  // Director name
  genre: [String],                   // Array of genres
  language: String,                  // Primary language
  rating: Double,                    // Rating (0-10)
  boxOffice: {                       // Box office details
    budget: String,
    worldwide: String
  },
  metadata: Object                   // Extensible field for future additions
}
```

### Indexes

1. **idx_movieName**: Single field index on `movieName`
2. **idx_year**: Single field index on `year` (descending)
3. **idx_songs_singer**: Single field index on `songs.singer`
4. **idx_year_movieName**: Compound index on `year` and `movieName`
5. **idx_text_search**: Text index on `movieName`, `director`, `actors`, `actresses`

## 🚀 Deployment Steps

### Step 1: Clone or Download the Project

```bash
cd /path/to/your/workspace
# If you have the project files ready, navigate to the directory
cd mongodb-openshift-content
```

### Step 2: Deploy in Order

Deploy the resources in the following order:

```bash
# 1. Create namespace
oc apply -f k8s/namespace.yaml

# 2. Create secret (MongoDB credentials)
oc apply -f k8s/secret.yaml

# 3. Create ConfigMap (initialization scripts)
oc apply -f configmap.yaml

# 4. Create PersistentVolumeClaim (storage)
oc apply -f k8s/persistentvolumeclaim.yaml

# 5. Create Service
oc apply -f k8s/service.yaml

# 6. Create StatefulSet (MongoDB deployment)
oc apply -f k8s/statefulset.yaml
```

### Step 3: Verify Deployment

```bash
# Check if all resources are created
oc get all -n content-db

# Check pod status
oc get pods -n content-db

# Check PVC status
oc get pvc -n content-db

# Wait for pod to be ready (may take 1-2 minutes)
oc wait --for=condition=ready pod -l app=mongodb -n content-db --timeout=300s
```

### Alternative: Deploy All at Once

```bash
# Deploy all resources at once
oc apply -f k8s/namespace.yaml \
          -f k8s/secret.yaml \
          -f configmap.yaml \
          -f k8s/persistentvolumeclaim.yaml \
          -f k8s/service.yaml \
          -f k8s/statefulset.yaml
```

## 🔐 Accessing MongoDB

### Default Credentials

- **Username**: `admin`
- **Password**: `M0ng0DB$ecur3P@ssw0rd2024!`
- **Database**: `contentdb`
- **Port**: `27017`

### Method 1: Port Forward (Recommended for Testing)

```bash
# Forward local port 27017 to MongoDB service
oc port-forward -n content-db svc/mongodb-service 27017:27017

# In another terminal, connect using mongosh
mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/contentdb?authSource=admin"
```

### Method 2: From Within the Cluster

```bash
# Execute mongosh inside the pod
oc exec -it -n content-db mongodb-0 -- mongosh -u admin -p 'M0ng0DB$ecur3P@ssw0rd2024!' --authenticationDatabase admin contentdb
```

### Method 3: From Another Pod in the Cluster

Connection string:
```
mongodb://admin:M0ng0DB$ecur3P@ssw0rd2024!@mongodb-service.content-db.svc.cluster.local:27017/contentdb?authSource=admin
```

## ✅ Verification

### Check Pod Logs

```bash
# View initialization logs
oc logs -n content-db mongodb-0 -c init-scripts

# View MongoDB logs
oc logs -n content-db mongodb-0 -c mongodb

# Follow logs in real-time
oc logs -n content-db mongodb-0 -c mongodb -f
```

### Verify Database and Collection

```bash
# Connect to MongoDB
oc exec -it -n content-db mongodb-0 -- mongosh -u admin -p 'M0ng0DB$ecur3P@ssw0rd2024!' --authenticationDatabase admin

# Inside mongosh:
use contentdb
show collections
db.content_001.countDocuments()  // Should return 10
db.content_001.getIndexes()      // Should show 5 indexes
```

### Check Resource Usage

```bash
# Check pod resource usage
oc top pod -n content-db

# Check PVC usage
oc get pvc -n content-db
```

## 🔍 Sample Queries

### Basic Queries

```javascript
// Connect to the database
use contentdb

// 1. Find all content items
db.content_001.find().pretty()

// 2. Count total content items
db.content_001.countDocuments()

// 3. Find content by year
db.content_001.find({ year: 1994 })

// 4. Find content with rating > 8.5
db.content_001.find({ rating: { $gt: 8.5 } }, { movieName: 1, year: 1, rating: 1 })

// 5. Find content by actor
db.content_001.find({ actors: "Aamir Khan" }, { movieName: 1, year: 1 })

// 6. Find content by singer
db.content_001.find({ "songs.singer": /Kumar Sanu/ }, { movieName: 1, "songs.title": 1 })

// 7. Find content by genre
db.content_001.find({ genre: "Drama" }, { movieName: 1, genre: 1 })

// 8. Find content by director
db.content_001.find({ director: "Christopher Nolan" }, { movieName: 1, year: 1 })
```

### Advanced Queries

```javascript
// 1. Full-text search
db.content_001.find({ $text: { $search: "Nolan" } })

// 2. Content released after 2000 with high ratings
db.content_001.find({
  year: { $gte: 2000 },
  rating: { $gte: 8.0 }
}, { movieName: 1, year: 1, rating: 1 }).sort({ rating: -1 })

// 3. Aggregate: Content by year
db.content_001.aggregate([
  { $group: { _id: "$year", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])

// 4. Aggregate: Average rating by language
db.content_001.aggregate([
  { $group: { _id: "$language", avgRating: { $avg: "$rating" } } },
  { $sort: { avgRating: -1 } }
])

// 5. Find content with specific actor and actress
db.content_001.find({
  actors: "Aamir Khan",
  actresses: { $exists: true, $ne: [] }
}, { movieName: 1, actors: 1, actresses: 1 })

// 6. Content with more than 3 songs
db.content_001.find({
  $expr: { $gt: [{ $size: "$songs" }, 3] }
}, { movieName: 1, songs: 1 })

// 7. Project specific fields
db.content_001.find({}, {
  movieName: 1,
  year: 1,
  director: 1,
  rating: 1,
  _id: 0
}).sort({ rating: -1 })
```

### Update Operations

```javascript
// 1. Add a new field to a specific movie
db.content_001.updateOne(
  { movieName: "Inception" },
  { $set: { "metadata.sequels": [] } }
)

// 2. Add a new song to a content item
db.content_001.updateOne(
  { movieName: "Lagaan" },
  { $push: { songs: { title: "Ghanan Ghanan", singer: "Udit Narayan" } } }
)

// 3. Update rating
db.content_001.updateOne(
  { movieName: "The Godfather" },
  { $set: { rating: 9.3 } }
)
```

## 🔧 Extending the Schema

The schema is designed to be extensible using the `metadata` field. Here's how to add new properties:

### Example 1: Add Awards Information

```javascript
db.content_001.updateOne(
  { movieName: "Inception" },
  {
    $set: {
      "metadata.oscarWins": 4,
      "metadata.oscarNominations": 8,
      "metadata.goldenGlobeNominations": 3
    }
  }
)
```

### Example 2: Add Streaming Information

```javascript
db.content_001.updateMany(
  {},
  {
    $set: {
      "metadata.streaming": {
        platforms: ["Netflix", "Amazon Prime"],
        availableFrom: new Date("2024-01-01")
      }
    }
  }
)
```

### Example 3: Add Production Company

```javascript
db.content_001.updateOne(
  { movieName: "The Dark Knight" },
  {
    $set: {
      "metadata.productionCompany": "Warner Bros. Pictures",
      "metadata.distributor": "Warner Bros. Pictures"
    }
  }
)
```

### Adding New Top-Level Fields

If you need to add new top-level fields, update the schema validation:

```javascript
db.runCommand({
  collMod: "content_001",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["movieName", "year"],
      properties: {
        // ... existing properties ...
        newField: {
          bsonType: "string",
          description: "Description of new field"
        }
      }
    }
  }
})
```

## 🐛 Troubleshooting

### Pod Not Starting

```bash
# Check pod events
oc describe pod -n content-db mongodb-0

# Check pod logs
oc logs -n content-db mongodb-0 -c mongodb
oc logs -n content-db mongodb-0 -c init-scripts

# Check if PVC is bound
oc get pvc -n content-db
```

### PVC Pending

```bash
# Check PVC status
oc describe pvc -n content-db mongodb-pvc

# Check available storage classes
oc get storageclass

# If needed, specify a storage class in persistentvolumeclaim.yaml
# Uncomment and set: storageClassName: <your-storage-class>
```

### Cannot Connect to MongoDB

```bash
# Verify service is running
oc get svc -n content-db

# Check if pod is ready
oc get pods -n content-db

# Test connection from within the pod
oc exec -it -n content-db mongodb-0 -- mongosh --eval "db.adminCommand('ping')"

# Check secret is correctly created
oc get secret -n content-db mongodb-secret -o yaml
```

### Initialization Scripts Not Running

```bash
# Check init container logs
oc logs -n content-db mongodb-0 -c init-scripts

# Verify ConfigMap exists
oc get configmap -n content-db mongodb-init-scripts

# Check if scripts are mounted
oc exec -it -n content-db mongodb-0 -- ls -la /docker-entrypoint-initdb.d/
```

### Database Not Initialized

```bash
# Check if database exists
oc exec -it -n movies-db mongodb-0 -- mongosh -u admin -p 'M0ng0DB$ecur3P@ssw0rd2024!' --authenticationDatabase admin --eval "show dbs"

# Manually run initialization scripts
oc exec -it -n movies-db mongodb-0 -- mongosh -u admin -p 'M0ng0DB$ecur3P@ssw0rd2024!' --authenticationDatabase admin moviesdb < /docker-entrypoint-initdb.d/init-schema.js
```

### Resource Issues

```bash
# Check resource usage
oc top pod -n content-db

# Check resource limits
oc describe pod -n content-db mongodb-0 | grep -A 5 "Limits"

# If needed, adjust resources in statefulset.yaml
```

## 🔄 Maintenance

### Backup Database

```bash
# Create a backup using mongodump
oc exec -it -n movies-db mongodb-0 -- mongodump \
  --username=admin \
  --password='M0ng0DB$ecur3P@ssw0rd2024!' \
  --authenticationDatabase=admin \
  --db=moviesdb \
  --out=/tmp/backup

# Copy backup to local machine
oc cp movies-db/mongodb-0:/tmp/backup ./mongodb-backup
```

### Restore Database

```bash
# Copy backup to pod
oc cp ./mongodb-backup movies-db/mongodb-0:/tmp/restore

# Restore using mongorestore
oc exec -it -n movies-db mongodb-0 -- mongorestore \
  --username=admin \
  --password='M0ng0DB$ecur3P@ssw0rd2024!' \
  --authenticationDatabase=admin \
  --db=moviesdb \
  /tmp/restore/moviesdb
```

### Scale Down/Up

```bash
# Scale down (stop MongoDB)
oc scale statefulset mongodb -n movies-db --replicas=0

# Scale up (start MongoDB)
oc scale statefulset mongodb -n movies-db --replicas=1
```

### Update MongoDB Version

```bash
# Edit StatefulSet to change image version
oc edit statefulset mongodb -n movies-db

# Or use patch
oc patch statefulset mongodb -n movies-db -p '{"spec":{"template":{"spec":{"containers":[{"name":"mongodb","image":"mongo:7.0.5"}]}}}}'
```

### Clean Up

```bash
# Delete all resources
oc delete -f k8s/statefulset.yaml
oc delete -f k8s/service.yaml
oc delete -f k8s/persistentvolumeclaim.yaml
oc delete -f configmap.yaml
oc delete -f k8s/secret.yaml
oc delete -f k8s/namespace.yaml

# Or delete namespace (removes everything)
oc delete namespace content-db
```

## 🔒 Security Considerations

### Production Deployment Recommendations

1. **Change Default Password**
   ```bash
   # Generate a strong password
   openssl rand -base64 32
   
   # Update secret with new password (base64 encoded)
   oc edit secret mongodb-secret -n content-db
   ```

2. **Use Network Policies**
   - Restrict access to MongoDB service
   - Only allow specific pods/namespaces to connect

3. **Enable TLS/SSL**
   - Configure MongoDB with TLS certificates
   - Update connection strings to use SSL

4. **Regular Backups**
   - Set up automated backup schedule
   - Store backups in secure location

5. **Resource Limits**
   - Already configured in StatefulSet
   - Adjust based on your workload

6. **Pod Security**
   - StatefulSet runs as non-root user (UID 999)
   - Security context configured for OpenShift compatibility

7. **Secrets Management**
   - Consider using external secrets management (Vault, Sealed Secrets)
   - Rotate credentials regularly

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [OpenShift Documentation](https://docs.openshift.com/)
- [Kubernetes StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [MongoDB Schema Validation](https://docs.mongodb.com/manual/core/schema-validation/)

## 📝 License

This project is provided as-is for educational and deployment purposes.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

---

**Created**: 2026
**MongoDB Version**: 7.0
**Kubernetes/OpenShift Compatible**: Yes