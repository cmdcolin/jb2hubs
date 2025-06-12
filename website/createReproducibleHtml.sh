#!/bin/bash

node createReproducibleHtml.js $1 $1.stable
mv $1.stable $1
