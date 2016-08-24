from flask import Flask, request, render_template, Response, make_response
from pymongo import MongoClient
import json, sys
app = Flask(__name__)
client = MongoClient()
db = client.calendar
event_id = 0

"""
    Database Schema:
        "Name": String, 
        "Location": String, 
        "Start": ISO Date String, 
        "End": ISO Date String, 
        "All_Day": Boolean Flag, 
        "Description": String describing the Event,
        "Event_ID": Identifier according to RFC and Google Specifications,
        "Type": (Local/Google) Identifying the source of the event
"""

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

"""
    Obtaining Events from the DB
"""
@app.route('/get_events', methods=['GET'])
def get_events():
    data = db.events.find({}, {"_id":0})
    # s = json.loads(data)
    result = []

    for d in data:
        result.append(d)
    if len(result) == 0:
        result = {}
        result['message'] = 'No Events in DB'
    
    print json.dumps(result)
    resp = Response(json.dumps(result), mimetype='application/json')
    resp.headers.set('Access-Control-Allow-Origin', '*')
    return resp

"""
    Adding Events to the DB
"""
@app.route('/create', methods=['POST'])
def create():
    data = request.get_json()
    data['id'] = str(data['id'])
    temp = {}
    try:
        # print data['event_name']
        result = db.events.insert_one({
            "Name": data['event_name'],
            "Location": data['location'],
            "Start": data['start_date'],
            "End": data['end_date'],
            "All_Day": data['all_day'], 
            "Description": data['description'],
            "Event_ID": data['id'],
            "Type": data['type']
        })
        temp['Status'] = 'OK'
        temp['Message'] = 'Event Added Successfully'
    except: 
        temp['Status'] = 'Error'
        temp['Message'] = str(sys.exc_info()[0]) + ' : ' + str(sys.exc_info()[1])
        print temp['Message']
    # response.append(temp)
    resp = Response(json.dumps(temp), mimetype='application/json')
    resp.headers.set('Access-Control-Allow-Origin', '*')
    return resp

"""
    Removing events from the DB
"""
@app.route('/remove', methods=['POST'])
def remove():
    data = request.get_json()
    data['id'] = str(data['id'])
    temp = {}
    try:
        print data['id']
        result = db.events.delete_many({
            "Event_ID": str(data['id'])
        })
        print result
        temp['Status'] = 'OK'
        temp['Message'] = 'Events Deleted Successfully'
    except:    
        temp['Status'] = 'Error'
        temp['Message'] = str(sys.exc_info()[0]) + ' : ' + str(sys.exc_info()[1])
    
    resp = Response(json.dumps(temp), mimetype='application/json')
    resp.headers.set('Access-Control-Allow-Origin', '*')
    return resp

"""
    Updating an event in the DB
"""
@app.route('/update', methods=['POST'])
def update():
    data = request.get_json(force=True)
    print data
    data['pk'] = str(data['pk'])
    temp = {}
    try:
        result = db.events.update_one({
            "Event_ID": data['pk']
        }, {
            "$set": {
                str(data['name']): data['value']
            }
        }, upsert=False)
        temp['Status'] = 'OK'
        temp['Message'] = 'Event Updated Successfully'
    except: 
        temp['Status'] = 'Error'
        temp['Message'] = str(sys.exc_info()[0]) + ' : ' + str(sys.exc_info()[1])
        
    resp = Response(json.dumps(temp), mimetype='application/json')
    resp.headers.set('Access-Control-Allow-Origin', '*')
    return resp

if __name__ == '__main__':
    app.run(debug=False, port=5000, host='127.0.0.1')