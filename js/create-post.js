const postForm = document.querySelector("#post-form");
const postSpot = document.querySelector("#post-spot");


touristSpots.forEach((tourist) => {

    const option = document.createElement("option");

    option.value = tourist.id;
    option.textContent = tourist.name;

    postSpot.appendChild(option);

});


postForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const user = document.querySelector("#post-user").value;
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


    const newPost = {

        id: Date.now(),

        user: user,

        touristSpot: tourist.name,

        description: description,

        image: tourist.image,

        rating: rating,

        likes: 0,

        date: "Agora",

        isUserPost: true

    };


    const savedPosts = localStorage.getItem("communityPosts");

    const posts = savedPosts
        ? JSON.parse(savedPosts)
        : [];


    posts.unshift(newPost);


    localStorage.setItem(
        "communityPosts",
        JSON.stringify(posts)
    );


    window.location.href = "index.html#comunidade";

});