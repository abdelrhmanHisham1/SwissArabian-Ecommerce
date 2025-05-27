$(function () {
  const user = JSON.parse(localStorage.getItem("loggedinUser"))||[];
  if (!checkuser(user, "Customer")) {
    return; 
}
  $("#ForHerNav, #ForHimNav").click(function () {
    const category = this.dataset.category;   
    localStorage.setItem('SelectedCategory', category); 
    window.location.href =window.location.origin+ "/products.html";
});
   
  
    
      const userId=user.id;
      let contact=document.getElementById("Contact");
      contact.addEventListener("click",function(){
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
            ClientId: userId,
            ClientName:user.name,
            Message:textarea.value
           
          };
        
          Complaints.push(complaints);
          localStorage.setItem("Complaints",JSON.stringify(Complaints));
          modal.hide();
        }
      });
      
      });
  function displayCart()
   {
  
    let ClientId=user.id;
    let cart = JSON.parse(localStorage.getItem("Cart"))||[];
    if (!cart) {
      console.log("No cart found in local storage.");
      return;
    }

    let products = JSON.parse(localStorage.getItem("Products"))||[];
    if (!products) {
      console.log("No products found in local storage.");
      return;
    }
    
    cart = cart.filter(function (selectedProduct) {
      return products.some(function (product) {
        return product.ProductId === selectedProduct.ProductId;
      });
    });
  
    localStorage.setItem("Cart", JSON.stringify(cart));
   
    let cartTableBody = $("#cart tbody");
    cartTableBody.empty();
    let filteredCart = cart.filter(function (selectedProduct) {
      return selectedProduct.ClientId === ClientId;
    });
    

    filteredCart.forEach(function(selectedProduct) {
      let productId = selectedProduct.ProductId;
      let GetProduct = products.find(function (product) {
        return String(product.ProductId) === productId;
      });

     
      if(GetProduct&&GetProduct.quantity===0)
      {
        cart = cart.filter(function(product) {
          return product.ProductId !== GetProduct.ProductId;
        });
        localStorage.setItem("Cart", JSON.stringify(cart));
    displayCart();
    return;
      
      }
    
      let productWrapper = $("<div>").addClass("d-flex align-items-center ");
      let row = $("<tr>");
      let productCol = $("<td>").addClass("align-middle");
      let img = $("<img>").attr("src", GetProduct.image)
                          .attr("alt", GetProduct.name)
                          .addClass("Cartimages");
    
      let name = $("<span>").text(GetProduct.name);

      let priceCol = $("<td>").addClass("align-middle").text(GetProduct.price + " EGP");
      let quantitydiv = $("<div>").addClass("d-flex align-items-center ");
      let decreaseBtn = $("<button>").addClass("btn btn-sm btn-outline-secondary me-2").text("-");
      let quantityInput = $("<input>")
        .attr("type", "number")
        .attr("readonly", true)
        .val(selectedProduct.quantity)
        .addClass("quantityInput form-control text-center border-0 rounded-3");
       if(selectedProduct.quantity>GetProduct.quantity)
       {
        
        quantityInput.val(GetProduct.quantity);
        UpdateQuantity(cart, selectedProduct.ProductId, Number(quantityInput.val()),ClientId); 
        
       }
      let increaseBtn = $("<button>").addClass("btn btn-sm btn-outline-secondary ms-2").text("+");
      let deleteimg=$("<i>").addClass("fa-solid fa-trash-can ");
    
      let quantityCol = $("<td>").addClass("align-middle").append(quantitydiv);
      let deleteCol = $("<td>").addClass("align-middle ").append(deleteimg);
      let totalCol = $("<td>").addClass("align-middle").text((Number(quantityInput.val()) * GetProduct.price) + " EGP");
  
     

      if (GetProduct.quantity <= 1) {
        increaseBtn.addClass("disabled");
      }

      increaseBtn.click(function () {
        let currentvalue = Number(quantityInput.val());
        if (currentvalue >= GetProduct.quantity) {
          increaseBtn.addClass("disabled");
        } else {
          quantityInput.val(currentvalue + 1);
          totalCol.text(Number(quantityInput.val()) * GetProduct.price + " EGP");
          UpdateQuantity(cart, selectedProduct.ProductId, Number(quantityInput.val()),ClientId); 
          localStorage.setItem("Cart", JSON.stringify(cart)); 
        }
      });

      decreaseBtn.click(function () {
        let currentvalue = Number(quantityInput.val());
        if (currentvalue > 1) {
          quantityInput.val(currentvalue - 1);
          totalCol.text(Number(quantityInput.val()) * GetProduct.price + " EGP");
          increaseBtn.removeClass("disabled");
          UpdateQuantity(cart, selectedProduct.ProductId, Number(quantityInput.val()),ClientId); 
          localStorage.setItem("Cart", JSON.stringify(cart));  
        }
      });

      
      
      deleteCol.click(function(){
        cart = cart.filter(function(product) {
          return !(product.ProductId === selectedProduct.ProductId && product.ClientId === ClientId);
        });
        
        localStorage.setItem("Cart", JSON.stringify(cart));
    
        displayCart();

      
      });
      productWrapper.append(img, name);
      productCol.append(productWrapper);
      quantitydiv.append(decreaseBtn, quantityInput, increaseBtn);
      row.append(productCol, priceCol, quantityCol,totalCol,deleteCol);
      cartTableBody.append(row);
    
      });
      let checkout=$("#checkout");
      checkout.click(function(){
        if(filteredCart.length>0)
        {
          window.location.href = "checkout.html";
        }
     
    });
   
  }
 
  function UpdateQuantity(cart, productId, NewQuantity,clientId) {
    const productindex = cart.findIndex(function (product) {
      return product.ProductId === productId&&product.ClientId==clientId;
    });
    if (productindex !== -1) {
      cart[productindex].quantity = NewQuantity;
      localStorage.setItem("Cart", JSON.stringify(cart));  
    }
  }
  
  displayCart();
  const logoutLink = $("#logout");

  logoutLink.click(function (event) {
   
    event.preventDefault();
    localStorage.removeItem("loggedinUser");
    window.location.href = "../login.html";
  });
  
});
