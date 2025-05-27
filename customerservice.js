$(function () {
  const currentUser = JSON.parse(localStorage.getItem("loggedinUser"));
  checkuser(currentUser,"Admin");
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });


  const links = document.querySelectorAll(".nav-link");

  links.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });

  const sellerName = currentUser.name || 'Admin';
  document.querySelector('.navbar-custom h5').textContent = `Welcome, ${sellerName}`;
  document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
      if (link.href === window.location.href) {
        link.classList.add("active");
      }
    });
  });

  function displayMessages() {

    let complaints = JSON.parse(localStorage.getItem("Complaints")) || [];
    if (!complaints) {
      console.log("No Complaints found in local storage.");
      return;
    }

    let TableBody = $("#ComplaintsTable tbody");
    TableBody.empty();

    complaints.forEach(function (complaint) {
      let row = $("<tr>");

     
      let ClientIdCol = $("<td>").text(complaint.ClientId);

      let ClientNameCol = $("<td>").text(complaint.ClientName);

    
      let MessageCol = $("<td>").text(complaint.Message);

      row.append(ClientIdCol, ClientNameCol, MessageCol);

  
      TableBody.append(row);
    });
  }

  const logoutLink = document.getElementById("logout");

  logoutLink.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem('loggedinUser');
      window.location.href = '../login.html';
  });



  displayMessages();
});
