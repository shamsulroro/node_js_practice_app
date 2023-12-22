
async function populateLockers(event) {
  const selectElement = event.target;
  const selectedTowerId = selectElement.value;
  const  lockersElement = document.getElementById("lockers");
  lockersElement.innerHTML = ''
  let lockerOptions = '<option value="">All</option>';
  if(selectedTowerId){
    const response = await fetch(`/admin/lockers/all?tower_id=${selectedTowerId}`);
    const lockers = await response.json();
    for(var i = 0; i < lockers.length; i++) {
      lockerOptions += `<option value="${lockers[i]._id}">${lockers[i].name}</option>`;
    }
    lockersElement.innerHTML = lockerOptions;
  }
}