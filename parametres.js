let apiUrl = new URL(
  "https://imagin-expo-backend-api.int.at-digital.fr/api/v1/"
);

const ProductOptions = [];

// récupère et affiche les produits dans la liste
function getProductData() {
  let request = new XMLHttpRequest();

  // Changer l'endpoint en ajoutant + 'newEndpoint'
  let url = apiUrl.toString() + "products";

  request.open("GET", url, true);
  request.setRequestHeader("ngrok-skip-browser-warning", 1);

  request.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.products;

    if (request.status >= 200 && request.status < 400) {
      const productContainer = document.getElementById("productList");

      Object.values(data).forEach((product) => {
        // vérification de si le produit est pas supprimé
        if (product.isDeleted === false) {
          const productElement = document.createElement("div");

          productElement.className = "productlistelement";

          const nom = document.createElement("p");
          nom.innerHTML = "<strong>" + product.name;
          +"</strong>";
          nom.className = "productinfosp";
          productElement.appendChild(nom);

          const dimensions = document.createElement("p");
          dimensions.innerHTML = product.description;
          dimensions.className = "productinfosp";
          productElement.appendChild(dimensions);

          const prix = document.createElement("p");
          prix.innerHTML = product.price.amount + " €";
          prix.className = "productinfosp";
          productElement.appendChild(prix);

          const buttonContainer = document.createElement("div");
          buttonContainer.className = "buttonlistcontainerproduct";

          const dupliquer = document.createElement("a");
          dupliquer.innerHTML = "Dupliquer";
          dupliquer.className = "button bluebutton w-button";
          dupliquer.onclick = function () {
            dupliquerProduct(
              product.name,
              product.description,
              product.price.amount
            );
          };
          buttonContainer.appendChild(dupliquer);

          const modifier = document.createElement("a");
          modifier.innerHTML = "Modifier";
          modifier.className = "button orangebutton w-button";
          modifier.onclick = function () {
            modifierProduct(
              modifier,
              product._id,
              nom,
              product.name,
              dimensions,
              product.description,
              prix,
              product.price.amount
            );
          };
          buttonContainer.appendChild(modifier);

          const supprimer = document.createElement("a");
          supprimer.innerHTML = "Supprimer";
          supprimer.className = "button redbutton w-button";
          supprimer.onclick = function () {
            supprimerItem(product.name, "products/", product._id);
          };
          buttonContainer.appendChild(supprimer);

          productElement.appendChild(buttonContainer);

          productContainer.appendChild(productElement);

          // Remplissage du select du formulaire d'ajout d'une nouvelle catégorie (liste des produits disponibles)

          const selectProductsCat =
            document.getElementById("selectProductsCat");

          var checkbox = document.createElement("input");
          checkbox.setAttribute("type", "checkbox");
          checkbox.setAttribute("id", product.name);
          checkbox.value = product._id;
          checkbox.className = "checkboxProduct";
          checkbox.style.marginRight = "5px";
          var checkboxLabel = document.createElement("label");
          checkboxLabel.innerHTML = product.name;
          checkboxLabel.setAttribute("for", product.name);
          var checkboxContainer = document.createElement("div");
          checkboxContainer.style.display = "flex";
          checkboxContainer.appendChild(checkbox);
          checkboxContainer.appendChild(checkboxLabel);

          ProductOptions.push(checkboxContainer);

          selectProductsCat.appendChild(checkboxContainer);
        }
      });
    }
  };

  request.send();
}

(function () {
  getProductData();
})();

// récupère et affiche les catégories dans la liste
function getCatData() {
  let request = new XMLHttpRequest();

  // Changer l'endpoint en ajoutant + 'newEndpoint'
  let url = apiUrl.toString() + "categories";

  request.open("GET", url, true);
  request.setRequestHeader("ngrok-skip-browser-warning", 1);

  request.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.categories;

    if (request.status >= 200 && request.status < 400) {
      const categoriesContainer = document.getElementById("categoryList");

      Object.values(data).forEach((category) => {
        // vérifie si la catégorie n'est pas supprimée
        if (category.isDeleted === false) {
          const categoryElement = document.createElement("div");

          categoryElement.className = "productlistelement";

          const nom = document.createElement("p");
          nom.innerHTML = "<strong>" + category.name;
          +"</strong>";
          nom.className = "categorieinfosp";
          categoryElement.appendChild(nom);

          const produits = document.createElement("p");
          var produitsText = "";
          category.products.forEach((product) => {
            produitsText += product.name + ", ";
          });
          produits.innerHTML = produitsText.slice(0, -2);
          produits.className = "categorieinfosp";
          categoryElement.appendChild(produits);

          const buttonContainer = document.createElement("div");
          buttonContainer.className = "buttonlistcontainer";

          const modifier = document.createElement("a");
          modifier.innerHTML = "Modifier";
          modifier.className = "button orangebutton w-button";
          modifier.onclick = function () {
            modifierCat(
              modifier,
              category._id,
              nom,
              category.name,
              produits,
              category.products
            );
          };
          buttonContainer.appendChild(modifier);

          const supprimer = document.createElement("a");
          supprimer.innerHTML = "Supprimer";
          supprimer.className = "button redbutton w-button";
          supprimer.onclick = function () {
            supprimerItem(category.name, "categories/", category._id);
          };
          buttonContainer.appendChild(supprimer);

          categoryElement.appendChild(buttonContainer);

          categoriesContainer.appendChild(categoryElement);
        }
      });
    }
  };

  request.send();
}

(function () {
  getCatData();
})();

// fonction de suppression de l'item (catégorie ou produit)
function supprimerItem(element, table, idItem) {
  // affichage du popup de confirmation de suppression
  const deleteItemContainer = document.getElementById("DeleteItemContainer");
  deleteItemContainer.style.display = "block";
  const textDeleteVerif = document.getElementById("textDeleteVerif");
  textDeleteVerif.innerHTML =
    "Êtes-vous sûr de vouloir supprimer <strong>" + element + "</strong> ?";
  const cancelDeleteItem = document.getElementById("cancelDeleteItem");
  cancelDeleteItem.onclick = function () {
    deleteItemContainer.style.display = "none";
  };
  const deleteButton = document.getElementById("deleteItemButton");
  deleteButton.onclick = function () {
    // création de la requete de suppression
    const xhr = new XMLHttpRequest();

    const url = apiUrl.toString() + table + idItem;

    // open request
    xhr.open("DELETE", url);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send();

    deleteItemContainer.style.display = "none";
    // reload de la page
    setTimeout(function () {
      location.reload();
    }, 1000);
  };
}

// fonction de modification d'un produit
function modifierProduct(
  button,
  productId,
  nomContainer,
  nomActuel,
  dimensionsContainer,
  dimensionsActuelles,
  prixContainer,
  prixActuel
) {
  // change tout en input pour pouvoir modifier les infos du produit
  nomContainer.innerHTML = '<input id="nomProduct" value="' + nomActuel + '">';
  dimensionsContainer.innerHTML =
    '<input id="dimensionsProduct" value="' + dimensionsActuelles + '">';
  prixContainer.innerHTML =
    '<input id="priceProduct" value="' + prixActuel + '">';
  button.innerHTML = "Valider";
  button.onclick = function () {
    // json de la modification
    const json = {
      product: {
        name: document.getElementById("nomProduct").value,
        description: document.getElementById("dimensionsProduct").value,
        price: {
          amount: document.getElementById("priceProduct").value,
          taxRate: 20,
        },
      },
    };

    let urlProduct = apiUrl + "products/" + productId;

    // requete de modification
    const xhr = new XMLHttpRequest();

    // listen for `load` event
    xhr.onload = () => {
      // print JSON response
      if (xhr.status >= 200 && xhr.status < 300) {
        // parse JSON
        const response = JSON.parse(xhr.responseText);
        console.log(response);
      }
    };

    // open request
    xhr.open("POST", urlProduct);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    // send rquest with JSON payload
    xhr.send(JSON.stringify(json));
    // reload de la page
    setTimeout(function () {
      location.reload();
    }, 1000);
  };
}

// fonction de duplication d'un produit
function dupliquerProduct(name, description, prix) {
  // affiche le formulaire d'ajout d'un produit en le pré-remplissant avec les infos du produit dupliqué
  const productform = document.getElementById("productform");
  productform.style.display = "block";
  const NameInput = document.getElementById("NameInput");
  NameInput.value = name;
  const DescriptionInput = document.getElementById("DescriptionInput");
  DescriptionInput.value = description;
  const PrixInput = document.getElementById("PrixInput");
  PrixInput.value = prix;
  document.getElementById("tabsMenu").scrollIntoView();
}

// fonction de modification d'une catégorie
function modifierCat(
  button,
  catId,
  nomContainer,
  nomActuel,
  ProduitsContainer,
  ProduitsActuels
) {
  // changement en input pour pouvoir modifier les infos
  nomContainer.innerHTML = '<input id="nomCat" value="' + nomActuel + '">';
  // ProduitsContainer.innerHTML =
  //   '<input id="produitsCat" value="' + ProduitsActuels + '">';
  ProduitsContainer.innerHTML = '<div id="produitsCat' + catId + '"></div>';
  const listProduitsActuel = [];
  Object.values(ProduitsActuels).forEach((produit) => {
    listProduitsActuel.push(produit._id);
  });
  Object.values(ProductOptions).forEach((checkbox) => {
    if (listProduitsActuel.includes(checkbox.firstChild.value)) {
      checkbox.firstChild.setAttribute("checked", 1);
    }
    document.getElementById("produitsCat" + catId).appendChild(checkbox);
  });
  button.innerHTML = "Valider";
  button.onclick = function () {
    const newListProducts = [];
    for (var checkbox of document.getElementsByClassName("checkboxProduct")) {
      if (checkbox.checked) {
        newListProducts.push(checkbox.value);
      }
    }
    // json de modification a envoyer
    const json = {
      category: {
        name: document.getElementById("nomCat").value,
        products: newListProducts,
      },
    };

    let urlCat = apiUrl + "categories/" + catId;

    // requete de modification
    const xhr = new XMLHttpRequest();

    // listen for `load` event
    xhr.onload = () => {
      // print JSON response
      if (xhr.status >= 200 && xhr.status < 300) {
        // parse JSON
        const response = JSON.parse(xhr.responseText);
        console.log(response);
      }
    };

    // open request
    xhr.open("POST", urlCat);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    // send rquest with JSON payload
    xhr.send(JSON.stringify(json));
    // reload de la page
    setTimeout(function () {
      location.reload();
    }, 1000);
  };
}

// fonction d'ajout de produit
(function () {
  document.getElementById("submitproduct").onclick = function () {
    var productName = document.getElementById("NameInput").value;
    var productDescription = document.getElementById("DescriptionInput").value;
    var productPrice = document.getElementById("PrixInput").value;

    const json = {
      product: {
        name: productName,
        description: productDescription,
        price: {
          amount: productPrice,
          taxRate: 20,
        },
      },
    };

    let urlProduct = apiUrl + "products";

    const xhr = new XMLHttpRequest();

    // listen for `load` event
    xhr.onload = () => {
      // print JSON response
      if (xhr.status >= 200 && xhr.status < 300) {
        // parse JSON
        const response = JSON.parse(xhr.responseText);
        console.log(response);
      }
    };

    // open request
    xhr.open("POST", urlProduct);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    // send rquest with JSON payload
    xhr.send(JSON.stringify(json));

    const form = document.getElementById("productform");
    form.style.display = "none";
    // reload de la page
    setTimeout(function () {
      location.reload();
    }, 1000);
  };
})();

// fonction d'ajout de categorie
(function () {
  document.getElementById("submitcategory").onclick = function () {
    var categoryName = document.getElementById("catDesignation").value;

    const selected = [];
    for (var checkbox of document.getElementsByClassName("checkboxProduct")) {
      if (checkbox.checked) {
        selected.push(checkbox.value);
      }
    }

    const json = {
      category: {
        name: categoryName,
        products: selected,
      },
    };

    let urlCategory = apiUrl + "categories";

    const xhr = new XMLHttpRequest();

    // listen for `load` event
    xhr.onload = () => {
      // print JSON response
      if (xhr.status >= 200 && xhr.status < 300) {
        // parse JSON
        const response = JSON.parse(xhr.responseText);
        console.log(response);
      }
    };

    // open request
    xhr.open("POST", urlCategory);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    // send rquest with JSON payload
    xhr.send(JSON.stringify(json));

    const form = document.getElementById("categoryform");
    form.style.display = "none";
    // reload de la page
    setTimeout(function () {
      location.reload();
    }, 1000);
  };
})();
