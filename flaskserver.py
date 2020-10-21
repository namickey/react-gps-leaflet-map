from flask import Flask, request, jsonify
import os
import io
import json
from datetime import datetime
import pytz
import pandas as pd
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './cred.json'

app = Flask(__name__, static_url_path='')
port = int(os.getenv('PORT', 8000))

@app.route('/geo', methods=['POST'])
def createGeo():
    data = request.get_json()
    df = pd.io.json.json_normalize(data)
    df['dt'] = datetime.now(pytz.timezone('Asia/Tokyo')).strftime('%Y/%m/%d %H:%M:%S')
    df.to_gbq('tanji.some', if_exists='append')# append or replace
    return data

@app.route('/geo', methods=['GET'])
def getGeo():
    sql = """
    SELECT *
    FROM `tanji.some`
    """
    df = pd.read_gbq(sql, dialect='standard')
    res = jsonify(df.to_json())
    res.headers.add('Access-Control-Allow-Origin', '*')
    return res

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)
