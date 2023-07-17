# Add a post-deployment task

> **_NOTE:_** The following configuration has already been deployed to your cluster. This page is for your information only.

> **_NOTE:_** The manifests shows in this document can be found [here](../gitops/manifests/demo-application/keptn.yaml)

Keptn can run tasks and evaluation as part of the deployment-lifecycle.
To run a load-test on the application and then run an evaluation,
add the following annotations to the appropriate Workload manifest
which, for this exercise, is the `Deployment` manifest:

```yaml
keptn.sh/post-deployment-tasks: load-test
keptn.sh/post-deployment-evaluations: demoapp-healty-check
```

## Define the Keptn task

The `load-test` Keptn task is implemented as a
[KeptnTaskDefinition](https://lifecycle.keptn.sh/docs/yaml-crd-ref/taskdefinition/)
CRD, using Deno, which uses a syntax similar to JavaScript or TypeScript.
You could instead use the Python runner to define tasks,
or you could use a standard Kubernetes container
for which you define the `image` and properties to use.

The following manifest creates a Keptn task that runs
[K6](https://k6.io/) for a load test.
The actual script could be coded inline in the manifest but,
in this case, it is an external script that is referenced:

```yaml
apiVersion: lifecycle.keptn.sh/v1alpha3
kind: KeptnTaskDefinition
metadata:
  name: load-test
  namespace: demo
spec:
  container:
    name: testy-test
    image: grafana/k6:0.45.0
    command:
      - 'k6'
      - 'run'
      - 'https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/manifests/demo-application/load.js'
```
## Add the load test

```Javascript
import { sleep } from"k6";
import http from "k6/http";

export let options = {
  duration: "1m",
  vus: 50,
  thresholds: {
    http_req_duration: ["p(95)<500"] // 95 percent of response times must be below 500ms
  }
};

export default function() {
  http.get("http://demoapp.demo/");
  sleep(1);
};
```

## Define Keptn Evaluation

A Keptn Evaluation defines a target value
for an existing `KeptnMetric` resource,
so the `KeptnMetric` becomes the SLI
and the evaluation serves as the SLO.

Using the `demoapp-latency` Keptn Metric we defined above,
create a
[KeptnEvaluationDefinition](https://main.lifecycle.keptn.sh/docs/yaml-crd-ref/evaluationdefinition/)
that tests whether the target value is less that `0.3`:

```yaml
apiVersion: lifecycle.keptn.sh/v1alpha3
kind: KeptnEvaluationDefinition
metadata:
  name: demoapp-healty-check
  namespace: demo
spec:
  objectives:
    - keptnMetricRef:
        name: demoapp-latency
        namespace: demo
      evaluationTarget: "<0.3"
```

Next: [Deploy a broken/slow new version of the app](slow_version.md)

