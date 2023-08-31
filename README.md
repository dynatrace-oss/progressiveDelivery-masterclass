# Progressive Delivery Masterclass

This masterclass shows how to set up a full progressive delivery platform using open source tooling

The masterclass uses a very simple node.js demo application

You can find the detailed walkthrough instructions [here](/walkthrough/readme.md)

## Codespaces

This repository is configured to work with Codespaces. To use it, click the Code button and select "Open with Codespaces". This will create a new Codespace for you with all the tools you need to complete the masterclass.

After starting the Codespace, you can open the terminal and run the following command to start the walkthrough:

```bash
make create
```

This will create a Kind Cluster, install ArgoCD and deploy the demo application. You can then either access Argo CD via the port-forward or by clicking the "Open in Browser" button in the bottom right corner of the Codespace.

To access the services via ingress, you need the [GitHub CLI](https://cli.github.com/) installed. You can then run the following command to create a port-forward to the ingress controller:

```bash
gh codespace ports forward 80:80
gh codespace ports forward 443:443
```
