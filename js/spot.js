function createStars(rating) {
    return "★".repeat(rating);
}

const spotContent = document.querySelector("#spot-content");


const params = new URLSearchParams(window.location.search);

const spotId = Number(params.get("id"));


const tourist = touristSpots.find((spot) => spot.id === spotId);

const savedFavorites = localStorage.getItem("favoriteTouristSpots");

const favoriteTouristSpots = savedFavorites
    ? JSON.parse(savedFavorites)
    : [];


if (tourist) {

    spotContent.innerHTML = `
        <div class="spot-header">

            <div class="spot-image">
                <img src="${tourist.image}" alt="${tourist.name}">
            </div>

            <div class="spot-info">

                <span class="category-badge">
                    ${tourist.category}
                </span>

                <h1>${tourist.name}</h1>

                <div class="spot-rating">
                    ${createStars(tourist.rating)}
                </div>

                <p>
                    📍 ${tourist.location}
                </p>

                <div class="spot-actions">

                    <button
                        id="spot-favorite-button"
                        class="spot-action-button"
                        type="button">
                        ♡ Favoritar
                    </button>

                    <a
                        href="index.html?mapSpot=${tourist.id}#mapa"
                        class="spot-action-button">
                        📍 Ver no mapa
                    </a>

                </div>

            </div>

        </div>


        <div class="spot-description">

            <h2>Sobre o local</h2>

            <p>
                ${tourist.description}
            </p>

        </div>

        <div class="spot-history">

    <h2>📖 História e curiosidades</h2>

    <p>
        ${tourist.details.history}
    </p>

</div>

        <div class="spot-details">

    <div class="detail-card">
        <span>🕐</span>
        <strong>Melhor horário</strong>
        <p>${tourist.details.bestTime}</p>
    </div>

    <div class="detail-card">
        <span>💰</span>
        <strong>Custo</strong>
        <p>${tourist.details.cost}</p>
    </div>

    <div class="detail-card">
        <span>♿</span>
        <strong>Acessibilidade</strong>
        <p>${tourist.details.accessibility}</p>
    </div>

    <div class="detail-card">
        <span>🚗</span>
        <strong>Estacionamento</strong>
        <p>${tourist.details.parking}</p>
    </div>

    <div class="detail-card">
        <span>🚻</span>
        <strong>Banheiros</strong>
        <p>${tourist.details.bathrooms}</p>
    </div>

    

</div>

<div class="spot-route">
    <h2>🧭 Como chegar</h2>

    <p>${tourist.details.howToGetThere}</p>

    <div class="spot-route-buttons">

        <a
            href="index.html?mapSpot=${tourist.id}#mapa"
            class="btn btn-secondary">
            Ver no mapa do site
        </a>

        <a
            href="https://www.google.com/maps/search/?api=1&query=${tourist.coordinates[0]},${tourist.coordinates[1]}"
            target="_blank"
            class="btn btn-primary">
            Abrir no Google Maps
        </a>

    </div>
</div>

    `;

} else {

    spotContent.innerHTML = `
        <div class="spot-not-found">

            <h1>Ponto turístico não encontrado</h1>

            <p>
                Não foi possível encontrar o ponto turístico solicitado.
            </p>

            <a href="index.html#explorar" class="btn btn-primary">
                Voltar para explorar
            </a>

        </div>
    `;

}

const spotFavoriteButton = document.querySelector(
    "#spot-favorite-button"
);

if (tourist && spotFavoriteButton) {

    function updateSpotFavoriteButton() {

        const isFavorite = favoriteTouristSpots.includes(tourist.id);

        if (isFavorite) {
            spotFavoriteButton.textContent = "♥ Favoritado";
            spotFavoriteButton.classList.add("favorite-active");
        } else {
            spotFavoriteButton.textContent = "♡ Favoritar";
            spotFavoriteButton.classList.remove("favorite-active");
        }

    }

    updateSpotFavoriteButton();

    spotFavoriteButton.addEventListener("click", () => {

        const favoritePosition =
            favoriteTouristSpots.indexOf(tourist.id);

        if (favoritePosition === -1) {

            favoriteTouristSpots.push(tourist.id);

        } else {

            favoriteTouristSpots.splice(favoritePosition, 1);

        }

        localStorage.setItem(
            "favoriteTouristSpots",
            JSON.stringify(favoriteTouristSpots)
        );

        updateSpotFavoriteButton();

    });

}