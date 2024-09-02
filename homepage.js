var catGIFGeneratorContainer = document.querySelector('.cat-gif-generator');
var featuredBreedContainer = document.querySelector('.featured-cat-breed');
var changeGIFButton = document.querySelector('.change-gif');
var apiKey = "live_MAPCjPeB9CN8ybe10u9tjqLpXuGipMWmr4iQCf0WjyhQtrJyeCBnz2a8NOMLlY3V";

function catGIFGenerator() {
    fetch("https://api.thecatapi.com/v1/images/search?api_key=" + apiKey + "&mime_types=gif")
        .then(response => response.json())
        .then(data => {
            var gifUrl = data[0].url;

            catGIFGeneratorContainer.innerHTML = `
                <h2>Random Animated Cat Media Generator!</h2>
                <img src="${gifUrl}" class="random-cat-media img-fluid">
            `;
        });
}

function updateFeaturedCatBreed() {
    fetch("https://api.thecatapi.com/v1/breeds?api_key=" + apiKey)
        .then(response => response.json())
        .then(data => {
            var randomCat = Math.floor(Math.random() * data.length);
            var featuredBreed = data[randomCat];
            var country_code = featuredBreed.country_code.toLowerCase();
            if (country_code === 'sp') {
                country_code = 'sg';
            }
            var country_flag_url = `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/1x1/${country_code}.svg`;

            featuredBreedContainer.innerHTML = `
                <h2>Featured Cat Breed - ${featuredBreed.name}</h2>
                <img src="${featuredBreed.image.url}" class="featured-cat img-fluid">
                <div class="country-container">
                <img class="breed-country" src="${country_flag_url}">
                <p class="country">${featuredBreed.origin}</p>
                </div>
                <p class="mt-3">${featuredBreed.description}</p>
                <a href="${featuredBreed.wikipedia_url}" target="_blank" class="learn-more btn btn-primary">Learn More</a>
            `;
        });
}

catGIFGenerator();
updateFeaturedCatBreed();

changeGIFButton.addEventListener('click', function () {
    catGIFGenerator();
});