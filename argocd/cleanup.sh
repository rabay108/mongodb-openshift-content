#!/bin/bash
# ArgoCD Cleanup Script
# This script safely deletes the MongoDB ArgoCD application and project
# Run this before redeploying to start fresh

set -e

echo "========================================"
echo "ArgoCD MongoDB Cleanup Script"
echo "========================================"
echo ""

# Check if oc is available
if ! command -v oc &> /dev/null; then
    echo "❌ Error: 'oc' command not found. Please install OpenShift CLI."
    exit 1
fi

# Check if logged in to OpenShift
if ! oc whoami &> /dev/null; then
    echo "❌ Error: Not logged in to OpenShift. Please run 'oc login' first."
    exit 1
fi

echo "Step 1: Deleting ArgoCD Application..."
if oc get application mongodb-content-app -n openshift-gitops &> /dev/null; then
    oc delete application mongodb-content-app -n openshift-gitops
    echo "✅ Application deletion initiated"
else
    echo "ℹ️  Application not found (already deleted)"
fi

echo ""
echo "Step 2: Waiting for resources to be cleaned up..."
sleep 10

echo ""
echo "Step 3: Deleting ArgoCD AppProject..."
if oc get appproject mongodb-content -n openshift-gitops &> /dev/null; then
    oc delete appproject mongodb-content -n openshift-gitops
    echo "✅ AppProject deleted"
else
    echo "ℹ️  AppProject not found (already deleted)"
fi

echo ""
echo "Step 4: Checking namespace status..."
if oc get namespace content-db &> /dev/null; then
    echo "⚠️  Namespace 'content-db' still exists"
    read -p "Do you want to delete it manually? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        oc delete namespace content-db
        echo "✅ Namespace deleted"
    else
        echo "ℹ️  Namespace kept (will be reused on redeploy)"
    fi
else
    echo "✅ Namespace already deleted"
fi

echo ""
echo "========================================"
echo "✅ Cleanup Complete!"
echo "========================================"
echo ""
echo "Next steps to redeploy:"
echo "  1. cd mongodb-openshift-content/argocd"
echo "  2. oc apply -f project.yaml"
echo "  3. oc apply -f application.yaml"
echo ""
echo "Or use the deploy script:"
echo "  ./argocd/deploy.sh"
echo "========================================"

# Made with Bob