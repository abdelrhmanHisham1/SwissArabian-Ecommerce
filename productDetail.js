
$(function() {

  const user =JSON.parse (localStorage.getItem("loggedinUser"))||[];
  
    
      
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
  const ClientId=user.id;
 let selectedProduct = JSON.parse(localStorage.getItem("SelectedProduct"));
 if (selectedProduct) {
    let mainsection = $("section");  
    let row = $("<div>").addClass("row align-items-center"); 
    let imgdiv = $("<div>").addClass("col-12 col-md-6 col-lg-6 mb-4"); 
    let img = $("<img>").attr("src", selectedProduct.image)
                         .attr("alt", selectedProduct.name)
                         .addClass("prodcutimg img-fluid rounded mb-3  ")
                         .data("ProductId",selectedProduct.ProductId);

     let productdiv = $("<div>").addClass("col-12 col-md-6 col-lg-6 d-flex flex-column justify-content-center mb-4 p-4");  
     let name = $("<h1>").text(selectedProduct.name).addClass("mb-3 text-uppercase fs-5 fw-bold"); 
     let price = $("<h5>").addClass("text-dark mb-4").text(selectedProduct.price + " EGP"); 
     let addToCartButton = $("<button>").text("Add To Cart")
             .addClass("btn btn-lg   mt-4 w-50  rounded-pill shadow-lg addtocart")
             .data("ProductId",selectedProduct.ProductId);
     let quantitydiv = $("<div>").addClass("d-flex align-items-center mb-4 ");
     let decreaseBtn = $("<button>").addClass("btn btn-sm btn-outline-secondary me-2").text("-"); 
     let quantityInput = $("<input>").attr("type", "number")
                                     .attr("readonly", true)
                                     .val(1).
                                     addClass("quantityInput form-control text-center border-0 rounded-3 ")
                                   
     let increaseBtn = $("<button>").addClass("btn btn-sm btn-outline-secondary ms-2").text("+");
         if(selectedProduct.quantity<1)
     {
         addToCartButton.addClass("disabled").text("Sold Out");;
         increaseBtn.addClass("disabled");
     
     }
     increaseBtn.click(function(){
      let currentvalue=Number(quantityInput.val());
      if(currentvalue>=selectedProduct.quantity)
      {
        increaseBtn.addClass("disabled");
   
      }
   
      else
      {
          quantityInput.val(currentvalue+1);
      
      }
   });
   
     decreaseBtn.click(function(){
     let currentvalue=Number(quantityInput.val());
     if(currentvalue>1)
     {
         quantityInput.val(currentvalue-1);
         increaseBtn.removeClass("disabled");
        
     }

 });
 
 addToCartButton.click(function() {
  if (!checkuser(user,"Customer")) {
    return; 
}
const userId=user.id;
    let cart=localStorage.getItem("Cart")
    let productId = $(this).data("ProductId"); 
    let Quantity=Number(quantityInput.val());
    let data={
       ProductId: productId,
       quantity:Quantity,
       ClientId:ClientId
    };
   
    if (cart) {
        cart = JSON.parse(cart);
    } else {
        cart = [];
    }
    let exsistProduct=cart.find(function(product)
{
    return product.ProductId===data.ProductId && product.ClientId === data.ClientId;
});
if(exsistProduct)
{
    
     if(exsistProduct.quantity+data.quantity<=selectedProduct.quantity)
   {
    exsistProduct.quantity+=data.quantity;
   }
   else
   {
    Swal.fire({
      icon: 'warning',
      title: "No more stock available for this product",
      showConfirmButton: true
  });
    return;
   }
    
   
}
else
{
    cart.push(data);
}
   
    localStorage.setItem("Cart", JSON.stringify(cart));
    Swal.fire({
      icon: 'success',
      title: "product has been added to you cart",
      showConfirmButton: true
  });
});
           
          
 
      

     imgdiv.append(img);
     quantitydiv.append(decreaseBtn, quantityInput, increaseBtn);
     productdiv.append(name, price, quantitydiv, addToCartButton);

     row.append(imgdiv, productdiv);
     mainsection.append(row);
   
 }
 const logoutLink = $("#logout");

  logoutLink.click(function (event) {
   
    event.preventDefault();
    localStorage.removeItem("loggedinUser");
    window.location.href = "../login.html";
  });
  
});

