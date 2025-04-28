#!/bin/bash

find hubs -name meta.json | parallel --bar node generateConfigs.ts {}
