# Flying Crow salesman challenge
The Flying Crow Salesman Company need a webapp to help their salesmen to find the best
route for their sales trips. A salesman will have a ‘home’ location, and up to 8 destinations. They
must choose a route which starts and ends at their home, and visits each of the other
destinations exactly once. The best route is the route with the shortest total distance travelled.
Salesman travel only along direct ‘as-the-crow-flies’ routes between two points regardless of
roads or terrain.

- Write a Javascript application to provide an interactive map to assist a Salesman
- A user will click the map to set their home location. They will then click the map up to 8
further times to set destinations. Each of these locations should be plotted on the map
as small icons or circles.
- The application will then compute the most efficient route. There are many algorithms
available to solve Travelling Salesmen problems; we recommend a simple brute-force
approach here. You must implement the algorithm yourself.
- The application will then plot lines connecting the home & destinations to show the
most efficient route.
- The application will show the total distance of the chosen route.
- You may optionally provide additional functionality of your choice.
- We recommend using http://turfjs.org/docs#distance to calculate the crow-flies
distance between two points, taking the curvature of the earth into account. You may,
alternatively, calculate distance using only Pythagorus on the two long/lat coordinates.
- You must use Mapbox GL JS for the map (see https://www.mapbox.com/mapbox-gl-js/api/ ).
- We do not expect you to already be familiar with Mapbox, and they provide extensive
online documentation and examples to help you.
- We recommend that you use vanilla JS, but you may choose to use a framework
(Angular, React etc.) if you wish (this adds additional setup difficulty).
- The application must use npm to download and install its own dependencies, and to set
up a localhost webserver.
- You may submit your application in a zipfile, or preferably as a project on Github,
Bitbucket etc.
- You are not required to support any browser except Chrome.

##### [Visit website](https://flying-crow-salesman-challenge.herokuapp.com/)


###### Approach

First I focused on creating a map and adding markers to it.

Then I created a function to calculate the distance between 2 points and then a function to calculate the total distance of a journey.

Then, I focused on getting all permutations for a certain number of points. This was done using a function that append a first point with all permutations of the remaining part of the route. This is done recursively until reaching the last point of the route.

Finally, I created a function that goes through the array of permutations (possible routes) and returns the shortest route.

<p align="center"><img src="https://i.imgur.com/IneZKXf.png" width="700"></p>

---

## Wins
I am happy I managed to solve the Travelling Salesmen problem and to find all permutations for a set number of points.
I also added extra functionalities to the app to reset the map or add new points once a route has already been found.

## Challenges
I wanted to make a class Map but the constructor function ended up being too long and the destroy function ends up not destroying the actual map as I need to keep it to calculate new routes...so I am not sure it made sense to create a class for a map.
Also mapboxgl does not have a functionality to test the existence of certain routes so I could not test their existence to reset the map and kept getting error messages, even after catching the error.

---

## Setup instructions

- Clone or download the repo
- Install dependencies with `npm install`
- Launch the app with `http-server -p8000 -c-1`
- Go to `http://localhost:8000/`
