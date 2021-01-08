#!/bin/bash

ls -a /root/code/vue/echarts-grid-builder-2 | grep -vE "^(.git|.|..)$" | awk '{print "/root/code/vue/echarts-grid-builder-2"$1}' | xargs rm -rf
ls -a | grep -vE "^(.git|.|..|node_modules|.nuxt|.vscode|dist)$" | xargs -I {} cp -Rf {} /root/code/vue/echarts-grid-builder-2/
