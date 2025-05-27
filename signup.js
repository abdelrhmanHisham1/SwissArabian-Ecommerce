document.getElementById("signupForm").addEventListener("submit", function (event) {
    event.preventDefault();

   
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    let isValid = true;

 
    clearErrors(["name", "email", "password"]);

  
    const nameRegex = /^[A-Za-z]{2,}(?:\s[A-Za-z]{2,})*$/;
    if (!nameRegex.test(name)) {
        displayError("name", "Please enter a valid Name.");
        isValid = false;
    }
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        displayError("email", "This email is already registered.");
        isValid = false;
    }

   
    if (!validateEmail(email)) {
        displayError("email", "Please enter a valid email address.");
        isValid = false;
    }

   
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        displayError("password", "Password must be at least 8 characters, including letters and numbers.");
        isValid = false;
    }

    if (isValid) {
        
        const userId = `user${Date.now()}`;
        const hashedPassword = CryptoJS.SHA256(password).toString();
        const registrationDate = new Date().toISOString();
        const user = { id: userId, name, email, password: hashedPassword, role , registrationDate };
    
       
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
    
        localStorage.removeItem("loggedinUser");
        localStorage.setItem("loggedinUser", JSON.stringify(user));
      
        if (role === "Customer") {
         /*   users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
    
        localStorage.removeItem("loggedinUser");
        localStorage.setItem("loggedinUser", JSON.stringify(user));*/
            window.location.href = './landscape/landscape.html';
        } else if (role === "Seller") {
            window.location.href = "seller_profile.html";
        }
    }
    
});


function clearErrors(inputIds) {
    inputIds.forEach(id => {
        const errorElement = document.getElementById(id + "Error");
        if (errorElement) errorElement.remove();
    });
}
function displayError(inputId, message) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.createElement("span");
    errorElement.id = inputId + "Error";
    errorElement.className = "error";
    errorElement.textContent = message;
    inputElement.insertAdjacentElement("afterend", errorElement);
}
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@gmail\.com$/;
    return emailPattern.test(email);
}