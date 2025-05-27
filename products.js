$(function () {
  const user =JSON.parse(localStorage.getItem("loggedinUser"));
 //const userId=user.id;
  
  
  $("#ForHerNav, #ForHimNav").click(function () {
    const category = this.dataset.category;   
    localStorage.setItem('SelectedCategory', category); 
    window.location.href =window.location.origin+ "/products.html";
});
    
   
  let contact=document.getElementById("Contact");
  contact.addEventListener("click",function(){
    if (!checkuser(user,"Customer")) {
        return; 
    }
    const contactdiv=document.createElement("div");
    contactdiv.innerHTML=`
  <div class="modal" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">

      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title">Contact Us</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <!-- Modal body -->
      <div class="modal-body">
      <h5 class="text-center"> We Will Recieve Your Meesage</h5>
      <div class="text-center">
       <textarea id="textArea" class="mt-3"></textarea>
       </div>
      </div>

      <!-- Modal footer -->
      <div class="modal-footer">
       <button type="button"  id="submit" class="btn btn-dark">Submit</button>
        <button  type="button" class="btn btn-dark" data-bs-dismiss="modal">Close</button>
      </div>

    </div>
  </div>
</div>`;
var Complaints=JSON.parse(localStorage.getItem("Complaints")) || [];
  document.body.appendChild(contactdiv); 
  let modal = new bootstrap.Modal(document.getElementById("myModal")); 
  modal.show();
  let submmitbtn=document.getElementById("submit");
  let textarea=document.getElementById("textArea");
  submmitbtn.addEventListener("click",function(){
    if(textarea.value)
        {
        const complaints = {
          ClientId: ClientId,
          ClientName:user.name,
          Message:textarea.value
         
        };
      
        Complaints.push(complaints);
        localStorage.setItem("Complaints",JSON.stringify(Complaints));
        modal.hide();
      }
  });
  
  });
 
    function DisplayFromLocalStorage() {
        const selectedCategory = localStorage.getItem('SelectedCategory')||[];
       
    
        let products = JSON.parse(localStorage.getItem("Products"))||[];
        if (!products) {
            console.error("No products found in localStorage!");
            return;
        }
        let filteredProducts = products.filter(function (product) {
            return product.category === selectedCategory;
        });

        let section = $("#product-list");
        filteredProducts.forEach(function (product) {
            let col = $("<div>").addClass("col-12 col-md-6 col-lg-4 mb-4");
            let productSection = $("<div>").addClass("text-center p-3");
            let img = $("<img>")
                .attr("src", product.image)
                .attr("alt", product.name)
                .addClass("img-fluid mb-3 clickable")
                .data("ProductId",String(product.ProductId));
            let name = $("<h5>").text(product.name).addClass("mb-2");
            let price = $("<p>").text(`${product.price} EGP`).addClass("mb-3 text-danger");
            let addToCartButton = $("<button>")
                .text("Add To Cart")
                .addClass("btn mt-4 w-75 rounded-pill shadow-lg addtocart")
                .data("ProductId",String(product.ProductId));

            if (product.quantity < 1) {
                addToCartButton.text("Sold Out").addClass("addtocart  disabled");
            }

            productSection.append(img, name, price, addToCartButton);
            col.append(productSection);
            section.append(col);
        });
     
 
        $(".search").on("input",function()
    {
        let query=$(this).val().toLowerCase();
        if (!/^[a-zA-Z0-9]*$/.test(query)) {
            query = query.replace(/[^a-zA-Z0-9]/g, ''); 
            $(this).val(query);
        }
    
        let lowerQuery = query.toLowerCase();
        let matchingproducts=filteredProducts.filter(function(product)
        {
            return  product.name.toLowerCase().includes(lowerQuery);
        });
            $("#product-list").empty();
            matchingproducts.forEach(function (product) {
                let col = $("<div>").addClass("col-12 col-md-6 col-lg-4 mb-4");
                let productSection = $("<div>").addClass("text-center p-3");
                let img = $("<img>")
                    .attr("src", product.image)
                    .attr("alt", product.name)
                    .addClass("img-fluid mb-3 clickable")
                    .data("ProductId",String(product.ProductId));
                let name = $("<h5>").text(product.name).addClass("mb-2");
                let price = $("<p>").text(`${product.price} EGP`).addClass("mb-3 text-danger");
                let addToCartButton = $("<button>")
                    .text("Add To Cart")
                    .addClass("btn mt-4 w-75 rounded-pill shadow-lg addtocart")
                    .data("ProductId",String(product.ProductId));
    
                if (product.quantity < 1) {
                    addToCartButton.text("Sold Out").addClass("addtocart  disabled");
                }
    
                productSection.append(img, name, price, addToCartButton);
                col.append(productSection);
                section.append(col);
                clickButtons();
            });
        }
  
    )
   
  function clickButtons()
  {
    $(".clickable").click(function () {
        let productId = String($(this).data("ProductId"));
        let selectedProduct = filteredProducts.find(function (product) {
            return product.ProductId === productId;
        });
        if (selectedProduct) {
            localStorage.setItem("SelectedProduct", JSON.stringify(selectedProduct));
            window.location.href =window.location.origin+ "/productsDetail.html";
        }
    });

    $(".addtocart").click(function () {
        if (!checkuser(user,"Customer")) {
            return; 
        }
        const ClientId = user.id;
        let cart = localStorage.getItem("Cart");
        let productId = String($(this).data("ProductId"));
        let selectedProduct = filteredProducts.find(function (product) {
            return product.ProductId=== productId;
        });
        let data = {
            ProductId: productId,
            quantity: 1,
            ClientId: ClientId
        };

        if (cart) {
            cart = JSON.parse(cart);
        } else {
            cart = [];
        }
        let existingProduct = cart.find(function (product) {
            return product.ProductId === data.ProductId && product.ClientId === data.ClientId;
        });
        if (existingProduct) {
            if (existingProduct.quantity < selectedProduct.quantity) {
                existingProduct.quantity += data.quantity;
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: "No more stock available for this product",
                    showConfirmButton: true
                });
                return;
            }
        } else {
            cart.push(data);
        }
        localStorage.setItem("Cart", JSON.stringify(cart));
        Swal.fire({
            icon: 'success',
            title: "product has been added to you cart",
            showConfirmButton: true
        });
    });
  }
  clickButtons();
    }
    
    
    DisplayFromLocalStorage();
    const logoutLink = $("#logout");

    logoutLink.click(function (event) {
     
      event.preventDefault();
      localStorage.removeItem("loggedinUser");
      window.location.href = "../login.html";
    });
});
