const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});
document.addEventListener("DOMContentLoaded", function () {
    
    const loggedInUser = JSON.parse(localStorage.getItem("loggedinUser"))||[];
    document.querySelector('.navbar-custom h5').textContent = `Welcome, ${loggedInUser.name}`;
   
    const links = document.querySelectorAll(".nav-link");
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });

    const sellerForm = document.getElementById("sellerProfileForm");
    const errorMessagesDiv = document.getElementById("errorMessages");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    checkuser(loggedInUser,"Seller");

   
    document.getElementById("name").value = loggedInUser.name || "";
    document.getElementById("email").value = loggedInUser.email || "";
    document.getElementById("address").value = loggedInUser.address || "";
    document.getElementById("phone").value = loggedInUser.phone || "";
    document.getElementById("nationalId").value = loggedInUser.nationalId || "";
    document.getElementById("bankAccount").value = loggedInUser.bankAccount || "";
   

    sellerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const address = document.getElementById("address").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const nationalId = document.getElementById("nationalId").value.trim();
        const bankAccount = document.getElementById("bankAccount").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        let isValid = true;
        errorMessagesDiv.innerHTML = "";

       
        const nameRegex = /^[A-Za-z]{2,}(?:\s[A-Za-z]{2,})*$/;
        if (!nameRegex.test(name)) {
            showError("Please enter a valid name.");
            isValid = false;
        }

        if (address.length < 5) {
            showError("Address must be at least 5 characters long.");
            isValid = false;
        }

        const phoneRegex = /^\+?\d{10,15}$/;
        if (!phoneRegex.test(phone)) {
            showError("Please enter a valid phone number.");
            isValid = false;
        }

        if (!/^\d{14}$/.test(nationalId)) {
            showError("Please enter a valid National ID (14 digits).");
            isValid = false;
        }

        if (!/^\d{10,18}$/.test(bankAccount)) {
            showError("Please enter a valid Bank Account (10-18 digits).");
            isValid = false;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (password && !passwordRegex.test(password)) {
            showError("Password must be at least 8 characters long, include at least one letter and one number.");
            isValid = false;
        }

        if (password && password !== confirmPassword) {
            showError("Passwords do not match.");
            isValid = false;
        }

        if (isValid) {
          
            loggedInUser.name = name;
            loggedInUser.address = address;
            loggedInUser.phone = phone;
            loggedInUser.nationalId = nationalId;
            loggedInUser.bankAccount = bankAccount;

            if (password) {
                loggedInUser.password = CryptoJS.SHA256(password).toString();
            }

            if (loggedInUser.status !== "active") {
                loggedInUser.status = "not active";
                Swal.fire({
                    icon: 'success',
                    title: "Your registration request has been submitted. Please try logging in after 24 hours.",
                    showConfirmButton: true
                });
            
            }

         
            const userIndex = users.findIndex(user => user.email === loggedInUser.email);
            if (userIndex !== -1) {
                users[userIndex] = loggedInUser;
                localStorage.setItem("users", JSON.stringify(users));
            }

            localStorage.setItem("loggedinUser", JSON.stringify(loggedInUser));
        }
     
        const alertBox = document.createElement('div');
        alertBox.className = 'cool-alert';
        alertBox.innerHTML = `
             <div class="cool-alert-content">
                <h2>Success!</h2>
                <p>Your profile has been updated successfully.</p>
                <button id="closeAlert">Close</button>
             </div> `;

       
        document.body.appendChild(alertBox);

      
        const closeAlert = document.getElementById('closeAlert');
        closeAlert.addEventListener('click', () => {
            alertBox.remove();
        });
    });

    function showError(message) {
        const errorElement = document.createElement("div");
        errorElement.className = "error";
        errorElement.textContent = message;
        errorMessagesDiv.appendChild(errorElement);
    }

    document.getElementById("logoutButton").addEventListener("click", function() {
        const alertBox = document.createElement('div');
        alertBox.className = 'cool-alert';
        alertBox.innerHTML = `
            <div class="cool-alert-content">
                <h2>See You Soon....</h2>
                <p>We gonna miss you 😭.</p>
                <button id="closeAlert">Close</button>
            </div>`;
    
        document.body.appendChild(alertBox);
    
        document.getElementById("closeAlert").addEventListener("click", function() {
            alertBox.remove(); 
            localStorage.removeItem('loggedinUser'); 
            window.location.href = '../login.html'; 
        });
    });
    
    
       

});
