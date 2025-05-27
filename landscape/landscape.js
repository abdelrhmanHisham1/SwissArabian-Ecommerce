let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace("active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  setTimeout(showSlides, 2500);
}

document.addEventListener("DOMContentLoaded", () => {
  
  const track = document.querySelector(".carousel-track");
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");

 
  const products = JSON.parse(localStorage.getItem("Products")) || [];


  const displayedProducts = products.slice(0, 20);

  
  displayedProducts.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
        <div class="product-top">
          <img class="product-image" src="${product.image}" alt="${product.name}">
          <div class="product-name">
            <p>${product.name}</p>
          </div>
        </div>
        <div class="product-bottom">
          <p class="product-prices">
            <span class="price-now">${product.price} EGP</span>
          </p>
          <button id="${product.ProductId}" class="shop-now" data-product-id="${product.ProductId}">Add To Cart</button>
        </div>`;
       
    track.appendChild(productDiv);
    if (product.quantity < 1) {
      const AddTocartBTN = document.querySelector(`#${product.ProductId}`);
      if (AddTocartBTN) {
        AddTocartBTN.innerHTML = "Sold Out";
        AddTocartBTN.classList.add("disabled");
        AddTocartBTN.setAttribute("disabled", "true");
      } else {
        console.error(`Button not found for product: ${product.ProductId}`);
      }
    }
  });
 
  const productElements = document.querySelectorAll(".product");
  const productWidth = productElements[0].getBoundingClientRect().width;

  let currentPosition = 0;

  
  const getVisibleItems = () => (window.innerWidth <= 768 ? 2 : 4);


  const slideNext = () => {
    const visibleItems = getVisibleItems();
    const maxPosition = -(productWidth * (displayedProducts.length - visibleItems));

    if (currentPosition > maxPosition) {
      currentPosition -= productWidth;
    } else {
      currentPosition = 0; 
    }
    track.style.transform = `translateX(${currentPosition}px)`;
  };

  

  const slidePrev = () => {
    const visibleItems = getVisibleItems();
    const maxPosition = -(productWidth * (displayedProducts.length - visibleItems));

    if (currentPosition < 0) {
      currentPosition += productWidth;
    } else {
      currentPosition = maxPosition; 
    }
    track.style.transform = `translateX(${currentPosition}px)`;
  };


  nextButton.addEventListener("click", slideNext);
  prevButton.addEventListener("click", slidePrev);
  
  const user =JSON.parse (localStorage.getItem("loggedinUser"))||[];

  const imgHer=document.getElementById('imgHer');
  if (imgHer) {
    imgHer.addEventListener('click', function() {
      const category = this.dataset.category;   
      localStorage.setItem('SelectedCategory', category); 
      window.location.href = "../../products.html";
    });
  }
  const imgHim=document.getElementById('imgHim');
  if (imgHim) {
    imgHim.addEventListener('click', function() {
      const category = this.dataset.category;
      localStorage.setItem('SelectedCategory', category);
      window.location.href = "../../products.html";
    });
  }

  document.querySelectorAll("#ForHerNav, #ForHimNav").forEach(function (element) {
    element.addEventListener("click", function (event) {
        event.preventDefault(); 
        const category = this.dataset.category;
        localStorage.setItem('SelectedCategory', category);
        window.location.href = "../../products.html";
    });
});

  
const userId=user.id;
 
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
 

  document.querySelectorAll('.shop-now').forEach(button => {
    button.addEventListener('click', function () {
      if (!checkuser(user,"Customer")) {
        return; 
    }
      const productId =this.dataset.productId;
    
      let cart = JSON.parse(localStorage.getItem("Cart")) || [];
      const selectedProduct = products.find((product) =>product.ProductId ===  productId);
      if (!selectedProduct) {
        alert("Product not found!");
        return;
      }

      const existingCartItemIndex = cart.findIndex(
        (item) => item.ProductId === productId && item.ClientId === userId
      );

      if (existingCartItemIndex !== -1) {
        if (cart[existingCartItemIndex].quantity < selectedProduct.quantity) {
          cart[existingCartItemIndex].quantity += 1;
        } else {
          Swal.fire({
            icon: 'warning',
            title: "No more stock available for this product",
            showConfirmButton: true
        });
          return;
        }
      } else {
        const cartItem = {
          ProductId: productId,
          quantity: 1,
          ClientId: userId,
        };
        cart.push(cartItem);
      }

      localStorage.setItem("Cart", JSON.stringify(cart));
      Swal.fire({
        icon: 'success',
        title: "product has been added to you cart",
        showConfirmButton: true
    });
    });
  });
 
 
  const logoutLink = document.getElementById("logout");

    logoutLink.addEventListener('click', (event) => {
  
        event.preventDefault(); 
        localStorage.removeItem('loggedinUser'); 
        window.location.href = '../login.html'; 
    });
});
