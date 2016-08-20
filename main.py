from flask import Flask, request, render_template
from pymongo import MongoClient
import json
app = Flask(__name__)
client = MongoClient()
db = client.calendar
event_id = 0
@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/get_events', methods=['GET'])
def get_events():
    

@app.route('/create', methods=['POST'])
def create():
    data = request.get_json()
    result = db.events.insert_one({
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
        "Description": data['description']
    })
    return "Success"

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