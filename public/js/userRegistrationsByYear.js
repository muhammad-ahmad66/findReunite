// Function to update the statistics chart
export const updateChart = async function (selectedYear) {
  try {
    // Fetch data from your API
    const response = await fetch(`/users/statistics/${selectedYear}`);
    const data = await response.json();

    if (data.status === 'success') {
      const monthlyCounts = data.data.statistics;

      const noDataMessage = document.getElementById('noDataMessage');
      const chartCanvas = document.getElementById('usersByMonthChart');

      if (!monthlyCounts || Object.keys(monthlyCounts).length === 0) {
        console.error(`No data available for the year ${selectedYear}`);
        // Display the no data message
        noDataMessage.textContent = `No data available for ${selectedYear}`;
        noDataMessage.style.display = 'block'; // Show the message
        chartCanvas.style.display = 'none'; // Hide the chart canvas
        return;
      }

      // Hide the no data message and show the chart canvas if data is available
      noDataMessage.style.display = 'none';
      chartCanvas.style.display = 'block';

      // Extract labels (months) and data (counts) for the chart
      const labels = Object.keys(monthlyCounts);
      const dataCounts = Object.values(monthlyCounts);

      // Set static suggestedMin and suggestedMax
      const suggestedMin = 0; // Example value
      const suggestedMax = 40; // Example value

      // If the chart already exists, destroy it before creating a new one
      if (
        window.usersByMonthChart &&
        typeof window.usersByMonthChart.destroy === 'function'
      ) {
        window.usersByMonthChart.destroy();
      }

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: `Registered Users in ${selectedYear}`,
            data: dataCounts,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };

      // Create the chart
      const ctx = chartCanvas.getContext('2d');
      window.usersByMonthChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
      });
    } else {
      console.error(`Failed to fetch statistics for ${selectedYear}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Function to populate the year dropdown with available years

export const populateYearDropdown = function () {
  const yearDropdown = document.getElementById('yearDropdown');
  const currentYear = new Date().getFullYear(); // Get current year

  // Populate options dynamically with years from 2000 to current year
  for (let year = 2000; year <= currentYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearDropdown.appendChild(option);
  }

  // Set default selection to the current year and update the chart
};

// updateChart(new Date().getFullYear().toString());
// populateYearDropdown();