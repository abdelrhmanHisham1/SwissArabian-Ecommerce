
const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });

    const currentUser = JSON.parse(localStorage.getItem('loggedinUser'));
    checkuser(currentUser, "Seller");


    const form = document.getElementById("add-product-form");
    const productList = document.getElementById("product-list");
    const popupFormContainer = document.getElementById("popup-form-container");
    const closePopupBtn = document.getElementById("close-popup-btn");
    const showFormBtn = document.getElementById("show-form-btn");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedinUser"));
    const SellerId = loggedInUser.id;
    const sellerName = loggedInUser.name || 'Seller';


    document.querySelector('.navbar-custom h5').textContent = `Welcome, ${sellerName}`;


    const PRODUCTS_KEY = "Products";
    const ORDERS_KEY = "Orders";


    const generateUniqueId = () => `product_${Date.now()}`;


    const getProducts = () => JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];

    const saveProducts = (products) => localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));


    const getOrders = () => JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];


    const saveOrders = (orders) => localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));


    showFormBtn.addEventListener("click", () => {
        form.reset();
        popupFormContainer.style.display = "flex";
        document.getElementById("form-header").innerText = "Add Product";
        document.getElementById("product-submit").innerText = "Add Product";
        form.dataset.ProductId = "";
        form.dataset.ExistingImage = "";
    });


    closePopupBtn.addEventListener("click", () => {
        popupFormContainer.style.display = "none";
    });

    popupFormContainer.addEventListener("click", (e) => {
        if (e.target === popupFormContainer) {
            popupFormContainer.style.display = "none";
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const productName = document.getElementById("product-name").value;
        const productPrice = document.getElementById("product-price").value;
        const productImgFile = document.getElementById("product-img").files[0];
        const productCategory = document.getElementById("product-category").value;
        const productQuantity = document.getElementById("product-quantity").value;

        const ProductId = form.dataset.ProductId || generateUniqueId();
        const products = getProducts();
        const existingProductIndex = products.findIndex((p) => p.ProductId === ProductId);

        if (!form.dataset.ProductId && (!productImgFile || !productImgFile.type.startsWith("image/"))) {
            Swal.fire({
                icon: 'warning',
                title: "Please upload a valid image for the product.",
                showConfirmButton: true
            });
            return;
        }


        let productImage = form.dataset.ExistingImage;
        if (productImgFile && productImgFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                productImage = reader.result;
                saveOrUpdateProduct();
            };
            reader.readAsDataURL(productImgFile);
        } else {
            saveOrUpdateProduct();
        }

        function saveOrUpdateProduct() {
            const newProduct = {
                ProductId: ProductId,
                SellerId: SellerId,
                name: productName,
                price: +(productPrice),
                image: productImage,
                category: productCategory,
                quantity: +(productQuantity),
            };

            if (existingProductIndex >= 0) {

                products[existingProductIndex] = newProduct;
            } else {

                products.push(newProduct);
            }

            saveProducts(products);
            renderProducts();
            popupFormContainer.style.display = "none";
        }
    });

    const renderProducts = () => {
        productList.innerHTML = "";
        const products = getProducts().filter((p) => p.SellerId === SellerId);

        products.forEach((product) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${product.ProductId}</td> <!-- ProductId for display -->
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;"></td>
                <td>${product.quantity}</td>
                <td>${product.category}</td>
                <td>
                    <button class="btn btn-warning btn-sm update-btn" data-product-id="${product.ProductId}">Update</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-product-id="${product.ProductId}">Delete</button>
                </td>
            `;

            productList.appendChild(row);
        });


        document.querySelectorAll(".update-btn").forEach((button) => {
            button.addEventListener("click", (e) => {
                const ProductId = e.target.dataset.productId;
                const product = getProducts().find((p) => p.ProductId === ProductId);

                if (product) {
                    document.getElementById("form-header").innerText = "Update Product";
                    document.getElementById("product-name").value = product.name;
                    document.getElementById("product-price").value = product.price;
                    document.getElementById("product-category").value = product.category;
                    document.getElementById("product-quantity").value = product.quantity;
                    document.getElementById("product-img").value = "";
                    document.getElementById("product-submit").innerText = "Update";


                    form.dataset.ProductId = product.ProductId;
                    form.dataset.ExistingImage = product.image;

                    popupFormContainer.style.display = "flex";
                }
            });
        });


        function deleteProductFromOrders(ProductId) {
            const orders = getOrders();

            orders.forEach(order => {

                if (order.status === 0) {
                    const product = order.items.find(item => item.ProductId === ProductId);

                    if (product) {
                        const { price, quantity } = product; 
                        order.total -= price * quantity; // Subtract from total
                    }
                    order.items = order.items.filter(item => item.ProductId !== ProductId);


                    if (order.items.length === 0) {
                        const orderIndex = orders.indexOf(order);
                        orders.splice(orderIndex, 1);
                    }
                }
            });

            saveOrders(orders);
        }


        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", (e) => {
                const ProductId = e.target.dataset.productId;
                const productName = getProducts().find((p) => p.ProductId === ProductId);
        
                Swal.fire({
                    title: 'Are you sure?',
                    text: `Do you really want to delete "${productName.name}"? This action cannot be undone!`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'Cancel',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        const products = getProducts().filter((p) => p.ProductId !== ProductId);
                        saveProducts(products);
        
                        deleteProductFromOrders(ProductId);
        
                        renderProducts(); 
        
                        Swal.fire(
                            'Deleted!',
                            `"${productName.name}" has been deleted.`,
                            'success'
                        );
                    }
                });
            });
        });
        
    };


    renderProducts();
});
