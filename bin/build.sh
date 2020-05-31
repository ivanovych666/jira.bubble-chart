#!/bin/bash

cp -r src/* dist/

search='${host}'
replace='https://ivanovych666.com'
replace $search $replace -- dist/atlassian-connect.json dist/gadget/main.html

search='${baseUrl}'
replace='/jira.bubble-chart'
replace $search $replace -- dist/atlassian-connect.json dist/gadget/main.html
