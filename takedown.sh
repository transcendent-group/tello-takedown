#!/bin/bash
psk=$(john $2 --show | head -1 | cut -d : -f 2)

echo $psk

networksetup -setairportnetwork en0 $1 $psk

echo "Press enter to continue"
read discard

./flip