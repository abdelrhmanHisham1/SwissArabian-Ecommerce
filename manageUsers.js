document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });

    function checkUserRole(requiredRole) {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedinUser"));
        if (!loggedInUser || loggedInUser.role !== requiredRole) {
            Swal.fire({
                icon: 'error',
                title: "You are not authorized to access this page. Redirecting to login...",
                showConfirmButton: true
                  });
            //alert("You don't have access here");
            window.location.href = "/login.html";
        }
    }
    checkUserRole("Admin");

    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.querySelector('.sidebar');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const orders = JSON.parse(localStorage.getItem("Orders")) || [];
    const products = JSON.parse(localStorage.getItem("Products")) || [];

    const usersTable = document.getElementById("user-table-body");
    const searchInput = document.getElementById("search-bar");

    function renderUsers(filter = "") {
        usersTable.innerHTML = "";

        const filteredUsers = users.filter(user =>
            user.role === "Customer" &&
            (user.name.toLowerCase().includes(filter.toLowerCase()) ||
                user.email.toLowerCase().includes(filter.toLowerCase()))
        );

        filteredUsers.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${user.id}">Delete</button>
                </td>
            `;
            usersTable.appendChild(row);
        });

        addDeleteListeners();
    }

    function deleteUser(userId) {
        const user = users.find(user => user.id == userId);
        if (!user) {
            Swal.fire({
                icon: 'error',
                title: "User not found!",
                showConfirmButton: true
                  });
            //alert("User not found!");
            return;
        }

        if (!confirm(`Are you sure you want to delete ${user.name} and their associated orders?`)) {
            return;
        }

       
        const remainingOrders = orders.filter(order => {
            if (order.ClientId == userId) {
                order.items.forEach(orderItem => {
                    const product = products.find(p => p.ProductId == orderItem.ProductId);
                    if (product) {
                        product.quantity += orderItem.quantity;
                    }
                });
                return false;
            }
            return true;
        });

        localStorage.setItem("Orders", JSON.stringify(remainingOrders));
        localStorage.setItem("Products", JSON.stringify(products));

        const userIndex = users.indexOf(user);
        users.splice(userIndex, 1);
        localStorage.setItem("users", JSON.stringify(users));
        Swal.fire({
            icon: 'success',
            title: "User, their orders, and associated updates were handled successfully",
            showConfirmButton: true
              });
        //alert("User, their orders, and associated updates were handled successfully!");
        renderUsers(searchInput.value);
    }

    function addDeleteListeners() {
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", event => {
                const userId = event.target.getAttribute("data-id");
                deleteUser(userId);
            });
        });
    }

    searchInput.addEventListener("input", () => {
        renderUsers(searchInput.value);
    });
    const logoutLink = document.getElementById("logout");

    logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('loggedinUser');
        window.location.href = '/login.html';
    });

    renderUsers();
});