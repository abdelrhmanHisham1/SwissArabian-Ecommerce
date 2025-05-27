
const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

function getLocalStorageData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}
//get from localstorage func
function updateDashboardMetrics() {
    const products = getLocalStorageData('Products');
    const orders = getLocalStorageData('Orders');
    const currentUser = getLocalStorageData('loggedinUser')||[];

    const SellerId = currentUser.id; 

    const sellerProducts = products.filter(product => product.SellerId === SellerId);

    let sellerOrderCount = 0;
    let sellerTotalSales = 0;
    let sellerPendingOrders = 0;

    orders.forEach(order => {
       
        order.items.forEach(item => {
            const product = products.find(p => p.ProductId === item.ProductId);
            if (product && product.SellerId === SellerId) {
                sellerOrderCount++;
                sellerTotalSales += item.quantity * product.price;

                if (order.status === 0) {
                    sellerPendingOrders++;
                }
            }
        });
    });

   
    document.querySelector('.grid-item:nth-child(1) p').textContent = sellerProducts.length; 
    document.querySelector('.grid-item:nth-child(2) p').textContent = sellerOrderCount; 
    document.querySelector('.grid-item:nth-child(3) p').textContent = `£${sellerTotalSales.toFixed(2)}`; 
    document.querySelector('.grid-item:nth-child(4) p').textContent = sellerPendingOrders;

   
    const sellerName = currentUser.name || 'Seller';
    document.querySelector('.navbar-custom h5').textContent = `Welcome, ${sellerName}`;
}


function displayBestSeller(products, orders, SellerId) {
    const productOrderCounts = {};

   
    orders.forEach(order => {
        order.items.forEach(item => {
            const product = products.find(p => p.ProductId === item.ProductId);
            if (product && product.SellerId === SellerId) {
                productOrderCounts[item.ProductId] = (productOrderCounts[item.ProductId] || 0) + item.quantity;
            }
        });
    });

   
    const mostOrderedProductId = Object.keys(productOrderCounts).reduce((maxId, currentId) => {
        return productOrderCounts[currentId] > (productOrderCounts[maxId] || 0) ? currentId : maxId;
    }, null);

    if (!mostOrderedProductId || productOrderCounts[mostOrderedProductId] === 0) {
        document.getElementById("best-seller-name").textContent = "No Best Seller";
        document.getElementById("best-seller-sales").textContent = "No orders found.";
        document.getElementById("best-seller-image").alt = " "; 
        return;
    }

    
    const bestSellerProduct = products.find(product => product.ProductId === mostOrderedProductId);

    if (bestSellerProduct) {
        document.getElementById("best-seller-name").textContent = bestSellerProduct.name;
        document.getElementById("best-seller-sales").textContent = `Orders Sold: ${productOrderCounts[mostOrderedProductId]}`;
        document.getElementById("best-seller-image").src = `${bestSellerProduct.image}`;
    }
}


document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });

   
    updateDashboardMetrics();

 
    const products = getLocalStorageData('Products');
    const orders = getLocalStorageData('Orders');
    const currentUser = getLocalStorageData('loggedinUser');

    const SellerId = currentUser.id; 
    displayBestSeller(products, orders, SellerId);
   
    if (!checkuser(currentUser, "Seller"));
});
