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
    **Content:** `

{"population":{"sample":["{\"id\":\"pop:individual:2\",\"fitness\":{\"1:1486488890712\":\"1486488875914\",\"1:1486489025693\":\"1486489010700\",\"1:1486489535683\":\"1486489520673\",\"1:1486489595692\":\"1486489580663\"},\"chromosome\":[\"128\",\"78\",\"0\",\"0\",\"1\",\"0\",\"2\",\"0\",\"1\",\"0\",\"0\",\"0\",\"1\",\"2\",\"1\"]}","{\"id\":\"pop:individual:3\",\"fitness\":{\"1:1486488965696\":\"1486488950703\",\"1:1486489115686\":\"1486489100708\",\"1:1486489145685\":\"1486489130691\",\"1:1486489640654\":\"1486489625684\",\"1:1486489656235\":\"1486489640666\",\"1:1486489716426\":\"1486489701416\"},\"chromosome\":[\"100\",\"53\",\"0\",\"0\",\"1\",\"0\",\"2\",\"0\",\"1\",\"1\",\"1\",\"1\",\"1\",\"0\",\"2\"]}","{\"id\":\"pop:individual:10\",\"fitness\":{\"1:1486488920699\":\"1486488905708\",\"1:1486488950697\":\"1486488935705\",\"1:1486489175682\":\"1486489160691\",\"1:1486489235678\":\"1486489220685\",\"1:1486489280675\":\"1486489265693\",\"1:1486489310673\":\"1486489295695\",\"1:1486489325673\":\"1486489310680\",\"1:1486489340673\":\"1486489325680\",\"1:1486489355671\":\"1486489340681\",\"1:1486489415667\":\"1486489400675\",\"1:1486489460664\":\"1486489445681\"},\"chromosome\":[\"47\",\"10\",\"0\",\"0\",\"1\",\"1\",\"4\",\"1\",\"1\",\"0\",\"2\",\"1\",\"1\",\"2\",\"1\"]}","{\"id\":\"pop:individual:1\",\"fitness\":{\"1:1486488905700\":\"1486488890734\",\"1:1486488935698\":\"1486488920706\",\"1:1486489010693\":\"1486488995707\",\"1:1486489610655\":\"1486489595721\",\"1:1486489686426\":\"1486489671719\"}"]}}`

* **Sample Call:**
