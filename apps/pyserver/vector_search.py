from genericpath import exists
import os
from envReader import getValue
from top2vec import Top2Vec
import pathlib
import time
import string

model_path = str(pathlib.Path(__file__).parent.resolve()) + '/files/data/vector_search_model'
data_path = str(pathlib.Path(__file__).parent.resolve()) + '/files/training_data/vector_search_data.txt'
cache_path = str(pathlib.Path(__file__).parent.resolve()) + '/files/cache/vector_search_cache.txt'

model = ''
prevDocuments = []

def initVectorSearch(_postgres):
    if exists(model_path) and checkForCache(_postgres):
        global model
        model = Top2Vec.load(model_path)
    else:
        trainModel(documents=_postgres.getDocuments())

def checkForCache(_postgres) -> bool:
    newDocuments = _postgres.getDocuments()
    if not exists(cache_path):
        writeCache(newDocuments)
        return False

    oldDocuments = readCache()
    if (oldDocuments == newDocuments):
        writeCache(newDocuments)
        return True

    writeCache(newDocuments)
    return False

def readCache():
    with open(cache_path) as f:
        dD =  f.read().splitlines()
    
    while("" in dD) :
        dD.remove("")
    
    return dD

def writeCache(documents):
    if exists(cache_path):
        os.remove(cache_path)

    f = open(cache_path, 'w')
    for x in documents:
        f.write(x + '\n')
    f.close()

def trainModel(documents, addDefault: bool = True):
    print('Training model...')
    start_time = time.time()
    global model
    global prevDocuments
    
    if (addDefault == False and documents == prevDocuments) or (addDefault == False and len(documents) == 0):
        print('Model already trained with same documents.')
        return

    if addDefault==True:
        dD = []
        with open(data_path) as f:
            dD = f.readlines()
        
        while("" in dD) :
            dD.remove("")
        
        dD = list(dict.fromkeys(dD))

        for x in dD:
            documents.append(x)
    
    model = Top2Vec(documents=documents, 
        speed=getValue('VECTOR_SEARCH_SPEED'), 
        workers=int(getValue('VECTOR_SEARCH_WORKERS')), 
        embedding_model=getValue('VECTOR_SEARCH_EMBEDDING_MODEL'), 
        min_count=2)

    if exists(model_path):
        os.remove(model_path)
        
    model.save(model_path)
    prevDocuments = documents
    print('Training model took:', time.time() - start_time, 'seconds.')

def getNumberOfTpocis() -> int:
    if (model == ''):
        return 0

    return model.get_num_topics()

def query(query: str):
    query = query.translate(str.maketrans('', '', string.punctuation))
    try: 
        documents, document_scores, document_ids = model.search_documents_by_keywords(keywords=query.split(' '), num_docs=2)
        highestScore = -1
        _doc = ''
        for doc, score, doc_id in zip(documents, document_scores, document_ids):
            if score > highestScore:
                highestScore = score
                _doc = doc
            
        return _doc
    except ValueError:
        return ''

def keywords_query(query: string): 
    query = query.translate(str.maketrans('', '', string.punctuation))
    try:
        words, word_scores = model.similar_words(keywords=query.split(' '), keywords_neg=[], num_words=20)
        res = []
        for word, score in zip(words, word_scores):
            if (score >= 0.8):
                res.append(word)
        return res
    except ValueError:
        return []