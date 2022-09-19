import psycopg2
from envReader import getValue

class postgres:
    def __init__(self):
        print('initializing postgres')
        self.postgres_con = psycopg2.connect(host=getValue('PGHOST'), database=getValue('PGDATABASE'), user=getValue('PGUSER'), password=getValue('PGPASSWORD'))
        self.cur = self.postgres_con.cursor()

    def getDocuments(self):
        documents = []

        query = 'SELECT * FROM documents'
        self.cur.execute(query)
        rows = self.cur.fetchall()
        for row in rows:
            documents.append(row[1])

        return documents