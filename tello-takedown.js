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
    log(' station: ' + data.station);
    log(' ap: ' + data.ap);
    log(' lat:' + gps.Latitude + ' lon:' + gps.Longitude + ' updated_at:' + gps.Updated.String());
});