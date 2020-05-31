#!/bin/bash

git checkout master
rm -rf dist

git checkout -b build
mkdir dist
npm run build
git add dist/
git commit -m "build"

git subtree split --prefix dist -b gh-pages
git push -f origin gh-pages:gh-pages

git checkout master

git branch -D build
git branch -D gh-pages
