// Data 
let data = [
    { gender: 'Female', 'Physical Activity': 2.43, 'Study Time': 4.49, 'Screen Time': 6.44, 'Sleep': 7.31 },
    { gender: 'Male',   'Physical Activity': 3.05, 'Study Time': 4.58, 'Screen Time': 8.5, 'Sleep': 7.14 }
  ];
  
  const keys   = ['Physical Activity', 'Study Time', 'Screen Time', 'Sleep'];
  const colors = ['#dbdb8d', '#aec7e8', '#ff9896', '#ffbb78'];
  
  let width  = 700, 
      height = 400;
  
  let margin = { top: 60, bottom: 80, left: 80, right: 200 };
  
  let svg = d3.select('#chart')
    .append('svg')
    .attr('width',  width)
    .attr('height', height)
    .style('background-color', 'white') 
    .style('border-radius', '8px')
    .style('box-shadow', '0 2px 8px rgba(0,0,0,0.1)');

  let tooltip = d3.select('body')
    .append('div')
    .style('position',         'absolute')
    .style('background',       'rgba(0,0,0,0.85)')
    .style('color',            '#fff')
    .style('padding',          '10px 14px')
    .style('font-size',        '14px')
    .style('border-radius',    '4px')
    .style('pointer-events',   'none')
    .style('opacity',          0)
    .style('z-index',          '1000');
  
  let stack  = d3.stack().keys(keys);
  let series = stack(data);
  
  let maxVal = d3.max(series, s => d3.max(s, d => d[1]));
  
  let yScale = d3.scaleLinear()
    .domain([0, Math.ceil(maxVal)])
    .range([height - margin.bottom, margin.top]);
  
  let xScale = d3.scaleBand()
    .domain(data.map(d => d.gender))
    .range([margin.left, width - margin.right])
    .padding(0.35);

  let yAxis = svg.append('g')
    .call(d3.axisLeft(yScale).ticks(8))
    .attr('transform', `translate(${margin.left}, 0)`)
    .style('font-size', '14px')
    .style('color', '#333');
  
  let xAxis = svg.append('g')
    .call(d3.axisBottom(xScale).tickSize(0))
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .style('font-size', '14px')
    .style('color', '#333');
  
  // Style axis lines
  svg.selectAll('.domain').style('stroke', '#999').style('stroke-width', '2px');
  
  // Input axis labels
  svg.append('text')
    .attr('x', -(height / 2))
    .attr('y', 20)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .attr('font-size', '16px')
    .attr('fill', '#333')
    .attr('font-weight', 'bold')
    .text('Average hours per day');
  
  svg.append('text')
    .attr('x', margin.left + (width - margin.left - margin.right) / 2)
    .attr('y', height - 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '16px')
    .attr('fill', '#333')
    .attr('font-weight', 'bold')
    .text('Gender');
  
  let groups = svg.selectAll('g.series')
    .data(series)
    .enter()
    .append('g')
    .attr('class', 'series')
    .attr('fill', (d, i) => colors[i]);
  
  groups.selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('x',      d => xScale(d.data.gender))
    .attr('y',      d => yScale(d[1]))
    .attr('width',  xScale.bandwidth())
    .attr('height', d => yScale(d[0]) - yScale(d[1]))
    .style('cursor', 'pointer')
    .style('transition', 'filter 0.2s ease')
    .on('mouseover', function(event, d) {
        const key    = d3.select(this.parentNode).datum().key;
        const rawVal = d.data[key];
        const total  = keys.reduce((sum, k) => sum + d.data[k], 0);
        const pct    = ((rawVal / total) * 100).toFixed(1);

        tooltip
            .style('opacity', 1)
            .html(`
                <strong style="font-size: 15px">${d.data.gender}</strong><br/>
                <span style="color:#bbb; font-size: 13px">${key}</span><br/>
                <span style="font-size: 14px">${rawVal.toFixed(2)} hrs &nbsp;|&nbsp; ${pct}%</span>
            `);

        d3.select(this).style('filter', 'brightness(0.85)').style('stroke', '#333').style('stroke-width', '2px');
    })
    .on('mousemove', function(event) {
        tooltip
            .style('left', (event.pageX + 14) + 'px')
            .style('top',  (event.pageY - 36) + 'px');
    })
    .on('mouseout', function() {
        tooltip.style('opacity', 0);
        d3.select(this).style('filter', null).style('stroke', 'none');
    });
  
  // Create the legend
  let legend = svg.append('g')
    .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`);
  
  keys.forEach((key, i) => {
    let row = legend.append('g').attr('transform', `translate(0, ${i * 28})`);
    row.append('rect')
      .attr('width', 16)
      .attr('height', 16)
      .attr('fill', colors[i])
      .attr('rx', 2);
    row.append('text')
      .attr('x', 24)
      .attr('y', 13)
      .style('font-size', '14px')
      .style('fill', '#333')
      .style('font-weight', '500')
      .text(key);
  });