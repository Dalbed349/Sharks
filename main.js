


    const render = data => {
        const margin = { top:20, right:20, bottom:50, left:100}
        const svg = d3.select('svg');
        const width = +svg.attr('width');
        const height = +svg.attr('height')
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
//xScale
        const xScale = d3.scaleBand()
        .domain(data.map(d => d.Year))
            .range([0, innerWidth])
            .padding(0.2);
console.log(xScale.range());
//yScale  
        const yScale = d3.scaleLinear()
        .domain([0,d3.max(data, d => +d.NewSpecies)+10])
        .range([innerHeight,0])
console.log(yScale.domain())
//Axis
        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale).tickValues(["1980","1994","2008","2016","2021"]);

        
        var XaxisData = data.map(function(d) { return +d.Year; });
        var YaxisData = data.map(function(d) { return +d.NewSpecies; });
        regression=leastSquaresequation(XaxisData,YaxisData);
        console.log(XaxisData)
        console.log(YaxisData)
        var line = d3.line()
            .x(function(d) { return xScale(d.Year); })
            .y(function(d) { return yScale(regression(d.Year)); });     
        

//Append Axis
    svg.append("g")
    .attr("transform", `translate(${margin.left},${innerHeight})`)
    .call(xAxis)
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-90)")
        .style("text-anchor", "end")
        .attr("x", -10);

        svg.append("path")
        .attr("transform", `translate(${margin.left},0)`)
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "red") 
        .attr("stroke-width",10)

     svg.append("g")
        .call(yAxis)
        .attr("transform", `translate(${margin.left})`);
//    
    d3.select('g').selectAll('rect').data(data)
        .enter().append('rect')
        .attr("transform", "translate(0,-" + innerHeight + ")")
        .attr('x', d=> xScale(d.Year))
        .attr('y', d => yScale(d.NewSpecies))
        .attr('width', xScale.bandwidth())
        .attr('height', d=> innerHeight - yScale(d.NewSpecies))
        .attr("fill", "#69b3a2")
    };
//// load data //// 
 d3.csv("https://raw.githubusercontent.com/Dalbed349/Sharks/master/SHARKPROJECT.csv")
            .then(data => {
                
                let message = '';
                console.log(data)
                message = message + Math.round(d3.csvFormat(data).length / 1024) + 'kB\n';
                message = message + data.length + ' rows\n';
                message = message + data.columns.length + ' columns\n';
                message = message + 'Earliest recorded year: ' + data[0].Year;
                document.getElementById('message').textContent = message;
                $("#ex1").html(JSON.stringify(data, null, 3));
                ///
                var filteredData = data.filter(function(d) 
                { 
                    if( d["Year"] >= 1980
                        // if( d["Year"] >= 1980 && d["NewSpecies"] <=60 
                        ) 
                        { 
                            return d;
                        } 
                
                    })


                console.log(d3.max(data, d => +d.NewSpecies))
                // render(data)
                render(filteredData)
            }
            )

            function leastSquaresequation(XaxisData, Yaxisdata) {
                var ReduceAddition = function(prev, cur) { return prev + cur; };
                
                // finding the mean of Xaxis and Yaxis data
                var xBar = XaxisData.reduce(ReduceAddition) * 1.0 / XaxisData.length;
                var yBar = Yaxisdata.reduce(ReduceAddition) * 1.0 / Yaxisdata.length;
            
                var SquareXX = XaxisData.map(function(d) { return Math.pow(d - xBar, 2); })
                  .reduce(ReduceAddition);
                
                var ssYY = Yaxisdata.map(function(d) { return Math.pow(d - yBar, 2); })
                  .reduce(ReduceAddition);
                  
                var MeanDiffXY = XaxisData.map(function(d, i) { return (d - xBar) * (Yaxisdata[i] - yBar); })
                  .reduce(ReduceAddition);
                  
                var slope = MeanDiffXY / SquareXX;
                var intercept = yBar - (xBar * slope);
                
            // returning regression function
                return function(x){
                  return x*slope+intercept
                }
            
              }
