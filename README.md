#evospace-js

EvoSpace is a population store for the development of evolutionary algorithms (EA)
and other population-based searches.  Is intended to run using an asynchronous
distributed architecture.  EvoSpace is designed to be versatile, since the population is
decoupled from any particular evolutionary (or, for that matter, metaheuristic) algorithm.

Client processes, or EvoWorkers, must perform the required evolutionary 
routines dynamically and asynchronously interacting with the population stored in EvoSpace.
EvoWorkers can reside on any web enabled device from web browsers to high performance servers. 

EvoSpace is also suited for interactive evolutionary algorithms  
since it is robust to lost connections with remote clients. 

This version is implemented in nodejs using redis as the backend.


#REST API

## Read all the population keys
Returns all the keys available in the population named [space].

* **URL**
  `\[space]`

* **Method:**
  
  `GET` 
  
* **Success Response:**
  * **Code:** 200 <br />
    **Content:** `["pop:individual:2","pop:individual:3","pop:individual:10","pop:individual:1","pop:individual:8","pop:individual:7","pop:individual:5"]`
 

## Read all the population
Returns all the individuals available in the population named [space].

* **URL**
  `\[space]\'all'`

* **Method:**

  `GET`

* **Success Response:**
  * **Code:** 200 <br />
    **Content:** `{"population":{"sample":["{\"id\":\"pop:individual:2\",\"fitness\":{\"1:1486488890712\":\"1486488875914\",\"1:1486489025693\":\"1486489010700\"},\"chromosome\":[\"128\",\"78\",\"0\"]}","{\"id\":\"pop:individual:3\",\"fitness\":{\"1:1486488965696\":\"1486488950703\",\"1:1486489115686\":\"1486489100708\"},\"chromosome\":[\"100\",\"53\",\"0\",\"0\"]}"]}}`


## Read an individual
Returns an individual in [space] with key = [key].

* **URL**
  `/[space]/individual/[key]`

* **Method:**

  `GET`

* **Success Response:**
  * **Code:** 200 <br />
    **Content:** `{"id":"pop:individual:2","fitness":{"1:1486488890712":"1486488875914","1:1486489025693":"1486489010700","1:1486489535683":"1486489520673","1:1486489595692":"1486489580663"},"chromosome":["128","78","0","0","1","0","2","0","1","0","0","0","1","2","1"]}`


## Post an individual
Creates and adds an Individual to [space].

* **URL**
   `/[space]/individual`

* **Method:**

  `POST`

* **Data Params**

   **Required:**

   `chromosome=[]`

    A list representation of the individual.

   **Optional:**

   A list of key, value pairs.

   `fitness=[]` , `timestamp=[]`


* **Success Response:**
  * **Code:** 200 <br />
    **Content:** `{"result":""}`

* **Sample Call:**

