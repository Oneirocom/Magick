from envReader import read, getValue
from postgres import postgres
from vector_search import initVectorSearch
from server import run_server
import pathlib


read(str(pathlib.Path(__file__).parent.resolve()) + '/files/config/.env.local')
_postgres = postgres()
initVectorSearch(_postgres)
run_server(int(getValue('PORT')), _postgres)