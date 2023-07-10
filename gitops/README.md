# GitOps for ArgoCD

## Preparation

1. Install the [ArgoCD CLI for your platform (you may need to update the version number for newer releases)](https://github.com/argoproj/argo-cd/releases/tag/v2.7.7)
1. Add argocd to your `PATH`
1. Install kind by [following these instructions for your platform](https://kind.sigs.k8s.io/docs/user/quick-start#installation)
1. Install kubectl by [following these instructions for your platform](https://kubernetes.io/docs/tasks/tools/#kubectl)
1. Clone this repository

```
git clone https://github.com/AloisReitbauer/progressiveDelivery-masterclass
cd progressiveDelivery-masterclass
```

## Create a fresh cluster

```
kind create cluster --config cluster/kind-cluster.yaml
```

## Install ArgoCD

```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Wait for all deployments to be ready. This is important because otherwise the initial password may not be available yet:

```
kubectl -n argocd rollout status deployment argocd-applicationset-controller --timeout=90s
kubectl -n argocd rollout status deployment argocd-dex-server --timeout=90s
kubectl -n argocd rollout status deployment argocd-notifications-controller --timeout=90s
kubectl -n argocd rollout status deployment argocd-redis --timeout=90s
kubectl -n argocd rollout status deployment argocd-repo-server --timeout=90s
kubectl -n argocd rollout status deployment argocd-server --timeout=90s
```

## Get ArgoCD Password and Port-Forward ArgoCD UI

```
argocd admin initial-password -n argocd
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

## Apply the "App of Apps"

```
kubectl -n argocd apply -f gitops/app-of-apps.yaml
```

The App of Apps will create all other apps which are included in the `applications` folder from within GtiHub Repository.

Sync waves allow you to ensure that certain resources are healthy before others are rolled out. It short, it's a way of saying "install A before B".

### Sync Wave -1
Applies custom argocd-cm for Application Health Status

### Sync Wave 0
- Cert Manager
- NGINX Ingress

### Sync Wave 2
- Keptn Lifecycle Toolkit
- OpenFeature Operator
- Prometheus CRDs

### Sync Wave 3
- `prometheus-grafana` application

### Sync Wave 4
- Jaeger Operator

### Sync Wave 5
- `featureflags` application
- OpenTelemetry Collector

### Sync Wave 6
- Keptn Lifecycle Toolkit Config

### Sync Wave 10
- `demo-application`