$(document).ready(function() {
    var d = new Date();
    var month = d.getMonth() + 1;
    if(parseInt(month) < 10) {
        var temp = '0';
        temp += month;
        month = temp;
    }
    var date = d.getDate();
    var year = d.getFullYear();
    var dateString = year + '-' + month + '-' + date;
    var markToday = function() {
        var list = document.getElementsByClassName('fc-today');
        for(var i = 0 ; i < list.length ; i++) {
            list[i].style.background = '#2ed39e';
            list[i].style.color = '#f8f8f8';
        }
    };
    $('#calendar').fullCalendar({
        theme: true,
        header: {
            left: '',
            center: 'next, prev, title',
            right: ''    
        },
        defaultDate: dateString,
        editable: true,
        eventLimit: true,
        viewRender: markToday // allow "more" link when too many events
    });
    // $('#mini_calendar').dcalendar();
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
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            s = JSON.parse(xhttp.responseText);
            var condition = s.current.condition;
            var html = "<p class='time'>" + "<img src='" + "http://" + condition.icon.slice(2) + "'>" + s.current.temp_c + String.fromCharCode(176) + "</p>";
            html += "<p class='time' style='font-size:15px'>" + condition.text + "</p>";
            $('#weather').html(html);
            mProgress.end(true);
        }
    };
    xhttp.open('GET', "http://api.apixu.com/v1/current.json?key=05fcb9bae03b415baf4145821161708&q=Delhi,IN", true);
    xhttp.send();
    var list = document.getElementsByClassName('fc-other-month');
    for(var i = 0 ; i < list.length ; i++) {
        list[i].style.background = '#f8f8f8';
        list[i].style.color = '#b3b3b3';
    }
    list = document.getElementsByClassName('fc-today');
    for(var i = 0 ; i < list.length ; i++) {
        list[i].style.background = '#2ed39e';
        list[i].style.color = '#f8f8f8';
    }
    $('.fc-day').not('.fc-other-month').click(function(e) {
        // alert(e.pageX + " : " + e.pageY);
        // alert($(this).attr("data-date"));
        // $(this).html("<p>Hello World</p>");
    })
})