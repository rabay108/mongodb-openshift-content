# MongoDB OpenShift Project Structure

## Overview
This document describes the complete directory structure of the MongoDB OpenShift deployment project and explains what ArgoCD expects to find.

## Directory Structure

```
mongodb-openshift-content/
├── README.md                          # Main project documentation
├── DEPLOYMENT_GUIDE.md                # Step-by-step deployment instructions
├── PROJECT_STRUCTURE.md               # This file - project structure documentation
│
├── argocd/                            # ArgoCD-specific configuration files
│   ├── application.yaml               # ArgoCD Application definition
│   ├── project.yaml                   # ArgoCD Project definition
│   └── README.md                      # ArgoCD setup instructions
│
├── k8s/                               # Kubernetes manifests (ArgoCD source path)
│   ├── namespace.yaml                 # Namespace definition
│   ├── secret.yaml                    # MongoDB credentials and secrets
│   ├── configmap.yaml                 # MongoDB configuration and init scripts
│   ├── persistentvolumeclaim.yaml     # Storage claim for MongoDB data
│   ├── statefulset.yaml               # MongoDB StatefulSet deployment
│   └── service.yaml                   # MongoDB service definition
│
└── init/                              # MongoDB initialization scripts
    ├── init-schema.js                 # Database schema initialization
    └── sample-data.js                 # Sample data for testing
```

## ArgoCD Configuration

### Application Source Path
The ArgoCD application is configured to look for Kubernetes manifests in the `k8s/` directory:

```yaml
spec:
  source:
    path: k8s/  # ArgoCD will sync all YAML files from this directory
```

### Required Manifests in k8s/ Directory

All Kubernetes manifests **MUST** be located in the `k8s/` subdirectory for ArgoCD to discover and deploy them:

1. **namespace.yaml** - Creates the `mongodb` namespace
2. **secret.yaml** - Contains MongoDB root password and other secrets
3. **configmap.yaml** - Contains MongoDB configuration and initialization scripts
4. **persistentvolumeclaim.yaml** - Defines storage requirements
5. **statefulset.yaml** - Deploys MongoDB as a StatefulSet
6. **service.yaml** - Exposes MongoDB service

## Directory Purposes

### `/argocd/`
Contains ArgoCD-specific configuration files that define how the application should be deployed. These files are applied to the ArgoCD instance, not to the target cluster directly.

**Files:**
- `application.yaml` - Defines the ArgoCD Application resource
- `project.yaml` - Defines the ArgoCD Project (optional)
- `README.md` - Instructions for setting up ArgoCD

### `/k8s/`
Contains all Kubernetes manifests that will be deployed to the target cluster. This is the directory that ArgoCD monitors and syncs.

**Deployment Order:**
1. Namespace (creates the mongodb namespace)
2. Secret (credentials must exist before StatefulSet)
3. ConfigMap (configuration must exist before StatefulSet)
4. PersistentVolumeClaim (storage must be available)
5. StatefulSet (deploys MongoDB pods)
6. Service (exposes MongoDB)

### `/init/`
Contains JavaScript files used to initialize the MongoDB database. These scripts are referenced in the ConfigMap and executed when MongoDB starts.

**Files:**
- `init-schema.js` - Creates database schema, collections, and indexes
- `sample-data.js` - Inserts sample data for testing

## Current Status

✅ **All manifests are correctly located in the `k8s/` directory**

The project structure is properly organized for ArgoCD deployment:
- All 6 required Kubernetes manifests are in `k8s/`
- ArgoCD configuration files are in `argocd/`
- Initialization scripts are in `init/`

## Verification

To verify the structure is correct:

```bash
# List all Kubernetes manifests
ls -la mongodb-openshift-content/k8s/

# Expected output:
# configmap.yaml
# namespace.yaml
# persistentvolumeclaim.yaml
# secret.yaml
# service.yaml
# statefulset.yaml
```

## ArgoCD Sync Behavior

When ArgoCD syncs this application:

1. It reads the `application.yaml` from the `argocd/` directory
2. It connects to the Git repository specified in the application
3. It looks in the `k8s/` directory (as specified by `spec.source.path`)
4. It discovers all YAML files in that directory
5. It applies them to the target cluster in the appropriate order

## Next Steps

1. **Apply ArgoCD Configuration:**
   ```bash
   kubectl apply -f mongodb-openshift-content/argocd/application.yaml
   ```

2. **Monitor Deployment:**
   ```bash
   argocd app get mongodb-app
   argocd app sync mongodb-app
   ```

3. **Verify Resources:**
   ```bash
   kubectl get all -n mongodb
   ```

## Troubleshooting

### ArgoCD Can't Find Manifests
- Verify the `path: k8s/` is set correctly in `application.yaml`
- Ensure all manifest files are in the `k8s/` directory
- Check that file names end with `.yaml` or `.yml`

### Manifests Not Syncing
- Check ArgoCD application status: `argocd app get mongodb-app`
- Verify Git repository access and credentials
- Ensure the target namespace exists or is created by namespace.yaml

## References

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Kubernetes StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [MongoDB on Kubernetes](https://www.mongodb.com/kubernetes)