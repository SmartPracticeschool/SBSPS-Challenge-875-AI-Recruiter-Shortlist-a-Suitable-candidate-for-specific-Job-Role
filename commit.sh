#!/bin/bash

# for i in {1..18}
# do
    
# done

echo "Hello world" >> README.md &&
git add . &&
git commit -m "edit: echo hello world" &&
git push origin master && 
echo "done"