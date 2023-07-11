#!/bin/sh

docker buildx create --use
docker buildx build --platform linux/arm64,linux/amd64 --push -t aloisreitbauer/featuredemo:V1 -f ../demoapp/Dockerfile .