# Sample project for KCD Talk


## The application

This is a very simple node.js application which simply changes text based on a feature flag

## OpenFeature

The example uses OpenFeature to write feature management code in a vendor agnostic way

## OpenTelemetry

OpenTelemetry is used for traces and metrics.

## Keptn

The Keptn Lifecycle Toolkit is used for validating the delivery of new artifacts.

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
  OTelCollectorUrl: 'otel-collector.default.svc.cluster.local:4317'
  keptnAppCreationRequestTimeoutSeconds: 30
EOF
```

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

