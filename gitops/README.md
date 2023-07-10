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

## Patch ArgoCD to support Application Health Status

TODO: Why? What does "Application Health Status" do or mean?

```
kubectl patch cm/argocd-cm -n argocd --type=merge -p="{\"data\":{\"resource.customizations.health.argoproj.io_Application\":\"hs = {}\nhs.status = Progressing\nhs.message = \\"\\"\nif obj.status ~= nil then\n  if obj.status.health ~= nil then\n    hs.status = obj.status.health.status\n    if obj.status.health.message ~= nil then\n      hs.message = obj.status.health.message\n    end\n  end\nend\nreturn hs\n\"}}"
```

## Get ArgoCD Password and Port-Forward ArgoCD UI

```
argocd admin initial-password -n argocd
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

## Open ArgoCD UI

1. Go to `http://localhost:8080`
1. Accept the security warning and login with: `username = admin / password = <The Value Above>

## Apply the "App of Apps"

```
kubectl -n argocd apply -f app-of-apps.yaml
```

The App of Apps will create all other apps which are included in the `applications` folder from within GtiHub Repository.

