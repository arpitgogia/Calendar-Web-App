$(document).ready(function() {
    $('#left-column').css('height', $(document).height() + "px");
    var d = new Date();
    var s = d.toTimeString();
    $('#clock').html(s.slice(0, s.indexOf(':') + 3));
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            s = JSON.parse(xhttp.responseText);
            var html = "<p class='time'>" + s.current.temp_c + String.fromCharCode(176) + "</p>";
            $('#weather').html(html);
    };
    xhttp.open('GET', "http://api.apixu.com/v1/current.json?key=05fcb9bae03b415baf4145821161708&q=Delhi,IN", true);
    xhttp.send();
})