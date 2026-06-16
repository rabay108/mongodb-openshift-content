# OpenShift GitOps (ArgoCD) Deployment Guide for MongoDB Content Database

This guide provides comprehensive instructions for deploying the MongoDB Content Database using OpenShift GitOps (ArgoCD) on OpenShift 4.20.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Architecture](#architecture)
- [GitHub Repository Setup](#github-repository-setup)
- [OpenShift GitOps Installation](#openshift-gitops-installation)
- [Deployment Steps](#deployment-steps)
- [Verification](#verification)
- [Managing the Application](#managing-the-application)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)
- [Advanced Configuration](#advanced-configuration)

## 🎯 Overview

This ArgoCD configuration automates the deployment and management of the MongoDB Content Database on OpenShift. It includes:

- **AppProject**: `mongodb-content` - Defines security policies and RBAC
- **Application**: `mongodb-content-app` - Manages the MongoDB deployment
- **Target Namespace**: `content-db` (flexible schema for Movies, Books, Music)
- **Source Repository**: https://github.com/rabay108/mongodb-openshift-content.git
- **Sync Policy**: Automated with self-healing enabled

## 📦 Prerequisites

### 1. OpenShift Cluster Access

Ensure you have access to an OpenShift 4.20 cluster with cluster-admin privileges:

```bash
# Verify cluster access
oc whoami
oc version

# Expected output should show OpenShift 4.20.x
```

### 2. Required Permissions

You need the following permissions:
- Cluster admin access to install OpenShift GitOps operator
- Ability to create projects/namespaces
- Ability to create ArgoCD AppProjects and Applications

### 3. Tools Required

- OpenShift CLI (`oc`) version 4.20 or compatible
- Git CLI
- Access to GitHub account (username: rabay108)

### 4. Cluster Resources

Ensure your cluster has sufficient resources:
- **CPU**: At least 1 core available
- **Memory**: At least 2Gi available
- **Storage**: At least 10Gi available for PVC

## 🏗️ Architecture

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
│  │            content-db namespace                     │    │
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
                          │
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

## 🔧 GitHub Repository Setup

### Step 1: Create GitHub Repository

1. **Log in to GitHub** with username `rabay108`

2. **Create a new repository**:
   - Go to https://github.com/new
   - Repository name: `mongodb-openshift-content`
   - Description: "MongoDB Content Database deployment for OpenShift with GitOps"
   - Visibility: Public (or Private if you prefer)
   - Do NOT initialize with README (we'll push existing code)
   - Click "Create repository"

### Step 2: Push Code to GitHub

Navigate to your project directory and push the code:

```bash
# Navigate to the project directory
cd mongodb-openshift-content

# Initialize git repository (if not already initialized)
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit: MongoDB Content Database with ArgoCD configuration"

# Add remote repository
git remote add origin https://github.com/rabay108/mongodb-openshift-content.git

# Push to GitHub (use main or master branch)
git branch -M main
git push -u origin main
```

### Step 3: Verify Repository

Verify that all files are pushed correctly:

```bash
# Check remote repository
git remote -v

# Verify branch
git branch

# Check status
git status
```

Visit https://github.com/rabay108/mongodb-openshift-content to confirm all files are present, especially:
- `k8s/` directory with all manifests
- `argocd/` directory with ArgoCD configurations
- `configmap.yaml`
- `README.md`

## 🚀 OpenShift GitOps Installation

### Step 1: Install OpenShift GitOps Operator

1. **Via OpenShift Web Console**:
   - Log in to OpenShift Web Console
   - Navigate to **Operators** → **OperatorHub**
   - Search for "OpenShift GitOps"
   - Click on "Red Hat OpenShift GitOps"
   - Click **Install**
   - Keep default settings:
     - Update channel: `latest`
     - Installation mode: `All namespaces on the cluster`
     - Installed Namespace: `openshift-gitops`
   - Click **Install**
   - Wait for installation to complete (2-3 minutes)

2. **Via CLI** (Alternative):

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
oc wait --for=condition=Ready pod -l name=openshift-gitops-operator -n openshift-operators --timeout=300s
```

### Step 2: Verify Installation

```bash
# Check if operator is installed
oc get csv -n openshift-operators | grep gitops

# Check if ArgoCD instance is created
oc get argocd -n openshift-gitops

# Check ArgoCD pods
oc get pods -n openshift-gitops

# All pods should be in Running state
```

### Step 3: Access ArgoCD UI

```bash
# Get ArgoCD route
oc get route openshift-gitops-server -n openshift-gitops -o jsonpath='{.spec.host}'

# Get admin password
oc extract secret/openshift-gitops-cluster -n openshift-gitops --to=-

# Or use this command to get password directly
oc get secret openshift-gitops-cluster -n openshift-gitops -o jsonpath='{.data.admin\.password}' | base64 -d
```

Access the ArgoCD UI:
- URL: `https://<route-from-above>`
- Username: `admin`
- Password: `<password-from-above>`

## 📥 Deployment Steps

### Step 1: Apply ArgoCD AppProject

The AppProject defines security policies and RBAC for the MongoDB deployment.

```bash
# Navigate to the argocd directory
cd mongodb-openshift-content/argocd

# Apply the AppProject
oc apply -f project.yaml

# Verify AppProject creation
oc get appproject mongodb-content -n openshift-gitops

# View AppProject details
oc describe appproject mongodb-content -n openshift-gitops
```

**Expected Output**:
```
appproject.argoproj.io/mongodb-content created
```

### Step 2: Apply ArgoCD Application

The Application manifest tells ArgoCD how to deploy and manage MongoDB.

```bash
# Apply the Application
oc apply -f application.yaml

# Verify Application creation
oc get application mongodb-content-app -n openshift-gitops

# View Application details
oc describe application mongodb-content-app -n openshift-gitops
```

**Expected Output**:
```
application.argoproj.io/mongodb-content-app created
```

### Step 3: Monitor Deployment

ArgoCD will automatically sync the application. Monitor the progress:

```bash
# Watch Application status
oc get application mongodb-content-app -n openshift-gitops -w

# Check sync status
oc get application mongodb-content-app -n openshift-gitops -o jsonpath='{.status.sync.status}'

# Check health status
oc get application mongodb-content-app -n openshift-gitops -o jsonpath='{.status.health.status}'
```

**Via ArgoCD UI**:
1. Log in to ArgoCD UI
2. Click on `mongodb-content-app` application
3. View the application tree and sync status
4. All resources should show as "Healthy" and "Synced"

### Step 4: Verify MongoDB Deployment

```bash
# Check if namespace is created
oc get namespace content-db

# Check all resources in content-db namespace
oc get all -n content-db

# Check PVC status
oc get pvc -n content-db

# Check pod status
oc get pods -n content-db

# Wait for pod to be ready
oc wait --for=condition=ready pod -l app=mongodb -n content-db --timeout=300s

# Check pod logs
oc logs -n content-db mongodb-0 -c mongodb

# Check init container logs
oc logs -n content-db mongodb-0 -c init-scripts
```

## ✅ Verification

### 1. Verify Database Initialization

```bash
# Connect to MongoDB and verify database
oc exec -it -n content-db mongodb-0 -- mongosh -u admin -p 'M0ng0DB$ecur3P@ssw0rd2024!' --authenticationDatabase admin

# Inside mongosh, run:
use contentdb
show collections
db.content_001.countDocuments()  // Should return 10
db.content_001.getIndexes()      // Should show 5 indexes
exit
```

### 2. Verify ArgoCD Sync Status

```bash
# Check Application sync status
oc get application mongodb-content-app -n openshift-gitops -o yaml | grep -A 5 "status:"

# Expected status:
# - sync.status: Synced
# - health.status: Healthy
```

### 3. Test Database Connectivity

```bash
# Port forward to MongoDB service
oc port-forward -n content-db svc/mongodb-service 27017:27017 &

# In another terminal, connect using mongosh
mongosh "mongodb://admin:M0ng0DB\$ecur3P@ssw0rd2024!@localhost:27017/contentdb?authSource=admin"

# Run a test query
db.content_001.find({ rating: { $gt: 8.5 } }, { movieName: 1, year: 1, rating: 1 })
```

### 4. Verify Resource Status

```bash
# Check all resources are healthy
oc get all,pvc,secret,configmap -n content-db

# Expected resources:
# - StatefulSet: mongodb (1/1 ready)
# - Pod: mongodb-0 (Running)
# - Service: mongodb-service
# - PVC: mongodb-pvc (Bound)
# - Secret: mongodb-secret
# - ConfigMap: mongodb-init-scripts
```

## 🔄 Managing the Application

### Sync Application Manually

If automatic sync is disabled or you want to force a sync:

```bash
# Sync via CLI
oc patch application mongodb-content-app -n openshift-gitops --type merge -p '{"operation":{"initiatedBy":{"username":"admin"},"sync":{"revision":"main"}}}'

# Or use ArgoCD CLI (if installed)
argocd app sync mongodb-content-app
```

**Via ArgoCD UI**:
1. Click on `mongodb-content-app` application
2. Click **SYNC** button
3. Select sync options if needed
4. Click **SYNCHRONIZE**

### View Application Logs

```bash
# View ArgoCD application controller logs
oc logs -n openshift-gitops -l app.kubernetes.io/name=argocd-application-controller -f

# View specific application events
oc get events -n content-db --sort-by='.lastTimestamp'
```

### Refresh Application

Force ArgoCD to check for changes in Git:

```bash
# Refresh application
oc patch application mongodb-content-app -n openshift-gitops --type merge -p '{"operation":{"initiatedBy":{"username":"admin"},"info":[{"name":"Reason","value":"Manual refresh"}]}}'
```

### Rollback to Previous Version

```bash
# View application history
oc get application mongodb-content-app -n openshift-gitops -o jsonpath='{.status.history}'

# Rollback to specific revision (via ArgoCD UI is easier)
# In ArgoCD UI:
# 1. Click on application
# 2. Go to "History and Rollback"
# 3. Select revision
# 4. Click "Rollback"
```

### Pause/Resume Auto-Sync

```bash
# Pause auto-sync
oc patch application mongodb-content-app -n openshift-gitops --type merge -p '{"spec":{"syncPolicy":{"automated":null}}}'

# Resume auto-sync
oc patch application mongodb-content-app -n openshift-gitops --type merge -p '{"spec":{"syncPolicy":{"automated":{"prune":true,"selfHeal":true}}}}'
```

### Delete Application (Cleanup)

```bash
# Delete Application (this will also delete all deployed resources)
oc delete application mongodb-content-app -n openshift-gitops

# Delete AppProject
oc delete appproject mongodb-content -n openshift-gitops

# Verify namespace is deleted
oc get namespace content-db
```

## 🐛 Troubleshooting

### Application Not Syncing

**Problem**: Application shows "OutOfSync" status

**Solutions**:

```bash
# Check Application status
oc describe application mongodb-content-app -n openshift-gitops

# Check for sync errors
oc get application mongodb-content-app -n openshift-gitops -o jsonpath='{.status.conditions}'

# Verify GitHub repository is accessible
git ls-remote https://github.com/rabay108/mongodb-openshift-content.git

# Force refresh and sync
oc patch application mongodb-content-app -n openshift-gitops --type merge -p '{"operation":{"initiatedBy":{"username":"admin"},"sync":{"revision":"main"}}}'
```

### Application Health Degraded

**Problem**: Application shows "Degraded" health status

**Solutions**:

```bash
# Check pod status
oc get pods -n content-db

# Check pod events
oc describe pod mongodb-0 -n content-db

# Check pod logs
oc logs -n content-db mongodb-0 -c mongodb
oc logs -n content-db mongodb-0 -c init-scripts

# Check PVC status
oc get pvc -n content-db
oc describe pvc mongodb-pvc -n content-db
```

### Repository Connection Issues

**Problem**: ArgoCD cannot connect to GitHub repository

**Solutions**:

```bash
# Verify repository URL in Application
oc get application mongodb-content-app -n openshift-gitops -o jsonpath='{.spec.source.repoURL}'

# Check if repository is public or if credentials are needed
# For private repositories, add repository credentials in ArgoCD

# Via ArgoCD UI:
# 1. Settings → Repositories
# 2. Click "Connect Repo"
# 3. Add GitHub credentials
```

### Namespace Not Created

**Problem**: `content-db` namespace is not created

**Solutions**:

```bash
# Check if CreateNamespace sync option is enabled
oc get application mongodb-content-app -n openshift-gitops -o jsonpath='{.spec.syncPolicy.syncOptions}'

# Manually create namespace if needed
oc create namespace content-db

# Re-sync application
oc patch application mongodb-content-app -n openshift-gitops --type merge -p '{"operation":{"initiatedBy":{"username":"admin"},"sync":{"revision":"main"}}}'
```

### Permission Denied Errors

**Problem**: ArgoCD cannot create resources due to permission issues

**Solutions**:

```bash
# Check AppProject permissions
oc describe appproject mongodb-content -n openshift-gitops

# Verify ArgoCD service account has necessary permissions
oc get rolebinding -n content-db | grep gitops

# Grant additional permissions if needed (cluster-admin should have all permissions)
oc adm policy add-cluster-role-to-user cluster-admin system:serviceaccount:openshift-gitops:openshift-gitops-argocd-application-controller
```

### MongoDB Pod Not Starting

**Problem**: MongoDB pod is in CrashLoopBackOff or Pending state

**Solutions**:

```bash
# Check pod status and events
oc describe pod mongodb-0 -n content-db

# Common issues:
# 1. PVC not bound - check storage class
oc get storageclass
oc get pvc -n content-db

# 2. Resource limits - check if cluster has enough resources
oc describe node | grep -A 5 "Allocated resources"

# 3. Image pull issues - check image pull status
oc get events -n content-db | grep -i pull

# 4. Init container failed - check init container logs
oc logs -n content-db mongodb-0 -c init-scripts
```

### ArgoCD UI Not Accessible

**Problem**: Cannot access ArgoCD UI

**Solutions**:

```bash
# Check ArgoCD server pod
oc get pods -n openshift-gitops | grep server

# Check route
oc get route openshift-gitops-server -n openshift-gitops

# If route doesn't exist, create it
oc create route edge openshift-gitops-server --service=openshift-gitops-server -n openshift-gitops

# Check if ArgoCD server is running
oc logs -n openshift-gitops -l app.kubernetes.io/name=argocd-server
```

## 🔒 Security Considerations

### 1. Change Default MongoDB Password

**Important**: The default password in `secret.yaml` should be changed for production use.

```bash
# Generate a strong password
NEW_PASSWORD=$(openssl rand -base64 32)

# Update secret
oc create secret generic mongodb-secret \
  --from-literal=mongodb-root-username=admin \
  --from-literal=mongodb-root-password="$NEW_PASSWORD" \
  --dry-run=client -o yaml | oc apply -f - -n content-db

# Restart MongoDB pod to use new password
oc delete pod mongodb-0 -n content-db

# Update the secret in Git repository
echo -n "$NEW_PASSWORD" | base64
# Update the base64 encoded password in k8s/secret.yaml
# Commit and push changes
```

### 2. Use Private GitHub Repository

For production deployments, use a private repository:

1. Make repository private in GitHub settings
2. Add repository credentials in ArgoCD:

```bash
# Via ArgoCD UI:
# Settings → Repositories → Connect Repo
# - Repository URL: https://github.com/rabay108/mongodb-openshift-content.git
# - Username: rabay108
# - Password: <GitHub Personal Access Token>
```

### 3. Enable RBAC

The AppProject includes RBAC roles. Assign users to appropriate groups:

```bash
# Create groups in OpenShift
oc adm groups new mongodb-content-admins
oc adm groups new mongodb-content-developers
oc adm groups new mongodb-content-viewers

# Add users to groups
oc adm groups add-users mongodb-content-admins user1 user2
oc adm groups add-users mongodb-content-developers user3 user4
oc adm groups add-users mongodb-content-viewers user5 user6
```

### 4. Network Policies

Add network policies to restrict access to MongoDB:

```yaml
# Create network-policy.yaml in k8s/ directory
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: mongodb-network-policy
  namespace: content-db
spec:
  podSelector:
    matchLabels:
      app: mongodb
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: allowed-namespace
      ports:
        - protocol: TCP
          port: 27017
```

### 5. Enable TLS/SSL

For production, enable TLS for MongoDB connections. Update StatefulSet to mount TLS certificates.

### 6. Secrets Management

Consider using external secrets management:

- **OpenShift Secrets**: Use SealedSecrets or External Secrets Operator
- **HashiCorp Vault**: Integrate with Vault for dynamic secrets
- **AWS Secrets Manager**: Use AWS Secrets Manager with IRSA

## 🚀 Advanced Configuration

### Multi-Environment Setup

Create separate branches for different environments:

```bash
# Create development branch
git checkout -b development
# Make environment-specific changes
git push origin development

# Create staging branch
git checkout -b staging
git push origin staging

# Create separate Applications for each environment
# Update targetRevision in application.yaml for each environment
```

### Automated Sync with Webhooks

Configure GitHub webhooks for instant sync:

1. In GitHub repository settings:
   - Go to Settings → Webhooks
   - Add webhook
   - Payload URL: `https://<argocd-server>/api/webhook`
   - Content type: `application/json`
   - Events: `Just the push event`

2. ArgoCD will automatically sync on Git push

### Health Checks Customization

Customize health checks in Application:

```yaml
spec:
  ignoreDifferences:
    - group: apps
      kind: StatefulSet
      jsonPointers:
        - /spec/replicas
  
  # Add custom health checks
  health:
    - group: apps
      kind: StatefulSet
      check: |
        hs = {}
        if obj.status ~= nil then
          if obj.status.readyReplicas == obj.spec.replicas then
            hs.status = "Healthy"
            hs.message = "All replicas are ready"
          else
            hs.status = "Progressing"
            hs.message = "Waiting for replicas"
          end
        end
        return hs
```

### Notifications

Configure notifications for sync events:

```bash
# Install ArgoCD Notifications
oc apply -n openshift-gitops -f https://raw.githubusercontent.com/argoproj-labs/argocd-notifications/stable/manifests/install.yaml

# Configure Slack notifications (example)
oc create secret generic argocd-notifications-secret \
  --from-literal=slack-token=<slack-token> \
  -n openshift-gitops
```

### Monitoring and Metrics

Monitor ArgoCD and MongoDB:

```bash
# View ArgoCD metrics
oc port-forward -n openshift-gitops svc/openshift-gitops-server-metrics 8083:8083

# Access Prometheus metrics at http://localhost:8083/metrics

# Monitor MongoDB metrics
oc exec -it -n content-db mongodb-0 -- mongosh -u admin -p 'M0ng0DB$ecur3P@ssw0rd2024!' --authenticationDatabase admin --eval "db.serverStatus()"
```

## 📚 Additional Resources

- [OpenShift GitOps Documentation](https://docs.openshift.com/container-platform/4.20/cicd/gitops/understanding-openshift-gitops.html)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [MongoDB on Kubernetes](https://www.mongodb.com/kubernetes)
- [GitOps Principles](https://www.gitops.tech/)

## 🤝 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review ArgoCD logs: `oc logs -n openshift-gitops -l app.kubernetes.io/name=argocd-application-controller`
3. Check MongoDB logs: `oc logs -n content-db mongodb-0`
4. Open an issue in the GitHub repository

---

**Created**: 2026  
**OpenShift Version**: 4.20  
**ArgoCD Version**: Compatible with OpenShift GitOps  
**MongoDB Version**: 7.0

# Made with Bob