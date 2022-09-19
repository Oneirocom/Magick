from genericpath import exists


data = []

def read(path):
    file = open(path, 'r')
    
    lines = file.readlines()
    for line in lines:
        d = line.strip().split('=', 1)
        if len(d) == 2:
            data.append({ 'key': d[0], 'value': d[1] })

    file.close()


def getValue(key):
    for x in data:
        if x['key'] == key:
            return x['value']
    
    return ''