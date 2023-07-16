# Create a cluster

Create a directory ``cluster `` in your project to create a KIND cluster that exposes port ``80`` and port ```443```

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

Then create the cluster using:

```bash
kind create cluster --config ./cluster/kind-cluster.yaml
```

Next: [Create the sample application](create_application.md