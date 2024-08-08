document.addEventListener('DOMContentLoaded', function() {
    const mulaiButton = document.querySelector('.action-btn.mulai');
    const pelajariButton = document.querySelector('.action-btn.pelajari');

    mulaiButton.addEventListener('click', function() {
        document.getElementById('input-section').scrollIntoView({ behavior: 'smooth' });
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

document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('economic-growth-table');
    
    // Fungsi untuk menghitung total per kolom
    function calculateTotals() {
        const years = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];
        years.forEach((year, index) => {
            // Mengambil semua sel pada kolom tertentu
            const cells = table.querySelectorAll(`tbody tr td:nth-child(${index + 3})`); // +3 karena 2 kolom pertama tidak dihitung
            let total = 0;
            cells.forEach(cell => {
                // Mengonversi format angka Indonesia ke format internasional untuk perhitungan
                const value = parseFloat(cell.textContent.replace(/\./g, '').replace(',', '.').trim()) || 0;
                total += value;
            });
            // Mengonversi hasil perhitungan kembali ke format Indonesia untuk ditampilkan
            document.getElementById(`total-${year}`).textContent = total.toFixed(2)
                .replace('.', ',')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        });
    }

    // Menambahkan event listener untuk perubahan pada sel tabel
    table.addEventListener('input', (event) => {
        if (event.target.tagName === 'TD') {
            calculateTotals();
        }
    });

    // Inisialisasi total saat halaman dimuat
    calculateTotals();
});

document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('projected-growth-table');
    
    // Fungsi untuk menghitung total per kolom
    function calculateTotals() {
        const years = ['2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033'];
        years.forEach((year, index) => {
            // Mengambil semua sel pada kolom tertentu
            const cells = table.querySelectorAll(`tbody tr td:nth-child(${index + 3})`); // +3 karena 2 kolom pertama tidak dihitung
            let total = 0;
            cells.forEach(cell => {
                // Mengonversi format angka Indonesia ke format internasional untuk perhitungan
                const text = cell.textContent.replace(/\./g, '').replace(',', '.').trim();
                const value = parseFloat(text) || 0;
                total += value;
            });
            // Mengonversi hasil perhitungan kembali ke format Indonesia untuk ditampilkan
            const formattedTotal = total.toFixed(2)
                .replace('.', ',')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            document.getElementById(`total-${year}`).textContent = formattedTotal;
        });
    }

    // Fungsi untuk menghitung dan menampilkan proyeksi
    function calculateProjection() {
        // Tambahkan kode untuk menghitung proyeksi dan mengisi tabel dengan data di sini
        // Pastikan tabel diisi dengan data yang sesuai sebelum menghitung total

        // Setelah tabel diisi, panggil fungsi calculateTotals untuk menghitung total
        calculateTotals();
    }

    // Tambahkan event listener pada tombol untuk menghitung proyeksi
    document.querySelector('.calculate-button').addEventListener('click', calculateProjection);

    // Jika diperlukan, panggil calculateTotals secara otomatis saat data diubah
    // table.addEventListener('input', (event) => {
    //     if (event.target.tagName === 'TD') {
    //         calculateTotals();
    //     }
    // });
});


// Fungsi untuk menghasilkan input sektor dinamis
function generateSectorInputs() {
    const sectorFields = document.getElementById('sector-fields');

    // Hapus input sektor sebelumnya
    sectorFields.innerHTML = '';

    const inputDiv = document.createElement('div');
    inputDiv.innerHTML = `
        <label for="sector-name">Nama Sektor:</label>
        <input type="text" id="sector-name">
    `;
    sectorFields.appendChild(inputDiv);

    generateYearInputs(); // Update input tahun
}

// Fungsi untuk menghasilkan input tahun
function generateYearInputs() {
    const inputFields = document.getElementById('input-fields');
    inputFields.innerHTML = ''; // Hapus input tahun sebelumnya

    const years = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    years.forEach(year => {
        const inputDiv = document.createElement('div');
        inputDiv.innerHTML = `
            <label for="revenue-${year}">${year}:</label>
            <input type="number" id="revenue-${year}" class="revenue-input" step="0.01">
        `;
        inputFields.appendChild(inputDiv);
    });
}

// Inisialisasi form input saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    generateSectorInputs(); // Initial call to generate inputs based on default sector count
    generateYearInputs();   // Initial call to generate inputs for years
    loadSavedData();        // Load saved data from localStorage
});

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

// Fungsi untuk menghitung dan menampilkan proyeksi
function calculateProjection() {
    const years = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    const revenues = [];

    // Ambil data pendapatan dari input pengguna
    years.forEach(year => {
        const revenue = parseFloat(document.getElementById(`revenue-${year}`).value) || 0;
        revenues.push(revenue);
    });

    // Lakukan regresi linier
    const xData = years;
    const [intercept, slope] = linearRegression(xData, revenues);

    // Hitung prediksi untuk tahun 2024 hingga 2033
    const predictedYears = [];
    const predictedRevenues = [];

    for (let year = 2024; year <= 2033; year++) {
        predictedYears.push(year);
        predictedRevenues.push(intercept + slope * year);
    }

    displayProjectedData(predictedYears, predictedRevenues);
    updateChart(years, revenues, predictedYears, predictedRevenues);
}

// Fungsi untuk menampilkan data proyeksi di tabel
function displayProjectedData(predictedYears, predictedRevenues) {
    const tbody = document.getElementById('predicted-data');
    tbody.innerHTML = ''; // Kosongkan tabel sebelum memperbarui

    // Ambil nama sektor dari input pengguna
    const sectorName = document.getElementById('sector-name').value || 'Sektor 1';

    // Buat satu baris untuk sektor
    let row = document.createElement('tr');
    
    let cell = document.createElement('td');
    cell.textContent = '1'; // Nomor baris
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = sectorName; // Nama sektor
    row.appendChild(cell);

    // Data prediksi
    predictedRevenues.forEach(revenue => {
        cell = document.createElement('td');
        cell.textContent = revenue.toFixed(2);
        row.appendChild(cell);
    });

    tbody.appendChild(row);
}

// Update grafik dengan Chart.js
function updateChart(years, revenues, predictedYears, predictedRevenues) {
    const ctx = document.getElementById('growth-chart').getContext('2d');

    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...years, ...predictedYears],
            datasets: [
                {
                    label: 'Data Asli',
                    data: years.map((year, idx) => ({ x: year, y: revenues[idx] })),
                    borderColor: 'blue', // Warna garis data asli
                    backgroundColor: 'rgb(6, 86, 190, 0.1)', // Latar belakang area data asli
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: 'Prediksi Pendapatan',
                    data: predictedYears.map((year, idx) => ({ x: year, y: predictedRevenues[idx] })),
                    borderColor: 'red', // Warna garis prediksi
                    backgroundColor: 'rgb(202, 25, 25, 0.1)', // Latar belakang area prediksi
                    borderWidth: 2,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'white' // Warna teks label legenda
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Pendapatan: ${tooltipItem.raw.y.toFixed(2)}`;
                        }
                    },
                    backgroundColor: 'white', // Latar belakang tooltip
                    titleColor: 'gray', // Warna judul tooltip
                    bodyColor: 'gray', // Warna teks tubuh tooltip
                    borderColor: 'gray', // Warna border tooltip
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white' // Warna teks pada sumbu x
                    },
                    grid: {
                        color: 'rgb(255, 255, 255, 0.1)' // Warna garis grid x
                    }
                },
                y: {
                    ticks: {
                        color: 'white' // Warna teks pada sumbu y
                    },
                    grid: {
                        color: 'rgb(255, 255, 255, 0.1)' // Warna garis grid y
                    }
                }
            }
        }
    });
}


// Inisialisasi form input saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    generateSectorInputs(); // Initial call to generate inputs based on default sector count
    generateYearInputs();   // Initial call to generate inputs for years
});

document.addEventListener('DOMContentLoaded', function() {
    function calculateTotal(columnClass) {
        let cells = document.querySelectorAll('.' + columnClass);
        let total = 0;

        cells.forEach(cell => {
            let value = parseFloat(cell.textContent.replace(/,/g, ''));
            if (!isNaN(value)) {
                total += value;
            }
        });

        return total;
    }

    function formatNumber(num) {
        return new Intl.NumberFormat('id-ID').format(num);
    }

    function calculateYearlyTotals(year) {
        let totalRupiah = calculateTotal('rupiah[data-year="' + year + '"]');
        document.getElementById('total-' + year + '-rupiah').textContent = formatNumber(totalRupiah);

        let cellsRupiah = document.querySelectorAll('.rupiah[data-year="' + year + '"]');
        cellsRupiah.forEach(cell => {
            let value = parseFloat(cell.textContent.replace(/,/g, ''));
            if (!isNaN(value) && totalRupiah > 0) {
                let percentValue = (value / totalRupiah) * 100;
                let percentCell = cell.nextElementSibling;
                percentCell.textContent = percentValue.toFixed(2);
            }
        });

        document.getElementById('total-' + year + '-percent').textContent = "100.00";
    }

    ['2013', '2018', '2023', '2025', '2028', '2033'].forEach(year => {
        calculateYearlyTotals(year);
    });

    document.getElementById('economic-growth-table').addEventListener('input', function(event) {
        let cell = event.target;
        let year = cell.getAttribute('data-year');

        if (year) {
            calculateYearlyTotals(year);
        }
    });
});

document.querySelectorAll('#weighting-results-table tbody td[contenteditable="true"]').forEach(cell => {
    cell.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default behavior of Enter key
            
            const cell = event.target;
            let inputValue = cell.innerText.trim();

            try {
                // Replace commas with dots for decimal points
                inputValue = inputValue.replace(/,/g, '.');

                // Remove any characters that are not numbers, operators, or parentheses
                inputValue = inputValue.replace(/[^0-9+\-*/().]/g, '');

                // Evaluate the expression using Decimal.js
                const result = new Decimal(eval(inputValue)).times(100); // Multiply result by 100

                // Format the result to two decimal places and use dot as decimal separator
                cell.innerText = result.toFixed(2); // Ensures dot is used
                cell.classList.remove('error'); // Remove any previous error styling
            } catch (error) {
                // If there's an error (invalid expression), display a warning
                cell.classList.add('error');
                cell.innerText = 'Invalid input'; // Optionally display an error message
            }
        }
    });
});

document.querySelectorAll('#economic-pull-table tbody td[contenteditable="true"]').forEach(cell => {
    cell.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const cell = event.target;
            let inputValue = cell.innerText.trim();

            try {
                // Remove any characters that are not digits, operators, or parentheses
                inputValue = inputValue.replace(/[^0-9+\-*/().^]/g, '');
                // Replace ^ with ** for exponentiation in JavaScript
                inputValue = inputValue.replace(/\^/g, '**');
                
                // Check if the input is a valid mathematical expression
                if (inputValue && /^[0-9+\-*/().^]+$/.test(inputValue)) {
                    // Evaluate the expression using JavaScript's eval
                    const result = new Decimal(eval(inputValue));
                    cell.innerText = result.toFixed(2);
                    cell.classList.remove('error');
                } else if (inputValue === '') {
                    cell.classList.remove('error');
                } else {
                    throw new Error('Invalid input');
                }
            } catch (error) {
                cell.classList.add('error');
                cell.innerText = 'Invalid input';
            }
        }
    });
});

document.querySelectorAll('#economic-increase-table tbody td[contenteditable="true"]').forEach(cell => {
    cell.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const cell = event.target;
            let inputValue = cell.innerText.trim();

            try {
                // Sanitize input and replace ^ with ** for JavaScript exponentiation
                inputValue = inputValue.replace(/\^/g, '**');

                // Check for valid input characters
                if (/^[0-9+\-*/().\s]*$/.test(inputValue)) {
                    const result = eval(inputValue);
                    const percentageResult = (result * 100).toFixed(2); // Convert to percentage
                    cell.innerText = percentageResult + '%'; // Display with percentage sign
                    cell.classList.remove('error');
                } else {
                    throw new Error('Invalid input');
                }
            } catch (error) {
                cell.classList.add('error');
                cell.innerText = 'Invalid input';
                console.error('Invalid input:', inputValue);
            }
        }
    });
});

function calculateProduction() {
    const initialAmount = parseFloat(document.getElementById('initial-amount-production').value);
    const remainingAmount = parseFloat(document.getElementById('remaining-amount-production').value);
    const timePeriod = parseFloat(document.getElementById('time-period-production').value);

    if (isNaN(initialAmount) || isNaN(remainingAmount) || isNaN(timePeriod) || timePeriod <= 0) {
        alert("Please enter valid numbers.");
        return;
    }

    // Calculate lambda
    const lambda = -Math.log(remainingAmount / initialAmount) / timePeriod;

    // Calculate remaining amounts and reverse graph data
    const t_values = Array.from({ length: (timePeriod * 10) + 1 }, (_, i) => i * 0.1);
    const N_values = t_values.map(t => initialAmount * Math.exp(-lambda * t));
    const N_reverse = N_values.map(N => initialAmount - N);

    // Plotting using Chart.js
    const ctx = document.getElementById('production-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: t_values,
            datasets: [{
                label: 'Produced Metal (tons)',
                data: N_reverse,
                borderColor: 'blue', // Warna garis grafik
                backgroundColor: 'rgb(0, 0, 255, 0.1)', // Latar belakang area grafik
                fill: true,
                borderWidth: 2 // Lebar garis grafik
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'white' // Warna teks label legenda
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Amount: ${tooltipItem.raw.toFixed(2)}`;
                        }
                    },
                    backgroundColor: 'white', // Latar belakang tooltip
                    titleColor: 'grey', // Warna judul tooltip
                    bodyColor: 'grey', // Warna teks tubuh tooltip
                    borderColor: 'grey', // Warna border tooltip
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white' // Warna teks pada sumbu x
                    },
                    grid: {
                        color: 'rgb(255, 255, 255, 0.1)' // Warna garis grid x
                    },
                    title: {
                        display: true,
                        text: 'Years',
                        color: 'white' // Warna teks judul sumbu x
                    }
                },
                y: {
                    ticks: {
                        color: 'white' // Warna teks pada sumbu y
                    },
                    grid: {
                        color: 'rgb(255, 255, 255, 0.1)' // Warna garis grid y
                    },
                    title: {
                        display: true,
                        text: 'Amount of Rare Earth Elements Produced (tons)',
                        color: 'white' // Warna teks judul sumbu y
                    }
                }
            }
        }
    });
    

    // Populate the projection table
    const tableBody = document.getElementById('production-projected-data');
    tableBody.innerHTML = '';
    for (let i = 0; i < t_values.length; i++) {
        if (i % 10 === 0) { // Show data for each whole year
            const year = (i / 10);
            const row = `<tr>
                <td>${year}</td>
                <td>${N_reverse[i].toFixed(2)}</td>
            </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        }
    }

// Function to save production input data to localStorage
function saveProductionData() {
    const initialAmount = document.getElementById('initial-amount-production').value;
    const remainingAmount = document.getElementById('remaining-amount-production').value;
    const timePeriod = document.getElementById('time-period-production').value;

    localStorage.setItem('initialAmount', initialAmount);
    localStorage.setItem('remainingAmount', remainingAmount);
    localStorage.setItem('timePeriod', timePeriod);
}

// Save data to localStorage after calculation
saveProductionData();
}

// Function to load production input data from localStorage
function loadProductionData() {
    const initialAmount = localStorage.getItem('initialAmount');
    const remainingAmount = localStorage.getItem('remainingAmount');
    const timePeriod = localStorage.getItem('timePeriod');

    if (initialAmount) document.getElementById('initial-amount-production').value = initialAmount;
    if (remainingAmount) document.getElementById('remaining-amount-production').value = remainingAmount;
    if (timePeriod) document.getElementById('time-period-production').value = timePeriod;
}

// Toggle menu state
function toggleMenu() {
    const navContainer = document.querySelector('.nav-container');
    const hamburger = document.querySelector('.hamburger-menu');

    navContainer.classList.toggle('show'); // Toggle the visibility of the menu
    hamburger.classList.toggle('active');  // Toggle the hamburger icon animation
}

// Close menu if clicking outside the menu or hamburger icon
document.addEventListener('click', function(event) {
    const navContainer = document.querySelector('.nav-container');
    const hamburger = document.querySelector('.hamburger-menu');

    if (!navContainer.contains(event.target) && !hamburger.contains(event.target)) {
        navContainer.classList.remove('show'); // Hide the menu
        hamburger.classList.remove('active');  // Deactivate the hamburger icon animation
    }
});

// Prevent toggleMenu function from closing the menu when clicking on hamburger icon
document.querySelector('.hamburger-menu').addEventListener('click', function(event) {
    event.stopPropagation(); // Stop event from propagating to the document
});

document.addEventListener('DOMContentLoaded', () => {
     // Memuat data yang disimpan dari localStorage
     function loadSavedData() {
        const sectorName = localStorage.getItem('sectorName');
        if (sectorName) {
            document.getElementById('sector-name').value = sectorName;
        }

        const years = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
        years.forEach(year => {
            const revenue = localStorage.getItem(`revenue-${year}`);
            if (revenue) {
                document.getElementById(`revenue-${year}`).value = revenue;
            }
        });
    }

    // Menambahkan event listener untuk perubahan data dan menyimpannya
    function saveData() {
        const sectorName = document.getElementById('sector-name').value;
        localStorage.setItem('sectorName', sectorName);

        const years = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
        years.forEach(year => {
            const revenue = document.getElementById(`revenue-${year}`).value;
            localStorage.setItem(`revenue-${year}`, revenue);
        });
    }

    document.querySelectorAll('.revenue-input').forEach(input => {
        input.addEventListener('input', saveData);
    });

    document.querySelector('#sector-name').addEventListener('input', saveData);

    // Function to save data from a table to localStorage
    function saveTableData(tableId, storageKey) {
        const table = document.getElementById(tableId);
        const rows = table.querySelectorAll('tbody tr');
        const data = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowData = [];
            cells.forEach(cell => {
                rowData.push(cell.textContent.trim());
            });
            data.push(rowData);
        });

        localStorage.setItem(storageKey, JSON.stringify(data));
    }

    // Function to load data from localStorage to a table
    function loadTableData(tableId, storageKey) {
        const table = document.getElementById(tableId);
        const data = JSON.parse(localStorage.getItem(storageKey));

        if (data) {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, cellIndex) => {
                    cell.textContent = data[rowIndex][cellIndex] || '';
                });
            });
        }
    }

    // Function to save all tables
    function saveAllTables() {
        const tableIds = [
            'economic-growth-table',
            'projected-growth-table',
            'weighting-results-table',
            'production-projected-data',
            'economic-increase-table',
            'economic-pull-table'
        ];
        const storageKeys = [
            'economicGrowthData',
            'projectedGrowthData',
            'weightingResultsData',
            'productionProjectedData',
            'economicIncreaseData',
            'economicPullData'
        ];

        tableIds.forEach((id, index) => {
            saveTableData(id, storageKeys[index]);
        });
    }

    // Function to load all tables
    function loadAllTables() {
        const tableIds = [
            'economic-growth-table',
            'projected-growth-table',
            'weighting-results-table',
            'production-projected-data',
            'economic-increase-table',
            'economic-pull-table'
        ];
        const storageKeys = [
            'economicGrowthData',
            'projectedGrowthData',
            'weightingResultsData',
            'productionProjectedData',
            'economicIncreaseData',
            'economicPullData'
        ];

        tableIds.forEach((id, index) => {
            loadTableData(id, storageKeys[index]);
        });
    }

    // Function to save charts
    function saveChartData(chartId, storageKey) {
        const chart = document.getElementById(chartId);
        if (chart && chart.toDataURL) {
            localStorage.setItem(storageKey, chart.toDataURL());
        }
    }

    // Function to load charts
    function loadChartData(chartId, storageKey) {
        const chart = document.getElementById(chartId);
        const dataURL = localStorage.getItem(storageKey);
        if (chart && dataURL) {
            chart.src = dataURL;
        }
    }

    // Function to save all charts
    function saveAllCharts() {
        const chartIds = [
            'economic-growth-chart',
            'projected-growth-chart',
            'growth-chart',
            'production-chart'
        ];
        const storageKeys = [
            'economicGrowthChartData',
            'projectedGrowthChartData',
            'growthChartData',
            'productionChartData'
        ];

        chartIds.forEach((id, index) => {
            saveChartData(id, storageKeys[index]);
        });
    }

    // Function to load all charts
    function loadAllCharts() {
        const chartIds = [
            'economic-growth-chart',
            'projected-growth-chart',
            'growth-chart',
            'production-chart'
        ];
        const storageKeys = [
            'economicGrowthChartData',
            'projectedGrowthChartData',
            'growthChartData',
            'productionChartData'
        ];

        chartIds.forEach((id, index) => {
            loadChartData(id, storageKeys[index]);
        });
    }

    // Add event listeners to save data on input change
    document.querySelectorAll('table').forEach(table => {
        table.addEventListener('input', () => {
            saveAllTables();
        });
    });

    // Add event listener to save chart data on change
    document.querySelectorAll('canvas').forEach(canvas => {
        // Note: Canvas does not have a 'change' event, using click event as an alternative
        canvas.addEventListener('click', () => {
            saveAllCharts();
        });
    });

        // Add event listeners to save data on input change
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                saveProductionData(); // Save production data on input change
            });
        });

        // Add event listeners to save data on input change
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            saveData(); // Save production data on input change
        });
    });

    // Initial load of all tables and charts
    loadAllTables();
    loadAllCharts();
    loadProductionData(); // Load production data
    loadSavedData(); // Load saved data from localStorage


    // Call these functions initially to populate the totals and projections
    calculateTotals();
    calculateProjection();
});
