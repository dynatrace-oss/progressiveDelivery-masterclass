# Create a cluster

We will create a KIND cluster to run this exercise.

To do this, create a ``cluster `` directory in your project
and create a ``kind-cluster.yaml`` file in that directory
that describes this cluster.     

This manifest exposes port ``80`` and port ```443```:

```yaml
apiVersion: kind.x-k8s.io/v1alpha4
kind: Cluster
name: demo-cluster
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
```

Now use the following command to create the cluster using:

```bash
kind create cluster --config ./cluster/kind-cluster.yaml
```

Next: [Create the sample application](create_application.md)
