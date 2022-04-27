// Filenames without a path reference current working directory

var handshakesFileName = '~/bettercap-wifi-handshakes.pcap'; //TODO: Where bettercap should store the captured handshake packets 
var hcxpcapngtool = 'hcxpcapngtool'; // (Full path to) executable hcxpcapngtool
var hashcatFormat22000FileName = 'hash.hc22000'; // Filename for the converted 22000 format hashes for hashcat
var hashcat = 'hashcat'; // (Full path to) executable hashcat
var hashcatHomePath = '/usr/local/share/hashcat/OpenCL/'; // For hashcat to execute properly on MacOS
var crackedFileName = 'tello-psk.txt'; // Filename for the output of cracking process
var wordlistFileName = 'wordlist.txt'; // Dict for cracking
var john = 'john'; // (Full path to) executable john
var johnWPApskFileName = 'wpapsk.john';