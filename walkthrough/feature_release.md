# Validate that the feature is working

Enable the ``slow`` feature in ``featureflags.yaml`` by switching ``defaultVariant`` to ``true`` 

```yaml
      "slowFlag":
        state: "ENABLED"
        variants:
          "true": "true"
          "false": "false"
        defaultVariant: "true"
        targeting: {}

```