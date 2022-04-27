hostname = $1
psk_file = $2
psk = $(cat $psk_file | head -1 | cut -d : -f 2)

networksetup -setairportnetwork en0 $hostname $psk

echo "Press any key to continue"
while [ true ] ; do
read -t 3 -n 1
if [ $? = 0 ] ; then
exit ;
else
echo "waiting for the keypress"
fi
done

go run 
