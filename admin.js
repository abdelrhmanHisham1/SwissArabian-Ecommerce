
const toggleBtn = document.querySelector('.toggle-btn');
const sidebar = document.querySelector('.sidebar');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});





function getLocalStorageData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}


function updateDashboardMetrics() {
    const users = getLocalStorageData('users');
    const orders = getLocalStorageData('Orders');

 
    const totalUsers = users.length;
    document.getElementById('total-users').textContent = totalUsers;

    
    const pendingSellers = users.filter(user => user.role === 'Seller' && user.status === 'not active').length;
    document.getElementById('pending-sellers').textContent = pendingSellers;

    const completedOrders = orders.filter(order => order.status === 1).length;
    document.getElementById('completed-orders').textContent = completedOrders;

  
    const today = new Date().toISOString().split('T')[0];
    const dailySignups = users.filter(user => user.registrationDate && user.registrationDate.startsWith(today)).length;
    document.getElementById('daily-signups').textContent = dailySignups;


  
    updateRegistrationsChart(users);
}


function updateRegistrationsChart(users) {
    const chartData = {
        labels: ['Customers', 'Sellers'],
        datasets: [{
            label: 'New Registrations',
            data: [
                users.filter(user => user.role === 'Customer').length,
                users.filter(user => user.role === 'Seller').length
            ],
            backgroundColor: ['#f39c12', '#3498db']
        }]
    };

    const ctx = document.getElementById('registrations-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: chartData,
    });
}
//
function updateSalesPerformanceChart(orders) {
    const salesData = orders.reduce((acc, order) => {
        const date = order.date;
        acc[date] = (acc[date] || 0) + order.total;
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(salesData),
        datasets: [{
            label: 'Sales Performance',
            data: Object.values(salesData),
            backgroundColor: '#3498db',
            borderColor: '#2980b9',
            borderWidth: 1,
            tension: 0.4,
        }],
    };

    const ctx = document.getElementById('sales-performance-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
            },
        },
    });
}

function updateOrderStatusChart(orders) {
    const statusData = {
        Pending: orders.filter(order => order.status === 0).length,
        Completed: orders.filter(order => order.status === 1).length,
    };

    const chartData = {
        labels: Object.keys(statusData),
        datasets: [{
            label: 'Order Status Distribution',
            data: Object.values(statusData),
            backgroundColor: ['#f1c40f', '#2ecc71'],
        }],
    };

    const ctx = document.getElementById('order-status-chart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
    });
}

function updateTopProductsChart(orders, products) {
    const productSales = {};

    orders.forEach(order => {
        order.items.forEach(item => {
            const productName = products.find(product => product.ProductId === item.ProductId)?.name || 'Unknown';
            productSales[productName] = (productSales[productName] || 0) + item.quantity;
        });
    });

    const sortedProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const chartData = {
        labels: sortedProducts.map(entry => entry[0]),
        datasets: [{
            label: 'Top Products',
            data: sortedProducts.map(entry => entry[1]),
            backgroundColor: ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e'],
        }],
    };

    const ctx = document.getElementById('top-products-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
            },
        },
    });
}

//
document.addEventListener("DOMContentLoaded", () => {
     
    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });
  
    updateDashboardMetrics();
    //
    const orders = getLocalStorageData('Orders');
    const products = getLocalStorageData('Products');

    
    updateSalesPerformanceChart(orders);
    updateOrderStatusChart(orders);
    updateTopProductsChart(orders, products);
    //

  
    const loggedInUser = JSON.parse(localStorage.getItem("loggedinUser"))||[];
    if (!loggedInUser || loggedInUser.role !== "Admin") {
        Swal.fire({
            icon: 'error',
            title: "You are not authorized to access this page. Redirecting to login...",
            showConfirmButton: true
              });
        window.location.href = "login.html";
        return;
    }

  
    const logoutLink = document.getElementById("logout");

    logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('loggedinUser');
        window.location.href = '../login.html';
    });
});
