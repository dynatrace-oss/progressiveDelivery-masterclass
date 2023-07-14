# GitOps Deployment

## Install ArgoCD to your cluster

Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s
argocd admin initial-password -n argocd
```

## Prepare your Repository



Within the `gitops` directory run

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
```


###  You should see a folder structure like this in your repository
```
gitops\
    +- applications\
    +- manifests\
        +- argo-config\
        +- cert-manager\
        +- ingress-nginx\
        +- demo-application\
```