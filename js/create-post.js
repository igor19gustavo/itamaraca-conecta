const postForm = document.querySelector("#post-form");
const postSpot = document.querySelector("#post-spot");
const postImages = document.querySelector("#post-images");


touristSpots.forEach((tourist) => {

    const option = document.createElement("option");

    option.value = tourist.id;
    option.textContent = tourist.name;

    postSpot.appendChild(option);

});


postForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    
const session = JSON.parse(
    localStorage.getItem("itamaracaCurrentUser") || "null"
);

const users = JSON.parse(
    localStorage.getItem("itamaracaUsers") || "[]"
);

const currentUser = session
    ? users.find(user => user.id === session.userId)
    : null;

if (!currentUser) {
    alert("Entre na sua conta antes de criar uma publicação.");
    window.location.href = "auth.html";
    return;
}

const user = currentUser.name;
const touristSpotId = Number(
    document.querySelector("#post-spot").value
);
    const description = document.querySelector("#post-description").value;
    const rating = Number(
        document.querySelector("#post-rating").value
    );


    const tourist = touristSpots.find(
        (spot) => spot.id === touristSpotId
    );


    const selectedFiles = Array.from(postImages.files);

if (selectedFiles.length > 5) {
    alert("Você pode selecionar no máximo 5 fotos.");
    return;
}

const imageFiles = [];

for (const file of selectedFiles) {

    if (!file.type.startsWith("image/")) {
        alert("Selecione apenas arquivos de imagem.");
        return;
    }

    if (file.size > 15 * 1024 * 1024) {
        alert(
            `A imagem "${file.name}" é muito grande. Escolha imagens de até 2 MB.`
        );
        return;
    }

    imageFiles.push(file);

    console.log("Quantidade de fotos carregadas:", imageFiles.length);
}

const newPost = {
    id: Date.now(),
    user: user,
    userId: currentUser.id,
    username: currentUser.username,
    touristSpot: tourist.name,
    description: description,
    image: imageFiles.length > 0 ? null : tourist.image,
    images: [],
    imageCount: imageFiles.length,
    rating: rating,
    likes: 0,
    date: "Agora",
    isUserPost: true
};

try {

    for (let i = 0; i < imageFiles.length; i++) {

        await window.ItamaracaStorage.savePostImage(
            newPost.id,
            i,
            imageFiles[i]
        );

    }

} catch (error) {

    console.error(
        "ERRO AO SALVAR IMAGENS DA PUBLICAÇÃO:",
        error
    );

    alert(
        "Não foi possível salvar as fotos da publicação."
    );

    return;
}

    const savedPosts = localStorage.getItem("communityPosts");

    const posts = savedPosts
        ? JSON.parse(savedPosts)
        : [];


    posts.unshift(newPost);


    try {

    localStorage.setItem(
        "communityPosts",
        JSON.stringify(posts)
    );

    console.log("Publicação salva com sucesso:", newPost);

} catch (error) {

    console.error("ERRO AO SALVAR PUBLICAÇÃO:", error);

    alert(
        "Não foi possível salvar a publicação. " +
        "Veja o erro no console do navegador."
    );

    return;
}


    window.location.href = "index.html#comunidade";

});