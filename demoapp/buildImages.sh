#!/bin/sh
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 --push --tag aloisreitbauer/featuredemo:V1.1 .
