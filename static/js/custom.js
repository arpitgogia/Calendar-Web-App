$(document).ready(function() {

    var w = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    var h = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;


    console.log('alsdjn');
    var event_count = localStorage.getItem('calendar_event_count');
    if(event_count == null)
        event_count = 0;

    var d = new Date();
    var month = d.getMonth() + 1;
    
    if(parseInt(month) < 10) {
        var temp = '0';
        temp += month;
        month = temp;
    }

    var day_ref = {
        0: 'sun',
        1: 'mon',
        2: 'tue',
        3: 'wed',
        4: 'thu',
        5: 'fri',
        6: 'sat',
    }
    var date = d.getDate();
    var year = d.getFullYear();
    var dateString = year + '-' + month + '-' + date;
    var formatDate = function(now) {
            var tzo = -now.getTimezoneOffset();
            var dif = tzo >= 0 ? '+' : '-';
            var pad = function(num) {
                var norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return now.getFullYear() 
            + '-' + pad(now.getMonth()+1)
            + '-' + pad(now.getDate())
            + 'T' + pad(now.getHours())
            + ':' + pad(now.getMinutes()) 
            + ':' + pad(now.getSeconds()) 
            + dif + pad(tzo / 60) 
            + ':' + pad(tzo % 60);
    };
    
    //Triggered on each render of the month view, displays the current day in the desired color.
    var markToday = function() {
        list = document.getElementsByClassName('fc-today');
        for(var i = 0 ; i < list.length ; i++) {
            list[i].style.background = '#2ed39e';
            list[i].style.color = '#f8f8f8';
            // var day = new Date().getDay();
            // day = day_ref[day];
            // class_name = 'fc-day-header ';
            // class_name += ('fc-' + day);
            // console.log(class_name);
            // var list2 = document.getElementsByClassName(class_name);
            // for(var j = 0 ; j < list2.length ; j++)
            //     list2[i].style.background = 'rgba(0, 0, 0, 0.15)';
        }
    };
    
    //Triggered on each click of a day, to display the form for creating an event.
    var dayClickEvent = function(date, jsEvent, view) {
        var temp = date.toDate();
        // console.log(temp);
        date = date.format("dddd, D MMMM YYYY");
        date = '<span style="color: #ff8787">' + date + '</span>'
        $(this).webuiPopover({
            title: date,
            type: 'html',
            position: 'right',
            content: $('#modal_add').html(),
            animation: 'fade',
            closeable: true,
            cache: false,
            onShow: function() {
                list = document.getElementsByClassName('webui-popover');
                for(var i = 0 ; i < list.length ; i++)
                    list[i].style.borderColor = '#ff8787';
                // document.getElementById('start_date').value = d.slice(0, d.indexOf('T'));
            }
        });
    };

    var eventClickEvent = function(event, jsEvent, view) {
        start = new Date(event.start);
        if(event.description.length == 0)
            event.description = " ";
        var modal_content = [
            '<strong><span style="color: #b3b3b3">Where</span></strong>',
            '<br><strong><p id="label_location" style="margin-bottom: 2px; color: #777777">' + event.location + '</p></strong>',
            '<br><strong><span style="color: #b3b3b3">When</span></strong>',
            '<br><strong><p id="label_time" style="margin-bottom: 2px; color: #777777">' + start.toString() + '</p></strong>',
            '<br><strong><span id="label_description" style="color: #b3b3b3">Description</label></strong>',
            '<br><strong><p id="label_description" style="margin-bottom: 2px; color: #777777">' + event.description + '</p></strong>',
            '<input id="delete" value="Delete" type="button" style="margin-top: 20px; border-radius: 2px; float: left; width: auto; padding: 5px 30px 5px 30px" class="btn-flat">',
            '<input id="edit" value="Edit" type="button" style="margin-top: 20px; border-radius: 2px; color: white; margin-right: 2px; background: #ff8787; float: right; width: auto; padding: 5px 30px 5px 30px" class="btn-flat">',
            '<p id="event_id" style="color: white">' + event.id + '</span>',    
            ];
        $(this).webuiPopover({
            title: '<span style="color: #ff8787">' + event.title + '</span>',
            type: 'html',
            position: 'right',
            content: modal_content.join(""),
            animation: 'fade',
            closeable: true,
            onShow: function() {
                list = document.getElementsByClassName('webui-popover');
                for(var i = 0 ; i < list.length ; i++)
                    list[i].style.borderColor = '#ff8787';
            }
        });
    };

    var event_list = [];
    var xhttp1 = new XMLHttpRequest();
    xhttp1.onreadystatechange = function() {
        if (xhttp1.readyState == 4 && xhttp1.status == 200) {
            events = JSON.parse(xhttp1.responseText);
            if(events.length > 0) {
                for(var i = 0 ; i < events.length ; i++) {
                    var event = {
                        id: events[i].Event_ID,
                        title: events[i].Name,
                        start: events[i].Start,
                        location: events[i].Location,
                        end: events[i].End,
                        description: events[i].Description
                    }
                    event_list.push(event);
                }
            }
            if(event_list.length == 0) {
                localStorage.setItem('calendar_event_count', 0);
                event_count = 0;
            }

            $('#calendar').fullCalendar({
                theme: true,
                header: {
                    left: '',
                    center: 'next, prev, title',
                    right: ''    
                },
                height: h,
                width: w,
                defaultDate: dateString,
                editable: true,
                eventLimit: true,
                viewRender: markToday,
                dayClick: dayClickEvent,
                eventClick: eventClickEvent,
                events: event_list
            });
            
        }
    };
    xhttp1.open('GET', "/get_events", true);
    xhttp1.send();
    
    //Adjusting the height of the left column.
    $('#left-column').css('height', h.toString() + "px");
    
    //Creating the clock
    var d = new Date();
    var s = d.toTimeString();
    $('#clock').html(s.slice(0, s.indexOf(':') + 3));
    // $('.fc-right').html('<i id="sync" class="fa fa-refresh" onclick="test" colour="#2bc493"></i>');
    // $('.fc-right').html('<i id="refresh" onclick="formatDate" class="fa fa-refresh"></i>');
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (xhttp2.readyState == 4 && xhttp2.status == 200) {
            s = JSON.parse(xhttp2.responseText);
            var condition = s.current.condition;
            var html = "<p class='time'>" + "<img src='" + "http://" + condition.icon.slice(2) + "'>" + s.current.temp_c + String.fromCharCode(176) + "</p>";
            html += "<p class='time' style='font-size:15px'>" + condition.text + "</p>";
            $('#weather').html(html);
        }
    };
    xhttp2.open('GET', "http://api.apixu.com/v1/current.json?key=05fcb9bae03b415baf4145821161708&q=Delhi,IN", true);
    xhttp2.send();
    
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
    list = document.getElementsByTagName('td');

    //Saving an event

    $(document).on("click", "#cancel", function() {
        WebuiPopovers.hideAll();
    });
    $(document).on("click", "#save", function() {
        var event_name = $(this).parent().find('#event_name').val();
        var location = $(this).parent().find('#location').val();
        var start_date = $(this).parent().find('#start_date').val();
        var start_time = $(this).parent().find('#start_time').val();
        var end_date = $(this).parent().find('#end_date').val();
        var end_time = $(this).parent().find('#end_time').val();
        
        start_date = new Date(start_date.slice(0, 4), (parseInt(start_date.slice(5, 7)) - 1).toString(), start_date.slice(8), start_time.slice(0, 2), 
                    start_time.slice(3));
        end_date = new Date(end_date.slice(0, 4), (parseInt(end_date.slice(5, 7)) - 1).toString(), end_date.slice(8), end_time.slice(0, 2), 
                    end_time.slice(3));

        start_date = formatDate(start_date);
        end_date = formatDate(end_date);

        var all_day = $(this).parent().find('#all-day').prop('checked');
        var description = $(this).parent().find('#description').val();

        var event = {
            title: event_name,
            allDay: all_day,
            start: start_date,
            end: end_date,
            description: description,
            location: location,
            id: event_count
        };

        var data = {
                event_name: event_name,
                location: location,
                start_date: start_date,
                end_date: end_date,
                all_day: false,
                description: description,
                id: event_count
            };
        xhttp3 = new XMLHttpRequest();
        xhttp3.onreadystatechange = function() {
            if (xhttp3.readyState == 4 && xhttp3.status == 200) {
                data = JSON.parse(xhttp3.responseText);
                if(data.Status == 'OK') {
                    $('#calendar').fullCalendar('renderEvent', event, true);
                    event_count = parseInt(event_count) + 1;
                    localStorage.setItem('calendar_event_count', event_count);
                    WebuiPopovers.hideAll();
                } else {
                    alert(data.Message);
                }
            }
        };
        xhttp3.open('POST', '/create');
        xhttp3.setRequestHeader('Content-Type', 'application/json');
        xhttp3.send(JSON.stringify(data));
    });


    $(document).on("click", "#delete", function() {
        var e_id = parseInt($(this).parent().find('#event_id').html());
        console.log(e_id);
        var data2 = {
            id: e_id
        };
        xhttp4 = new XMLHttpRequest();
        xhttp4.onreadystatechange = function() {
            if(xhttp4.readyState == 4 && xhttp4.status == 200) {
                console.log(xhttp4.responseText)
                data3 = JSON.parse(xhttp4.responseText);
                if(data3.Status == 'OK') {
                    $('#calendar').fullCalendar('removeEvents', e_id);
                    WebuiPopovers.hideAll();
                } else {
                    alert(data3.Message);
                }
            }
        }
        xhttp4.open('POST', '/remove');
        xhttp4.setRequestHeader('Content-Type', 'application/json');
        xhttp4.send(JSON.stringify(data2));
    });
    // document.getElementsByClassName('fc-right')[0].innerHTML = '<p>Hello</p>'
    // document.getElementsByClassName('fc-right')[0].innerHTML = '<i id="sync" class="fa fa-refresh" onclick="test" colour="#2bc493"></i>';
});