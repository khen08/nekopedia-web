document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "live_MAPCjPeB9CN8ybe10u9tjqLpXuGipMWmr4iQCf0WjyhQtrJyeCBnz2a8NOMLlY3V";
  const itemsPerPage = 12;
  let apiPage = 0;
  let currentPage = 1;

  function fetchCatMedia() {
    const mediaType = document.getElementById("media-type").value;
    const breedFilter = document.getElementById("breed").value;
    const startIndex = (currentPage - 1) * itemsPerPage;
  
    let apiUrl = `https://api.thecatapi.com/v1/images/search?api_key=${apiKey}&limit=${itemsPerPage}&order=ASC&page=${apiPage}`;
  
    if (mediaType !== "all") {
      apiUrl += `&mime_types=${mediaType}`;
    }
    if (breedFilter !== "none") {
      apiUrl += `&breed_ids=${breedFilter}`;
    }
  
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          checkNextPage(data.length);
          updateGallery(data, startIndex);
        } else {
          const nextPageButton = document.getElementById("next-page");
          nextPageButton.disabled = true;
        }
      })
      .catch((error) => {
        console.error("Error fetching cat media:", error);
        currentPage--;
        apiPage--;
        document.getElementById("page-number").innerHTML = currentPage;
      });
  }

  function updateGallery(data, startIndex) {
    const galleryGrid = document.querySelector(".gallery-grid");
    galleryGrid.innerHTML = "";
  
    let row = document.createElement("div");
    row.classList.add("row");
  
    data.forEach((media, index) => {
      if (index + startIndex < startIndex + itemsPerPage) {
        const mediaItem = document.createElement("div");
        mediaItem.classList.add("col-md-3", "mb-4");
  
        const card = document.createElement("div");
        card.classList.add("card");
  
        const cardImage = document.createElement("img");
        cardImage.src = media.url;
        cardImage.alt = "Cat Media";
        cardImage.classList.add("card-img-top", "img-fluid", "fixed-size");
        card.appendChild(cardImage);
  
        mediaItem.appendChild(card);
  
        row.appendChild(mediaItem);
  
        if ((index + 1) % 4 === 0 || index === data.length - 1) {
          galleryGrid.appendChild(row);
          row = document.createElement("div");
          row.classList.add("row");
        }
      }
    });
  
    document.getElementById("page-number").innerHTML = currentPage;
  }  

  function updateBreedOptions() {
    const breedSelect = document.getElementById("breed");

    fetch(`https://api.thecatapi.com/v1/breeds`, {
      headers: {
        "x-api-key": apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        breedSelect.innerHTML = "<option value='none'>None</option>";
        data.forEach((breed) => {
          breedSelect.innerHTML += `<option value='${breed.id}'>${breed.name}</option>`;
        });
      });
  }

  function checkNextPage(dataLength) {
    const nextPageButton = document.getElementById("next-page");
    nextPageButton.disabled = dataLength === 0 || dataLength < itemsPerPage;
  }

  function resetPage() {
    currentPage = 1;
    apiPage = 0;
    document.getElementById("page-number").innerHTML = currentPage;
  }

  document.getElementById("media-type").addEventListener("change", function () {
    resetPage();
    fetchCatMedia();
  });

  document.getElementById("breed").addEventListener("change", function () {
    resetPage();
    fetchCatMedia();
  });

  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      apiPage--;
      document.getElementById("page-number").innerHTML = currentPage;
      checkNextPage(1);
      fetchCatMedia();
    }
  });
  
  document.getElementById("next-page").addEventListener("click", () => {
    currentPage++;
    apiPage++;
    checkNextPage(1);
    fetchCatMedia();
  });

  fetchCatMedia();
  updateBreedOptions();
});