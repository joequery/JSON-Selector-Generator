import json

from flask import Flask, request, render_template, jsonify

from src.jsonselector import codify_json
from src.flaskhelpers import extract_post_data

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return render_template("home.html")

@app.route('/process', methods=['POST'])
def process():
    required_fields = ('rawjson',)
    post,errors = extract_post_data(request, required_fields)

    if errors:
        return jsonify(errors=errors)

    try:
        data = json.loads(post['rawjson'])
    except ValueError:
        return "Invalid JSON"

    try:
        codified_json = codify_json(json.dumps(data))
    except ValueError, e:
        return "Error"

    return render_template("codify_json.html", codified_json=codified_json)

@app.route('/sampledata', methods=['GET'])
def sample_data():
    rawjson=render_template("examplejson.json")
    return jsonify(rawjson=rawjson)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
