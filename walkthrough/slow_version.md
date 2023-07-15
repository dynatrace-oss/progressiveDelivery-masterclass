# Deploy a broken/slow new version of the app

Now we will deploy a slower version of the application. Therefore we need to change the image in the ``deployment.yaml`` of the app to:

```yaml
      labels:
        app.kubernetes.io/part-of: demoapp
        app.kubernetes.io/name: featuredemo
        app.kubernetes.io/version: V2
        app: demoapp
      # This is the annotation for OpenFeature Operator
      annotations:     
        openfeature.dev/enabled: "true"
        openfeature.dev/flagsourceconfiguration: "flags/flagsourceconfiguration-sample"     
    spec:
      containers:
      - name: demoapp
        image: aloisreitbauer/featuredemo:V2
        imagePullPolicy: Always

```

*Note:* You must change the ``app.kubernetes.io.version`` label and the ``image`` to the new version

Next: [Add OpenFeature to the app with two new features](openfeature.md)

