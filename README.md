# Sample project for KCD Talk


## The application

This is a very simple node.js application which simply changes text based on a feature flag

## OpenFeature

The example uses OpenFeature to write feature management code in a vendor agnostic way

## OpenTelemetry


## flagD

The application uses flag as a feature evaluation engine

## GitOps

### Install ArgoCD

```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Port Forward
```
kubectl port-forward svc/argocd-server -n argocd 8080:443
```


## How to run this example

