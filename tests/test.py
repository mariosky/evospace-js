import requests
import json

#Create population
#r = requests.post('http://127.0.0.1:3000/evospace/pop/initialize', data = {'space':'pop'})


#print r.text
#{"result":[[null,1],[null,1],[null,1],[null,"OK"]]}

ind = {'id':2, 'name':"Mario", 'chromosome':[1,2,3,1,1,2,2,2],"fitness":{"s":1},"score":1 }
url = 'http://127.0.0.1:3000/evospace/pop/individual'

r = requests.post(url, data={'chromosome':[1,2,3,1,1,2,2,2]})
print r.text



