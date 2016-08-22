$(document).ready(function() {

    // Width excluding the scroll bars
    var w = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    //Height excluding the scroll bars
    var h = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

    //Ajax Config for Update Operation
    var AJAX_OPTIONS = {
        contentType: 'application/json',
        dataType: 'json',
    }

    //Formatting Paramters for X-Editable Fields
    var PARAMFORMATTER = function(params) {
        return JSON.stringify(params);
    }
    

    console.log('Hello 1wewsasdfwe11');
    
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

    //Day Reference for Formatting Needs
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
    
    //Converting a Date to ISO Format With Time Zone Offset
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
    
    //Triggered on each render of the month view, marks the current day in the desired color.
    var markToday = function() {
        list = document.getElementsByClassName('fc-today');
        for(var i = 0 ; i < list.length ; i++) {
            list[i].style.background = '#2ed39e';
            list[i].style.color = '#f8f8f8';
        }
    };
    
    //Triggered on each click of a day, to display the form for creating an event.
    var dayClickEvent = function(date, jsEvent, view) {
        var temp = date.toDate();
        console.log(view);
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
            onShow: function(element) {
                // Adding Border Color to the Popover
                list = document.getElementsByClassName('webui-popover');
                for(var i = 0 ; i < list.length ; i++)
                    list[i].style.borderColor = '#ff8787';
            }
        });
    };

    //Triggered at each click of the event
    var eventClickEvent = function(event, jsEvent, view) {
        start = new Date(event.start);
        start = moment(start).format('k:mm a, dddd, MMM D');
        end = new Date(event.end);
        end = moment(end).format('k:mm a, dddd, MMM D');
        if(event.description.length == 0)
            event.description = " ";
        var button = '';
        if(event.location == 'Check Description' && event.description.search('Link') != -1)
            button = 'disabled';
        //Modal Content; Displays the Event Information
        var modal_content = [
            '<strong><span style="color: #b3b3b3">Where</span></strong>',
            '<br><strong><p><a id="label_location" style="margin-bottom: 2px; color: #777777">' + event.location + '</a></p></strong>',
            '<br><strong><span style="color: #b3b3b3">Start</span></strong>',
            '<br><strong><p><a id="label_time_start" style="margin-bottom: 2px; color: #777777">' + start.toString() + '</a></p></strong>',
            '<br><strong><span style="color: #b3b3b3">End</span></strong>',
            '<br><strong><p><a id="label_time_end" style="margin-bottom: 2px; color: #777777">' + end.toString() + '</a></p></strong>',
            '<br><strong><span style="color: #b3b3b3">Description</label></strong>',
            '<br><strong><p><a id="label_description" style="margin-bottom: 2px; color: #777777">' + event.description + '</a></p></strong>',
            '<input id="delete" value="Delete" type="button" style="margin-top: 20px; border-radius: 2px; float: left; width: inherit; padding: 5px 30px 5px 30px" class="btn-flat">',
            '<p id="event_id" style="color: white">' + event.id + '</span>',    
        ];
        $(this).webuiPopover({
            title: '<span id="title" style="color: #ff8787">' + event.title + '</span>',
            type: 'html',
            position: 'right',
            content: modal_content.join(""),
            animation: 'fade',
            closeable: true,
            onShow: function(element) {
                console.log(element);
                list = document.getElementsByClassName('webui-popover');
                for(var i = 0 ; i < list.length ; i++)
                    list[i].style.borderColor = '#ff8787';
                //Adding X Editable Customization to each Event Paramter

                //Title
                $(element).children().children().find('#title').editable({
                    type: 'text',
                    mode: 'inline',
                    url: '/update',
                    name: 'Name',
                    pk: event.id,
                    ajaxOptions: AJAX_OPTIONS,
                    params: PARAMFORMATTER,
                    success: function(response, newValue) {
                        if(response.Status == 'OK') {
                            event.title = newValue;
                            $('#calendar').fullCalendar('updateEvent', event);
                            WebuiPopovers.hideAll();
                        } else {
                            alert(response.Message);
                        }
                    }
                })

                //Location
                $(element).children().children().find('#label_location').editable({
                    type: 'text',
                    mode: 'inline',
                    url: '/update',
                    name: 'Location',
                    pk: event.id,
                    ajaxOptions: AJAX_OPTIONS,
                    params: PARAMFORMATTER,
                    success: function(response, newValue) {
                        if(response.Status == 'OK') {
                            event.location = newValue;
                            $('#calendar').fullCalendar('updateEvent', event);
                            WebuiPopovers.hideAll();
                        } else {
                            alert(response.Message);
                        }
                    }
                });

                //Start Time
                $(element).children().children().find('#label_time_start').editable({
                    type: 'combodate',
                    template: 'D MMM YYYY  HH:mm',
                    format: 'YYYY-MM-DDTHH:mm:ss.sssZ',
                    viewformat: 'k:mm a, dddd, MMM D',
                    mode: 'inline',
                    url: '/update',
                    name: 'Start',
                    pk: event.id,
                    ajaxOptions: AJAX_OPTIONS,
                    params: PARAMFORMATTER,
                    success: function(response, newValue) {
                        if(response.Status == 'OK') {
                            event.start = newValue;
                            $('#calendar').fullCalendar('updateEvent', event);
                            WebuiPopovers.hideAll();
                        } else {
                            alert(response.Message);
                        }
                    }
                });

                //End Time
                $(element).children().children().find('#label_time_end').editable({
                    type: 'combodate',
                    template: 'D MMM YYYY  HH:mm',
                    format: 'YYYY-MM-DDTHH:mm:ss.sssZ',
                    viewformat: 'k:mm a, dddd, MMM D',
                    mode: 'inline',
                    url: '/update',
                    name: 'End',
                    pk: event.id,
                    ajaxOptions: AJAX_OPTIONS,
                    params: PARAMFORMATTER,
                    success: function(response, newValue) {
                        if(response.Status == 'OK') {
                            event.end = newValue;
                            $('#calendar').fullCalendar('updateEvent', event);
                            WebuiPopovers.hideAll();
                        } else {
                            alert(response.Message);
                        }
                    }
                });

                //Description
                $(element).children().children().find('#label_description').editable({
                    type: 'textarea',
                    mode: 'inline',
                    url: '/update',
                    name: 'Description',
                    pk: event.id,
                    ajaxOptions: AJAX_OPTIONS,
                    params: PARAMFORMATTER,
                    success: function(response, newValue) {
                        if(response.Status == 'OK') {
                            event.description = newValue;
                            $('#calendar').fullCalendar('updateEvent', event);
                            WebuiPopovers.hideAll();
                        } else {
                            alert(response.Message);
                        }
                    }
                });
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
    // var d = new Date();
    var d = moment().format('h:mm a');
    console.log(d);
    var html = '<big>' + d.slice(0, 5) + '</big>' + '<small><small><small><small>' + d.slice(5) + '</small></small></small></small>'
    $('#clock').html(html);
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
        // $(this).parent().find('#all-day').change(function() {
        //     if($(this).is(":checked")) {
        //         console.log('checked');
        //     } else {
        //         console.log('unchecked');
        //     }
        // });
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
                all_day: all_day,
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


    $(document).on("click", "#settings", function() {
        $(this).webuiPopover({
            title: '<span style="color: #ff8787">Sync Google Calendar</span>',
            type: 'html',
            position: 'right',
            content: $("#modal_login").html(),
            animation: 'fade',
            closeable: true,
            onShow: function() {
                list = document.getElementsByClassName('webui-popover');
                for(var i = 0 ; i < list.length ; i++)
                    list[i].style.borderColor = '#ff8787';
            }
        });
    });
    $(document).on("click", "#auth-button", function(e) {
        handleAuthClick(e);
    });
    $(document).on("click", "#sync", function(e) {
        loadCalendarApi();
    });
    var CLIENT_ID = '705643443576-1geno5j828oflrhsefln11bl0k0n00g7.apps.googleusercontent.com';
    var SCOPES = ["https://www.googleapis.com/auth/calendar"];

    /**
     * Check if current user has authorized this application.
     */
    function checkAuth() {
        gapi.auth.authorize({
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
        }, handleAuthResult);
    };

    /**
     * Handle response from authorization server.
     *
     * @param {Object} authResult Authorization result.
     */
    function handleAuthResult(authResult) {
        // var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
            // authorizeDiv.style.display = 'none';
            localStorage.setItem('AUTHORIZED', true);
        } else {
            // authorizeDiv.style.display = 'inline';
        }
    }

    /**
    * Initiate auth flow in response to user clicking authorize button.
    *
    * @param {Event} event Button click event.
    */
    function handleAuthClick(event) {
        WebuiPopovers.hideAll();
        gapi.auth.authorize({
            client_id: CLIENT_ID, 
            scope: SCOPES, 
            immediate: false
        }, handleAuthResult);
        return false;
    }

    /**
    * Load Google Calendar client library. List upcoming events
    * once client library is loaded.
    */
    function loadCalendarApi() {
        // console.log(localStorage.getItem('AUTHORIZED'));
        // if(localStorage.getItem('AUTHORIZED') == true)
            gapi.client.load('calendar', 'v3', listUpcomingEvents);
        // else
            // alert('Not Signed Into Google');
    }

    /**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
    function listUpcomingEvents() {
        var request = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        });

        request.execute(function(resp) {
            var events = resp.items;
            if (events.length > 0) {
                var event_count = localStorage.getItem('calendar_event_count');
                if(event_count == null)
                    event_count = 0;
                for (i = 0; i < events.length; i++) {
                    var event = events[i];
                    var start_date_time = null;
                    var end_date_time = null;
                    var all_day = false;
                    if(event.start.dateTime == undefined)
                        start_date_time = event.start.date + 'T00:00:00.000+05:30', all_day = true;
                    else
                        start_date_time = event.start.dateTime;

                    if(event.end.dateTime == undefined)
                        end_date_time = event.end.date + 'T00:00:00.000+05:30', all_day = true;
                    else
                        end_date_time = event.end.dateTime;
                        
                    var local_event = {
                        start: start_date_time,
                        end: end_date_time,
                        location: 'Check Description',
                        description: '<a href="' + event.htmlLink + '"> Link <i class="fa fa-external-link"></i></a>',
                        id: event_count,
                        title: event.summary,
                        allDay: all_day
                    };
                    console.log(local_event);
                    var data = {
                        event_name: event.summary,
                        location: 'Check Description',
                        start_date: start_date_time,
                        end_date: end_date_time,
                        all_day: all_day,
                        description: '<a href="' + event.htmlLink + '"> Link <i class="fa fa-external-link"></i></a>',
                        id: event_count
                    };
                    xhttp3 = new XMLHttpRequest();
                    xhttp3.onreadystatechange = function() {
                        if (xhttp3.readyState == 4 && xhttp3.status == 200) {
                            data = JSON.parse(xhttp3.responseText);
                            if(data.Status == 'OK') {
                                console.log("Successful");
                                $('#calendar').fullCalendar('renderEvent', local_event, true);
                                event_count = parseInt(event_count) + 1;
                                localStorage.setItem('calendar_event_count', event_count);
                            } else {
                                alert(data.Message);
                            }
                        }
                    };
                    xhttp3.open('POST', '/create');
                    xhttp3.setRequestHeader('Content-Type', 'application/json');
                    xhttp3.send(JSON.stringify(data));
                }
            } else {
                appendPre('No upcoming events found.');
            }
        });
    }
});