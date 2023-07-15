# Add OpenFeature to the app

## Add OpenFeature to the app

Add the following code to the ``app.js`` file:

``` Javascript

/**
 * OpenFeature relevant code
 */

const OpenFeature = require('@openfeature/js-sdk').OpenFeature;
const FlagdProvider = require('@openfeature/flagd-provider').FlagdProvider;

const openFeatureConf = {
  HOST : process.env.FLAGD_HOST || 'localhost',
  PORT : process.env.FLAGD_PORT || '8031'
}
console.log ("Connecting to flagD at %s:%s", openFeatureConf.HOST, openFeatureConf.PORT)

/**
 * OpenFeature init code
 */

OpenFeature.addHooks(new TracingHook(), new MetricsHook());

OpenFeature.setProvider(new FlagdProvider({
    host: openFeatureConf.HOST,
    port: openFeatureConf.PORT
}))

const featureFlags = OpenFeature.getClient();
```

## Add feature flags to application method

Also adjust the ``app.get()`` method to validate feature flags:

``` JavaScript
app.get('/', async(req, res) => {
  const myFlag = await featureFlags.getBooleanValue('my-flag', false);
  const slowFlag = await featureFlags.getBooleanValue('slowFlag', false);

  if (slowFlag){
    await new Promise(r => setTimeout(r, 20000));
  }

  var body = "<html><title>Demo App</title><body><h1>";
  if (myFlag){
    body += '+++ Hello World! +++ ';
  } else {
    body += 'Hello World!';
  }
  body += "</h1></body></html>";
  res.send (body)
})
```

## Add the feature definition

You must create a ``featureflags.yaml`` manifest for the new features:

``` yaml
apiVersion: core.openfeature.dev/v1alpha2
kind: FeatureFlagConfiguration
metadata:
  name: featureflagconfiguration-sample
  namespace: demo
spec:
  featureFlagSpec:
    flags:
      my-flag:
        state: "ENABLED"
        variants:
          "true": true
          "false": false
        defaultVariant: "false"
        targeting: {}
      slowFlag:
        state: "ENABLED"
        variants:
          "true": true
          "false": false
        defaultVariant: "false"
        targeting: {}
```

You also need a ``flagsource.yaml`` manifest to properly configure the operator:

```yaml
apiVersion: core.openfeature.dev/v1alpha3
kind: FlagSourceConfiguration
metadata:
  name: flagsourceconfiguration-sample
  namespace: demo
spec:
  sources:
  - source: demo/featureflagconfiguration-sample
    provider: kubernetes
  port: 8030
```

## Create the manifests/apps directory and execute

The following script creates the ``manifests/apps`` directory
and executes:

Create the following directory ``manifests/apps`` and execute

```bash

curl -sL -o featureflags.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/manifests/app/featureflags.yaml

curl -sL -o flagsource.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/manifests/app/flagsource.yaml

```

Next: [Validate that the feature is working](feature_release.md)

