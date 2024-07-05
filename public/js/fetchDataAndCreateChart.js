// Function to fetch data and create chart
export const fetchDataAndCreateChart = function (
  url,
  canvasElement,
  chartLabel,
) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      // Determine how to access missingPersons based on API response structure
      const missingPersons = extractMissingPersons(data);

      // Count missing persons by country
      const countryCounts = countPersonsByCountry(missingPersons);

      console.log(countryCounts);

      // Extract labels (countries) and data (counts) for the chart
      const labels = Object.keys(countryCounts);
      const dataCounts = Object.values(countryCounts);

      // Get the canvas context
      const ctx = canvasElement.getContext('2d');

      // Create the chart with dynamic label
      createChart(ctx, labels, dataCounts, chartLabel);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      // Handle errors here, e.g., display an error message to the user
    });
};

// Function to extract missingPersons from data based on response structure
function extractMissingPersons(data) {
  // Check different possible structures here
  if (data.data && data.data.persons) {
    return data.data.persons;
  } else if (data.data.missingPersons) {
    return data.data.missingPersons;
  } else {
    console.error('Missing persons data not found in API response:', data);
    return []; // Return empty array or handle error as per your app logic
  }
}

// Function to count persons by country
function countPersonsByCountry(missingPersons) {
  const countryCounts = {};

  missingPersons.forEach((person) => {
    // Ensure person.location exists and has a country property
    if (person.location && person.location.country) {
      const country = person.location.country;
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    } else {
      const country = person.country;
      countryCounts[country] = (countryCounts[country] || 0) + 1;

      // Handle cases where location or country data is missing or inconsistent
    }
  });
  console.log(countryCounts);
  return countryCounts;
}

// Function to create Chart.js chart with dynamic label
function createChart(ctx, labels, dataCounts, chartLabel) {
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: chartLabel, // Use dynamic label here
          data: dataCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 45,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
