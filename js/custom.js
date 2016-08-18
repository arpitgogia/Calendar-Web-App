$(document).ready(function() {
    $('#left-column').css('height', $(document).height() + "px");
    var d = new Date();
    var s = d.toTimeString();
    $('#clock').html(s.slice(0, s.indexOf(':') + 3));
    var mProgress = new Mprogress({
        template: 3,
        parent: '#progress'
    });
    mProgress.start();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            s = JSON.parse(xhttp.responseText);
            console.log(s.current);
            var condition = s.current.condition;
            var html = "<p class='time'>" + "<img src='" + "http://" + condition.icon.slice(2) + "'>" + s.current.temp_c + String.fromCharCode(176) + "</p>";
            html += "<p class='time' style='font-size:20px'>" + condition.text + "</p>";
            $('#weather').html(html);
            document.getElementById('loader').style.visibility = 'collapse';
            mProgress.end(true);
    };
    xhttp.open('GET', "http://api.apixu.com/v1/current.json?key=05fcb9bae03b415baf4145821161708&q=Delhi,IN", true);
    xhttp.send();
    
})