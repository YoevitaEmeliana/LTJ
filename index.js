document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.prev ');
    const contentText = document.querySelector('#home .content p');

    nextButton.addEventListener('click', function() {
        contentText.textContent = 'NAMA WEBSITE dibuat dalam bentuk web untuk memudahkan ...';
    });

    prevButton.addEventListener('click', function() {
        contentText.textContent = 'Kami dapat membantu Anda untuk mengetahui nilai prediksi pendapatan dan pertumbuhan ekonomi suatu wilayah melalui data';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const mulaiButton = document.querySelector('.action-btn.mulai');
    const pelajariButton = document.querySelector('.action-btn.pelajari');

    mulaiButton.addEventListener('click', function() {
        document.getElementById('pertumbuhan').scrollIntoView({ behavior: 'smooth' });
    });

    pelajariButton.addEventListener('click', function() {
        document.getElementById('tentang').scrollIntoView({ behavior: 'smooth' });
    });
});

// Menambahkan event listener untuk input tahun
document.querySelectorAll('.year-filter').forEach(input => {
    input.addEventListener('input', event => {
        let newValue = event.target.value;
        if (newValue.match(/^\d{4}$/)) { // Memastikan input adalah tahun
            let index = [...event.target.parentElement.parentElement.children].indexOf(event.target.parentElement);
            document.querySelectorAll(`#economic-growth-table tbody td:nth-child(${index + 1}) input`).forEach(input => {
                input.placeholder = newValue;
            });
        }
    });
});

// Tahun data asli
const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];

// Menyiapkan input untuk setiap tahun
document.addEventListener('DOMContentLoaded', () => {
    generateSectorInputs();
    generateYearInputs();
    updateChart(years, Array(years.length).fill(0)); // Data dummy untuk inisialisasi grafik
});

function generateYearInputs() {
    const inputFields = document.getElementById('input-fields');
    years.forEach(year => {
        const inputDiv = document.createElement('div');
        inputDiv.innerHTML = `
            <label for="revenue-${year}">${year}:</label>
            <input type="number" id="revenue-${year}" class="revenue-input" placeholder="Masukkan pendapatan">
        `;
        inputFields.appendChild(inputDiv);
    });
}

// Generate sector inputs based on user-defined count
function generateSectorInputs() {
    const sectorCount = parseInt(document.getElementById('sector-count').value, 10);
    const sectorFields = document.getElementById('sector-fields');

    // Clear existing sector inputs
    let sectorInputDiv = document.getElementById('sector-inputs');
    if (sectorInputDiv) {
        sectorInputDiv.remove();
    }

    // Create new sector inputs
    sectorInputDiv = document.createElement('div');
    sectorInputDiv.id = 'sector-inputs';

    for (let i = 1; i <= sectorCount; i++) {
        const inputDiv = document.createElement('div');
        inputDiv.innerHTML = `
            <label for="sector-${i}">Sektor ${i}:</label>
            <input type="text" id="sector-${i}" class="sector-input" placeholder="Masukkan nama sektor">
        `;
        sectorInputDiv.appendChild(inputDiv);
    }

    sectorFields.appendChild(sectorInputDiv);
}

// Fungsi untuk melakukan regresi linier
function linearRegression(x, y) {
    let n = x.length;
    let sum_x = 0, sum_y = 0, sum_xy = 0, sum_xx = 0;

    for (let i = 0; i < n; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += x[i] * y[i];
        sum_xx += x[i] * x[i];
    }

    let slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    let intercept = (sum_y - slope * sum_x) / n;

    return [intercept, slope];
}

// Menghitung dan menampilkan proyeksi
function calculateProjection() {
    const revenues = [];
    const sectors = [];
    
    document.querySelectorAll('.revenue-input').forEach(input => {
        revenues.push(parseFloat(input.value) || 0);
    });
    
    document.querySelectorAll('.sector-input').forEach(input => {
        sectors.push(input.value || 'Sektor ' + (sectors.length + 1));
    });

    const [intercept, slope] = linearRegression(years.map((_, index) => 2023 - index), revenues);

    const predictedYears = [];
    const predictedRevenues = [];

    for (let year = 2024; year <= 2033; year++) {
        predictedYears.push(year);
        predictedRevenues.push(intercept + slope * (year - 2023));
    }

    displayProjectedData(predictedRevenues, sectors);
    updateChart(predictedYears, predictedRevenues);
}

// Menampilkan data proyeksi di tabel
function displayProjectedData(predictedRevenues, sectors) {
    const tbody = document.getElementById('predicted-data');
    tbody.innerHTML = ''; // Kosongkan tabel sebelum memperbarui

    sectors.forEach((sector, index) => {
        let row = document.createElement('tr');

        // Nomor dan nama sektor
        let cell = document.createElement('td');
        cell.textContent = index + 1;
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.textContent = sector;
        row.appendChild(cell);

        // Data prediksi
        predictedRevenues.forEach(revenue => {
            cell = document.createElement('td');
            cell.textContent = revenue.toFixed(2);
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}

// Update grafik dengan Chart.js
function updateChart(years, revenues) {
    const ctx = document.getElementById('growth-chart').getContext('2d');

    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Proyeksi Pendapatan',
                data: revenues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Pendapatan: ${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}
