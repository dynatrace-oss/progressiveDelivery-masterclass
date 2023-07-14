# Progressive Delivery Masterclass

This masterclass shows how to set up a fully progressive delivery
that separates delivery from release management
and progressively rolls out a new release.
It also does targeted rollbacks
by adjusting the targeting rules on the fly.

This is a very simple node.js application
which simply changes text based on a feature flag.

The steps in this exercise are:

1. Set up a Kubernetes cluster,
   install a deployment engine,
   and deploy the application.
1. Implement observability
   - Install, enable, and integrate KLT
     and define a Keptn Application
     that includes all Kubernetes workloads
     included in the deployed application.
1. Study the observability data
   - Install the OpenTelementry collector
     and integrate it into the cluster
   - Install Grafana and Jaeger to provide a dashboard
   - Study the output of DORA metrics and OpenTelemetry
   - Define a Custom Keptn Metric to measure
     the deployment performance for the application.
   - View the `KeptnMetric` data
1. Add a KLT post-deployment evaluation and task
   - Implement a KLT post-deployment evaluation
     that compares the deployment speed to a specified threshhold
   - Add a KLT post-deployment task
     that implements a rollback
     for a failed blue/green deployment
1. Implement OpenFeature and deploy a new feature using flagD
   - Install and integrate OpenFeature in the cluster
     and check the traces
   - Release a new feature with flagD and check the traces
     to see that the new feature has introduced a performance degradation
   - Fix things -- need details

TODO: Make all items in the list a link to the appropriate section below

## Deploy application with ArgoCD on Kubernetes

The first step is to
1. Set up a Kubernetes cluster
1. Install and configure a deployment engine.
   We are using ArgoCD in this exercise
   but you can use any deployment tool you like,
   including `kubectl --apply`.
1. Deploy the application using a standard deployment tool.

### Set up a Kind Cluster with nginx ingress controller

Create Kind Cluster that exposes Port 80 and 443:

TODO: Why those ports and what are they used for?

```shell
kind create cluster --config ./cluster/kind-cluster.yaml
```

TODO: Brief explanation about why we ned NGINX Ingress controller

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

### Install and configure ArgoCD

TODO: Intro verbage that this works with almost any deployment engine

```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Get your initial password:

```
argocd admin initial-password -n argocd
```

Port Forward:

```
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

### Deploy the application with ArgoCD

TODO: Where do they download the application
      and how do they deploy it?

## Implement observability by installing the Keptn Lifecycle Toolkit

Your application has been deployed now 
but you do not really know how well the deployment went
or how well the application is performing.
To gain observability of the deployment
and, later, to be able to validate the delivery of new artifacts.
let us install, enable, and integrate the Keptn Lifecycle Toolkit (KLT).

KLT is completely cloud native,
meaning that virtually all configuration is done
either by modifying Kubernetes resources
that are defined by the Kubernetes API
or by populating Keptn
[custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
KLT includes its own operators
and a scheduler that enhances the functionality
of the Kubernetes scheduler.

### Install KLT

Use the following command sequence to install KLT:

```shell
helm repo add klt https://charts.lifecycle.keptn.sh &&
helm repo update &&
helm upgrade --install keptn klt/klt --version v0.2.5 --namespace keptn-lifecycle-toolkit-system --create-namespace --wait
```
Note that the `helm repo update` command is used for fresh installs
as well as for upgrades.

`--version v0.2.5` is the version of the Helm chart,
not the released version number of KLT.

To verify that the KLT components are installed in your cluster,
run the following command:

```shell
kubectl get pods -n keptn-lifecycle-toolkit-system

The output shows all components that are running on your system.

### Enable KLT

Installing KLT in your cluster activates Keptn metrics.
No other functionality is available until you enable KLT.
To do this, you must create a YAML file for the Kubernetes Namespace resource
and annotate it as follows:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: demoapp
  annotations:
    keptn.sh/lifecycle-toolkit: "enabled"
```

### Integrate KLT into the cluster

To integrate KLT into the cluster,
you must provide
[basic annotations](https://lifecycle.keptn.sh/docs/implementing/integrate/#basic-annotations)
in the pod template specs of your
[Workloads](https://kubernetes.io/docs/concepts/workloads/)
([Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/),
[StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/),
[DaemonSets](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/),
and
[ReplicaSets](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/).

TODO: Provide details about the annotations

TODO: Do we want to use the `keptn.sh` or the `app.kubernetes.io`
      annotations in this exercise?

TODO: Do we want to make them add the annotations in this workshop
or just describe them and point to the files
where we have implemented them?

### Define a Keptn Application

Kubernetes does not have the concept of an application
that includes all the workloads that are included in the application.
KLT provides this with the
[KeptnApp](https://lifecycle.keptn.sh/docs/yaml-crd-ref/app/)
resource,
which can be created and modified manually
but can also be generated automatically using the
[automatic app discovery](https://lifecycle.keptn.sh/docs/implementing/integrate/#use-keptn-automatic-app-discovery),
which is what we are doing in this exercise.

When you added the `part-of` annotation to your workloads,
you implemented the automatic app discovery feature.
Each workload that is annotated with the ?? value for the `part-of` annotation
is included in the application.
You can view the resulting `KeptnApp` resource definition
in the ?? file.

TODO: figure out the name of the app,
      whether using k8s or keptn annotations, etc
      and clean up the prose in the preceding paragraph

## Study the observability data

* Install the OpenTelemetry collector,
  which is used for traces and metrics
* Integrate the OpenTelemetry collector into the cluster
* Install Grafana and Jaeger,
  which provide a dashboard that displays the data
* Deploy the whole platform stack of the container
  and see that it works and does not complain.
* View the data provided

### Integrate OpenTelemetry into the cluster

Use the following command to apply the manifest
that configures KLT to send OpenTelemetry data to the collector.
This assumes that the collector is installed in the default namespace:

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

### Install Prometheus and Grafana

The observability data can be retrieved with command line tools
or can be exported to the dashboard of your choice.
In this exercise, we use Grafana and Jaeger.

TODO: Need to straighten out Prometheus info.
      I guess we install Prometheus into the cluster here
      then create the `KeptnMetricProvider` resource
      as part of defining a `KeptnMetric` resource.
      I will rewrite accordingly.

The following command sets up the resources
necessary for the Prometheus Operator to work.

```shell
kubectl apply --server-side -f manifests/platform/prometheus-grafana/setup &&
kubectl wait --for=condition=Established --all CustomResourceDefinition --namespace=monitoring
```

Once the resources are available,
we can install the Prometheus resources and Grafana.
The following command also pre-configures Grafana
with dashboards to visualize traces and metrics exposed by KLT.

```shell
kubectl apply -f manifests/platform/prometheus-grafana/ &&
kubectl wait --for=condition=available deployment/prometheus-operator -n monitoring --timeout=120s &&
kubectl wait --for=condition=available deployment/prometheus-adapter -n monitoring --timeout=120s &&
kubectl wait --for=condition=available deployment/kube-state-metrics -n monitoring --timeout=120s &&
kubectl wait --for=condition=available deployment/grafana -n monitoring --timeout=120s
```

## Add a Custom Keptn Metric

The default data provided by DORA and OpenTelemetry
can be supplemented with Custom Keptn Metric resources
that are of interest.
Later, we can create evaluations that test whether
a certain threshhold has been met for each of these Keptn Metrics.

Keptn Metrics work with data collected
by one of the standards observability platforms,
each of which is defined as a
[KeptnMetricsProvider](https://lifecycle.keptn.sh/docs/yaml-crd-ref/metricsprovider/)
resouorce.
Currently, Prometheus, Datadog, and Dynatrace are supported.
You can configure multiple observability platforms
and multiple instances of each.

For this exercise,
we will configure a single Prometheus data provider.

TODO: Explain why we are using Prometheus here
      -- just a one-liner

TODO: Existing material installs Prometheus at the same
      time as Grafana and Jaeger.
      Is that what we want?

TODO: Instructions for creating this `KeptnMetricsProvide`
or just say that it has been created and point to the yaml file

In this example, we are interested in the response time
of the deployed application.
So we create a
[KeptnMetric](https://lifecycle.keptn.sh/docs/yaml-crd-ref/metric/)
resource that contains the Prometheus query
and defines the sampling interval to use.

TODO: Instructions for creating this `KeptnMetric`
or just say that it has been created and point to the yaml file.

## Add KLT post-deployment evaluation for deployment speed

TODO: Add info about creating a `KeptnEvaluationDefinition` resource
      that uses the `KeptnMetric` resource defined earlier.
      Then add annotations for the evaluation, etc.

## Add KLT post-deployment task to do a rollback

TODO: Explain how to do this.  Maybe not have them actually do it
      but point to the `KeptnTaskDefinition` that defines the task
      and to the file(s) that include the workload annotations?

TODO: So which runner -- deno or python -- are we using for this task?

TODO: Shall we do a straight rollback or use Argo Rollouts
      or show both?

## Implement OpenFeature and deploy a new feature with it

### Install OpenFeature into the cluster

The example uses OpenFeature
to write feature management code in a vendor agnostic way.
Use the following command sequence to install OpenFeature into the cluster:

```
helm repo add openfeature https://open-feature.github.io/open-feature-operator/ &&
helm repo update &&
helm upgrade --install openfeature openfeature/open-feature-operator
```

### Install Cert Manager

OpenFeature requires its own light-weight certification manager
that is used for various HTTPS operations.
Use the following command sequence to install it:

```
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.10.1/cert-manager.yaml &&
kubectl wait --for=condition=Available=True deploy --all -n 'cert-manager'
```

### Add a new feature that uses flagD

The application uses flag as a feature evaluation engine.
[flagD](https://github.com/open-feature/flagd#readme)
is automatically injected by the OpenFeature operator.
