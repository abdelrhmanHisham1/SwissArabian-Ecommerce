document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-link");

  links.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });

  const toggleBtn = document.querySelector('.toggle-btn');
  const sidebar = document.querySelector('.sidebar');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  
  const users = JSON.parse(localStorage.getItem("users")) || [];


  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");
  const addAdminBtn = document.getElementById("add-admin-btn");

  
  function addAdmin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

   
    if (!validateEmail(email) || !password) {
      Swal.fire({
        icon: 'error',
        title: "Please enter both email and password in correct form!",
        showConfirmButton: true
          });
      return;
    }

 
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      Swal.fire({
        icon: 'error',
        title: "This email is already registered!",
        showConfirmButton: true
          });
      return;
    }

   
    const newAdmin = {
      id: users.length > 0 ? users[users.length - 1].id + 1 : 1, 
      email: email,
      password: CryptoJS.SHA256(password).toString(),
      role: "Admin"
    };

    
    users.push(newAdmin);
    localStorage.setItem("users", JSON.stringify(users));

  
    emailInput.value = "";
    passwordInput.value = "";
    Swal.fire({
      icon: 'success',
      title: "Admin added successfully!",
      showConfirmButton: true
        });
  }

 
  addAdminBtn.addEventListener("click", addAdmin);

 
  const loggedInUser = JSON.parse(localStorage.getItem("loggedinUser"))||[];
  if (!loggedInUser || loggedInUser.role !== "Admin") {
    Swal.fire({
      icon: 'error',
      title: "You are not authorized to access this page. Redirecting to login...",
      showConfirmButton: true
        });
      window.location.href = "login.html";
      return;
  }

  const logoutLink = document.getElementById("logout");

  logoutLink.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem('loggedinUser');
      window.location.href = '../login.html';
  });
});
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@gmail\.com$/;
  return emailPattern.test(email);
}