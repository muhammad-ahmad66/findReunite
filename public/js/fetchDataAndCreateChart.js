import Chart from 'chart.js/auto';

// Function to fetch data and create chart using Chart.js
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
      const missingPersons = extractMissingPersons(data);
      const countryCounts = countPersonsByCountry(missingPersons);

      const labels = Object.keys(countryCounts);
      const dataCounts = Object.values(countryCounts);

      // Ensure canvas element is initialized
      if (canvasElement.getContext) {
        const ctx = canvasElement.getContext('2d');

        // Destroy existing chart if it exists
        if (window.barChart) {
          window.barChart.destroy();
        }

        const config = {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: chartLabel,
                data: dataCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Chart.js Bar Chart',
              },
            },
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
          },
        };

        window.barChart = new Chart(ctx, config);
      }
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
    const country = person.location?.country || person.country;
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  console.log(countryCounts);
  return countryCounts;
}
