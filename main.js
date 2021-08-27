// List of Species discoveries
// Data source: 

const margin = { top:10, right:20, bottom:40, left:25}
const width = 300 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

    const render = data => {

        const svg = d3.select('#chart')
        .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .call(responsivefy) // this is all it takes to make the chart responsive
        .append('g')
          .attr('transform', `translate(0, ${margin.top})`);

        // const innerWidth = width - margin.left - margin.right;
        // const innerHeight = height - margin.top - margin.bottom;

   
//xScale
        const xScale = d3.scaleBand()
        .domain(data.map(d => d.Year))
            .range([0, width])
            .padding(0.2);
//yScale  
        const yScale = d3.scaleLinear()
        .domain([0,d3.max(data, d => +d.NewSpecies)+10])
        .range([height,0])

//Axis
        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale).tickValues(["1980","1994","2008","2016","2021"]);

        
        var XaxisData = data.map(function(d) { return +d.Year; });
        var YaxisData = data.map(function(d) { return +d.NewSpecies; });
        regression=leastSquaresequation(XaxisData,YaxisData);
        // console.log(XaxisData)
        // console.log(YaxisData)
        var line = d3.line()
            .x(function(d) { return xScale(d.Year); })
            .y(function(d) { return yScale(regression(d.Year)); });     
        

//Append Axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("font", "12px times")
            .attr("transform", "translate(-10,0)rotate(-90)")
            .style("text-anchor", "end")
            .attr("x", -10);
        

    svg.append("path")
        .attr("transform", `translate(${margin.left},0)`)
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "red") 
        .attr("stroke-width",1)

     svg.append("g")
        .call(yAxis)
        .style("font", "12px times")
        .attr("transform", `translate(${margin.left})`);
//    
    d3.select('g').selectAll('rect').data(data)
        .enter().append('rect')
        .attr("transform", `translate(${margin.left},0)`)
        .attr('x', d=> xScale(d.Year))
        .attr('y', d => yScale(d.NewSpecies))
        .attr('width', xScale.bandwidth())
        .attr('height', d=> height - yScale(d.NewSpecies))
        .attr("fill", "#69b3a2")
    };
//// load data //// 
 d3.csv("https://raw.githubusercontent.com/Dalbed349/Sharks/master/SHARKPROJECT.csv")
            .then(data => 
             {
                var filteredData = data.filter(function(d) 
                { 
                    if( d["Year"] >= 1980
                        // if( d["Year"] >= 1980 && d["NewSpecies"] <=60 
                        ) 
                        { 
                            return d;
                        } 
                    })
                /// mean New Discoveries per year 
                var totalMean = [d3.mean(filteredData.map(function(d){ return d.NewSpecies}))];
                console.log(totalMean);
                var totalSum = [d3.sum(filteredData.map(function(d){ return d.NewSpecies}))];
                console.log(totalSum);
                /// descriptives 
                let m = '';
                ///
                        m = m + Math.round(d3.csvFormat(filteredData).length / 1024) + 'kB\n';
                        m = m + filteredData.length + ' rows\n';
                        m = m + data.columns.length + ' columns\n';
                        m = m + 'Earliest recorded year: ' + filteredData[0].Year+ "\n";
                        m = m + 'Latest recorded year: ' + filteredData[filteredData.length - 1].Year + "\n";
                        m = m + 'Mean New Discoveries per year: ' + totalMean + "\n";
                        m = m + 'Sum for date range: ' + totalSum;
                ///        
                document.getElementById('message').textContent = m;
                $("#ex1").html(JSON.stringify(filteredData, null, 3));
                ///
                render(filteredData)
                ///
             }
            );

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

              // https://codepen.io/bclinkinbeard/pen/gGPvrz
              function responsivefy(svg) {
                // container will be the DOM element the svg is appended to
                // we then measure the container and find its aspect ratio
                const container = d3.select(svg.node().parentNode),
                    width = parseInt(svg.style('width'), 10),
                    height = parseInt(svg.style('height'), 10),
                    aspect = width / height;
              
                // add viewBox attribute and set its value to the initial size
                // add preserveAspectRatio attribute to specify how to scale
                // and call resize so that svg resizes on inital page load

                // svg.attr('viewBox', `0 0 ${width} ${height}`)
                //     .attr('preserveAspectRatio', 'xMinYMid')
                //     .call(resize);
                    svg.attr('viewBox', `0 0 300 300`)
                    .attr('preserveAspectRatio', 'xMinYMid')
                    .call(resize);
              
                // add a listener so the chart will be resized when the window resizes
                // to register multiple listeners for same event type,
                // you need to add namespace, i.e., 'click.foo'
                // necessary if you invoke this function for multiple svgs
                // api docs: https://github.com/mbostock/d3/wiki/Selections#on
                d3.select(window).on('resize.' + container.attr('id'), resize);
              
                // this is the code that actually resizes the chart
                // and will be called on load and in response to window resize
                // gets the width of the container and proportionally resizes the svg to fit
                function resize() {
                    const targetWidth = parseInt(container.style('width'));
                    svg.attr('width', targetWidth);
                    svg.attr('height', Math.round(targetWidth / aspect));
                }
              }
