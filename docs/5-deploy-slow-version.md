# 5. Deploy a Slow Version of the Application

Intro blurb TODO.

In the codespace:

* Open the file `gitops/manifests/demo-application/deployment.yaml`
* Update the `app.kubernetes.io/version` label to `V2` and the image tag from `V1.1` to `V2`

Commit the changes to GitHub (use the commands below if you don't know how).

```shell
git add gitops/manifests/demo-application/deployment.yaml
git commit -m "rollout V2"
git push
```