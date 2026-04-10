// Data
let data = [
    { gender: 'Female', 'Physical Activity': 2.43, 'Study Time': 4.49, 'Screen Time': 6.44, 'Sleep': 7.31 },
    { gender: 'Male', 'Physical Activity': 3.05, 'Study Time': 4.58, 'Screen Time': 8.5, 'Sleep': 7.14 }
];

const keys = ['Physical Activity', 'Study Time', 'Screen Time', 'Sleep'];
const colors = ['#dbdb8d', '#aec7e8', '#ff9896', '#ffbb78'];
let width = 600,
height = 400;
let margin = { top: 50, bottom: 60, left: 60, right: 160 };
let svg = d3.select('body')
.append('svg')
.attr('width', width)
.attr('height', height);
let stack = d3.stack().keys(keys);
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
    .call(d3.axisLeft(yScale).ticks(6))
    .attr('transform', `translate(${margin.left}, 0)`);
let xAxis = svg.append('g')
    .call(d3.axisBottom(xScale).tickSize(0))
    .attr('transform', `translate(0, ${height - margin.bottom})`);

// Input axis labels
svg.append('text')
    .attr('x', -(height / 2))
    .attr('y', 18)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Average hours per day');
svg.append('text')
    .attr('x', margin.left + (width - margin.left - margin.right) / 2)
    .attr('y', height - 10)
    .attr('text-anchor', 'middle')
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
    .attr('x', d => xScale(d.data.gender))
    .attr('y', d => yScale(d[1]))
    .attr('width', xScale.bandwidth())
    .attr('height', d => yScale(d[0]) - yScale(d[1]));

// Create the legend
let legend = svg.append('g')
    .attr('transform', `translate(${width - margin.right + 16}, ${margin.top})`);
keys.forEach((key, i) => {
    let row = legend.append('g').attr('transform', `translate(0, ${i * 24})`);
    row.append('rect').attr('width', 12).attr('height', 12).attr('fill', colors[i]);
    row.append('text').attr('x', 18).attr('y', 10).style('font-size', '12px').text(key);
})