var newman = require('newman'); // require Newman in your project
const fs = require('fs');


// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require('./zendeskguide_collection.json'),
    reporters: 'cli'
    // folder: 'Zendesk Articles Page 1'
}).on('request', (error, data) => {
    if (error) {
        console.log(error);
        return;
    }

    const randomString = Math.random().toString(36).substring(7);
    // const fileName = `response ${data.item.name}-${randomString}.csv`;
    const fileName = 'Response-Articles.csv';

    const content = data.response.stream;
    var array = JSON.parse(content).articles;
    const replacer = (key, value) => value === null ? '' : value;

    const header = Object.keys(array[0])

    const csv = [
        header.join(','), // header row first
        ...array.map(row => header.map(fieldName => {
          if(fieldName==='html_url'){
            return JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""').replace(/\\n/g, '').replace("https://help.youli.io/hc/en-us/","https://support.youli.io/")
          }else{
            return JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""').replace(/\\n/g, '')
          }
          
        }).join(','))
      ].join('\r\n');

    fs.writeFile(fileName, csv,{ flag: "a+" }, function(error){
        if(error){
            console.error
    ;    }
    })

    // console.log('Request name: ' + data.item.name);
    // console.log(data.response.stream.toString());
});

