const ITAMARACA_DB_NAME = "itamaracaConectaDB";
const ITAMARACA_DB_VERSION = 2;

const AVATAR_STORE = "avatars";
const POST_IMAGE_STORE = "postImages";


function openItamaracaDB() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(
            ITAMARACA_DB_NAME,
            ITAMARACA_DB_VERSION
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


/* =========================
   FOTOS DAS PUBLICAÇÕES
   ========================= */


async function savePostImage(postId, imageIndex, imageBlob) {

    const db = await openItamaracaDB();


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

    const db = await openItamaracaDB();


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

    const db = await openItamaracaDB();


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


/* =========================
   ACESSO COMPARTILHADO
   ========================= */


window.ItamaracaStorage = {

    savePostImage,
    getPostImage,
    deletePostImages

};