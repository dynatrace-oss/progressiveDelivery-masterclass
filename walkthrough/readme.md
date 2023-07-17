# Walkthrough of the Masterclass

## Introduction

This masterclass guides illustrates how to use
Keptn and OpenFeature
to gain better observability and management
of your cloud-native software deployment.

After some initial setup,
you will do the following:

1. Create and deploy a simple application using ArgoCD.
1. Install OpenTelemetry into your application
   for application level observability,
   then install Keptn and see the expanded observability of deployments
   and Dora metrics it provides.
1. Use the Keptn Release lifecycle management tools
   to add an evaluation and task that runs after the ArgoCD deployment.

We have provided scripts as well as commands and files that you can copy
to simplify the mechanics of setting up this environment.
We assume that you have some familiarity with how Kubernetes works.

Before beginning this exercise,
you must provide the following on your local system:

* A github repository where you will store the files and resources
  used for the exercise.
  We recommend that you create a new repository to use just for this exercise.
  See [Create a repo](https://docs.github.com/en/get-started/quickstart/create-a-repo)
  for instructions.
* KIND must be installed locally.
  See
  [KIND Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/)
  for instructions
* Docker must be installed and running locally.
  See
  [Install Docker Engine](https://docs.docker.com/engine/install/)
  for instructions.

## [Step 1: Create cluster](create_cluster.md)

## [Step 2: Create application](create_application.md)

## [Step 3: Create a GitOps deployment](gitops_deployment.md)

## [Step 4: Add OpenTelemetry to the app](opentelemetry.md)

## [Step 5: Add Keptn for deployment observability](keptn.md)

## [Step 6: Implement Custom Keptn metrics](kmetrics.md)

## [Step 7: Add a post-deployment task](post_deployment.md)

## [Step 8: Deploy a broken/slow new version of the app](slow_version.md)

## [Step 9: Add OpenFeature to the app with two new features](openfeature.md)

## [Step 10: Validate that the feature is working](feature_release.md)

