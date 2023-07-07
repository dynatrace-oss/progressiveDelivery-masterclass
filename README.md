# Progressive Delivery Masterclass

Learn how build a full progressive delivery example, which separates delivery from release management and progressively rolls out a new release and does targeted rollbacks via adjusting targeting rules on the fly. 

## The application

This is a very simple node.js application which simply changes text based on a feature flag

## OpenFeature

The example uses OpenFeature to write feature management code in a vendor agnostic way

## OpenTelemetry

OpenTelemetry is used for traces and metrics.

## Keptn

The Keptn Lifecycle Toolkit is used for validating the delivery of new artifacts.

## Setup a Kind Cluster with nginx ingress controller

Create Kind Cluster which exposes Port 80 and 443

```shell
kind create cluster --config ./cluster/kind-cluster.yaml
```

Install NGINX Ingress controller
```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```

Apply `ingress.yaml` to expose the application via [http://127.0.0.1.nip.io](http://127.0.0.1.nip.io)

```shell
kubectl apply -f manifests/ingress.yaml
```


### Install Keptn Lifecycle Controller

```shell
helm repo add klt https://charts.lifecycle.keptn.sh &&
helm repo update &&
helm upgrade --install keptn klt/klt --version v0.2.5 --namespace keptn-lifecycle-toolkit-system --create-namespace --wait
```

Afterwards, we can configure KLT to send OpenTelemetry data to a collector applying the following manifest, assuming the collector is installed in the default namespace.

```shell
kubectl apply -f - <<EOF
apiVersion: options.keptn.sh/v1alpha1
kind: KeptnConfig
metadata:
  name: keptnconfig-sample
spec:
  OTelCollectorUrl: 'otel-collector:4317'
  keptnAppCreationRequestTimeoutSeconds: 30
EOF
```

## flagD

The application uses flag as a feature evaluation engine. flagD will automatically get injected using the OpenFeature operator

### Install Cert Manager

```
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.10.1/cert-manager.yaml &&
kubectl wait --for=condition=Available=True deploy --all -n 'cert-manager'
```

### Install Helm Release

```
helm repo add openfeature https://open-feature.github.io/open-feature-operator/ &&
helm repo update &&
helm upgrade --install openfeature openfeature/open-feature-operator
```

#### Upgrading

```
helm upgrade --install openfeature openfeature/open-feature-operator
```

## GitOps

### Install ArgoCD

```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Get your initial password

```
argocd admin initial-password -n argocd
```

### Port Forward
```
kubectl port-forward svc/argocd-server -n argocd 8080:443
```


## How to run this example

