FROM node:19-bullseye-slim AS build
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install

FROM gcr.io/distroless/nodejs:16
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app
CMD ["app.js"]