#!/bin/sh

cd ../demoapp
docker buildx create --use
docker buildx build --platform linux/arm64,linux/amd64 --push -t aloisreitbauer/featuredemo:V1 -f ./Dockerfile .