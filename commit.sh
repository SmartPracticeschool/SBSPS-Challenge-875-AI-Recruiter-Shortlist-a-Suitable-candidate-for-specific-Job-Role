#!/bin/bash

## Clear contents of a file
git pull origin -y master &&
rm README.md &&
touch README.md

## Make a commit set number of times
for ((i=1; i<=45; i++))
do
  echo "Hello world" >> README.md &&
    git add . &&
    git commit -m "edit: echo hello world" &&
    git push origin master && 
    echo "Done $i"
done