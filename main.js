


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
        const xAxis = d3.axisBottom(xScale).tickValues(["1758","1841"]);

        
//Append Axis
    svg.append("g")
    .attr("transform", `translate(${margin.left},${innerHeight})`)
    .call(xAxis)
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-90)")
        .style("text-anchor", "end")
        .attr("x", -10);
    
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
                console.log(d3.max(data, d => +d.NewSpecies))
                render(data)
            }
            )
