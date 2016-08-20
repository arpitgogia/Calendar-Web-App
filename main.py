from flask import Flask, request, render_template, Response, make_response
from pymongo import MongoClient
import json, sys
app = Flask(__name__)
client = MongoClient()
db = client.calendar
event_id = 0
@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

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
    resp = Response(json.dumps(result), mimetype='application/json')
    resp.headers.set('Access-Control-Allow-Origin', '*')
    return resp

@app.route('/create', methods=['POST'])
def create():
    data = request.get_json()
    print data
    temp = {}
    try:
        # print data['event_name']
        result = db.events.insert_one({
            "Name": data['event_name'],
            "Location": data['location'],
            "Start": data['start_date'],
            "End": data['end_date'],
            "All-Day": data['all_day'], 
            "Description": data['description'],
            "Event-ID": data['event_id']
        })
        temp['Status'] = 'OK'
        temp['Message'] = 'Event Added Successfully'
    except: 
        temp['Status'] = 'Error'
        temp['Message'] = str(sys.exc_info()[0]) + ' : ' + str(sys.exc_info()[1])
        print sys.exc_info[2]
    # response.append(temp)
    resp = Response(json.dumps(temp), mimetype='application/json')
    resp.headers.set('Access-Control-Allow-Origin', '*')
    return resp

@app.route('/remove', methods=['POST'])
def remove():
    data = request.get_json()
    result = db.events.delete_many({
        "Name": data['event_name'],
        "Location": data['location'],
        "Start": {
            "Date": data['start_date'],
            "Time": data['start_time']
        },
        "End": {
            "Date": data['end_date'],
            "Time": data['end_time']
        },
        "All-Day": data['all_day'],
    })








if __name__ == '__main__':
    app.run(debug=True)