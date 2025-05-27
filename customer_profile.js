document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("profileForm");
    const errorMessagesDiv = document.getElementById("errorMessages");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedinUser"));
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!loggedInUser) {
        Swal.fire({
            icon: 'error',
            title: "You are not authorized to access this page. Redirecting to login...",
            showConfirmButton: true
              }).then(() => {
        window.location.href = window.location.origin + '/login.html';
    });
       // alert("You are not logged in. Redirecting to login...");
       
        return;
    }

   
    document.getElementById("name").value = loggedInUser.name || "";
    document.getElementById("email").value = loggedInUser.email || "";
    document.getElementById("address").value = loggedInUser.address || "";
    document.getElementById("phone").value = loggedInUser.phone || "";

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

    
        const name = document.getElementById("name").value.trim();
        const address = document.getElementById("address").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        let isValid = true;
        errorMessagesDiv.innerHTML = "";

       
        const nameRegex = /^[A-Za-z]{2,}(?:\s[A-Za-z]{2,})*$/;
        if (!nameRegex.test(name)) {
            showError("Please enter a valid name.");
            isValid = false;
        }

      
        if (address && address.length < 5) {
            showError("Address must be at least 5 characters long.");
            isValid = false;
        }

        
        const phoneRegex = /^\+?\d{10,15}$/;
        if (phone && !phoneRegex.test(phone)) {
            showError("Please enter a valid phone number.");
            isValid = false;
        }

        
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (password) {
            if (!passwordRegex.test(password)) {
                showError("Password must be at least 8 characters long, include at least one letter and one number.");
                isValid = false;
            }

            if (password !== confirmPassword) {
                showError("Passwords do not match.");
                isValid = false;
            }
        }

        if (isValid) {
            
            loggedInUser.name = name;
            loggedInUser.address = address;
            loggedInUser.phone = phone;

            if (password) {
                loggedInUser.password = CryptoJS.SHA256(password).toString();
            }

          
            const userIndex = users.findIndex(user => user.email === loggedInUser.email);
            if (userIndex !== -1) {
                users[userIndex] = loggedInUser;
                localStorage.setItem("users", JSON.stringify(users));
            }

           
            localStorage.setItem("loggedinUser", JSON.stringify(loggedInUser));
            Swal.fire({
                icon: 'success',
                title: "Profile updated successfully",
                showConfirmButton: true
                  });
            //alert("Profile updated successfully!");
        }
    });

 
    function showError(message) {
        const errorElement = document.createElement("div");
        errorElement.className = "error";
        errorElement.textContent = message;
        errorMessagesDiv.appendChild(errorElement);
    }
});
