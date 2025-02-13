
    const binId = "67ac3265acd3cb34a8deaac1"; // Remplace par ton ID JSONBin
    const apiKey = "$2a$10$lsQYBX8I2jpoXqzfu0MI5uqMnOMUbgkL/i0wE7Gj7wUw5nAE1KqYe"; // Remplace par ton API Key JSONBin



// Variables JSONBin
const JSON_BIN_ID = "TON_BIN_ID";
const JSON_BIN_KEY = "TON_CLE_API";
const JSON_BIN_URL = `https://api.jsonbin.io/v3/b/${JSON_BIN_ID}`;

// Sélection des éléments HTML
const productList = document.getElementById("product-list");
const editSection = document.getElementById("edit-section");
const editForm = document.getElementById("edit-form");
const nameInput = document.getElementById("edit-name");
const priceInput = document.getElementById("edit-price");
const descriptionInput = document.getElementById("edit-description");
const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");

let currentProductId = null;

// Charger les produits depuis JSONBin
async function loadProducts() {
    try {
        const response = await fetch(JSON_BIN_URL, {
            headers: { "X-Master-Key": JSON_BIN_KEY }
        });
        const data = await response.json();
        displayProducts(data.record);
    } catch (error) {
        console.error("Erreur de chargement des produits:", error);
    }
}

// Affichage des produits sur la page
function displayProducts(products) {
    productList.innerHTML = "";
    products.forEach((product, index) => {
        const productCard = document.createElement("div");
        productCard.classList.add("cardp");

        productCard.innerHTML = `
            <div class="cardp-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="cardp-content">
                <h3>${product.name}</h3>
                <p class="price">${product.price}€</p>
                <p>${product.description}</p>
                <button class="cardp-button" onclick="editProduct(${index})">Modifier</button>
            </div>
        `;

        productList.appendChild(productCard);
    });
}

// Remplir le formulaire avec les données du produit sélectionné
function editProduct(index) {
    fetch(JSON_BIN_URL, { headers: { "X-Master-Key": JSON_BIN_KEY } })
        .then(response => response.json())
        .then(data => {
            const product = data.record[index];
            currentProductId = index;
            nameInput.value = product.name;
            priceInput.value = product.price;
            descriptionInput.value = product.description;
        })
        .catch(error => console.error("Erreur lors de la récupération du produit:", error));
}

// Sauvegarder les modifications
async function saveProduct() {
    try {
        const response = await fetch(JSON_BIN_URL, {
            headers: { "X-Master-Key": JSON_BIN_KEY }
        });
        const data = await response.json();
        let products = data.record;

        products[currentProductId] = {
            name: nameInput.value,
            price: priceInput.value,
            description: descriptionInput.value,
            image: products[currentProductId].image
        };

        await fetch(JSON_BIN_URL, {
            method: "PUT",
            headers: {
                "X-Master-Key": JSON_BIN_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(products)
        });

        loadProducts();
    } catch (error) {
        console.error("Erreur de sauvegarde:", error);
    }
}

// Supprimer un produit
async function deleteProduct() {
    try {
        const response = await fetch(JSON_BIN_URL, {
            headers: { "X-Master-Key": JSON_BIN_KEY }
        });
        const data = await response.json();
        let products = data.record;

        products.splice(currentProductId, 1);

        await fetch(JSON_BIN_URL, {
            method: "PUT",
            headers: {
                "X-Master-Key": JSON_BIN_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(products)
        });

        loadProducts();
    } catch (error) {
        console.error("Erreur de suppression:", error);
    }
}

// Écouteurs d'événements
saveButton.addEventListener("click", saveProduct);
deleteButton.addEventListener("click", deleteProduct);

// Charger les produits au démarrage
loadProducts();
