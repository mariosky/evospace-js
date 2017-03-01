import requests
import json
import time
#Delete  population
r = requests.delete('http://127.0.0.1:3000/evospace/test_pop')
print "Delete population", r.text
#{"result":[[null,1],[null,1],[null,1],[null,"OK"]]}


#Create population
r = requests.post('http://127.0.0.1:3000/evospace/test_pop/initialize', data = {'space':'test_pop'})
print "Create population", r.text
#{"result":[[null,1],[null,1],[null,1],[null,"OK"]]}

#Add Individuals
ind = {'id':3, 'name':"Mario", 'chromosome':[1,2,3,1,1,2,2,2],"fitness":{"s":1},"score":1 }
url = 'http://127.0.0.1:3000/evospace/test_pop/individual'
r = requests.post(url, data=ind)
print "Insert individual with id", r.text

# Add 100 Individuals
for i in range(20): 
	ind = { 'name':"Mario", 'chromosome':[2,2,3,1,1,2,2,2],"fitness":{"s":i},"score":i }
	url = 'http://127.0.0.1:3000/evospace/test_pop/individual'
	r = requests.post(url, data=ind)
print "Insert individual with out id", r.text

#Read an individual by id
url = 'http://127.0.0.1:3000/evospace/test_pop/individual/3'
r = requests.get(url)
print "Read an individual by key", r.text

# Read All the population keys
url = 'http://127.0.0.1:3000/evospace/test_pop'
r = requests.get(url)
print "Read all keys", r.text

# Read All the population keys
url = 'http://127.0.0.1:3000/evospace/test_pop/all'
r = requests.get(url)
print "Read all", r.text

#Read those individuals with a score between [:start] and [:finish].
url = 'http://127.0.0.1:3000/evospace/test_pop/zrange/1/1'
r = requests.get(url)
print "\n\n\nscore between 10 and 12", r.text

#Read the top N individuals
url = 'http://127.0.0.1:3000/evospace/test_pop/top/2'
r = requests.get(url)
print "\n\n\ntopn", r.text

#GET sample of N individuals
url = 'http://127.0.0.1:3000/evospace/pop/sample/3'
r = requests.get(url)
print "\n\n\nsample", r.text
sample = r.json()
print 'sample result', sample['result']
print 'as JSON', json.dumps(sample['result'])

#GET sample of N individuals
url = 'http://127.0.0.1:3000/evospace/pop/sample/3'
r = requests.get(url)
print "\n\n\nsample", r.text
sample = r.json()
print 'sample result', sample['result']
print 'as JSON', json.dumps(sample['result'])



#POST sample 
ind ={'sample':sample['result']['sample'], 'sample_id':sample['result']['sample_id']}  
print "sample:",ind,json.dumps(ind)
url = 'http://127.0.0.1:3000/evospace/test_pop/sample'
r = requests.post(url, json=ind)
print 'POST sample', r.text

#Read the number of individuals in the population [space]
url = 'http://127.0.0.1:3000/evospace/test_pop/cardinality'
r = requests.get(url)
print "cardinality", r.text

#Respawn 1 sample
url = 'http://127.0.0.1:3000/evospace/test_pop/respawn'
data ={'n':1}  
r = requests.post(url,data)
print "respawn", r.text


r.connection.close()




