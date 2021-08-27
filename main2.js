// The type locality doesn’t given you any indication of the range of the species, 
//just where the holotype was collected.

// data2 source 

d3.csv("Number of sharks and rays since 1980.csv")
.then(data2 => {
    var filteredData2 = data2.filter(function(d) 
    { 
        if( d["Year"] >= 1980
            // if( d["Year"] >= 1980 && d["NewSpecies"] <=60 
            ) 
            { 
                return d;
            } 
        })

        const sumstat = d3.group(filteredData2, d => d.Year) // nest function allows to group the calculation per level of a factor

        // What is the list of groups?
        allKeys = new Set(filteredData2.map(d=>d.Year))

        console.log(allKeys)

        var grouped_data = d3.group(filteredData2, 
            d => d.Year, d => d.CommonName)
      
    console.log(grouped_data)
    console.log([...grouped_data.entries()]);
    // console.log([...grouped_data.values()]);
    [0].key
// render(data2)
   /// mean New Discoveries per year 
    // var totalMean = [d3.mean(filteredData2.map(function(d){ return d.NewSpecies}))];
    // console.log(totalMean);
    // var totalSum = [d3.sum(filteredData2.map(function(d){ return d.NewSpecies}))];
    // console.log(totalSum);
   ///  
    let m = '';
    console.log(data2)
    m = m + Math.round(d3.csvFormat(data2).length / 1024) + 'kB\n';
    m = m + data2.length + ' rows\n';
    m = m + data2.columns.length + ' columns\n';
    m = m + 'Earliest recorded year: ' + filteredData2[0].Year+ "\n";
    m = m + 'Latest recorded year: ' + filteredData2[filteredData2.length-1].Year + "\n";
    m = m + 'Type Locations Listed: ' + allKeys.length + "\n";
    // m = m + 'Sum for date range: ' + totalSum;

    document.getElementById('message2').textContent = m;
    $("#ex2").html(JSON.stringify([...grouped_data.values()], null, 3));
    // $("#ex2").html(grouped_data);
    
    ///

    // render(filteredData2)
}
);