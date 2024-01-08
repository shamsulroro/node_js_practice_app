// Add custom js to be executed on browser

const roleDropdown = document.getElementById("userRole");
roleDropdown.addEventListener("change", (event) => {
  if(roleDropdown){
    const selectedRole = roleDropdown.options[roleDropdown.selectedIndex].value;
    if(selectedRole != "1"){
      document.getElementById("selectStore").style.display = "block";
    }
    else {
      document.getElementById("selectStore").style.display = "none";
    }
    togglePasswordAndLoginPinFields(selectedRole);
  }
});

function togglePasswordAndLoginPinFields(selectedRole){
  if(selectedRole === "2"){
    document.getElementById("passwordFields").style.display = "block";
    document.getElementById("storeAssociateFields").style.display = "none";
  }
  else if (selectedRole === "3"){
    document.getElementById("passwordFields").style.display = "none";
    document.getElementById("storeAssociateFields").style.display = "block";
  }
}

$( document ).ready(function() {
  const roleDropdown = document.getElementById("userRole");
  const selectedRole = roleDropdown.options[roleDropdown.selectedIndex].value;
  togglePasswordAndLoginPinFields(selectedRole);
});
