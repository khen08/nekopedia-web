var breedsGrid = document.querySelector('.breeds-grid');
var searchInput = document.getElementById('search-input');
var magnifyingGlass = document.querySelector('.fa-search');
var apiKey = "live_MAPCjPeB9CN8ybe10u9tjqLpXuGipMWmr4iQCf0WjyhQtrJyeCBnz2a8NOMLlY3V";
var currentSearchTerm = '';

fetch("https://api.thecatapi.com/v1/breeds?api_key=" + apiKey)
  .then(response => response.json())
  .then(data => {
    searchInput.addEventListener('input', function () {
      const searchTerm = searchInput.value.toLowerCase();
      currentSearchTerm = searchTerm;
      const filteredBreeds = data.filter(breed =>
        breed.name.toLowerCase().includes(searchTerm)
      );
      displayBreeds(filteredBreeds, currentSearchTerm);
    });

    magnifyingGlass.addEventListener('click', function () {
      searchInput.dispatchEvent(new Event('input'));
    });

    displayBreeds(data, currentSearchTerm);
  });

function displayBreeds(breeds, searchTerm) {
  breedsGrid.innerHTML = '';

  const fetchPromises = breeds.map(breed =>
    fetch("https://api.thecatapi.com/v1/images/search?breed_ids=" + breed.id)
      .then(response => response.json())
      .then(imagesData => {
        return { breed, imagesData };
      })
  );

  Promise.all(fetchPromises)
    .then(breeds => {
      breeds.forEach(({ breed, imagesData }) => {
        if (searchInput.value.toLowerCase() === searchTerm) {
          const col = document.createElement('div');
          col.classList.add('cat-breed', 'row', 'row-cols-md-4', 'g-4', 'mb-4');

          const card = document.createElement('div');
          card.classList.add('card');

          const cardBody = document.createElement('div');
          cardBody.classList.add('card-body');

          const descriptionContainer = document.createElement('div');
          descriptionContainer.classList.add('desc-container');

          const description = document.createElement('p');
          description.classList.add('mt-2');
          description.innerHTML = `${breed.description}`;

          const learnMoreButton = document.createElement('button');
          learnMoreButton.classList.add('learn-more', 'btn', 'btn-primary');
          learnMoreButton.innerHTML = `Learn More`;
          learnMoreButton.addEventListener('click', function () {
            window.open(breed.wikipedia_url, '_blank');
          });

          const parametersContainer = document.createElement('div');
          parametersContainer.classList.add('parameters-container', 'd-flex', 'flex-wrap');

          const parametersList1 = document.createElement('ul');
          parametersList1.classList.add('parameters-list-1');
          parametersList1.style.listStyleType = 'none';

          const parameters1 = [
            'affection_level',
            'adaptability',
            'child_friendly',
            'dog_friendly',
            'energy_level',
            'grooming',
          ];

          parameters1.forEach(parameter => {
            const parameterItem = document.createElement('li');
            parameterItem.innerHTML = `<strong>${parameter.replace('_', ' ')}</strong>: `;

            const ratingContainer = document.createElement('div');
            ratingContainer.classList.add('paw-rating');

            const ratingValue = breed[parameter];
            for (let i = 1; i <= 5; i++) {
              const paw = document.createElement('img');
              paw.classList.add('paw-rating');
              paw.src = i <= ratingValue ? 'images/fullPaw.png' : 'images/emptyPaw.png';
              ratingContainer.appendChild(paw);
            }

            parameterItem.appendChild(ratingContainer);
            parametersList1.appendChild(parameterItem);
          });

          const parametersList2 = document.createElement('ul');
          parametersList2.classList.add('parameters-list-2');
          parametersList2.style.listStyleType = 'none';

          const parameters2 = [
            'health_issues',
            'intelligence',
            'shedding_level',
            'social_needs',
            'stranger_friendly',
            'vocalisation',
          ];

          parameters2.forEach(parameter => {
            const parameterItem = document.createElement('li');
            parameterItem.innerHTML = `<strong>${parameter.replace('_', ' ')}</strong>: `;

            const ratingContainer = document.createElement('div');
            ratingContainer.classList.add('paw-rating');

            const ratingValue = breed[parameter];
            for (let i = 1; i <= 5; i++) {
              const paw = document.createElement('img');
              paw.classList.add('paw-rating');
              paw.src = i <= ratingValue ? 'images/fullPaw.png' : 'images/emptyPaw.png';
              ratingContainer.appendChild(paw);
            }

            parameterItem.appendChild(ratingContainer);
            parametersList2.appendChild(parameterItem);
          });

          parametersContainer.appendChild(parametersList1);
          parametersContainer.appendChild(parametersList2);

          const cardTitle = document.createElement('h5');
          cardTitle.classList.add('card-title', 'text-center');
          cardTitle.textContent = breed.name;

          const cardCountryImage = document.createElement('img');
          cardCountryImage.classList.add('breed-country');
          var country_code = breed.country_code.toLowerCase();
          if (country_code === 'sp') {
            country_code = 'sg';
          }
          var country_flag_url = `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/1x1/${country_code}.svg`;
          cardCountryImage.src = country_flag_url;

          const cardCountry = document.createElement('p');
          cardCountry.classList.add('country');
          cardCountry.textContent = breed.origin;

          const countryContainer = document.createElement('div');
          countryContainer.classList.add('country-container');

          cardBody.appendChild(cardTitle);
          cardBody.appendChild(countryContainer);
          countryContainer.appendChild(cardCountryImage);
          countryContainer.appendChild(cardCountry);
          card.appendChild(cardBody);
          col.appendChild(card);
          col.appendChild(descriptionContainer);
          col.appendChild(parametersContainer);
          descriptionContainer.appendChild(description);
          descriptionContainer.appendChild(learnMoreButton);
          breedsGrid.appendChild(col);

          console.log(breed);

          const cardImage = document.createElement('img');
          cardImage.classList.add('breed-image', 'card-img-top');

          if (imagesData && imagesData.length > 0) {
            cardImage.src = imagesData[0].url;
            cardImage.alt = breed.name;
          } else {
            cardImage.src = 'images/placeholder.jpg';
            cardImage.alt = 'Image Placeholder';
          }
          card.insertBefore(cardImage, cardBody);
        }
      });
    });

  var scrollToTopBtn = document.getElementById("scroll-to-top");

  window.addEventListener("scroll", function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollToTopBtn.style.display = "inline-block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });

  scrollToTopBtn.addEventListener("click", function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });

}