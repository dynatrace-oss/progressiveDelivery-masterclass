kind delete clusters demo-cluster
kind create cluster --config ../cluster/kind-cluster.yaml
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl patch cm/argocd-cm -n argocd --type=merge -p='{"data":{"resource.customizations.health.argoproj.io_Application":"hs = {}\nhs.status = \"Progressing\"\nhs.message = \"\"\nif obj.status ~= nil then\n  if obj.status.health ~= nil then\n    hs.status = obj.status.health.status\n    if obj.status.health.message ~= nil then\n      hs.message = obj.status.health.message\n    end\n  end\nend\nreturn hs\n"}}'
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s
sleep 10
kubectl apply -f ../gitops/app-of-apps.yaml
argocd admin initial-password -n argocd
kubectl port-forward svc/argocd-server -n argocd 8080:443