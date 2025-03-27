<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profit Graph | Crypto Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #1a1a2e;
      color: white;
      font-family: 'Arial', sans-serif;
    }
    .graph-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      background: rgba(255,255,255,0.05);
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    #profitChart {
      width: 100%;
      height: 400px;
    }
    .graph-title {
      text-align: center;
      margin-bottom: 20px;
      color: #6c5ce7;
      font-size: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="graph-container">
    <h2 class="graph-title">Your Profit/Loss Trend</h2>
    <canvas id="profitChart"></canvas>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const ctx = document.getElementById('profitChart').getContext('2d');
      
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Profit/Loss (₹)',
            data: [-2000, 1500, 3000, 4500, 2500, 6000],
            borderColor: '#00cec9',
            backgroundColor: 'rgba(0, 206, 201, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: '#fff',
                font: {
                  size: 14
                }
              }
            },
            tooltip: {
              backgroundColor: '#16213e',
              titleColor: '#00cec9',
              bodyColor: '#fff',
              borderColor: '#00cec9',
              borderWidth: 1
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255,255,255,0.1)'
              },
              ticks: {
                color: '#fff'
              }
            },
            y: {
              grid: {
                color: 'rgba(255,255,255,0.1)'
              },
              ticks: {
                color: '#fff',
                callback: function(value) {
                  return '₹' + value;
                }
              }
            }
          }
        }
      });
    });
  </script>
</body>
</html>