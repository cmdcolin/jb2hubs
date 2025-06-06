#!/bin/bash

(echo "Can you generate a short bulletted summary of the following git diff that describes species that were added, removed, and changed from UCSC GenArk\n\n" && git diff HEAD website/hubJson) | llm -m claude-4-opus
