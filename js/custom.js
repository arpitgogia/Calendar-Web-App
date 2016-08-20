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
    
    //Triggered on each render of the month view, displays the current day in the desired color.
    var markToday = function() {
        var list = document.getElementsByClassName('fc-today');
        for(var i = 0 ; i < list.length ; i++) {
            list[i].style.background = '#2ed39e';
            list[i].style.color = '#f8f8f8';
        }
    };
    
    //Triggered on each click of a day, to display the form for creating an event.
    var dayClickEvent = function(date, jsEvent, view) {
        date = date.format("dddd, D MMMM YYYY");
        date = '<span style="color: #ff8787">' + date + '</span>'
        $(this).webuiPopover({
            title: date,
            type: 'html',
            position: 'right',
            content: $('#modal_add').html(),
            animation: 'fade',
            closeable: true,
            onShow: function() {
                list = document.getElementsByClassName('webui-popover');
                for(var i = 0 ; i < list.length ; i++)
                    list[i].style.borderColor = '#ff8787';
            }
        });
    };

    var eventClickEvent = function(event, jsEvent, view) {
        var modal_content = [
            '<strong><span style="color: #b3b3b3">Where</span></strong>',
            '<br><strong><p id="label_location" style="margin-bottom: 2px; color: #777777">' + event.location + '</p></strong>',
            '<br><strong><span style="color: #b3b3b3">When</span></strong>',
            '<br><strong><p id="label_time" style="margin-bottom: 2px; color: #777777">' + event.start_date + '</p></strong>',
            '<br><strong><span id="label_description" style="color: #b3b3b3">Description</label></strong>',
            '<br><strong><p id="label_description" style="margin-bottom: 2px; color: #777777">' + event.description + '</p></strong>',
            '</div>'];
        console.log(modal_content.join());
        $(this).webuiPopover({
            title: event.title,
            type: 'html',
            position: 'right',
            content: modal_content.join(),
            closeable: true,
            onShow: function() {
                list = document.getElementsByClassName('webui-popover');
                for(var i = 0 ; i < list.length ; i++)
                    list[i].style.borderColor = '#ff8787';
            }
        });
    };

    //Initialize the calendar
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
        viewRender: markToday,
        dayClick: dayClickEvent,
        eventClick: eventClickEvent
    });
    
    //Adjusting the height of the left column.
    $('#left-column').css('height', $(document).height() + "px");
    
    //Creating the clock
    var d = new Date();
    var s = d.toTimeString();
    $('#clock').html(s.slice(0, s.indexOf(':') + 3));
    
    var mProgress = new Mprogress({
        template: 3,
        parent: '#progress'
    });
    mProgress.start();
    //Retrieving the weather
    //TO-DO: Fix weather icons according to specifications
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

    $('td').css('text-align', 'left');
    $('td').css('margin-top', '10px');

    //Saving an event

    $(document).on("click", "#save", function() {
        var event_name = $(this).parent().find('#event_name').val();
        // var event_name = $('.webui-popover #event_name').val();
        var location = $(this).parent().find('#location').val();
        var start_date = $(this).parent().find('#start_date').val() + 'T15:37:48+00:00';
        var end_date = $(this).parent().find('#end_date').val() + 'T15:37:48+00:00';
        var all_day = $(this).parent().find('#all-day').prop('checked');
        var description = $(this).parent().find('#description').val();
        var event = {
            title: event_name,
            allDay: false,
            start: start_date,
            end: end_date,
            description: description,
            location: location
        };
        console.log(event);
        $('#calendar').fullCalendar('renderEvent', event, true);
        // console.log(event_name);
    });
});