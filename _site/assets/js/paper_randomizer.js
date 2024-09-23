// List of PDF files
const pdfFiles = [
    'assets/papers/document1.pdf',
    'assets/papers/document2.pdf'
    // Add more PDFs here
];

// Function to get a random PDF from the list
function getRandomPdf() {
    const randomIndex = Math.floor(Math.random() * pdfFiles.length);
    return pdfFiles[randomIndex];
}

// Function to display the PDF
function displayPdf(pdfPath) {
    const pdfContainer = document.getElementById('pdf-container');
    pdfContainer.innerHTML = `<embed src="${pdfPath}" width="600" height="500" type="application/pdf">`;
}

// Add event listener to the button
document.getElementById('random-pdf-button').addEventListener('click', () => {
    const randomPdf = getRandomPdf();
    displayPdf(randomPdf);
});
