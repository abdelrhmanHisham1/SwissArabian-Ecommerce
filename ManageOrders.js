const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

const getOrders = () => JSON.parse(localStorage.getItem('Orders')) || [];


const getProducts = () => JSON.parse(localStorage.getItem('Products')) || [];


const saveOrders = (orders) => {
    localStorage.setItem('Orders', JSON.stringify(orders));
};


const getLoggedInUser = () => JSON.parse(localStorage.getItem('loggedinUser')) || {};


const renderOrders = () => {
    const ordersList = document.getElementById("orders-list");
    ordersList.innerHTML = '';

    const orders = getOrders();
    const loggedInUser = getLoggedInUser();
    const sellerId = loggedInUser.id; 

    const products = getProducts();

  
    const sellerOrders = orders.filter(order =>
        order.items.some(item => {
            const product = products.find(p => p.ProductId === item.ProductId);
            return product && product.SellerId === sellerId;
        })
    );

    sellerOrders.forEach(order => {
        const row = document.createElement('tr');

       
        const clientInfo = `${order.country}, ${order.state}, ${order.address}, ${order.zipcode}`;
       
        const productInfo = order.items
            .map(item => {
                const product = products.find(p => p.ProductId === item.ProductId);
                if (product && product.SellerId === sellerId) {
                    return `Product ID: ${item.ProductId}, Quantity: ${item.quantity}, Status: ${item.status === 0 ? 'Pending' : 'Shipped'}`;
                }
                return '';
            })
            .filter(info => info !== '')
            .join('<br>');

     
        const orderStatus = order.status === 0 ? 'Pending' : 'Shipped';
        const statusClass = order.status === 0 ? 'pending' : 'shipped';

        row.innerHTML = `
                <td>${order.id}</td>
                <td>${clientInfo}<br>Email: ${order.email}<br>Phone: ${order.number}</td>
                <td>${productInfo}</td>
                <td>${order.total}</td>
                <td><span class="status ${statusClass}">${orderStatus}</span></td>
                <td>
                    <button 
            class="update ${order.status === 1 ? 'shipped' : ''}" 
            onclick="updateProductStatus('${order.id}')" 
            ${order.status === 1 ? 'disabled' : ''}>Update Product Status</button>
                </td>`;

        ordersList.appendChild(row);
    });
};


const updateProductStatus = (orderId) => {
    const orders = getOrders();
    const order = orders.find(order => order.id === orderId);
    const loggedInUser = getLoggedInUser();
    const sellerId = loggedInUser.id;

   
    const products = getProducts();

   
    if (order.status === 1) {
        Swal.fire({
            icon: 'success',
            title: "This order has already been shipped.",
            showConfirmButton: true
        });
    
        return;
    }

    
    order.items.forEach(item => {
        const product = products.find(p => p.ProductId === item.ProductId);
        if (product && product.SellerId === sellerId && item.status === 0) { 
            item.status = 1;
        }
    });

   
    const allShipped = order.items.every(item => item.status === 1);

    if (allShipped) {
        order.status = 1; 
    }

    saveOrders(orders);
    renderOrders();
};


document.addEventListener('DOMContentLoaded', () => {

    
    const loggedInUser = JSON.parse(localStorage.getItem("loggedinUser"));
    document.querySelector('.navbar-custom h5').textContent = `Welcome, ${loggedInUser.name}`;
   
    const links = document.querySelectorAll(".nav-link");
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });
  
    
    renderOrders(); 
    const currentUser = JSON.parse(localStorage.getItem('loggedinUser'));
    if (!checkuser(currentUser, "Seller"));
});
