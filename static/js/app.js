 // Define the URL for fetching data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to fetch data using D3
function fetchData(url) {
  // Return a promise
  return new Promise((resolve, reject) => {
    // Fetch data from the URL using D3
    d3.json(url)
      .then(data => {
        // Resolve the promise with the fetched data
        resolve(data);
      })
      .catch(error => {
        // Reject the promise with the error if fetching fails
        reject(error);
      });
  });
}

// Function to create the bar chart
function createBarChart(data) {
  // Extract necessary data for the chart
  const sampleValues = data.samples[0].sample_values.slice(0, 10).reverse();
  const otuIds = data.samples[0].otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
  const otuLabels = data.samples[0].otu_labels.slice(0, 10).reverse();

  // Create the trace for the bar chart
  const trace = {
    x: sampleValues,
    y: otuIds,
    text: otuLabels,
    type: "bar",
    orientation: "h"
  };

  // Create the data array for the plot
  const plotData = [trace];

  // Define the layout for the plot
  const layout = {
    title: "Top 10 OTUs",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU ID" }
  };

  // Plot the bar chart using Plotly
  Plotly.newPlot("bar", plotData, layout);
}

// Function to create the bubble chart
function createBubbleChart(data) {
  // Extract necessary data for the bubble chart
  const otuIds = data.samples[0].otu_ids;
  const sampleValues = data.samples[0].sample_values;
  const otuLabels = data.samples[0].otu_labels;

  // Create trace for the bubble chart
  const trace = {
    x: otuIds,
    y: sampleValues,
    mode: 'markers',
    marker: {
      size: sampleValues,
      color: otuIds,
      colorscale: 'Earth'
    },
    text: otuLabels
  };

  // Define data array containing the trace
  const plotData = [trace];

  // Define layout for the bubble chart
  const layout = {
    title: 'Bubble Chart',
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values' }
  };

  // Plot the bubble chart using Plotly
  Plotly.newPlot('bubble', plotData, layout);
}

// Function to display sample metadata
function displaySampleMetadata(metadata) {
  // Clear previous metadata
  const metadataDiv = document.getElementById('sample-metadata');
  metadataDiv.innerHTML = '';

  // Display each key-value pair from the metadata
  Object.entries(metadata).forEach(([key, value]) => {
    const metadataItem = document.createElement('p');
    metadataItem.textContent = `${key}: ${value}`;
    metadataDiv.appendChild(metadataItem);
  });
}

// Function to update all plots and display metadata when a new sample is selected
function updatePlots(sample) {
  // Fetch data
  fetchData(url)
    .then(data => {
      // Filter data for the selected sample
      const selectedSample = data.samples.find(s => s.id === sample);
      const selectedMetadata = data.metadata.find(m => m.id === parseInt(sample));

      // Update the bar chart
      createBarChart(selectedSample);

      // Update the bubble chart
      createBubbleChart(selectedSample);

      // Display metadata
      displaySampleMetadata(selectedMetadata);
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });
}

// Initialize the dashboard
function init() {
  // Fetch data and update plots for the first sample
  fetchData(url)
    .then(data => {
      const firstSample = data.names[0];
      updatePlots(firstSample);
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });
}

// Call init function to initialize the dashboard
init();