#!/bin/bash

find hubs -name meta.json | parallel --bar node generateHub/generateConfigs.ts {}
