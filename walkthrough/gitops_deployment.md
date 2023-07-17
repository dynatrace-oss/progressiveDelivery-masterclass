# GitOps Deployment

Keptn, OpenTelemetry, and OpenFeature
work with virtually any deployment engine,
including just `kubectl apply`.
For this exercise, we use ArgoCD
so we need to install and configure that
and then use it to deploy our sample application.

## Install ArgoCD in your cluster

Install ArgoCD with the following command sequence:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s
argocd admin initial-password -n argocd
```

## Prepare your GitOps Repository

Open a bash shell and execute the following commands
to apply the Kubernetes resources required for this exercise:

```bash
curl --create-dirs -sL -o gitops/app-of-apps.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/app-of-apps.yaml
curl --create-dirs -sL -o gitops/applications/argo-config.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/applications/argo-config.yaml
curl --create-dirs -sL -o gitops/applications/cert-manager.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/applications/cert-manager.yaml
curl --create-dirs -sL -o gitops/applications/ingress-nginx.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/applications/ingress-nginx.yaml
curl --create-dirs -sL -o gitops/applications/demo-application.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/applications/demo-application.yaml
curl --create-dirs -sL -o gitops/manifests/argo-config/argocd-cm.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/manifests/argo-config/argocd-cm.yaml
curl --create-dirs -sL -o gitops/manifests/argo-config/ingress.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/manifests/argo-config/ingress.yaml
curl --create-dirs -sL -o gitops/manifests/cert-manager/deploy.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/manifests/cert-manager/deploy.yaml
curl --create-dirs -sL -o gitops/manifests/ingress-nginx/deploy.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/manifests/ingress-nginx/deploy.yaml
curl --create-dirs -sL -o gitops/manifests/demo-application/deployment.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/manifests/demo-application/deployment.yaml
curl --create-dirs -sL -o gitops/manifests/demo-application/ingress.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/manifests/demo-application/ingress.yaml
curl --create-dirs -sL -o gitops/manifests/demo-application/service.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/manifests/demo-application/service.yaml
curl --create-dirs -sL -o gitops/manifests/demo-application/namespace.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/manifests/demo-application/namespace.yaml
```


###  You should see a folder structure like this in your repository
```
└── gitops
    ├── app-of-apps.yaml
    ├── applications
    │   ├── argo-config.yaml
    │   ├── cert-manager.yaml
    │   ├── demo-application.yaml
    │   └── ingress-nginx.yaml
    └── manifests
        ├── argo-config
        │   ├── argocd-cm.yaml
        │   └── ingress.yaml
        ├── cert-manager
        │   └── deploy.yaml
        ├── demo-application
        │   ├── deployment.yaml
        │   ├── ingress.yaml
        │   └── service.yaml
        └── ingress-nginx
            └── deploy.yaml
```

### Point all manifests to your Repository

```
find . -type f -exec sed -i 's_github.com/AloisReitbauer/progressiveDelivery-masterclass_github.com/YOURHANDLE/YOURREPOSITORY_g' {} +
```

## Deploy the App-of-Apps

```
kubectl apply -f gitops/app-of-apps.yaml
```

Access [ArgoCD](http://argocd.127.0.0.1.nip.io) and verify that the deployment is running


Next: [Roll out the delivery stack](delivery_stack.md)
