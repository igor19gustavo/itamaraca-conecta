
(() => {
    const USERS_KEY = "itamaracaUsers";
    const SESSION_KEY = "itamaracaCurrentUser";

    const nameElement = document.querySelector("#profile-name");
    const usernameElement = document.querySelector("#profile-username");
    const bioElement = document.querySelector("#profile-bio");
    const avatarElement = document.querySelector("#profile-avatar");
    const visitedElement = document.querySelector("#visited-spots");
    const messageElement = document.querySelector("#profile-message");
    const logoutButton = document.querySelector("#logout-button");
    
    const editButton = document.querySelector("#edit-profile-button");
    const editForm = document.querySelector("#edit-profile-form");
    const editNameInput = document.querySelector("#edit-name");
    const editBioInput = document.querySelector("#edit-bio");
    const cancelEditButton = document.querySelector("#cancel-edit-button");

    const avatarInput = document.querySelector("#avatar-input");
    const saveAvatarButton = document.querySelector("#save-avatar-button");
    const removeAvatarButton = document.querySelector("#remove-avatar-button");
    const avatarControls = document.querySelector("#avatar-controls");
    const avatarImage = document.querySelector("#profile-avatar-image");
    const avatarPlaceholder = document.querySelector("#profile-avatar-placeholder");

    const visitedSpotForm = document.querySelector("#visited-spot-form");
    const visitedSpotInput = document.querySelector("#visited-spot-name");
    const visitedSpotMessage = document.querySelector("#visited-spot-message");

    
    const profilePostsElement = document.querySelector("#profile-posts");
    const profilePostsMessage = document.querySelector("#profile-posts-message");
    const profilePostsTitle = document.querySelector("#profile-posts-title");

    let profilePostObjectUrls = [];


    function getCurrentUser() {
        try {
            const session = JSON.parse(
                localStorage.getItem(SESSION_KEY) || "null"
            );

            const users = JSON.parse(
                localStorage.getItem(USERS_KEY) || "[]"
            );

            if (!session || !Array.isArray(users)) {
                return null;
            }

            return users.find(user => user.id === session.userId) || null;
        } catch {
            return null;
        }
    }

    
function getViewedUser() {
    const params = new URLSearchParams(window.location.search);
    const requestedUserId = params.get("userId");

    // Sem userId na URL, exibe o próprio perfil.
    if (!requestedUserId) {
        return getCurrentUser();
    }

    try {
        const users = JSON.parse(
            localStorage.getItem(USERS_KEY) || "[]"
        );

        if (!Array.isArray(users)) return null;

        return users.find(user => user.id === requestedUserId) || null;
    } catch {
        return null;
    }
}

function isOwnProfile() {
    const currentUser = getCurrentUser();
    const viewedUser = getViewedUser();

    return Boolean(
        currentUser &&
        viewedUser &&
        currentUser.id === viewedUser.id
    );
}

    const DB_NAME = "itamaracaConectaDB";
const DB_VERSION = 2;
const AVATAR_STORE = "avatars";
const POST_IMAGE_STORE = "postImages";

function openAvatarDB() {
    return new Promise((resolve, reject) => {

        const request = indexedDB.open(
            DB_NAME,
            DB_VERSION
        );

        request.onupgradeneeded = () => {

            const db = request.result;

            if (!db.objectStoreNames.contains(AVATAR_STORE)) {
                db.createObjectStore(AVATAR_STORE);
            }

            if (!db.objectStoreNames.contains(POST_IMAGE_STORE)) {
                db.createObjectStore(POST_IMAGE_STORE);
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };

    });
}

async function saveAvatar(userId, imageBlob) {
    const db = await openAvatarDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(AVATAR_STORE, "readwrite");

        transaction.objectStore(AVATAR_STORE).put(imageBlob, userId);

        transaction.oncomplete = () => {
            db.close();
            resolve();
        };

        transaction.onerror = () => {
            db.close();
            reject(transaction.error);
        };

        transaction.onabort = () => {
            db.close();
            reject(transaction.error);
        };
    });
}

async function getAvatar(userId) {
    const db = await openAvatarDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(AVATAR_STORE, "readonly");
        const request = transaction.objectStore(AVATAR_STORE).get(userId);

        request.onsuccess = () => {
            db.close();
            resolve(request.result || null);
        };

        request.onerror = () => {
            db.close();
            reject(request.error);
        };
    });
}

async function savePostImage(postId, imageIndex, imageBlob) {
    const db = await openAvatarDB();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            POST_IMAGE_STORE,
            "readwrite"
        );

        const key = `${postId}_${imageIndex}`;

        transaction
            .objectStore(POST_IMAGE_STORE)
            .put(imageBlob, key);

        transaction.oncomplete = () => {
            db.close();
            resolve();
        };

        transaction.onerror = () => {
            db.close();
            reject(transaction.error);
        };

        transaction.onabort = () => {
            db.close();
            reject(transaction.error);
        };

    });
}

async function getPostImage(postId, imageIndex) {
    const db = await openAvatarDB();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            POST_IMAGE_STORE,
            "readonly"
        );

        const key = `${postId}_${imageIndex}`;

        const request = transaction
            .objectStore(POST_IMAGE_STORE)
            .get(key);

        request.onsuccess = () => {
            db.close();
            resolve(request.result || null);
        };

        request.onerror = () => {
            db.close();
            reject(request.error);
        };

    });
}

async function deletePostImages(postId, imageCount) {
    const db = await openAvatarDB();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            POST_IMAGE_STORE,
            "readwrite"
        );

        const store = transaction.objectStore(
            POST_IMAGE_STORE
        );

        for (let i = 0; i < imageCount; i++) {
            store.delete(`${postId}_${i}`);
        }

        transaction.oncomplete = () => {
            db.close();
            resolve();
        };

        transaction.onerror = () => {
            db.close();
            reject(transaction.error);
        };

        transaction.onabort = () => {
            db.close();
            reject(transaction.error);
        };

    });
}





async function renderProfilePosts(user, ownProfile) {
    profilePostObjectUrls.forEach(url => URL.revokeObjectURL(url));
    profilePostObjectUrls = [];

    profilePostsElement.replaceChildren();

    profilePostsTitle.textContent = ownProfile
        ? "Minhas publicações"
        : `Publicações de ${user.name || user.username}`;

    let posts;

    try {
        posts = JSON.parse(
            localStorage.getItem("communityPosts") || "[]"
        );

        if (!Array.isArray(posts)) {
            throw new Error("Formato de publicações inválido.");
        }
    } catch (error) {
        console.error(error);
        profilePostsMessage.textContent =
            "Não foi possível carregar as publicações.";
        return;
    }

    const userPosts = posts.filter(post =>
        post &&
        post.userId != null &&
        String(post.userId) === String(user.id)
    );

    if (userPosts.length === 0) {
        profilePostsMessage.textContent = ownProfile
            ? "Você ainda não fez nenhuma publicação."
            : "Este usuário ainda não tem publicações.";
        return;
    }

    profilePostsMessage.textContent = "";

    let avatarUrl = null;

    try {
        const avatar = await getAvatar(user.id);

        if (avatar) {
            avatarUrl = URL.createObjectURL(avatar);
            profilePostObjectUrls.push(avatarUrl);
        }
    } catch (error) {
        console.error("Erro ao carregar foto:", error);
    }

    let comments = [];
    let likedPosts = [];

    try {
        comments = JSON.parse(
            localStorage.getItem("communityComments") || "[]"
        );

        if (!Array.isArray(comments)) comments = [];
    } catch {
        comments = [];
    }

    try {
        likedPosts = JSON.parse(
            localStorage.getItem("likedCommunityPosts") || "[]"
        );

        if (!Array.isArray(likedPosts)) likedPosts = [];
    } catch {
        likedPosts = [];
    }

   for (const post of userPosts) {
        const card = document.createElement("article");
        card.className = "profile-post-card";

        // Cabeçalho
        const header = document.createElement("div");
        header.className = "profile-post-header";

        if (avatarUrl) {
            const avatar = document.createElement("img");
            avatar.className = "profile-post-avatar";
            avatar.src = avatarUrl;
            avatar.alt = "Foto de perfil";
            header.appendChild(avatar);
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "profile-post-avatar";
            placeholder.textContent = "👤";
            header.appendChild(placeholder);
        }

        const authorInfo = document.createElement("div");
        const author = document.createElement("div");

        author.className = "profile-post-author";
        author.textContent = post.user || user.name || "Visitante";
        authorInfo.appendChild(author);

        if (post.username) {
            const username = document.createElement("div");
            username.textContent = `@${post.username}`;
            authorInfo.appendChild(username);
        }

        const date = document.createElement("span");
        date.className = "profile-post-date";
        date.textContent = post.date || "";
        authorInfo.appendChild(date);

        header.appendChild(authorInfo);
        card.appendChild(header);

        // Local turístico
        if (post.touristSpot) {
            const spot = document.createElement("h3");
            spot.textContent = post.touristSpot;
            card.appendChild(spot);
        }

        // Descrição
        if (post.description) {
            const description = document.createElement("p");
            description.className = "profile-post-description";
            description.textContent = post.description;
            card.appendChild(description);
        }

        // Imagens da publicação
let postImages = [];

if (post.imageCount > 0) {

    for (let i = 0; i < post.imageCount; i++) {

        const blob = await window.ItamaracaStorage.getPostImage(
            post.id,
            i
        );

        if (blob) {
    const imageUrl = URL.createObjectURL(blob);

    postImages.push(imageUrl);
    profilePostObjectUrls.push(imageUrl);
}
    }

} else if (
    Array.isArray(post.images) &&
    post.images.length > 0
) {

    // Compatibilidade com publicações antigas
    postImages = post.images;

} else if (
    typeof post.image === "string" &&
    post.image.trim()
) {

    // Compatibilidade com publicações antigas
    postImages = [post.image];

}

postImages.forEach((imageSrc, index) => {

    const image = document.createElement("img");

    image.className = "profile-post-image";

    image.alt = post.touristSpot
        ? `Foto ${index + 1} de ${post.touristSpot}`
        : `Imagem ${index + 1} da publicação`;

    image.loading = "lazy";
    image.src = imageSrc;

    image.addEventListener("error", () => image.remove(), {
        once: true
    });

    card.appendChild(image);

});

        // Avaliação
        if (
            post.rating !== undefined &&
            post.rating !== null &&
            post.rating !== ""
        ) {
            const rating = document.createElement("p");
            rating.className = "profile-post-rating";
            rating.textContent = `⭐ Avaliação: ${post.rating}/5`;
            card.appendChild(rating);
        }

        // Curtidas
        const actions = document.createElement("div");
        actions.className = "profile-post-actions";

        const likeButton = document.createElement("button");
        likeButton.type = "button";

        const postId = Number(post.id);
        const hasLiked = likedPosts.includes(postId);

        likeButton.className = "profile-post-like";
        likeButton.textContent = hasLiked
            ? "💔 Curtido"
            : `❤️ ${Number(post.likes) || 0}`;

        if (hasLiked) {
            likeButton.classList.add("liked");
        }

        likeButton.addEventListener("click", () => {
            try {
                const savedPosts = JSON.parse(
                    localStorage.getItem("communityPosts") || "[]"
                );

                const currentPosts = Array.isArray(savedPosts)
                    ? savedPosts
                    : [];

                const targetPost = currentPosts.find(item =>
                    String(item.id) === String(post.id) &&
                    String(item.userId) === String(user.id)
                );

                if (!targetPost) {
                    profilePostsMessage.textContent =
                        "Não foi possível atualizar esta curtida.";
                    return;
                }

                let savedLikes = JSON.parse(
                    localStorage.getItem("likedCommunityPosts") || "[]"
                );

                if (!Array.isArray(savedLikes)) savedLikes = [];

                const alreadyLiked = savedLikes.includes(postId);

                targetPost.likes = Math.max(
                    0,
                    Number(targetPost.likes) || 0
                );

                if (alreadyLiked) {
                    targetPost.likes--;

                    savedLikes = savedLikes.filter(
                        id => id !== postId
                    );
                } else {
                    targetPost.likes++;
                    savedLikes.push(postId);
                }

                localStorage.setItem(
                    "communityPosts",
                    JSON.stringify(currentPosts)
                );

                localStorage.setItem(
                    "likedCommunityPosts",
                    JSON.stringify(savedLikes)
                );

                renderProfilePosts(user, ownProfile);
            } catch (error) {
                console.error(error);
                profilePostsMessage.textContent =
                    "Não foi possível salvar a curtida.";
            }
        });

        actions.appendChild(likeButton);
        card.appendChild(actions);

        // Comentários da publicação
        const commentsSection = document.createElement("section");
        commentsSection.className = "profile-post-comments";

        const commentsTitle = document.createElement("h4");
        const postComments = comments.filter(comment =>
            String(comment.postId) === String(post.id)
        );

        commentsTitle.textContent =
            `Comentários (${postComments.length})`;

        commentsSection.appendChild(commentsTitle);

        if (postComments.length === 0) {
            const empty = document.createElement("p");
            empty.className = "profile-post-no-comments";
            empty.textContent = "Nenhum comentário ainda.";
            commentsSection.appendChild(empty);
        }

        postComments.forEach(comment => {
            const commentCard = document.createElement("div");
            commentCard.className = "profile-post-comment";

            const commentAuthor = document.createElement("strong");

            commentAuthor.textContent = comment.user || "Visitante";
            commentCard.appendChild(commentAuthor);

            if (comment.username) {
                const username = document.createElement("span");
                username.className = "profile-comment-username";
                username.textContent = ` @${comment.username}`;
                commentCard.appendChild(username);
            }

            const commentText = document.createElement("p");
            commentText.textContent = comment.text || "";
            commentCard.appendChild(commentText);

            commentsSection.appendChild(commentCard);
        });

        // Formulário para comentar
        const commentForm = document.createElement("form");
        commentForm.className = "profile-post-comment-form";

        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.maxLength = 500;
        commentInput.placeholder = "Escreva um comentário...";
        commentInput.setAttribute("aria-label", "Seu comentário");
        commentInput.required = true;

        const commentButton = document.createElement("button");
        commentButton.type = "submit";
        commentButton.className = "btn btn-primary";
        commentButton.textContent = "Comentar";

        commentForm.append(commentInput, commentButton);

        commentForm.addEventListener("submit", event => {
            event.preventDefault();

            const text = commentInput.value.trim();

            if (!text) return;

            try {
                const savedComments = JSON.parse(
                    localStorage.getItem("communityComments") || "[]"
                );

                const currentComments = Array.isArray(savedComments)
                    ? savedComments
                    : [];

                const currentUser = getCurrentUser();

                const newComment = {
                    id: Date.now(),
                    postId: postId,
                    text: text,
                    isUserComment: true,
                    userId: currentUser?.id || null,
                    user: currentUser?.name || "Visitante",
                    username: currentUser?.username || ""
                };

                currentComments.push(newComment);

                localStorage.setItem(
                    "communityComments",
                    JSON.stringify(currentComments)
                );

                renderProfilePosts(user, ownProfile);
            } catch (error) {
                console.error(error);
                profilePostsMessage.textContent =
                    "Não foi possível salvar o comentário.";
            }
        });

        commentsSection.appendChild(commentForm);
        card.appendChild(commentsSection);

        // Excluir somente publicação própria
        if (ownProfile && post.isUserPost === true) {
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "profile-post-delete";
            deleteButton.textContent = "Excluir publicação";

            deleteButton.addEventListener("click", async () => {
                if (!confirm("Deseja excluir esta publicação?")) return;

                try {
                    const savedPosts = JSON.parse(
                        localStorage.getItem("communityPosts") || "[]"
                    );

                    const currentPosts = Array.isArray(savedPosts)
                        ? savedPosts
                        : [];

                    const updatedPosts = currentPosts.filter(item =>
                        !(
                            String(item.id) === String(post.id) &&
                            String(item.userId) === String(user.id) &&
                            item.isUserPost === true
                        )
                    );

                    localStorage.setItem(
    "communityPosts",
    JSON.stringify(updatedPosts)
);

try {

    await window.ItamaracaStorage.deletePostImages(
        post.id,
        Number(post.imageCount) || 0
    );

} catch (error) {

    console.error(
        "Erro ao apagar imagens da publicação:",
        error
    );

}

renderProfilePosts(user, ownProfile);
                } catch (error) {
                    console.error(error);
                    profilePostsMessage.textContent =
                        "Não foi possível excluir a publicação.";
                }
            });

            card.appendChild(deleteButton);
        }

        profilePostsElement.appendChild(card);
    }
}

async function deleteAvatar(userId) {
    const db = await openAvatarDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(AVATAR_STORE, "readwrite");

        transaction.objectStore(AVATAR_STORE).delete(userId);

        transaction.oncomplete = () => {
            db.close();
            resolve();
        };

        transaction.onerror = () => {
            db.close();
            reject(transaction.error);
        };

        transaction.onabort = () => {
            db.close();
            reject(transaction.error);
        };
    });
}

    
function showProfile() {
    const user = getViewedUser();

    if (!user) {
        const params = new URLSearchParams(window.location.search);

        if (params.has("userId")) {
            messageElement.textContent = "Perfil não encontrado.";
        } else {
            window.location.href = "auth.html";
        }

        return;
    }

    const ownProfile = isOwnProfile();

    const createPostButton = document.querySelector(
    "#create-profile-post-button"
);

if (createPostButton) {
    createPostButton.hidden = !ownProfile;
}

    renderProfilePosts(user, ownProfile);

    nameElement.textContent = user.name || "Visitante";
    usernameElement.textContent = `@${user.username || ""}`;
    bioElement.textContent = user.bio || "Nenhuma biografia adicionada.";

    // Só o dono do perfil pode ver os controles de edição.
    editButton.hidden = !ownProfile;
    editForm.hidden = true;
    logoutButton.hidden = !ownProfile;
    visitedSpotForm.hidden = !ownProfile;

    avatarControls.hidden = true;

    loadAvatar(user.id);

    visitedElement.replaceChildren();

    const visitedSpots = Array.isArray(user.visitedSpots)
        ? user.visitedSpots
        : [];

    if (visitedSpots.length === 0) {
        const item = document.createElement("li");

        item.textContent = "Nenhum local registrado ainda.";
        visitedElement.appendChild(item);
    }

    visitedSpots.forEach((spot, index) => {
        const item = document.createElement("li");
        const name = document.createElement("span");

        name.textContent = spot;

        if (ownProfile) {
            const removeButton = document.createElement("button");

            removeButton.type = "button";
            removeButton.textContent = "Remover";
            removeButton.textContent = "×";
            removeButton.setAttribute(
                "aria-label",
                `Remover ${spot} dos locais visitados`
            );

            removeButton.addEventListener("click", () => {
                removeVisitedSpot(index);
            });

            item.append(name, " ", removeButton);
        } else {
            item.appendChild(name);
        }

        visitedElement.appendChild(item);
    });
}

    
function updateVisitedSpots(updateCallback) {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = "auth.html";
        return false;
    }

    try {
        const users = JSON.parse(
            localStorage.getItem(USERS_KEY) || "[]"
        );

        const userIndex = users.findIndex(
            item => item.id === user.id
        );

        if (userIndex === -1) {
            visitedSpotMessage.textContent =
                "Não foi possível localizar sua conta.";
            return false;
        }

        const currentSpots = Array.isArray(users[userIndex].visitedSpots)
            ? users[userIndex].visitedSpots
            : [];

        users[userIndex].visitedSpots = updateCallback([...currentSpots]);

        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        showProfile();
        return true;
    } catch {
        visitedSpotMessage.textContent =
            "Não foi possível salvar os locais visitados.";
        return false;
    }
}

function removeVisitedSpot(index) {
    const saved = updateVisitedSpots(spots => {
        spots.splice(index, 1);
        return spots;
    });

    if (saved) {
        visitedSpotMessage.textContent = "Local removido da lista.";
    }
}

visitedSpotForm.addEventListener("submit", event => {
    event.preventDefault();

    const spotName = visitedSpotInput.value.trim();

    if (!spotName) return;

    const user = getCurrentUser();

    if (!user) {
        window.location.href = "auth.html";
        return;
    }

    const existingSpots = Array.isArray(user.visitedSpots)
        ? user.visitedSpots
        : [];

    if (existingSpots.some(
        spot => spot.toLowerCase() === spotName.toLowerCase()
    )) {
        visitedSpotMessage.textContent =
            "Esse local já está na sua lista.";
        return;
    }

    const saved = updateVisitedSpots(spots => {
        spots.push(spotName);
        return spots;
    });

    if (saved) {
        visitedSpotInput.value = "";
        visitedSpotMessage.textContent =
            "Local adicionado com sucesso!";
    }
});



    let currentAvatarUrl = null;

async function loadAvatar(userId) {
    try {
        const avatar = await getAvatar(userId);

        if (currentAvatarUrl) {
            URL.revokeObjectURL(currentAvatarUrl);
            currentAvatarUrl = null;
        }

        if (avatar) {
            currentAvatarUrl = URL.createObjectURL(avatar);

            avatarImage.src = currentAvatarUrl;
            avatarImage.hidden = false;

            avatarPlaceholder.hidden = true;
        } else {
            avatarImage.removeAttribute("src");

            avatarImage.hidden = true;
            avatarPlaceholder.hidden = false;
        }

    } catch {
        messageElement.textContent =
            "Não foi possível carregar a foto.";
    }
}

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = "auth.html";
    });

    
editButton.addEventListener("click", () => {
    const user = getCurrentUser();

    if (!user) return;

    editNameInput.value = user.name || "";
    editBioInput.value = user.bio || "";

    editForm.hidden = false;
    editButton.hidden = true;

    avatarControls.hidden = false;

    messageElement.textContent = "";
});

cancelEditButton.addEventListener("click", () => {
    editForm.hidden = true;
    editButton.hidden = false;
    avatarControls.hidden = true;
    editForm.reset();
});

editForm.addEventListener("submit", event => {
    event.preventDefault();

    const user = getCurrentUser();

    if (!user) {
        window.location.href = "auth.html";
        return;
    }

    const newName = editNameInput.value.trim();
    const newBio = editBioInput.value.trim();

    if (!newName) {
        messageElement.textContent = "Digite um nome para exibição.";
        return;
    }

    try {
        const users = JSON.parse(
            localStorage.getItem(USERS_KEY) || "[]"
        );

        const userIndex = users.findIndex(
            item => item.id === user.id
        );

        if (userIndex === -1) {
            messageElement.textContent = "Não foi possível localizar sua conta.";
            return;
        }

        users[userIndex].name = newName;
        users[userIndex].bio = newBio;

        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        editForm.hidden = true;
        editButton.hidden = false;

        showProfile();

        messageElement.textContent = "Perfil atualizado com sucesso!";
    } catch {
        messageElement.textContent =
            "Não foi possível salvar as alterações. Tente novamente.";
    }
});

avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        messageElement.textContent = "Escolha uma imagem PNG, JPEG ou WebP.";
        avatarInput.value = "";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        messageElement.textContent = "A imagem deve ter no máximo 5 MB.";
        avatarInput.value = "";
        return;
    }

    messageElement.textContent = "Imagem selecionada. Clique em Salvar foto.";
});

saveAvatarButton.addEventListener("click", async () => {
    const user = getCurrentUser();
    const file = avatarInput.files[0];

    if (!user) {
        window.location.href = "auth.html";
        return;
    }

    if (!file) {
        messageElement.textContent = "Selecione uma imagem primeiro.";
        return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)
        || file.size > 5 * 1024 * 1024) {
        messageElement.textContent = "Escolha PNG, JPEG ou WebP de até 5 MB.";
        return;
    }

    try {
        await saveAvatar(user.id, file);
        await loadAvatar(user.id);
        avatarInput.value = "";
        messageElement.textContent = "Foto de perfil salva com sucesso!";
    } catch {
        messageElement.textContent = "Não foi possível salvar a foto.";
    }
});

removeAvatarButton.addEventListener("click", async () => {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = "auth.html";
        return;
    }

    try {
        await deleteAvatar(user.id);
        await loadAvatar(user.id);
        avatarInput.value = "";
        messageElement.textContent = "Foto de perfil removida.";
    } catch {
        messageElement.textContent = "Não foi possível remover a foto.";
    }
});

showProfile();


})();

