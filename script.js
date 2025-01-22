const form = document.getElementById("listingForm");
const tableBody = document.getElementById("listingTable");
const editIndexField = document.getElementById("editIndex");
let listings = JSON.parse(localStorage.getItem("listings")) || [];

function saveToLocalStorage() {
  localStorage.setItem("listings", JSON.stringify(listings));
}

function renderListings() {
  tableBody.innerHTML = "";
  listings.forEach((listing, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td><img src="${listing.image}" style="width: 100px; height: auto;" /></td>
        <td>${listing.propertyName}</td>
        <td>${listing.location}</td>
        <td>${listing.price}</td>
          <td>
    <button class="btn btn-info btn-sm" onclick="viewListing(${index})">ចុចមើល</button>
    <button class="btn btn-warning btn-sm" onclick="editListing(${index})">កែសម្រួល</button>
    <button class="btn btn-danger btn-sm" onclick="deleteListing(${index})">លុបទិន្នន័យ</button>
  </td>
      </tr>`;
    tableBody.innerHTML += row;
  });
}
function viewListing(index) {
  const listing = listings[index];
  document.getElementById("modalImage").src = listing.image;
  document.getElementById(
    "modalPropertyName"
  ).textContent = ` ប្រភេទផ្ទះ : ${listing.propertyName}`;
  document.getElementById(
    "modalLocation"
  ).textContent = ` ទីតាំង : ${listing.location}`;
  document.getElementById(
    "modalPrice"
  ).textContent = ` តម្លៃផ្ទះ​​ : $${listing.price.toLocaleString()}`;

  const modal = new bootstrap.Modal(document.getElementById("propertyModal"));
  modal.show();
}
function editListing(index) {
  const listing = listings[index];
  document.getElementById("propertyName").value = listing.propertyName;
  document.getElementById("location").value = listing.location;
  document.getElementById("price").value = listing.price;
  document.getElementById("previewImage").src = listing.image;
  document.getElementById("previewImage").style.display = "block";
  editIndexField.value = index;
}

function deleteListing(index) {
  listings.splice(index, 1);
  saveToLocalStorage();
  renderListings();
}
// search function :
const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#listingTable tr");

    rows.forEach((row) => {
      const propertyType = row.querySelector("td:nth-child(3)")?.textContent.toLowerCase();
      const location = row.querySelector("td:nth-child(4)")?.textContent.toLowerCase();

      if (propertyType?.includes(filter) || location?.includes(filter)) {
        row.style.display = ""
      } else {
        row.style.display = "none";
      }
    });
  });
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const propertyName = document.getElementById("propertyName").value;
  const location = document.getElementById("location").value;
  const price = parseFloat(document.getElementById("price").value);
  const editIndex = parseInt(editIndexField).value;
  const file = document.getElementById("propertyImage").files[0];

  const newListing = { propertyName, location, price, image: "" };

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      newListing.image = reader.result;
      if (editIndex >= 0) {
        listings[editIndex] = newListing;
      } else {
        listings.push(newListing);
      }
      saveToLocalStorage();
      renderListings();
      form.reset();
      document.getElementById("previewImage").style.display = "none";
      editIndexField.value = -1;
    };
    reader.readAsDataURL(file);
  } else {
    if (editIndex >= 0) {
      newListing.image = listings[editIndex].image;
      listings[editIndex] = newListing;
    } else {
      listings.push(newListing);
    }
    saveToLocalStorage();
    renderListings();
    form.reset();
    document.getElementById("previewImage").style.display = "none";
    editIndexField.value = -1;
  }
});
renderListings();