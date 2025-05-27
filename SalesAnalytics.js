const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

const currentUser = JSON.parse(localStorage.getItem('loggedinUser'));
document.querySelector('.navbar-custom h5').textContent = `Welcome, ${currentUser.name}`;


const products = JSON.parse(localStorage.getItem('Products'))||[];
const orders = JSON.parse(localStorage.getItem('Orders'))||[];



const productLabels = products.filter(product => product.SellerId === currentUser.id);
const productQuantities = productLabels.map(product => product.quantity);

const sellerOrders = orders.filter(order => 
  order.items.some(item => {
      const product = products.find(p => p.ProductId === item.ProductId);
      return product && product.SellerId === currentUser.id;
  })
);

const orderStatuses = sellerOrders.flatMap(order => order.items.map(item => item.status));
const statusCounts = [0, 1].map(status => orderStatuses.filter(s => s === status).length);

const chartColors = {
    backgroundColor: 'rgba(81, 52, 17, 0.4)',
    borderColor: 'rgba(81, 52, 17, 1)', 
};


const productCtx = document.getElementById('productChart').getContext('2d');
new Chart(productCtx, {
    type: 'bar',
    data: {
        labels: productLabels,
        datasets: [{
            label: 'Quantity',
            data: productQuantities,
            backgroundColor: chartColors.backgroundColor,
            borderColor: chartColors.borderColor,
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        animation: {
            duration: 3000, 
            easing: 'easeOutBounce' 
        },
        scales: {
            y: {
                beginAtZero: true,
            }
        }
    }
});

// Render Order Status Chart
const orderCtx = document.getElementById('orderChart').getContext('2d');
new Chart(orderCtx, {
    type: 'doughnut',
    data: {
        labels: ['Pending', 'Completed'],
        datasets: [{
            data: statusCounts,
            backgroundColor: ['rgba(250, 220, 0,0.5)', 'rgba(76, 175, 80, 0.5)'],
            borderColor: ['rgba(250, 220, 0,1)', 'rgba(76, 175, 80, 1)'],
            borderWidth: 1,
        }]
    },
    options: {
        responsive: true,
        animation: {
            duration: 3000, 
            easing: 'easeInOutQuad' 
        }
    }
});


let forHimCount = 0;
let forHerCount = 0;

orders.forEach(order => {
  order.items.forEach(item => {
    if (item.status === 1) { 
      const product = products.find(p => p.ProductId === item.ProductId);
      if (product && product.SellerId === currentUser.id) {
        if (product.category === "For Him") {
          forHimCount += item.quantity;
        } else if (product.category === "For Her") {
          forHerCount += item.quantity;
        }
      }
    }
  });
});

const catctx = document.getElementById('categoryChart').getContext('2d');
new Chart(catctx, {
  type: 'bar',
  data: {
    labels: ['For Him', 'For Her'],
    datasets: [{
      label: 'Number of Shipped Products',
      data: [forHimCount, forHerCount],
      backgroundColor: ['rgba(0, 92, 230, 0.5)','rgba(255, 102, 153, 0.5)'],
      borderColor: ['rgba(0, 92, 230, 1)', 'rgba(255, 102, 153, 1)'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    animation: {
      duration: 3000,
      easing: 'easeInOutQuad'
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  }
});


let salesData = [];

orders.forEach(order => {
    let totalSales = 0;

    order.items.forEach(item => {
        const product = products.find(p => p.ProductId === item.ProductId);

        if (product && product.SellerId === currentUser.id) {
            totalSales += item.quantity * product.price;
        }
    });

    salesData.push(totalSales);
});

const labels = orders.map(order => new Date(order.date).toLocaleString('default', { month: 'short', year: 'numeric' }));

const salesctx = document.getElementById('salesOverTimeChart').getContext('2d');
new Chart(salesctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'Total Sales ($)',
      data: salesData,
      borderColor: chartColors.borderColor,
      backgroundColor: chartColors.backgroundColor,
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    animation: {
      duration: 3000,
      easing: 'easeOutBounce'
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});


const productRevenues = products
  .filter(product => product.SellerId === currentUser.id)
  .map(product => {
      const totalRevenue = orders.reduce((sum, order) => {
          order.items.forEach(item => {
              if (item.ProductId === product.ProductId && item.status === 1) {
                  sum += item.quantity * product.price;
              }
          });
          return sum;
      }, 0);
      return totalRevenue;
  });

const revenueCtx = document.getElementById('revenueChart').getContext('2d');
new Chart(revenueCtx, {
    type: 'bar',
    data: {
        labels: productLabels,
        datasets: [{
            label: 'Revenue ($)',
            data: productRevenues,
            backgroundColor: chartColors.backgroundColor,
            borderColor: chartColors.borderColor,
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        animation: {
            duration: 3000,
            easing: 'easeInOutQuad'
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) { return '$' + value.toFixed(2); }
                }
            }
        }
    }
});


const stateData = sellerOrders.reduce((states, order) => {
    const state = order.state;
    if (states[state]) {
        states[state] += 1;
    } else {
        states[state] = 1;
    }
    return states;
}, {});

const states = Object.keys(stateData);
const stateOrderCounts = Object.values(stateData);

const stateChartCtx = document.getElementById('stateChart').getContext('2d');
new Chart(stateChartCtx, {
    type: 'bar',
    data: {
        labels: states,
        datasets: [{
            label: 'Orders per State',
            data: stateOrderCounts,
            backgroundColor: chartColors.backgroundColor,
            borderColor: chartColors.borderColor,
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        animation: {
            duration: 3000,
            easing: 'easeOutQuart'
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { precision: 0 }
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });

   
    const currentUser = JSON.parse(localStorage.getItem('loggedinUser'));
    !checkuser(currentUser, "Seller");
}); 


