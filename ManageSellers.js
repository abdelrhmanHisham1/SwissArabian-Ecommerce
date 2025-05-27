document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      if (link.href === window.location.href) {
        link.classList.add('active');
      }
    });
  
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.querySelector('.sidebar');
  
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const products = JSON.parse(localStorage.getItem("Products")) || [];
    const orders = JSON.parse(localStorage.getItem("Orders")) || [];
  
   
    const sellersTable = document.getElementById("seller-table-body");
    const searchInput = document.getElementById("search-bar");
  
    
    function renderSellers(filter = "") {
      sellersTable.innerHTML = "";
  
      
      const filteredSellers = users.filter(user =>
        user.role === "Seller" &&
        (user.name.toLowerCase().includes(filter.toLowerCase()) ||
          user.email.toLowerCase().includes(filter.toLowerCase()))
      );
  
      filteredSellers.forEach(seller => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${seller.id}</td>
          <td>${seller.name}</td>
          <td>${seller.email}</td>
          <td>${seller.status}</td>
          <td>
            <button class="btn btn-warning btn-sm toggle-status-btn" data-id="${seller.id}">
              ${seller.status === "active" ? "Deactivate" : "Activate"}
            </button>
            <button class="btn btn-danger btn-sm delete-seller-btn" data-id="${seller.id}">Delete</button>
          </td>
        `;
        sellersTable.appendChild(row);
      });
  
   
      addToggleStatusListeners();
      addDeleteListeners();
    }
  

    function toggleSellerStatus(sellerId) {
      const seller = users.find(user => user.id == sellerId);
      if (!seller) {
        
          Swal.fire({
              icon: 'error',
              title: "Seller not found!",
              showConfirmButton: true
                });
        //alert("Seller not found!");
        return;
      }
  
   
      seller.status = seller.status === "active" ? "not active" : "active";
      localStorage.setItem("users", JSON.stringify(users));
      Swal.fire({
        icon: 'success',
        title: `Seller ${seller.name} status updated to ${seller.status}`,
        showConfirmButton: true
       });

      //alert(`Seller ${seller.name} status updated to ${seller.status}`);
      renderSellers(searchInput.value);
    }
  
   
    function deleteSeller(sellerId) {
      const seller = users.find(user => user.id == sellerId);
      if (!seller) {
        Swal.fire({
          icon: 'error',
          title: "Seller not found!",
          showConfirmButton: true
            });
        //alert("Seller not found!");
        return;
      }
  
      if (!confirm(`Are you sure you want to delete ${seller.name} and their related data?`)) {
        return;
      }
  
      
      const remainingProducts = products.filter(product => product.SellerId != sellerId);
      localStorage.setItem("Products", JSON.stringify(remainingProducts));
  
     /* 
      const updatedOrders = orders.filter(order => {
        const filteredItems = order.items.filter(item => item.SellerId != sellerId);
        if (filteredItems.length > 0) {
          const newTotal = filteredItems.reduce((total, item) => total + (item.price * item.quantity), 0);
          order.total = newTotal;
            order.items = filteredItems; 
            return true;
        }
        return false;
    });*/
    const updatedOrders = orders.filter(order => {
      
      if (order.status === 1) {
          return true; 
      }
  
      const filteredItems = order.items.filter(item => {
          return item.status !== 1 && item.SellerId !== sellerId;
      });
  
      if (filteredItems.length > 0) {
          const newTotal = filteredItems.reduce((total, item) => total + (item.price * item.quantity), 0);
          
          order.items = filteredItems; 
          order.total = newTotal; 
          return true;
      }
      return false;
  });
      localStorage.setItem("Orders", JSON.stringify(updatedOrders));
  
   
      const sellerIndex = users.indexOf(seller);
      users.splice(sellerIndex, 1);
      localStorage.setItem("users", JSON.stringify(users));
      Swal.fire({
        icon: 'success',
        title: "Seller and related data deleted successfully!",
        showConfirmButton: true
          });
      //alert("Seller and related data deleted successfully!");
      renderSellers(searchInput.value);
    }
  
  
    function addToggleStatusListeners() {
      document.querySelectorAll(".toggle-status-btn").forEach(button => {
        button.addEventListener("click", event => {
          const sellerId = event.target.getAttribute("data-id");
          toggleSellerStatus(sellerId);
        });
      });
    }
  
  
    function addDeleteListeners() {
      document.querySelectorAll(".delete-seller-btn").forEach(button => {
        button.addEventListener("click", event => {
          const sellerId = event.target.getAttribute("data-id");
          deleteSeller(sellerId);
        });
      });
    }
  
    
    searchInput.addEventListener("input", () => {
      renderSellers(searchInput.value);
    });

   
    const loggedInUser = JSON.parse(localStorage.getItem("loggedinUser"))||[];
    if (!loggedInUser || loggedInUser.role !== "Admin") {
      Swal.fire({
        icon: 'error',
        title: "You are not authorized to access this page. Redirecting to login...",
        showConfirmButton: true
          });
        //alert("You are not authorized to access this page. Redirecting to login...");
        window.location.href = "/login.html";
        return;
    }

   
    const logoutLink = document.getElementById("logout");

    logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('loggedinUser');
        window.location.href = '/login.html';
    });
  
    
    renderSellers();
  });
  