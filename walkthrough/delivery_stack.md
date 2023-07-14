
## Clone the sample repository

```shell
git clone https://github.com/AloisReitbauer/progressiveDelivery-masterclass.git
```

## Copy the following files to your repository

```bash
cp -R ../progressiveDelivery-masterclass/gitops ./gitops
```

## Point all manifests to your Repository
```
find . -type f -exec sed -i 's_github.com/AloisReitbauer/progressiveDelivery-masterclass_github.com/YOURHANDLE/YOURREPOSITORY_g' {} +
```

## Push the new config to your repository
```
git add .
git commit -m "Adding delivery stack"
git push
```