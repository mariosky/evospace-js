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
Returns all the keys available in the population.

* **URL**
  `\[space]`

* **Method:**
  
  `GET` 
  
* **Success Response:**
  * **Code:** 200 <br />
    **Content:** `["pop:individual:2","pop:individual:3","pop:individual:10","pop:individual:1","pop:individual:8","pop:individual:7","pop:individual:5"]`
 
* **Sample Call:**


## Read all the population
Returns all the individuals available in the population.

* **URL**
  `\[space]\'all'`

* **Method:**

  `GET`

* **Success Response:**
  * **Code:** 200 <br />
    **Content:** `{"population":{"sample":["{\"id\":\"pop:individual:2\",\"fitness\":{\"1:1486488890712\":\"1486488875914\",\"1:1486489025693\":\"1486489010700\"},\"chromosome\":[\"128\",\"78\",\"0\"]}","{\"id\":\"pop:individual:3\",\"fitness\":{\"1:1486488965696\":\"1486488950703\",\"1:1486489115686\":\"1486489100708\"},\"chromosome\":[\"100\",\"53\",\"0\",\"0\"]}"]}}`

* **Sample Call:**
