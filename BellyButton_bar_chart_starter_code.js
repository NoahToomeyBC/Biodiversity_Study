function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    let result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let ids = result.otu_ids;
    let labels = result.otu_lables;
    let values = result.sample_values;
    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    let yticks = ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();


    // 8. Create the trace for the bar chart. 
    let barData = [{
      x: values,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: labels,
      transforms: [{
        type: 'sort',
        target: 'y',
        order: 'descending'
      }]
    }];

    let trace = barData;

    // 9. Create the layout for the bar chart. 
    let barLayout = {
      title: "Top 10 Bacterial Samples",
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", trace, barLayout);
  
// Create trace for bubble chart
  let bubbleData = [{
    x: ids,
    y: values,
    text: labels,
    mode: 'markers', 
      marker: {
        size: values,
        color: values,
        colorscale: 'RdBu'
      }
  }];

  let trace2 = bubbleData;
// Create layout for bubblechart
  let bubbleLayout= {
    title: 'Bacteria Cultures Per Sample',
    hovermode: 'closest',
    xaxis: {title:'OTU ID'},
    automargin: 'true',

  };
// Create bubblechart to be loaded to site
  Plotly.newPlot('bubble', trace2, bubbleLayout)
// Get meta data and wash frequency variables
  let metadata = data.metadata;
  let gaugeArray = metadata.filter(meta=> meta.id == sample);
  
  let gaugeResult = gaugeArray[0];

  let wfreq= gaugeResult.wfreq;
// create gauge chart trace
  let gaugeData = [{
    value: wfreq, 
    type: 'indicator',
    mode: 'gauge+number',

    title: {text: "Scrubs Per Week"},
    gauge: {
      bar: {color: 'black'},
      axis: {range: [0,10], dticks: '2'},
      steps:[
        { range:[0,2], color: 'red'},
        { range: [2,4], color: 'orange'},
        { range: [4,6], color: 'yellow'},
        { range: [6,8], color: 'lightgreen'},
        { range: [8,10], color: 'green'}
        ],
      
    }
  }];
  let trace3= gaugeData;
// Create Layout for gauge chart
  let gaugeLayout = {
    automargin: 'true',
    title: 'Belly Button Washing Frequency'
  };

  Plotly.newPlot('gauge', trace3, gaugeLayout)
});
}
