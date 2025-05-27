function checkuser(user, role) {
  if (user) {
      if (user.role !== role) {
          Swal.fire({
              icon: 'warning',
              title: "You don't have access here ",
              
              showConfirmButton: true
          }).then(() => {
              window.location.href = window.location.origin + '/login.html';
          });
          return false;
      }
    }
   else {
      Swal.fire({
          icon: 'warning',
          title: "You don't have access here ",
          showConfirmButton: true,
      }).then(() => {
          window.location.href = window.location.origin + '/login.html';
      });
      return false;
  }
  return true;
}
