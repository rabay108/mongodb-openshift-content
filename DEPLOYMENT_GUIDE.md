# MongoDB OpenShift Deployment Guide with ArgoCD

Complete step-by-step instructions for deploying the MongoDB Content Database on OpenShift 4.20 using ArgoCD GitOps.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Step 1: GitHub Repository Setup](#step-1-github-repository-setup)
- [Step 2: Install OpenShift GitOps Operator](#step-2-install-openshift-gitops-operator)
- [Step 3: Deploy ArgoCD Project](#step-3-deploy-argocd-project)
- [Step 4: Deploy ArgoCD Application](#step-4-deploy-argocd-application)
- [Step 5: Verify MongoDB Deployment](#step-5-verify-mongodb-deployment)
- [Step 6: Verify Database Initialization](#step-6-verify-database-initialization)
- [Step 7: Access MongoDB](#step-7-access-mongodb)
- [Troubleshooting](#troubleshooting)
- [Cleanup Instructions](#cleanup-instructions)

---

## 🎯 Overview

This guide walks you through deploying a production-ready MongoDB database with:

- **Database**: `moviesdb` with movies collection
- **MongoDB Version**: 7.0
- **Storage**: 10Gi persistent volume
- **Sample Data**: 10 pre-loaded movies with schema validation
- **Deployment Method**: GitOps using ArgoCD
- **Target Namespace**: `movies-db`

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenShift Cluster                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         openshift-gitops namespace                  │    │
│  │                                                     │    │
│  │  ┌──────────────────┐    ┌──────────────────┐    │    │
│  │  │  AppProject      │    │  Application     │    │    │
│  │  │  mongodb-content │───▶│mongodb-content-app│   │    │
│  │  └──────────────────┘    └──────────────────┘    │    │
│  │                                   │                │    │
│  └───────────────────────────────────┼────────────────┘    │
│                                      │                      │
│                                      ▼                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │            movies-db namespace                      │    │
│  │                                                     │    │
│  │  ┌──────────┐  ┌─────────┐  ┌────────────────┐   │    │
│  │  │ Secret   │  │ConfigMap│  │      PVC       │   │    │
│  │  └──────────┘  └─────────┘  └────────────────┘   │    │
│  │                                                     │    │
│  │  ┌────────────────────────────────────────────┐   │    │
│  │  │         StatefulSet (MongoDB)              │   │    │
│  │  │  ┌──────────────────────────────────┐     │   │    │
│  │  │  │  Pod: mongodb-0                  │     │   │    │
│  │  │  │  - Init Container (scripts)      │     │   │    │
│  │  │  │  - MongoDB Container             │     │   │    │
│  │  │  └──────────────────────────────────┘     │   │    │
│  │  └────────────────────────────────────────────┘   │    │
│  │                                                     │    │
│  │  ┌────────────────────────────────────────────┐   │    │
│  │  │      Service: mongodb-service              │   │    │
│  │  └────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │ Git Sync
                          │
                ┌─────────┴─────────┐
                │   GitHub Repo     │
                │   rabay108/       │
                │   mongodb-        │
                │   openshift-      │
                │   content         │
                └───────────────────┘
```

---

## 📦 Prerequisites

Before starting, ensure you have the following:

### 1. OpenShift Cluster Access

You need access to an OpenShift 4.20 cluster with cluster-admin privileges.

```bash
# Verify cluster access
oc whoami

# Check OpenShift version
oc version

# Expected output should show OpenShift 4.20.x
```

**Expected Output:**
```
Client Version: 4.20.x
Kubernetes Version: v1.27.x
Server Version: 4.20.x
```

### 2. Required Tools

Install and configure the following tools:

- **OpenShift CLI (`oc`)**: Version 4.20 or compatible
  ```bash
  # Verify oc installation
  oc version --client
  ```

- **Git CLI**: For repository operations
  ```bash
  # Verify git installation
  git --version
  ```

### 3. GitHub Account

- GitHub username: `rabay108`
- Repository will be created at: `https://github.com/rabay108/mongodb-openshift-content`
- Ensure you have permissions to create repositories

### 4. Cluster Resources

Verify your cluster has sufficient resources:

- **CPU**: At least 1 core available
- **Memory**: At least 2Gi available
- **Storage**: At least 10Gi available for PVC

```bash
# Check node resources
oc describe nodes | grep -A 5 "Allocated resources"
```

### 5. Required Permissions

You need the following permissions:
- ✅ Cluster admin access to install OpenShift GitOps operator
- ✅ Ability to create projects/namespaces
- ✅ Ability to create ArgoCD AppProjects and Applications
- ✅ Ability to create PVCs and StatefulSets

---

## 🔧 Step 1: GitHub Repository Setup

### 1.1 Create GitHub Repository

1. **Log in to GitHub** with username `rabay108`

2. **Create a new repository**:
   - Navigate to: https://github.com/new
   - **Repository name**: `mongodb-openshift-content`
   - **Description**: "MongoDB Content Database deployment for OpenShift with GitOps"
   - **Visibility**: Public (recommended) or Private
   - **Important**: Do NOT initialize with README, .gitignore, or license
   - Click **"Create repository"**

### 1.2 Initialize Local Git Repository

Navigate to your project directory and initialize git:

```bash
# Navigate to the project directory
cd mongodb-openshift-content

# Initialize git repository (if not already initialized)
git init

# Check current status
git status
```

### 1.3 Add and Commit Files

```bash
# Add all project files
git add .

# Verify files to be committed
git status

# Commit the files with a descriptive message
git commit -m "Initial commit: MongoDB Content Database with ArgoCD configuration"
```

**Expected Output:**
```
[main (root-commit) abc1234] Initial commit: MongoDB Content Database with ArgoCD configuration
 XX files changed, XXXX insertions(+)
 create mode 100644 README.md
 create mode 100644 configmap.yaml
 ...
```

### 1.4 Add Remote and Push to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/rabay108/mongodb-openshift-content.git

# Verify remote is added
git remote -v

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**Expected Output:**
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
...
To https://github.com/rabay108/mongodb-openshift-content.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### 1.5 Verify Repository Contents

Visit https://github.com/rabay108/mongodb-openshift-content and verify the following structure:

```
mongodb-openshift-content/
├── README.md
├── DEPLOYMENT_GUIDE.md
├── configmap.yaml
├── argocd/
│   ├── application.yaml
│   ├── project.yaml
│   └── README.md
├── k8s/
│   ├── namespace.yaml
│   ├── secret.yaml
│   ├── persistentvolumeclaim.yaml
│   ├── service.yaml
│   └── statefulset.yaml
└── init/
    ├── init-schema.js
    └── sample-data.js
```

✅ **Checkpoint**: Confirm all files are visible in the GitHub repository before proceeding.

---

## 🚀 Step 2: Install OpenShift GitOps Operator

### 2.1 Install via OpenShift Web Console (Recommended)

1. **Access OpenShift Web Console**
   - Open your OpenShift cluster URL in a browser
   - Log in with your cluster-admin credentials

2. **Navigate to OperatorHub**
   - Click on **"Operators"** in the left navigation menu
   - Select **"OperatorHub"**

3. **Search for OpenShift GitOps**
   - In the search box, type: `OpenShift GitOps`
   - Click on **"Red Hat OpenShift GitOps"** tile

4. **Install the Operator**
   - Click **"Install"** button
   - Configure installation settings:
     - **Update channel**: `latest`
     - **Installation mode**: `All namespaces on the cluster (default)`
     - **Installed Namespace**: `openshift-gitops`
     - **Update approval**: `Automatic`
   - Click **"Install"**

5. **Wait for Installation**
   - Installation typically takes 2-3 minutes
   - Status will change from "Installing" to "Succeeded"

### 2.2 Install via CLI (Alternative Method)

If you prefer CLI installation:

```bash
# Create subscription for OpenShift GitOps operator
cat <<EOF | oc apply -f -
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: openshift-gitops-operator
  namespace: openshift-operators
spec:
  channel: latest
  name: openshift-gitops-operator
  source: redhat-operators
  sourceNamespace: openshift-marketplace
EOF
```

**Expected Output:**
```
subscription.operators.coreos.com/openshift-gitops-operator created
```

### 2.3 Verify Operator Installation

```bash
# Check if operator is installed
oc get csv -n openshift-operators | grep gitops

# Check operator pod status
oc get pods -n openshift-operators | grep gitops
```

**Expected Output:**
```
openshift-gitops-operator.v1.x.x   Red Hat OpenShift GitOps   1.x.x   Succeeded

NAME                                                    READY   STATUS    RESTARTS   AGE
openshift-gitops-operator-controller-manager-xxxxx     2/2     Running   0          2m
```

### 2.4 Verify ArgoCD Instance Creation

The operator automatically creates an ArgoCD instance in the `openshift-gitops` namespace:

```bash
# Check if ArgoCD instance is created
oc get argocd -n openshift-gitops

# Check ArgoCD pods
oc get pods -n openshift-gitops
```

**Expected Output:**
```
NAME                 AGE
openshift-gitops     3m

NAME                                                          READY   STATUS    RESTARTS   AGE
openshift-gitops-application-controller-0                     1/1     Running   0          3m
openshift-gitops-applicationset-controller-xxxxx              1/1     Running   0          3m
openshift-gitops-dex-server-xxxxx                            1/1     Running   0          3m
openshift-gitops-redis-xxxxx                                 1/1     Running   0          3m
openshift-gitops-repo-server-xxxxx                           1/1     Running   0          3m
openshift-gitops-server-xxxxx                                1/1     Running   0          3m
```

### 2.5 Wait for All Pods to be Ready

```bash
# Wait for all pods to be ready (timeout: 5 minutes)
oc wait --for=condition=ready pod --all -n openshift-gitops --timeout=300s
```

**Expected Output:**
```
pod/openshift-gitops-application-controller-0 condition met
pod/openshift-gitops-applicationset-controller-xxxxx condition met
...
```

### 2.6 Get ArgoCD Admin Credentials

```bash
# Get ArgoCD route URL
ARGOCD_ROUTE=$(oc get route openshift-gitops-server -n openshift-gitops -o jsonpath='{.spec.host}')
echo "ArgoCD URL: https://$ARGOCD_ROUTE"

# Get admin password
ARGOCD_PASSWORD=$(oc get secret openshift-gitops-cluster -n openshift-gitops -o jsonpath='{.data.admin\.password}' | base64 -d)
echo "Admin Password: $ARGOCD_PASSWORD"
```

**Save these credentials** - you'll need them to access the ArgoCD UI.

### 2.7 Access ArgoCD UI

1. Open the ArgoCD URL in your browser: `https://<argocd-route>`
2. **Username**: `admin`
3. **Password**: Use the password from the previous step
4. Click **"Sign In"**

✅ **Checkpoint**: Confirm you can successfully log in to the ArgoCD UI before proceeding.

---

## 📥 Step 3: Deploy ArgoCD Project

The ArgoCD AppProject defines security policies, RBAC, and allowed resources for the MongoDB deployment.

### 3.1 Review Project Configuration

The [`argocd/project.yaml`](argocd/project.yaml) file contains:
- **Source repositories**: GitHub repository URL
- **Destinations**: `movies-db` namespace
- **Resource whitelists**: Allowed Kubernetes resources
- **RBAC roles**: Admin, developer, and read-only roles

### 3.2 Apply the AppProject

```bash
# Navigate to the argocd directory
cd mongodb-openshift-content/argocd

# Apply the AppProject manifest
oc apply -f project.yaml
```

**Expected Output:**
```
appproject.argoproj.io/mongodb-content created
```

### 3.3 Verify AppProject Creation

```bash
# Check if AppProject is created
oc get appproject mongodb-content -n openshift-gitops

# View detailed AppProject information
oc describe appproject mongodb-content -n openshift-gitops
```

**Expected Output:**
```
NAME              AGE
mongodb-content   10s
```

### 3.4 Verify RBAC Policies

```bash
# Check AppProject RBAC roles
oc get appproject mongodb-content -n openshift-gitops -o jsonpath='{.spec.roles}' | jq
```

**Expected Output:** Should show three roles: admin, developer, and readonly.

✅ **Checkpoint**: Confirm the AppProject is created successfully before proceeding.

---

## 🎯 Step 4: Deploy ArgoCD Application

The ArgoCD Application manifest tells ArgoCD how to deploy and manage the MongoDB resources.

### 4.1 Review Application Configuration

The [`argocd/application.yaml`](argocd/application.yaml) file contains:
- **Project reference**: `mongodb-content`
- **Source repository**: `https://github.com/rabay108/mongodb-openshift-content.git`
- **Target revision**: `main` branch
- **Path**: `k8s` directory
- **Destination**: `movies-db` namespace
- **Sync policy**: Automated with self-healing enabled

### 4.2 Apply the Application Manifest

```bash
# Apply the Application manifest
oc apply -f application.yaml
```

**Expected Output:**
```
application.argoproj.io/mongodb-content-app created
```

### 4.3 Verify Application Creation

```bash
# Check if Application is created
oc get application mongodb-content-app -n openshift-gitops

# View detailed Application information
oc describe application mongodb-content-app -n openshift-gitops
```

**Expected Output:**
```
NAME                  SYNC STATUS   HEALTH STATUS
mongodb-content-app   Synced        Healthy
```

### 4.4 Monitor Sync Progress

ArgoCD will automatically sync the application. Monitor the progress:

```bash
# Watch Application status (press Ctrl+C to stop)
oc get application mongodb-content-app -n openshift-gitops -w

# Check sync status
oc get application mongodb-content-app -n openshift-gitops -o jsonpath='{.status.sync.status}'
echo

# Check health status
oc get application mongodb-content-app -n openshift-gitops -o jsonpath='{.status.health.status}'
echo
```

**Expected Output:**
```
Synced
Healthy
```

### 4.5 View Application in ArgoCD UI

1. Log in to ArgoCD UI
2. You should see the `mongodb-content-app` application card
3. Click on the application to view the resource tree
4. All resources should show as "Healthy" and "Synced"

**Application Tree View:**
```
mongodb-content-app
├── Namespace: movies-db
├── Secret: mongodb-secret
├── ConfigMap: mongodb-init-scripts
├── PersistentVolumeClaim: mongodb-pvc
├── Service: mongodb-service
└── StatefulSet: mongodb
    └── Pod: mongodb-0
```

✅ **Checkpoint**: Confirm the application shows "Synced" and "Healthy" status before proceeding.

---

## ✅ Step 5: Verify MongoDB Deployment

### 5.1 Check Namespace Creation

```bash
# Verify namespace exists
oc get namespace movies-db

# View namespace details
oc describe namespace movies-db
```

**Expected Output:**
```
NAME        STATUS   AGE
movies-db   Active   2m
```

### 5.2 Check All Resources

```bash
# List all resources in movies-db namespace
oc get all -n movies-db

# More detailed view
oc get all,pvc,secret,configmap -n movies-db
```

**Expected Output:**
```
NAME             READY   STATUS    RESTARTS   AGE
pod/mongodb-0    1/1     Running   0          2m

NAME                      TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)     AGE
service/mongodb-service   ClusterIP   172.30.xxx.xxx  <none>        27017/TCP   2m

NAME                       READY   AGE
statefulset.apps/mongodb   1/1     2m

NAME                                STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/mongodb-pvc   Bound    pvc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   10Gi       RWO            gp2            2m

NAME                             TYPE     DATA   AGE
secret/mongodb-secret            Opaque   2      2m

NAME                              DATA   AGE
configmap/mongodb-init-scripts    2      2m
```

### 5.3 Verify StatefulSet Status

```bash
# Check StatefulSet details
oc get statefulset mongodb -n movies-db

# View StatefulSet description
oc describe statefulset mongodb -n movies-db
```

**Expected Output:**
```
NAME      READY   AGE
mongodb   1/1     3m
```

### 5.4 Verify Pod Status

```bash
# Check pod status
oc get pods -n movies-db

# View pod details
oc describe pod mongodb-0 -n movies-db

# Check pod events
oc get events -n movies-db --sort-by='.lastTimestamp' | tail -20
```

**Expected Output:**
```
NAME        READY   STATUS    RESTARTS   AGE
mongodb-0   1/1     Running   0          3m
```

### 5.5 Verify Persistent Volume Claim

```bash
# Check PVC status
oc get pvc -n movies-db

# View PVC details
oc describe pvc mongodb-pvc -n movies-db
```

**Expected Output:**
```
NAME          STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
mongodb-pvc   Bound    pvc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   10Gi       RWO            gp2            3m
```

**Important**: PVC status must be "Bound" for MongoDB to start successfully.

### 5.6 Check MongoDB Logs

```bash
# View MongoDB container logs
oc logs -n movies-db mongodb-0 -c mongodb

# View init container logs (database initialization)
oc logs -n movies-db mongodb-0 -c init-scripts

# Follow logs in real-time (press Ctrl+C to stop)
oc logs -n movies-db mongodb-0 -c mongodb -f
```

**Expected Log Output (MongoDB):**
```
{"t":{"$date":"..."},"s":"I",  "c":"NETWORK",  "id":23015,   "ctx":"listener","msg":"Listening on","attr":{"address":"0.0.0.0"}}
{"t":{"$date":"..."},"s":"I",  "c":"NETWORK",  "id":23016,   "ctx":"listener","msg":"Waiting for connections","attr":{"port":27017}}
```

**Expected Log Output (Init Scripts):**
```
========================================
Starting MongoDB Movies Database Initialization
========================================
Creating movies collection with schema validation...
Movies collection created successfully with schema validation
Creating indexes for optimized queries...
...
Initialization Complete!
========================================
```

### 5.7 Wait for Pod to be Ready

```bash
# Wait for pod to be ready (timeout: 5 minutes)
oc wait --for=condition=ready pod -l app=mongodb -n movies-db --timeout=300s
```

**Expected Output:**
```
pod/mongodb-0 condition met
```

✅ **Checkpoint**: Confirm the MongoDB pod is running and all resources are healthy before proceeding.

---

## 🔍 Step 6: Verify Database Initialization

### 6.1 Connect to MongoDB Pod

```bash
# Execute mongosh inside the pod
oc exec -it -n movies-db mongodb-0 -- mongosh -u admin -p 'M0ng0DB$ecur3P@ssw0rd2024!' --authenticationDatabase admin
```

**Expected Output:**
```
Current Mongosh Log ID: xxxxxxxxxxxxxxxxxxxxxxxxxx
Connecting to:          mongodb://<credentials>@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin&appName=mongosh+2.x.x
Using MongoDB:          7.0.x
Using Mongosh:          2.x.x

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

test>
```

### 6.2 Verify Database Exists

Inside the mongosh shell:

```javascript
// List all databases
show dbs

// Switch to moviesdb
use moviesdb

// Show collections
show collections
```

**Expected Output:**
```
admin     100.00 KiB
config    108.00 KiB
local      72.00 KiB
moviesdb  200.00 KiB

switched to db moviesdb

movies
```

### 6.3 Verify Collection and Document Count

```javascript
// Count documents in movies collection
db.movies.countDocuments()

// View collection stats
db.movies.stats()
```

**Expected Output:**
```
10

{
  ns: 'moviesdb.movies',
  size: xxxxx,
  count: 10,
  ...
}
```

### 6.4 Verify Indexes

```javascript
// List all indexes
db.movies.getIndexes()
```

**Expected Output:** Should show 6 indexes (including the default `_id` index):
1. `_id_` (default)
2. `idx_movieName`
3. `idx_year`
4. `idx_songs_singer`
5. `idx_year_movieName`
6. `idx_text_search`

### 6.5 Query Sample Data

```javascript
// Find all movies
db.movies.find().pretty()

// Find movies with rating > 8.5
db.movies.find(
  { rating: { $gt: 8.5 } },
  { movieName: 1, year: 1, rating: 1, _id: 0 }
)

// Find movies by year
db.movies.find({ year: 1994 }, { movieName: 1, year: 1 })

// Find movies by actor
db.movies.find({ actors: "Aamir Khan" }, { movieName: 1, year: 1 })
```

**Expected Output (movies with rating > 8.5):**
```
[
  { movieName: 'The Shawshank Redemption', year: 1994, rating: 9.3 },
  { movieName: 'The Godfather', year: 1972, rating: 9.2 },
  { movieName: 'Inception', year: 2010, rating: 8.8 },
  { movieName: 'Pulp Fiction', year: 1994, rating: 8.9 },
  { movieName: 'The Dark Knight', year: 2008, rating: 9 }
]
```

### 6.6 Test Full-Text Search

```javascript
// Search for movies with "Nolan" in movieName, director, or actors
db.movies.find({ $text: { $search: "Nolan" } }, { movieName: 1, director: 1 })
```

**Expected Output:**
```
[
  { _id: ObjectId('...'), movieName: 'Inception', director: 'Christopher Nolan' },
  { _id: ObjectId('...'), movieName: 'The Dark Knight', director: 'Christopher Nolan' }
]
```

### 6.7 Exit MongoDB Shell

```javascript
// Exit mongosh
exit
```

✅ **Checkpoint**: Confirm the database has 10 movies and all indexes are created before proceeding.

---

## 🔐 Step 7: Access MongoDB

### 7.1 Default Credentials

The MongoDB instance is configured with the following credentials:

- **Username**: `admin`
- **Password**: `M0ng0DB$ecur3P@ssw0rd2024!`
- **Database**: `moviesdb`
- **Port**: `27017`
- **Authentication Database**: `admin`

⚠️ **Security Note**: Change the default password for production deployments. See [Troubleshooting](#change-mongodb-password) section.

### 7.2 Internal Cluster Access

From within the OpenShift cluster, applications can connect using:

**Service Name**: `mongodb-service.movies-db.svc.cluster.local`

**Connection String**:
```
mongodb://admin:M0ng0DB$ecur3P@ssw0rd2024!@mongodb-service.movies-db.svc.cluster.local:27017/moviesdb?authSource=admin
```

**Example: Connect from another pod**:
```bash
# Deploy a test pod
oc run mongodb-client --image=mongo:7.0 -n movies-db --rm -it --restart=Never -- \
  mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@mongodb-service.movies-db.svc.cluster.local:27017/moviesdb?authSource=admin"
```

### 7.3 External Access via Port Forward (For Testing)

For local development and testing, you can use port forwarding:

```bash
# Forward local port 27017 to MongoDB service
oc port-forward -n movies-db svc/mongodb-service 27017:27017
```

**Expected Output:**
```
Forwarding from 127.0.0.1:27017 -> 27017
Forwarding from [::1]:27017 -> 27017
```

**In another terminal**, connect using mongosh:

```bash
# Connect to MongoDB via port forward
mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/moviesdb?authSource=admin"
```

**Or using MongoDB Compass**:
- Connection String: `mongodb://admin:M0ng0DB$ecur3P@ssw0rd2024!@localhost:27017/moviesdb?authSource=admin`

### 7.4 Connection Examples

**Python (pymongo)**:
```python
from pymongo import MongoClient

client = MongoClient(
    "mongodb://admin:M0ng0DB$ecur3P@ssw0rd2024!@mongodb-service.movies-db.svc.cluster.local:27017/moviesdb?authSource=admin"
)
db = client.moviesdb
movies = db.movies.find({"rating": {"$gt": 8.5}})
for movie in movies:
    print(movie["movieName"], movie["rating"])
```

**Node.js (mongodb)**:
```javascript
const { MongoClient } = require('mongodb');

const uri = "mongodb://admin:M0ng0DB$ecur3P@ssw0rd2024!@mongodb-service.movies-db.svc.cluster.local:27017/moviesdb?authSource=admin";
const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const database = client.db('moviesdb');
  const movies = database.collection('movies');
  const query = { rating: { $gt: 8.5 } };
  const cursor = movies.find(query);
  await cursor.forEach(console.log);
}
run().catch(console.dir);
```

**Java (MongoDB Driver)**:
```java
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;

String uri = "mongodb://admin:M0ng0DB$ecur3P@ssw0rd2024!@mongodb-service.movies-db.svc.cluster.local:27017/moviesdb?authSource=admin";
MongoClient mongoClient = MongoClients.create(uri);
MongoDatabase database = mongoClient.getDatabase("moviesdb");
```

✅ **Checkpoint**: Confirm you can successfully connect to MongoDB using at least one method.

---

## 🐛 Troubleshooting

### Application Not Syncing

**Problem**: ArgoCD Application shows "OutOfSync" status

**Diagnosis**:
```bash
# Check Application status
oc describe application mongodb-content-app -n openshift-gitops

# Check for sync errors
oc get application mongodb-content-app -n openshift-gitops -o jsonpath='{.status.conditions}' | jq

# View ArgoCD application controller logs
oc logs -n openshift-gitops -l app.kubernetes.io/name=argocd-application-controller --tail=50
```

**Solutions**:

1. **Verify GitHub repository is accessible**:
   ```bash
   git ls-remote https://github.com/rabay108/mongodb-openshift-content.git
   ```

2. **Force refresh and sync**:
   ```bash
   # Via CLI
   oc patch application mongodb-content-app -n openshift-gitops --type merge -p '{"operation":{"initiatedBy":{"username":"admin"},"sync":{"revision":"main"}}}'
   ```

3. **Via ArgoCD UI**:
   - Click on `mongodb-content-app`
   - Click **"REFRESH"** button
   - Click **"SYNC"** button
   - Select **"SYNCHRONIZE"**

### Application Health Degraded

**Problem**: Application shows "Degraded" or "Progressing" health status

**Diagnosis**:
```bash
# Check pod status
oc get pods -n movies-db

# Check pod events
oc describe pod mongodb-0 -n movies-db

# Check pod logs
oc logs -n movies-db mongodb-0 -c mongodb --tail=100
oc logs -n movies-db mongodb-0 -c init-scripts
```

**Common Issues and Solutions**:

1. **PVC Not Bound**:
   ```bash
   # Check PVC status
   oc get pvc -n movies-db
   oc describe pvc mongodb-pvc -n movies-db
   
   # Check available storage classes
   oc get storageclass
   
   # If needed, update persistentvolumeclaim.yaml with correct storageClassName
   ```

2. **Insufficient Resources**:
   ```bash
   # Check node resources
   oc describe nodes | grep -A 5 "Allocated resources"
   
   # Check pod resource requests
   oc describe pod mongodb-0 -n movies-db | grep -A 10 "Requests"
   ```

3. **Image Pull Issues**:
   ```bash
   # Check image pull status
   oc get events -n movies-db | grep -i pull
   
   # Verify image exists
   oc describe pod mongodb-0 -n movies-db | grep -i image
   ```

### MongoDB Pod Not Starting

**Problem**: Pod is in CrashLoopBackOff, Error, or Pending state

**Diagnosis**:
```bash
# Check pod status
oc get pod mongodb-0 -n movies-db

# View pod events
oc get events -n movies-db --sort-by='.lastTimestamp' | grep mongodb-0

# Check pod logs
oc logs -n movies-db mongodb-0 -c mongodb
oc logs -n movies-db mongodb-0 -c init-scripts --previous
```

**Solutions**:

1. **Check Init Container Logs**:
   ```bash
   oc logs -n movies-db mongodb-0 -c init-scripts
   ```

2. **Verify Secret Exists**:
   ```bash
   oc get secret mongodb-secret -n movies-db
   oc describe secret mongodb-secret -n movies-db
   ```

3. **Verify ConfigMap Exists**:
   ```bash
   oc get configmap mongodb-init-scripts -n movies-db
   oc describe configmap mongodb-init-scripts -n movies-db
   ```

4. **Restart Pod**:
   ```bash
   # Delete pod (StatefulSet will recreate it)
   oc delete pod mongodb-0 -n movies-db
   
   # Wait for pod to be ready
   oc wait --for=condition=ready pod mongodb-0 -n movies-db --timeout=300s
   ```

### Cannot Connect to MongoDB

**Problem**: Unable to connect to MongoDB from applications or mongosh

**Diagnosis**:
```bash
# Verify service exists
oc get svc mongodb-service -n movies-db

# Check service endpoints
oc get endpoints mongodb-service -n movies-db

# Test connection from within the pod
oc exec -it -n movies-db mongodb-0 -- mongosh --eval "db.adminCommand('ping')"
```

**Solutions**:

1. **Verify Pod is Running**:
   ```bash
   oc get pods -n movies-db
   # Pod should be in "Running" state with "1/1" ready
   ```

2. **Test Connection with Correct Credentials**:
   ```bash
   # Get credentials from secret
   oc get secret mongodb-secret -n movies-db -o jsonpath='{.data.mongodb-root-username}' | base64 -d
   oc get secret mongodb-secret -n movies-db -o jsonpath='{.data.mongodb-root-password}' | base64 -d
   
   # Test connection
   oc exec -it -n movies-db mongodb-0 -- mongosh -u admin -p 'M0ng0DB$ecur3P@ssw0rd2024!' --authenticationDatabase admin --eval "db.adminCommand('ping')"
   ```

### Database Not Initialized

**Problem**: Database or collection doesn't exist, or no sample data

**Diagnosis**:
```bash
# Check init container logs
oc logs -n movies-db mongodb-0 -c init-scripts

# Connect to MongoDB and check
oc exec -it -n movies-db mongodb-0 -- mongosh -u admin -p 'M0ng0DB$ecur3P@ssw0rd2024!' --authenticationDatabase admin --eval "show dbs"
```

**Solutions**:

1. **Verify ConfigMap is Mounted**:
   ```bash
   # Check if scripts are mounted
   oc exec -it -n movies-db mongodb-0 -- ls -la /docker-entrypoint-initdb.d/
   ```

2. **Manually Run Initialization Scripts**:
   ```bash
   # Copy init scripts to pod
   oc exec -it -n movies-db mongodb-0 -- mongosh -u admin -p 'M0ng0DB$ecur3P@ssw0rd2024!' --authenticationDatabase admin moviesdb /docker-entrypoint-initdb.d/init-schema.js
   
   oc exec -it -n movies-db mongodb-0 -- mongosh -u admin -p 'M0ng0DB$ecur3P@ssw0rd2024!' --authenticationDatabase admin moviesdb /docker-entrypoint-initdb.d/sample-data.js
   ```

3. **Recreate Pod**:
   ```bash
   # Delete pod to trigger re-initialization
   oc delete pod mongodb-0 -n movies-db
   ```

### Change MongoDB Password

**Problem**: Need to change default MongoDB password for security

**Solution**:

```bash
# Generate a strong password
NEW_PASSWORD=$(openssl rand -base64 32)
echo "New Password: $NEW_PASSWORD"

# Update secret in Kubernetes
oc create secret generic mongodb-secret \
  --from-literal=mongodb-root-username=admin \
  --from-literal=mongodb-root-password="$NEW_PASSWORD" \
  --dry-run=client -o yaml | oc apply -f - -n movies-db

# Restart MongoDB pod to use new password
oc delete pod mongodb-0 -n movies-db

# Wait for pod to be ready
oc wait --for=condition=ready pod mongodb-0 -n movies-db --timeout=300s

# Update the secret in Git repository
echo -n "$NEW_PASSWORD" | base64
# Update the base64 encoded password in k8s/secret.yaml
# Commit and push changes to GitHub
```

### View Application Logs

**Useful commands for debugging**:

```bash
# ArgoCD application controller logs
oc logs -n openshift-gitops -l app.kubernetes.io/name=argocd-application-controller -f

# MongoDB logs
oc logs -n movies-db mongodb-0 -c mongodb -f

# Init container logs
oc logs -n movies-db mongodb-0 -c init-scripts

# All events in movies-db namespace
oc get events -n movies-db --sort-by='.lastTimestamp'

# Pod describe (shows events and status)
oc describe pod mongodb-0 -n movies-db
```

---

## 🧹 Cleanup Instructions

### Option 1: Delete via ArgoCD (Recommended)

This method removes all resources managed by ArgoCD:

```bash
# Delete Application (this will delete all deployed resources)
oc delete application mongodb-content-app -n openshift-gitops

# Verify namespace is deleted
oc get namespace movies-db
# Should return: Error from server (NotFound): namespaces "movies-db" not found

# Delete AppProject
oc delete appproject mongodb-content -n openshift-gitops
```

**Via ArgoCD UI**:
1. Log in to ArgoCD UI
2. Click on `mongodb-content-app`
3. Click **"DELETE"** button
4. Confirm deletion
5. Select **"Foreground"** deletion propagation
6. Click **"OK"**

### Option 2: Delete Namespace Directly

This method removes the namespace and all resources within it:

```bash
# Delete the entire namespace
oc delete namespace movies-db

# This will delete:
# - StatefulSet (mongodb)
# - Pod (mongodb-0)
# - Service (mongodb-service)
# - PVC (mongodb-pvc)
# - Secret (mongodb-secret)
# - ConfigMap (mongodb-init-scripts)

# Verify deletion
oc get namespace movies-db
```

### Option 3: Delete Individual Resources

If you want to keep the namespace but remove specific resources:

```bash
# Delete in reverse order of creation
oc delete statefulset mongodb -n movies-db
oc delete service mongodb-service -n movies-db
oc delete pvc mongodb-pvc -n movies-db
oc delete configmap mongodb-init-scripts -n movies-db
oc delete secret mongodb-secret -n movies-db

# Finally, delete namespace
oc delete namespace movies-db
```

### Cleanup ArgoCD Resources

```bash
# Delete Application
oc delete application mongodb-content-app -n openshift-gitops

# Delete AppProject
oc delete appproject mongodb-content -n openshift-gitops

# Verify cleanup
oc get application -n openshift-gitops | grep mongodb
oc get appproject -n openshift-gitops | grep mongodb
```

### Verify Complete Cleanup

```bash
# Check for any remaining resources
oc get all -n movies-db
oc get pvc -n movies-db
oc get secret -n movies-db
oc get configmap -n movies-db

# Check ArgoCD resources
oc get application -n openshift-gitops | grep mongodb
oc get appproject -n openshift-gitops | grep mongodb

# All commands should return "No resources found" or "NotFound" errors
```

---

## 📚 Additional Resources

### Documentation

- [OpenShift GitOps Documentation](https://docs.openshift.com/container-platform/4.20/cicd/gitops/understanding-openshift-gitops.html)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB on Kubernetes Best Practices](https://www.mongodb.com/kubernetes)
- [GitOps Principles](https://www.gitops.tech/)

### Project Files

- [`README.md`](README.md) - Project overview and manual deployment instructions
- [`argocd/README.md`](argocd/README.md) - Detailed ArgoCD configuration guide
- [`argocd/project.yaml`](argocd/project.yaml) - ArgoCD AppProject manifest
- [`argocd/application.yaml`](argocd/application.yaml) - ArgoCD Application manifest

### Useful Commands Reference

```bash
# ArgoCD
oc get application -n openshift-gitops
oc get appproject -n openshift-gitops
oc logs -n openshift-gitops -l app.kubernetes.io/name=argocd-application-controller

# MongoDB
oc get all -n movies-db
oc logs -n movies-db mongodb-0 -c mongodb
oc exec -it -n movies-db mongodb-0 -- mongosh -u admin -p 'M0ng0DB$ecur3P@ssw0rd2024!' --authenticationDatabase admin

# Debugging
oc describe pod mongodb-0 -n movies-db
oc get events -n movies-db --sort-by='.lastTimestamp'
oc port-forward -n movies-db svc/mongodb-service 27017:27017
```

---

## 🎉 Conclusion

You have successfully deployed MongoDB Content Database on OpenShift 4.20 using ArgoCD GitOps!

### What You've Accomplished

✅ Set up GitHub repository with Kubernetes manifests  
✅ Installed OpenShift GitOps operator  
✅ Created ArgoCD AppProject with RBAC policies  
✅ Deployed ArgoCD Application with automated sync  
✅ Deployed MongoDB with persistent storage  
✅ Initialized database with schema validation and indexes  
✅ Loaded 10 sample movies into the database  
✅ Verified all components are healthy and operational  

### Next Steps

1. **Change Default Password**: Update MongoDB credentials for production use
2. **Configure Backups**: Set up automated backup schedule
3. **Enable Monitoring**: Integrate with Prometheus/Grafana
4. **Add Network Policies**: Restrict network access to MongoDB
5. **Configure TLS**: Enable SSL/TLS for encrypted connections
6. **Scale Application**: Adjust resources based on workload

---

**Created**: 2026  
**OpenShift Version**: 4.20  
**ArgoCD Version**: Compatible with OpenShift GitOps  
**MongoDB Version**: 7.0  
**Author**: Bob (AI Assistant)