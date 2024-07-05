// Function to generate PDF from chart and text
export const generatePDF = function (
  chartCanvasId,
  companyName,
  documentTitle,
  fileName,
) {
  const { jsPDF } = window.jspdf;

  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Set background color
  doc.setFillColor(240, 240, 240); // Light grey background
  doc.rect(
    0,
    0,
    doc.internal.pageSize.width,
    doc.internal.pageSize.height,
    'F',
  );

  // Add company name and document title with center alignment
  doc.setFontSize(20);
  const companyNameWidth =
    (doc.getStringUnitWidth(companyName) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  const xCompanyName = (doc.internal.pageSize.width - companyNameWidth) / 2;
  doc.text(companyName, xCompanyName, 20 /* { align: 'center' }*/);

  doc.setFontSize(16);
  const documentTitleWidth =
    (doc.getStringUnitWidth(documentTitle) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  const xDocumentTitle = (doc.internal.pageSize.width - documentTitleWidth) / 2;
  doc.text(documentTitle, xDocumentTitle, 30 /* { align: 'center' }*/);

  // Capture the chart as an image using html2canvas
  html2canvas(document.getElementById(chartCanvasId)).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 200;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the chart image to the PDF
    const xImage = (doc.internal.pageSize.width - imgWidth) / 2;
    doc.addImage(imgData, 'PNG', xImage, 40, imgWidth, imgHeight);

    // Save the PDF
    doc.save(fileName);
  });
};

// Example usage:

/*
document.getElementById('download-btn').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;

  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Add company name and title
  doc.setFontSize(20);
  doc.text('Company Name', 20, 20);
  doc.setFontSize(16);
  doc.text('Country Distribution of Persons', 20, 30);

  // Capture the chart as an image using html2canvas
  html2canvas(document.getElementById('missingPersonsByCountryChart')).then(
    (canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the chart image to the PDF
      doc.addImage(imgData, 'PNG', 15, 40, imgWidth, imgHeight);

      // Save the PDF
      doc.save('Country_Distribution.pdf');
    },
  );
});

*/
