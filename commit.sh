#!/bin/bash

# for i in {1..18}
# do
    
# done
for ((i=1; i<=10; i++))
do
  echo "Hello world" >> README.md &&
    git add . &&
    git commit -m "edit: echo hello world" &&
    git push origin master && 
    echo "Done $i"
done