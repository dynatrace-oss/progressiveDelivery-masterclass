#!/bin/sh

docker buildx build --platform linux/arm64,linux/amd64 --push -t aloisreitbauer/featuredemo:V1 -f ./demoapp/Dockerfile .