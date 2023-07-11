#!/bin/sh
docker buildx create --use
docker buildx build --push --tag aloisreitbauer/featuredemo:V1 .   
