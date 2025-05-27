$(function () {
    const user = JSON.parse(localStorage.getItem("loggedinUser"));
    if (!checkuser(user, "Customer")) {
        return; 
    }
    const ClientId = user.id;
    let cart = JSON.parse(localStorage.getItem("Cart"))||[];
    let products = JSON.parse(localStorage.getItem("Products"))||[];

    if (!products) {
        console.log("No products found in local storage.");
        return;
    }

    function UpdateCart(quantity, productId) {
        let productIndex = products.findIndex(function (product) {
            return product.ProductId === productId;
        });
        if (productIndex !== -1) {
            products[productIndex].quantity -= Number(quantity);
            localStorage.setItem("Products", JSON.stringify(products));
        }
    }

    let filteredCart = cart.filter(function (selectedProduct) {
        return selectedProduct.ClientId === ClientId;
    });

    let total = 0;
    let wrapper = $("#wrapper");
    let TotalItems = $("#TotalItems");
    let itemQuantity = 0;

    filteredCart.forEach(function (selectedProduct) {
        let productId = selectedProduct.ProductId;
        let GetProduct = products.find(function (product) {
            return product.ProductId === productId;
        });
        if (!GetProduct) {
            cart = cart.filter(function(product) {
                return !(product.ProductId === selectedProduct.ProductId && product.ClientId === ClientId);
            });
            localStorage.setItem("Cart", JSON.stringify(cart));
            return; 
        }

        itemQuantity += Number(selectedProduct.quantity);

        let Productsli = $("<li>").addClass("list-group-item d-flex justify-content-between lh-sm");
        let divs = $("<div>");
        let productname = $("<h6>").addClass("my-0 mb-3").text(GetProduct.name);
        let img = $("<img>")
            .attr("src", GetProduct.image)
            .attr("alt", GetProduct.name)
            .addClass("Checkoutimages");

        let price = $("<span>").text(GetProduct.price + " EGP");
        let quantity = $("<h6>").text("Quantity: " + selectedProduct.quantity);

        total += Number(GetProduct.price * selectedProduct.quantity);

        divs.append(productname, img, quantity);
        Productsli.append(divs, price);
        wrapper.append(Productsli);
    });

    TotalItems.text(itemQuantity);

    let totalli = $("<li>").addClass("list-group-item d-flex justify-content-between");
    let TotalSpan = $("<span>").text("Total (EGP)");
    let TotalStrong = $("<strong>").text(total + " EGP");
    totalli.append(TotalSpan, TotalStrong);
    wrapper.append(totalli);

  
    function validateInput($input, pattern, errorMsg) {
        if ($input.val() && $input.val().match(pattern)) {
            $input.css('border-color', 'green');
            $input.next('.invalid-feedback').hide();
        } else {
            $input.css('border-color', 'red');
            $input.next('.invalid-feedback').text(errorMsg).show();
        }
    }

    function isFormValid() {
        let valid = true;

        $('input, select').each(function () {
            if ($(this).next('.invalid-feedback').is(':visible') || $(this).val() === '') {
                valid = false;
                $(this).focus();
                return false;
            }
        });

        return valid;
    }

    $('input, select').on('input', function () {
        let $input = $(this);
        if ($input.attr('id') === 'firstName'||$input.attr('id') === 'lastName') {
            let namePattern =  /^[A-Za-z]{2,}(?:\s[A-Za-z]{2,})*$/;
            validateInput($input, namePattern, 'Name Contain only letters and should be more than 2');
        } 
        else if ($input.attr('id') === 'email') {
            let emailPattern = /^[^\s@]+@gmail\.com$/;
            validateInput($input, emailPattern, 'Please enter a valid Gmail address (e.g., example@gmail.com).');
        } else if ($input.attr('id') === 'address') {
            let addressPattern = /^[A-Za-z0-9\s]+$/;
            validateInput($input, addressPattern, 'Address must contain only letters, numbers, and spaces.');
        } else if ($input.attr('id') === 'zip') {
            let zipPattern = /^\d{3,10}$/;
            validateInput($input, zipPattern, 'Zip code must be numbers only.');
        } else if ($input.attr('id') === 'PhoneNumber') {
            let cardPattern = /^\d{11}$/;
            validateInput($input, cardPattern, 'Phone number must be 11 digits only.');
        }
    });

    $('#placeorder').on('click', function () {
    
        if(filteredCart.length===0)
        {
            Swal.fire({
                icon: 'warning',
                title: "please select product to checkout",
                
                showConfirmButton: true
            }).then(() => {
                window.location.href = '/landscape/landscape.html';
            });
            return;
        }
        products = JSON.parse(localStorage.getItem("Products"))||[];
        let isStockValid = true;
        filteredCart.forEach(function (selectedProduct) {
            let productId = selectedProduct.ProductId;
            let currentProduct = products.find(function (product) {
                return product.ProductId === productId;
            });
            if (!currentProduct || currentProduct.quantity < selectedProduct.quantity) {
                Swal.fire({
                    icon: 'warning',
                    title: "Sorry No more stock available for this product",
                    showConfirmButton: true
                });
                isStockValid = false;
                return false;
            }
          
        });
        if (!isStockValid) {
          
            return; 
        }

        if (isFormValid()) {
            let orders = JSON.parse(localStorage.getItem("Orders")) || [];
            let date = new Date();
            let FormattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

            let newOrder = {
                id: `Order_${Date.now()}`,
                ClientId: ClientId,
                country: $("#country").val(),
                state: $("#state").val(),
                address: $("#address").val(),
                zipcode: $("#zip").val(),
                email: $("#email").val(),
                number: $("#PhoneNumber").val(),
                total: total,
                status: 0,
                date: FormattedDate,
                PaymentMethod: "Cash On Delivery",
                items: filteredCart.map(function (selectedProduct) {
                    let GetProduct = products.find(function (product) {
                        return product.ProductId === selectedProduct.ProductId;
                    });

                    return {
                        ProductId: GetProduct.ProductId,
                        quantity: selectedProduct.quantity,
                        price: GetProduct.price,
                        image:GetProduct.image,
                        name:GetProduct.name,
                        SellerId:GetProduct.SellerId,
                        status: 0
                    };
                })
            };

            orders.push(newOrder);
            localStorage.setItem("Orders", JSON.stringify(orders));

            filteredCart.forEach(function (selectedProduct) {
                UpdateCart(selectedProduct.quantity, selectedProduct.ProductId);
            });

            cart = cart.filter(function (selectedProduct) {
                return selectedProduct.ClientId !== ClientId;
            });

            localStorage.setItem("Cart", JSON.stringify(cart));
            window.location.href = "placeorder.html";
        } else {
            console.log('Form validation failed.');
        }
    });
});
