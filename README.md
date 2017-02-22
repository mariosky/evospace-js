**evospace-js**
----

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


**REST API**

**Read All the population keys**
Returns all the keys available in the population.

* **URL**
  `\[space]`

* **Method:**
  
  `GET` 
  
* **Success Response:**
  * **Code:** 200 <br />
    **Content:** `["pop:individual:2","pop:individual:3","pop:individual:10","pop:individual:1","pop:individual:8","pop:individual:7","pop:individual:5"]`
 
* **Sample Call:**

  
* **Notes:**
