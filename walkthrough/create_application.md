# Create the basic application

## First, we will create a basic node.js express application

Create a ``demoapp``  directory and an ```apps.js``` file in this directory

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

app.get('/', async(req, res) => {}

  var body = "<html><title>Demo App</title><body><h1>";
  body += 'Hello World!';
  body += "</h1></body></html>";
  res.send (body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

## Installing packages

Download the ``package.json`` file into the ``demoapps`` directory

Get the package.json file to install dependencies. This will install all required dependencies for the entire masterclass. 

``` bash
curl https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/demoapp/package.json > package.json
```


Run ``npm install``


## Verify everything is working

Run ``node app.js `` and you should be able to access the website on port ``3000``


## Next we build our container image

Craete a ``Dockerfile`` in the ``demoapp`` directory which allows you to build the image

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


