const touristGrid = document.querySelector("#tourist-grid");
const searchTourist = document.querySelector("#search-tourist");
const clearSearch = document.querySelector("#clear-search");
const backToTop = document.querySelector("#back-to-top");
const favoriteGrid = document.querySelector("#favorite-grid");

const savedFavorites = localStorage.getItem("favoriteTouristSpots");

const favoriteTouristSpots = savedFavorites
    ? JSON.parse(savedFavorites)
    : [];

let selectedCategory = "Todos";

const filterButtons = document.querySelectorAll(".filter-button");

const routeInfo = document.querySelector("#route-info");

const routeDescriptions = {
    "Histórico": {
        title: "🏛️ Rota Histórica",
        description: "Conheça locais relacionados à história e à cultura da Ilha de Itamaracá.",
        spots: "Forte Orange e Forno de Cal"
    },

    "Natureza": {
        title: "🌿 Rota Natureza",
        description: "Explore paisagens naturais e lugares para se conectar com a natureza.",
        spots: "Lagoa Azul e Trilha dos Holandeses"
    },

    "Praia": {
        title: "🏖️ Rota Praias",
        description: "Descubra praias e lugares especiais para aproveitar o litoral da ilha.",
        spots: "Coroa do Avião"
    }
};


function createStars(rating) {
    return "★".repeat(rating);
}


function createTouristCard(tourist) {

    const isFavorite = favoriteTouristSpots.includes(tourist.id);

    return `
        <article class="tourist-card"
            onclick="openTouristSpot(${tourist.id})">

            <button
                class="favorite-button"
                data-tourist-id="${tourist.id}"
                type="button">
                ${isFavorite ? "❤️" : "♡"}
            </button>


            <div class="tourist-image">

                <span class="category-badge">
                    ${tourist.category}
                </span>

                <div class="image-placeholder">
                    <img src="${tourist.image}" alt="${tourist.name}">
                </div>

            </div>

            <div class="tourist-info">

                <h3>${tourist.name}</h3>

                <p>
                    ${tourist.description}
                </p>

                <div class="tourist-meta">

                    <span>
                        📍 ${tourist.location}
                    </span>

                    <span>
                        ${createStars(tourist.rating)}
                    </span>

                </div>

            </div>

        </article>
    `;
}

function renderFavoriteSpots() {

    const favorites = touristSpots.filter((tourist) => {
        return favoriteTouristSpots.includes(tourist.id);
    });

    if (favorites.length === 0) {

        favoriteGrid.innerHTML = `
            <div class="favorite-empty">
                <h3>♡ Nenhum favorito ainda</h3>
                <p>
                    Clique no coração de um ponto turístico para salvá-lo aqui.
                </p>
            </div>
        `;

        return;
    }

    favoriteGrid.innerHTML = favorites
        .map(createTouristCard)
        .join("");

    setupFavoriteButtons();

}


function renderTouristSpots(spots = touristSpots) {

    if (spots.length === 0) {

        touristGrid.innerHTML = `
            <div class="no-results">
                <h3>🔎 Nenhum ponto encontrado</h3>
                <p>
                    Tente pesquisar outro termo ou selecionar outra categoria.
                </p>
            </div>
        `;

        return;
    }

    touristGrid.innerHTML = spots
        .map(createTouristCard)
        .join("");

        setupFavoriteButtons();
}


function filterTouristSpots() {

    const searchText = searchTourist.value
        .toLowerCase()
        .trim();

    const filteredSpots = touristSpots.filter((tourist) => {

        const name = tourist.name.toLowerCase();
        const category = tourist.category.toLowerCase();
        const description = tourist.description.toLowerCase();

        const matchesSearch =
            name.includes(searchText) ||
            category.includes(searchText) ||
            description.includes(searchText);

        const matchesCategory =
            selectedCategory === "Todos" ||
            tourist.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderTouristSpots(filteredSpots);
}


renderTouristSpots();

renderFavoriteSpots();

function setupFavoriteButtons() {

    document.querySelectorAll(".favorite-button").forEach((button) => {

        button.addEventListener("click", (event) => {

            event.stopPropagation();

            const touristId = Number(button.dataset.touristId);

            const favoritePosition =
                favoriteTouristSpots.indexOf(touristId);

            if (favoritePosition === -1) {

                favoriteTouristSpots.push(touristId);

            } else {

                favoriteTouristSpots.splice(favoritePosition, 1);

            }

            localStorage.setItem(
                "favoriteTouristSpots",
                JSON.stringify(favoriteTouristSpots)
            );

            renderTouristSpots();

            renderFavoriteSpots();

            setupFavoriteButtons();

        });

    });

}


searchTourist.addEventListener("input", () => {

    filterTouristSpots();

});


filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        selectedCategory = button.dataset.category;

        routeInfo.classList.remove("visible");
        routeInfo.innerHTML = "";

        filterButtons.forEach((button) => {
            button.classList.remove("active");
        });

        button.classList.add("active");

        filterTouristSpots();

    });

});

clearSearch.addEventListener("click", () => {

    searchTourist.value = "";

    selectedCategory = "Todos";

    filterButtons.forEach((button) => {
        button.classList.remove("active");
    });

    const allButton = document.querySelector(
        '.filter-button[data-category="Todos"]'
    );

    allButton.classList.add("active");

    routeInfo.classList.remove("visible");
    routeInfo.innerHTML = "";

    filterTouristSpots();

});

const routeLinks = document.querySelectorAll(".route-link");

routeLinks.forEach((link) => {

    link.addEventListener("click", () => {

        selectedCategory = link.dataset.routeCategory;

        filterButtons.forEach((button) => {

            button.classList.remove("active");

            if (button.dataset.category === selectedCategory) {
                button.classList.add("active");
            }

        });

        searchTourist.value = "";

        const route = routeDescriptions[selectedCategory];

        routeInfo.innerHTML = `
            <h3>${route.title}</h3>
            <p>${route.description}</p>
            <span>📍 Pontos sugeridos: ${route.spots}</span>
        `;

        routeInfo.classList.add("visible");

        filterTouristSpots();

    });

});

const map = L.map("map").setView([-7.7477, -34.8256], 13);
const mapParams = new URLSearchParams(window.location.search);
const mapSpotId = Number(mapParams.get("mapSpot"));


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


touristSpots.forEach((tourist) => {

    const marker = L.marker(tourist.coordinates)
        .addTo(map);

    marker.bindPopup(`
        <div class="map-popup">
            <strong>${tourist.name}</strong>
            <span>${tourist.category}</span>
            <p>${tourist.description}</p>
            <a href="spot.html?id=${tourist.id}" class="map-popup-button">
                Ver detalhes
            </a>
        </div>
    `);

    if (tourist.id === mapSpotId) {

        map.setView(tourist.coordinates, 16);

        marker.openPopup();

    }

});


function openTouristSpot(id) {

    window.location.href = `spot.html?id=${id}`;

}


const communityFeed = document.querySelector("#community-feed");


function createCommunityPost(post) {

    const comments = getComments(post.id);

    const commentsHTML = comments.length > 0
    ? comments.map((comment) => `
        <div class="comment">

            <div class="comment-user">
                👤 Visitante
            </div>

            <p>${comment.text}</p>

            ${comment.isUserComment ? `
                <button
                    class="delete-comment-button"
                    data-comment-id="${comment.id}">
                    🗑️ Excluir
                </button>
            ` : ""}

        </div>
    `).join("")
        : `
            <p class="no-comments">
                Nenhum comentário ainda.
            </p>
        `;


    return `
        <article class="community-post">

            <div class="post-header">

                
<div class="post-user">

    <div class="user-avatar">
        <img
            class="community-avatar-image"
            data-user-id="${post.userId || ""}"
            alt="Foto de perfil"
            hidden
        >
        <span class="community-avatar-placeholder">👤</span>
    </div>

    <div>
        ${post.userId ? `
<a
class="community-author-link"
href="profile.html?userId=${encodeURIComponent(post.userId)}"

>


<strong>${post.user || "Visitante"}</strong>



${post.username ? `<span>@${post.username}</span>` : ""}


  </a>
` : `
  <strong>${post.user || "Visitante"}</strong>
  ${post.username ? `<span>@${post.username}</span>` : ""}
`} 


        <span>${post.date || ""}</span>
    </div>

</div>

            </div>


            <div class="post-location">
                📍 ${post.touristSpot}
            </div>


            <div class="post-image">

    ${
        post.images && post.images.length > 0
            ? post.images.map((image, index) => `
                <img
                    src="${image}"
                    alt="${post.touristSpot} - Foto ${index + 1}"
                >
            `).join("")
            : `
                <img
                    src="${post.image}"
                    alt="${post.touristSpot}"
                >
            `
    }

</div>


            <div class="post-content">

                <div class="post-rating">
                    ${createStars(post.rating)}
                </div>

                <p>
                    ${post.description}
                </p>


                <div class="post-actions">

                    <button
                        class="like-button"
                        data-post-id="${post.id}">
                        ❤️ ${post.likes}
                    </button>

                    <button
                        class="comment-button"
                        data-post-id="${post.id}">
                        💬 Comentários
                    </button>

                    ${post.isUserPost ? `
                        <button
                            class="delete-button"
                            data-post-id="${post.id}">
                            🗑️ Excluir
                        </button>
                    ` : ""}

                </div>


                <div class="comments-section" id="comments-${post.id}">

                    <div class="comments-list">
                        ${commentsHTML}
                    </div>

                    <div class="comment-form">

                        <input
                            type="text"
                            class="comment-input"
                            placeholder="Escreva um comentário..."
                        >

                        <button
                            class="comment-submit"
                            data-post-id="${post.id}">
                            Comentar
                        </button>

                    </div>

                </div>

            </div>

        </article>
    `;
}


function renderCommunityPosts() {

    const savedPosts = localStorage.getItem("communityPosts");

    const userPosts = savedPosts
        ? JSON.parse(savedPosts)
        : [];

    const allPosts = [
        ...userPosts,
        ...communityPosts
    ];

    communityFeed.innerHTML = allPosts
        .map(createCommunityPost)
        .join("");

}


renderCommunityPosts();


async function loadCommunityAvatars() {
    const images = document.querySelectorAll(
        ".community-avatar-image[data-user-id]"
    );

    const imagesWithUser = Array.from(images).filter(
        image => image.dataset.userId
    );

    if (imagesWithUser.length === 0) return;

    let db;

    try {
        db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(
                "itamaracaConectaDB",
                1
            );

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        if (!db.objectStoreNames.contains("avatars")) {
            db.close();
            return;
        }

        for (const image of imagesWithUser) {
            const transaction = db.transaction(
                "avatars",
                "readonly"
            );

            const request = transaction
                .objectStore("avatars")
                .get(image.dataset.userId);

            const avatar = await new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error);
            });

            if (avatar) {
                image.src = URL.createObjectURL(avatar);
                image.hidden = false;

                const placeholder = image.parentElement.querySelector(
                    ".community-avatar-placeholder"
                );

                if (placeholder) {
                    placeholder.hidden = true;
                }
            }
        }
    } catch (error) {
        console.error(
            "Não foi possível carregar as fotos dos autores:",
            error
        );
    } finally {
        if (db) db.close();
    }
}

loadCommunityAvatars();


// ========================================
// SISTEMA DE LIKES
// ========================================

const savedLikedPosts = localStorage.getItem("likedCommunityPosts");

const likedPosts = savedLikedPosts
    ? JSON.parse(savedLikedPosts)
    : [];


document.querySelectorAll(".like-button").forEach((button) => {

    const postId = Number(button.dataset.postId);


    // Verifica se o usuário já curtiu
    if (likedPosts.includes(postId)) {

        button.innerHTML = `💔 Curtido`;

        button.classList.add("liked");

    }


    button.addEventListener("click", () => {

        const savedPosts = localStorage.getItem("communityPosts");

        const userPosts = savedPosts
            ? JSON.parse(savedPosts)
            : [];


        const allPosts = [
            ...userPosts,
            ...communityPosts
        ];


        const post = allPosts.find(
            (post) => post.id === postId
        );


        if (!post) {
            return;
        }


        // ==========================
        // DESCURTIR
        // ==========================

        if (likedPosts.includes(postId)) {

            post.likes--;

            const position = likedPosts.indexOf(postId);

            likedPosts.splice(position, 1);

            button.innerHTML = `❤️ ${post.likes}`;

            button.classList.remove("liked");

        }


        // ==========================
        // CURTIR
        // ==========================

        else {

            post.likes++;

            likedPosts.push(postId);

            button.innerHTML = `💔 Curtido`;

            button.classList.add("liked");

        }


        // Salva as publicações criadas pelo usuário
        localStorage.setItem(
            "communityPosts",
            JSON.stringify(userPosts)
        );


        // Salva quais publicações foram curtidas
        localStorage.setItem(
            "likedCommunityPosts",
            JSON.stringify(likedPosts)
        );

    });

});

document.querySelectorAll(".delete-button").forEach((button) => {

    button.addEventListener("click", () => {

        const postId = Number(button.dataset.postId);

        const savedPosts = localStorage.getItem("communityPosts");

        const userPosts = savedPosts
            ? JSON.parse(savedPosts)
            : [];


        const updatedPosts = userPosts.filter(
            (post) => post.id !== postId
        );


        localStorage.setItem(
            "communityPosts",
            JSON.stringify(updatedPosts)
        );


        window.location.reload();

    });

});

document.querySelectorAll(".comment-button").forEach((button) => {

    button.addEventListener("click", () => {

        const postId = button.dataset.postId;

        const commentsSection = document.querySelector(
            `#comments-${postId}`
        );

        commentsSection.classList.toggle("comments-open");

    });

});

function getComments(postId) {

    const savedComments = localStorage.getItem("communityComments");

    const comments = savedComments
        ? JSON.parse(savedComments)
        : [];

    return comments.filter(
        (comment) => comment.postId === postId
    );

}

document.querySelectorAll(".comment-submit").forEach((button) => {

    button.addEventListener("click", () => {

        const postId = Number(button.dataset.postId);

        const commentsSection = document.querySelector(
            `#comments-${postId}`
        );

        const input = commentsSection.querySelector(".comment-input");

        const text = input.value.trim();


        if (text === "") {
            return;
        }


        const savedComments = localStorage.getItem("communityComments");

        const comments = savedComments
            ? JSON.parse(savedComments)
            : [];


        const newComment = {

            id: Date.now(),

            postId: postId,

            text: text,

            isUserComment: true

        };


        comments.push(newComment);


        localStorage.setItem(
    "communityComments",
    JSON.stringify(comments)
);


input.value = "";


// Atualiza a lista de comentários na tela
const commentsList = commentsSection.querySelector(".comments-list");

const postComments = getComments(postId);

commentsList.innerHTML = postComments
    .map((comment) => `
        <div class="comment">

            <div class="comment-user">
                👤 Visitante
            </div>

            <p>
                ${comment.text}
            </p>

            ${comment.isUserComment ? `
                <button
                    class="delete-comment-button"
                    data-comment-id="${comment.id}">
                    🗑️ Excluir
                </button>
            ` : ""}

        </div>
    `)
    .join("");
        

    });

});

document.querySelectorAll(".delete-comment-button").forEach((button) => {

    button.addEventListener("click", () => {

        const commentId = Number(button.dataset.commentId);

        const savedComments = localStorage.getItem("communityComments");

        const comments = savedComments
            ? JSON.parse(savedComments)
            : [];


        const updatedComments = comments.filter(
            (comment) => comment.id !== commentId
        );


        localStorage.setItem(
            "communityComments",
            JSON.stringify(updatedComments)
        );


        window.location.reload();

    });

});

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {
        backToTop.classList.add("visible");
    } else {
        backToTop.classList.remove("visible");
    }

});


backToTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

const knowledgeButtons = document.querySelectorAll(".knowledge-button");
const knowledgeContent = document.querySelector("#knowledge-content");

const knowledgeTopics = {
    history: {
        title: "🏛️ História e patrimônio",
        text: "A Ilha de Itamaracá possui uma trajetória marcada pela ocupação histórica, por patrimônios arquitetônicos e por locais que ajudam a compreender diferentes períodos da história de Pernambuco. As informações apresentadas nesta seção devem ser complementadas com fontes confiáveis durante a fase de pesquisa do projeto."
    },

    nature: {
        title: "🌿 Natureza e biodiversidade",
        text: "A ilha reúne ambientes costeiros, áreas de vegetação, praias e paisagens naturais que fazem parte de sua identidade. O turismo responsável deve valorizar a preservação desses espaços e incentivar atitudes que reduzam impactos ambientais."
    },

    culture: {
        title: "🎶 Cultura e tradições",
        text: "A cultura da Ilha de Itamaracá está relacionada às suas tradições, manifestações artísticas, comunidades e formas de expressão. A plataforma poderá apresentar essas informações de maneira respeitosa, valorizando a participação e o conhecimento da população local."
    }
};

knowledgeButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const topicName = button.dataset.topic;
        const topic = knowledgeTopics[topicName];

        knowledgeContent.innerHTML = `
            <h3>${topic.title}</h3>
            <p>${topic.text}</p>
        `;

        knowledgeContent.classList.add("visible");

        knowledgeContent.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

});