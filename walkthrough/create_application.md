# Create the sample application

Now we will create the sample application
that we are going to use.
This is a very simple node.js application
that merely changes text based on a feature flag.

## Create a basic node.js express application

Create a `demoapp`  directory and an `app.js` file in this directory
that has the following content:

``` JavaScript
/**
 * express code
 */

const express = require('express')
const app = express()
const port = 3000

/**
 * health endpoint
 */

app.get ("/healthz", async(req, res) => {
  res.send("All good")
})

/**
 * Minimal application code
 */

app.get('/', async(req, res) => {

  var body = "<html><title>Demo App</title><body><h1>";
  body += 'Hello World!';
  body += "</h1></body></html>";
  res.send (body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

## Install packages

We need to install the OpenTelemetry and OpenFeature packages
for use in this exercise.
To save time, we have created a package that does this.
To install these packages:

1. Download the `package.json` file into the `demoapps` directory

1. Get the package.json file to install dependencies.
   This command installs all required dependencies for the entire masterclass: 

   ``` bash
   curl -sL -o package.json https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/demoapp/package.json
   ```

1. Change directory into the `demoapp` if you aren't already there: `cd demoapp`
1. Run `npm install`

## Verify that everything works

Run `node app.js` and you should be able to access the website on port `3000`

## Build container image

Create a `Dockerfile` in the `demoapp` directory which allows you to build the image:

``` Docker 
FROM node:19-bullseye-slim AS build
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install

FROM gcr.io/distroless/nodejs:16
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app
CMD ["app.js"]
```

Next: [GitOps Deployment](gitops_deployment.md)

