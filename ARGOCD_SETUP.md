# ArgoCD Setup Guide for OpenShift

This guide explains how to install and configure ArgoCD on your OpenShift cluster to deploy the MongoDB content database.

---

## Option 1: Using OpenShift GitOps Operator (Recommended)

OpenShift GitOps is Red Hat's supported ArgoCD distribution for OpenShift.

### Step 1: Install OpenShift GitOps Operator

#### Via OpenShift Web Console:
1. Log in to OpenShift Web Console
2. Navigate to **Operators** → **OperatorHub**
3. Search for **"Red Hat OpenShift GitOps"**
4. Click **Install**
5. Select:
   - **Update Channel**: `latest` or `stable`
   - **Installation Mode**: `All namespaces on the cluster`
   - **Installed Namespace**: `openshift-gitops`
6. Click **Install**
7. Wait for installation to complete (Status: Succeeded)

#### Via CLI:
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

# Wait for operator to be ready
oc get csv -n openshift-operators | grep gitops

# Verify installation
oc get pods -n openshift-gitops
```

### Step 2: Access ArgoCD

```bash
# Get ArgoCD route
oc get route openshift-gitops-server -n openshift-gitops

# Get admin password
oc extract secret/openshift-gitops-cluster -n openshift-gitops --to=-

# Or get password directly
oc get secret openshift-gitops-cluster -n openshift-gitops -o jsonpath='{.data.admin\.password}' | base64 -d
```

### Step 3: Login to ArgoCD

```bash
# Get ArgoCD server URL
ARGOCD_SERVER=$(oc get route openshift-gitops-server -n openshift-gitops -o jsonpath='{.spec.host}')

# Get admin password
ARGOCD_PASSWORD=$(oc get secret openshift-gitops-cluster -n openshift-gitops -o jsonpath='{.data.admin\.password}' | base64 -d)

# Login via CLI
argocd login $ARGOCD_SERVER --username admin --password $ARGOCD_PASSWORD --insecure

# Or access via browser
echo "ArgoCD URL: https://$ARGOCD_SERVER"
echo "Username: admin"
echo "Password: $ARGOCD_PASSWORD"
```

---

## Option 2: Manual ArgoCD Installation

If you prefer vanilla ArgoCD instead of OpenShift GitOps:

### Step 1: Install ArgoCD

```bash
# Create namespace
oc create namespace argocd

# Install ArgoCD
oc apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods to be ready
oc wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s
```

### Step 2: Expose ArgoCD Server

```bash
# Create route for ArgoCD server
oc create route passthrough argocd-server --service=argocd-server --port=https -n argocd

# Get route URL
oc get route argocd-server -n argocd
```

### Step 3: Get Admin Password

```bash
# Get initial admin password
oc get secret argocd-initial-admin-secret -n argocd -o jsonpath='{.data.password}' | base64 -d
```

---

## Option 3: Deploy Without ArgoCD (Direct kubectl/oc)

If you don't want to use ArgoCD, you can deploy directly:

### Step 1: Delete Old Namespace (if exists)
```bash
oc delete namespace content-db
```

### Step 2: Apply Kubernetes Manifests Directly
```bash
# Navigate to project directory
cd mongodb-openshift-content

# Apply all manifests
oc apply -f k8s/namespace.yaml
oc apply -f k8s/secret.yaml
oc apply -f k8s/configmap.yaml
oc apply -f k8s/persistentvolumeclaim.yaml
oc apply -f k8s/service.yaml
oc apply -f k8s/statefulset.yaml

# Verify deployment
oc get pods -n content-db -w
```

### Step 3: Verify MongoDB is Running
```bash
# Check pod status
oc get pods -n content-db

# Check logs
oc logs -n content-db -l app=mongodb

# Port-forward to test connection
oc port-forward -n content-db svc/mongodb-service 27017:27017

# In another terminal, test connection
mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/contentdb"
```

---

## Deploying MongoDB via ArgoCD

Once ArgoCD is installed, deploy the MongoDB application:

### Method 1: Via ArgoCD CLI

```bash
# Create ArgoCD project (optional but recommended)
argocd proj create mongodb-content \
  --description "MongoDB Content Database Project" \
  --dest https://kubernetes.default.svc,content-db \
  --src https://github.com/rabay108/mongodb-openshift-content.git

# Create ArgoCD application
argocd app create mongodb-content-app \
  --project mongodb-content \
  --repo https://github.com/rabay108/mongodb-openshift-content.git \
  --path k8s \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace content-db \
  --sync-policy automated \
  --auto-prune \
  --self-heal

# Sync the application
argocd app sync mongodb-content-app

# Watch sync status
argocd app get mongodb-content-app --watch
```

### Method 2: Via kubectl/oc (Declarative)

```bash
# Apply ArgoCD project
oc apply -f argocd/project.yaml

# Apply ArgoCD application
oc apply -f argocd/application.yaml

# Check application status
oc get application -n openshift-gitops mongodb-content-app

# Or if using manual ArgoCD installation
oc get application -n argocd mongodb-content-app
```

### Method 3: Via ArgoCD Web UI

1. Log in to ArgoCD Web UI
2. Click **"+ NEW APP"**
3. Fill in details:
   - **Application Name**: `mongodb-content-app`
   - **Project**: `mongodb-content` (or `default`)
   - **Sync Policy**: `Automatic`
   - **Repository URL**: `https://github.com/rabay108/mongodb-openshift-content.git`
   - **Revision**: `main`
   - **Path**: `k8s`
   - **Cluster URL**: `https://kubernetes.default.svc`
   - **Namespace**: `content-db`
4. Enable:
   - ✅ **Prune Resources**
   - ✅ **Self Heal**
5. Click **CREATE**

---

## Troubleshooting

### Issue: "configmap 'argocd-cm' not found"

**Cause**: ArgoCD is not installed or not running in the expected namespace.

**Solution**:
```bash
# Check if ArgoCD is installed
oc get pods -n openshift-gitops  # For OpenShift GitOps
# OR
oc get pods -n argocd  # For manual ArgoCD installation

# If no pods found, install ArgoCD (see Option 1 or 2 above)
```

### Issue: "error retrieving argocd-cm"

**Cause**: ArgoCD CLI is looking in wrong namespace.

**Solution**:
```bash
# For OpenShift GitOps
export ARGOCD_OPTS='--grpc-web'
argocd login $ARGOCD_SERVER --username admin --password $ARGOCD_PASSWORD --insecure

# For manual ArgoCD
argocd login $ARGOCD_SERVER --username admin --password $ARGOCD_PASSWORD --insecure --grpc-web
```

### Issue: Cannot access ArgoCD UI

**Solution**:
```bash
# Check route exists
oc get route -n openshift-gitops  # For OpenShift GitOps
# OR
oc get route -n argocd  # For manual installation

# If no route, create one
oc create route passthrough argocd-server --service=argocd-server --port=https -n argocd
```

### Issue: Application stuck in "Progressing" state

**Solution**:
```bash
# Check application status
argocd app get mongodb-content-app

# Check sync status
argocd app sync mongodb-content-app --force

# Check pod logs
oc logs -n content-db -l app=mongodb

# Check events
oc get events -n content-db --sort-by='.lastTimestamp'
```

---

## Verification

### Verify ArgoCD Installation
```bash
# Check ArgoCD pods
oc get pods -n openshift-gitops  # For OpenShift GitOps
# OR
oc get pods -n argocd  # For manual installation

# All pods should be Running
```

### Verify MongoDB Deployment
```bash
# Check application in ArgoCD
argocd app list

# Check application details
argocd app get mongodb-content-app

# Check MongoDB pods
oc get pods -n content-db

# Check MongoDB logs
oc logs -n content-db -l app=mongodb

# Test MongoDB connection
oc port-forward -n content-db svc/mongodb-service 27017:27017
mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/contentdb"
```

---

## Quick Reference

### ArgoCD CLI Commands
```bash
# List applications
argocd app list

# Get application details
argocd app get mongodb-content-app

# Sync application
argocd app sync mongodb-content-app

# Delete application
argocd app delete mongodb-content-app

# Watch application
argocd app get mongodb-content-app --watch
```

### OpenShift CLI Commands
```bash
# Check ArgoCD applications
oc get applications -n openshift-gitops

# Check MongoDB resources
oc get all -n content-db

# Check MongoDB logs
oc logs -n content-db -l app=mongodb -f

# Port-forward to MongoDB
oc port-forward -n content-db svc/mongodb-service 27017:27017
```

---

## Recommended Approach

### For Production:
1. ✅ **Install OpenShift GitOps Operator** (Option 1)
2. ✅ **Create ArgoCD Project** for better organization
3. ✅ **Deploy via ArgoCD Application** for GitOps workflow
4. ✅ **Enable auto-sync and self-heal** for automated management

### For Development/Testing:
1. ✅ **Deploy directly via oc/kubectl** (Option 3)
2. ✅ **Faster iteration** without GitOps overhead
3. ✅ **Manual control** over deployments

---

## Next Steps

After ArgoCD is set up:
1. ✅ Review `MIGRATION_GUIDE.md` for namespace cleanup
2. ✅ Deploy MongoDB application via ArgoCD
3. ✅ Verify deployment and test connectivity
4. ✅ Migrate data if needed (see `MIGRATION_GUIDE.md`)

---

Made with Bob