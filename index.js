// All Stream APIs are implemented using event emitters, reacting to events on that stream using .on() function
// we are goin to want to implement the Stream approach beause of the LARGE size of our data we are parsing through and maximize efficiency
const { parse } = require('csv-parse');
const fs = require('fs');
const habitablePlanets = [];

// returns true or alse if planet object being passd in meets conditions 
function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
     && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
     && planet['koi_prad'] < 1.6;
}
// Node's built in module allows us to open file in a readable stream with certain function and feed into parser
// The readable stream acts as an event emitter that emits various named events in response to what's happening with the file 
/* checkout documentation for the different event types to be expected */
fs.createReadStream('kepler_data.csv')
    // to connect the readable stream and parser we must "pipe" the output of the file to the parse function
    // pipe function is meant to connect readable stream source (kepler_file) to a writable stream destination (parse() function)
    .pipe(parse({
        // these will give instructions to our parse function to parse data correctly -> parsed data will then be observed 
        comment: '#',
        columns: true,
    })) 
    .on('data', (data) => {
        // when 'data' event is triggered and meets condition then we push the data into the array
        if (isHabitablePlanet(data)) {
            habitablePlanets.push(data);
        }  
    })
    .on('error', (err) => {
        console.log(err);
    })
    .on('end', () => {
        console.log(habitablePlanets.map((planet) => {
            return planet['kepler_name'];
        }));
        console.log(`${habitablePlanets.length} habitable planets disovered!`);
    });

 