import json
import os
from flask import Flask, request
from vector_search import trainModel, getNumberOfTpocis, query, keywords_query
from utils import *

def run_server(port, _postgres):
    app = Flask('thoth')
    
    @app.route('/', methods=['GET', 'POST'])
    def main_page():
        if request.method == 'GET':
            html = read_file(os.getcwd() + '/files/utils/main.html')
            html += '</body></html>'
            return html
        elif request.method =='POST':
            return json.dumps({"status": "not_supported"})
    
    @app.route('/search', methods=['GET', 'POST'])
    def search_page():
        if request.method == 'GET':
            return json.dumps({"status": "not_supported"})
        elif request.method == 'POST':
            _json = request.get_json()
            isKeywords = _json['isKeywords']
            _query = _json['query']
            res = ''
            if isKeywords == True or isKeywords == 'true':
                res = keywords_query(_query)
            else:
                res = query(_query)

            return  json.dumps({"status": 'ok', 'data': res})
    
    @app.route('/update_search_model')
    def update_search_model_page():
        if request.method == 'GET':
            documents = _postgres.getDocuments()
            try:
                trainModel(documents=documents)
                return json.dumps({"status": "ok"})
            except Exception as e:
                return json.dumps({"status": "error", "message": str(e)})
    
    @app.route('/number_of_topics')
    def get_number_of_topics_page():
        if request.method == 'GET':
            num = getNumberOfTpocis()
            return json.dumps({"status": "ok", "count": num})
    
    app.secret_key = 'KJDFSIJ34534(*%&#)kjfdskfd'
    app.run(host='0.0.0.0', port=port)