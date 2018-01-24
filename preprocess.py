import csv

f = open('pokemon_alopez247.csv', 'r')

typeDict = {}

for row in csv.DictReader(f):
    t1 = row['Type_1']
    t2 = row['Type_2']
    if t1 == 'Type_1':
        continue
    if t1 not in typeDict:
        typeDict[t1] = 1
    else: 
        typeDict[t1] += 1

    if t2 not in typeDict:
        typeDict[t2] = 1
    else:
        typeDict[t2] += 1

for k, v in typeDict.iteritems():
    print k + " " + str(v)
    

with open('types.csv', 'w') as csvfile:
    fieldnames = ['type', 'count']
    writer = csv.DictWriter(csvfile, fieldnames = fieldnames)
    writer.writeheader()

    for k, v in typeDict.iteritems():
        if len(k) != 0 :
            writer.writerow({'type': k, 'count': str(v)})
