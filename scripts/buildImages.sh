#!/bin/sh

docker build --no-cache ../demoapp/Dockerfile -t aloisreitbauer/featuredemo:V1
docker push aloisreitbauer/featuredemo:V1