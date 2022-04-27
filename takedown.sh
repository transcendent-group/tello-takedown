echo takedown

$hostname = $1
$psk = $2

echo $1

networksetup -setairportnetwork en0 $1 $()

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
