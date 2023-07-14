# Add OpenFeature to the app

## Add OpenFeature 

Adding the following code to the ``app.js`` file

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

OpenFeature.addHooks(new OpenTelemetryHook());

OpenFeature.setProvider(new FlagdProvider({
    host: openFeatureConf.HOST,
    port: openFeatureConf.PORT
}))

const featureFlags = OpenFeature.getClient();
```

## Add feature flags to application method

Also adjust the ``app.get()`` method to validate feature flags

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


