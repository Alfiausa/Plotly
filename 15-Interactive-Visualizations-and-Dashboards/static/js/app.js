function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    var metadataUrl = "/metadata/"+sample;
  // Use `d3.json` to fetch the metadata for a sample
    Plotly.d3.json(metadataUrl,function(error,data){
        console.log(data);
//        console.log(d3.entries(response));
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
        var metadata = d3.select("#sample-metadata").selectAll("p").data(d3.entries(data)).enter().append("p");
        d3.select("#sample-metadata").selectAll("p").text( function(d,i) { return d.key+": " + d.value} );


    // BONUS: Build the Gauge Chart
        console.log(data.WFREQ)
        my_buildGauge(data.WFREQ);
    });
    // Use `.html("") to clear any existing metadata ???
}

function my_buildGauge(WFREQ) {
    // WFREQ value between 0 and 180
    var level = WFREQ*20;

    // Trig to calc meter point
    var degrees = 180 - level,
         radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
         pathX = String(x),
         space = ' ',
         pathY = String(y),
         pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
       x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'Frequency',
        text: WFREQ,
        hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',
//      marker: {colors:d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))},
      marker: {colors:['rgba(0, 60, 0, .5)',      'rgba(14, 100, 22, .5)',
                       'rgba(90, 127, 40, .5)',    'rgba(130, 150, 60, .5)',
                       'rgba(160, 170, 90, .5)',  'rgba(190, 196, 120, .5)',
                       'rgba(210, 206, 160, .5)', 'rgba(230, 216, 190, .5)',
                       'rgba(240, 236, 220, .5)', 'rgba(250, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: '<b>Belly Button Washing Frequency</b> <br>Scrubs per week',
//      height: 700,
//      width:  700,
      xaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var sample_url="/samples/"+sample;
    var otu_ids = new Array();
    var sample_values = new Array();
    Plotly.d3.json(sample_url, function(error, response){
        if (error) {
            return console.warn(error);
        };
        // Variables to display on pie chart
        var sampleIDs = response.otu_ids;
        var sampleValues = response.sample_values;
        var sampleLabels = response.sample_values;
    // @TODO: Build a Bubble Chart using the sample data
        var data = [{
            x: sampleIDs,
            y: sampleValues,
            text: sampleLabels,
            type:'scatter',
            mode: 'markers',
            marker: {
                colorscale: "Rainbow",
                color: sampleIDs,
                opacity: .8,
                size:sampleValues
            },
        }];
        var layout = {
            title: "<b>"+sample+"</b>",
            hovermode:'closest',
            showlegend: false,
//            height: 600,
//            width: 1200,
            xaxis:{showline :false,title:"Otu_Id"},
            yaxis:{showline :false,title:"Sample_values",autorange: true}
        };
        Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // Show only 10 sample_values and otu_ids on pie chart
        var chartIDs = sampleIDs.slice(0, 10);
        var chartValues = sampleValues.slice(0, 10);
        var chartLabels = sampleLabels.slice(0, 10);
        var data = [{
                ids: chartIDs,
                values: chartValues,
                labels: chartLabels,
                type: 'pie',
            }];
        var layout = {
                title: "<b>"+sample+"</b>",
                yaxis: {
                    autorange: true
                }
            };
        Plotly.newPlot("pie", data, layout);
    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
