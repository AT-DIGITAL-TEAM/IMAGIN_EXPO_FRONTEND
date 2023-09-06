// différencier les liens prod / staging
let apiUrl = window.location.href.includes("webflow")
  ? new URL("https://imagin-expo-backend-api.int.at-digital.fr/api/v1/")
  : new URL("https://api.imaginexpo.com/api/v1/");

const ProductOptions = [];

// ****************************** //
// ***Illustration d'evenement*** //
// ****************************** //

// creation du formulaire d'ajout de nouvelle illustration d'evenement
const addEventIlluFormContainer = document.getElementById(
  "addEventIlluFormContainer"
);
const formContainer = document.createElement("div");
formContainer.style.display = "flex";
formContainer.style.width = "100%";

//Gestion input upload file
const fileUploadContainer = document.createElement("div");
fileUploadContainer.style.width = "80%";
const fileUploadInput = document.createElement("input");
const fileUploadLabel = document.createElement("div");
const fileUploadErrorMsg = document.createElement("div");
fileUploadErrorMsg.innerHTML = "Mauvais format";
fileUploadErrorMsg.style.color = "red";
fileUploadErrorMsg.style.display = "none";
fileUploadInput.setAttribute("type", "file");
fileUploadInput.setAttribute("id", "eventIllustrationUploadInput");
fileUploadInput.setAttribute("accept", "image/png, image/jpeg");
// vérification du format du fichier envoyé
fileUploadInput.onchange = function () {
  const inputFile = document.getElementById("eventIllustrationUploadInput");
  const EventImage = inputFile.files[0];
  if (EventImage.type === "image/png" || EventImage.type === "image/jpeg") {
    console.log("bon format");
    fileUploadErrorMsg.style.display = "none";
    // readFile(StandImage);
    proccessData(EventImage);
  } else {
    inputFile.value = "";
    fileUploadErrorMsg.style.display = "block";
  }
};
fileUploadLabel.innerHTML = "Ajouter une image (png/jpeg)";

fileUploadLabel.className = "text-block-53";
fileUploadContainer.appendChild(fileUploadLabel);
fileUploadContainer.appendChild(fileUploadInput);
fileUploadContainer.appendChild(fileUploadErrorMsg);

const createButton = document.createElement("a");
createButton.className = "button addbuttonformproduct";
createButton.style.color = "white";
createButton.style.textDecoration = "none";
createButton.style.cursor = "pointer";
createButton.innerHTML = "Ajouter";
formContainer.appendChild(fileUploadContainer);
formContainer.appendChild(createButton);
addEventIlluFormContainer.appendChild(formContainer);

// affichage du formulaire d'ajout
// const addIllustrationButton = document.getElementById("addIllustrationButton");
// addEventIlluFormContainer.onclick = function () {
//   addEventIlluFormContainer.style.display = "block";
// };

// envoie du formulaire de creation
createButton.onclick = function () {
  if (designImageData) {
    const json = {
      eventIllustration: {
        image: designImageData,
      },
    };

    let urlEventIllustration = apiUrl + "event-illustrations";

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
    xhr.open("POST", urlEventIllustration);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    // send rquest with JSON payload
    xhr.send(JSON.stringify(json));

    // reload de la page
    setTimeout(function () {
      location.reload();
    }, 1000);
  }
};

// récupère et affiche les illustrations d'événements
function getEventIllustrationData() {
  let request = new XMLHttpRequest();

  // Changer l'endpoint en ajoutant + 'newEndpoint'
  let url = apiUrl.toString() + "event-illustrations";

  request.open("GET", url, true);
  request.setRequestHeader("ngrok-skip-browser-warning", 1);

  request.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.eventIllustrations;

    if (request.status >= 200 && request.status < 400) {
      const eventIllustrationContainer = document.getElementById(
        "eventIllustrationList"
      );

      Object.values(data).forEach((illustration) => {
        // vérification de si le produit est pas supprimé
        if (illustration.isDeleted === false) {
          const illustrationElement = document.createElement("div");

          illustrationElement.className = "productlistelement";

          const imgContainer = document.createElement("div");
          imgContainer.style.width = "80%";
          const imgLink = document.createElement("a");
          imgLink.href = illustration.image;
          const image = document.createElement("img");
          image.src = illustration.image;
          image.style.width = "150px";
          imgLink.appendChild(image);
          imgContainer.appendChild(imgLink);
          illustrationElement.appendChild(imgContainer);

          const buttonContainer = document.createElement("div");
          buttonContainer.className = "buttonlistcontainereventillustration";

          const modifier = document.createElement("a");
          modifier.innerHTML = "Modifier";
          modifier.className = "button orangebutton w-button";
          modifier.onclick = function () {
            modifierEventIllustration(illustration._id, imgContainer, modifier);
          };
          buttonContainer.appendChild(modifier);

          const supprimer = document.createElement("a");
          supprimer.innerHTML = "Supprimer";
          supprimer.className = "button redbutton w-button";
          supprimer.onclick = function () {
            supprimerItem(
              "cette illustration",
              "event-illustrations/",
              illustration._id
            );
          };
          buttonContainer.appendChild(supprimer);

          illustrationElement.appendChild(buttonContainer);

          eventIllustrationContainer.appendChild(illustrationElement);
        }
      });
    }
  };

  request.send();
}

(function () {
  getEventIllustrationData();
})();

// fonction de modification d'une illustration
function modifierEventIllustration(id, imageContainer, updateButton) {
  imageContainer.innerHTML = `<div style="width: 80%;"><div class="text-block-53">Ajouter une image (png/jpeg)</div><input id='updateInput${id}' type="file" accept="image/png, image/jpeg"><div id="errorMsg${id}" style="color: red; display: block;">Mauvais format</div></div>`;

  updateButton.innerHTML = "Valider";

  const input = document.getElementById(`updateInput${id}`);
  const ErrorMsg = document.getElementById(`errorMsg${id}`);
  ErrorMsg.style.display = "none";
  input.onchange = function () {
    const EventImage = input.files[0];
    if (EventImage.type === "image/png" || EventImage.type === "image/jpeg") {
      console.log("bon format");
      ErrorMsg.style.display = "none";
      proccessData(EventImage);
    } else {
      input.value = "";
      ErrorMsg.style.display = "block";
    }
  };

  // envoie de la modification
  updateButton.onclick = function () {
    if (designImageData) {
      // json de la modification
      const json = {
        eventIllustration: {
          image: designImageData,
        },
      };

      let urlEventIllustration = apiUrl + "event-illustrations/" + id;

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
      xhr.open("POST", urlEventIllustration);

      // set `Content-Type` header
      xhr.setRequestHeader("Content-Type", "application/json");

      // send rquest with JSON payload
      xhr.send(JSON.stringify(json));
    }

    // reload de la page
    setTimeout(function () {
      location.reload();
    }, 1000);
  };
}

// ********************************************* //
// ***Illustration de description d'evenement*** //
// ********************************************* //

// creation du formulaire d'ajout de nouvelle illustration d'evenement
const addEventDescIlluFormContainer = document.getElementById(
  "addEventDescIlluFormContainer"
);
const formDescIlluContainer = document.createElement("div");
formDescIlluContainer.style.display = "flex";
formDescIlluContainer.style.width = "100%";

//Gestion input upload file
const fileUploadDescIlluContainer = document.createElement("div");
fileUploadDescIlluContainer.style.width = "80%";
const fileUploadDescIlluInput = document.createElement("input");
const fileUploadDescIlluLabel = document.createElement("div");
const fileUploadDescIlluErrorMsg = document.createElement("div");
fileUploadDescIlluErrorMsg.innerHTML = "Mauvais format";
fileUploadDescIlluErrorMsg.style.color = "red";
fileUploadDescIlluErrorMsg.style.display = "none";
fileUploadDescIlluInput.setAttribute("type", "file");
fileUploadDescIlluInput.setAttribute(
  "id",
  "eventDescriptionIllustrationUploadInput"
);
fileUploadDescIlluInput.setAttribute("accept", "image/png, image/jpeg");
// vérification du format du fichier envoyé
fileUploadDescIlluInput.onchange = function () {
  const inputFile = document.getElementById(
    "eventDescriptionIllustrationUploadInput"
  );
  const EventImage = inputFile.files[0];
  if (EventImage.type === "image/png" || EventImage.type === "image/jpeg") {
    console.log("bon format");
    fileUploadDescIlluErrorMsg.style.display = "none";
    // readFile(StandImage);
    proccessData(EventImage);
  } else {
    inputFile.value = "";
    fileUploadDescIlluErrorMsg.style.display = "block";
  }
};
fileUploadDescIlluLabel.innerHTML = "Ajouter une image (png/jpeg)";

fileUploadDescIlluLabel.className = "text-block-53";
fileUploadDescIlluContainer.appendChild(fileUploadDescIlluLabel);
fileUploadDescIlluContainer.appendChild(fileUploadDescIlluInput);
fileUploadDescIlluContainer.appendChild(fileUploadDescIlluErrorMsg);

const createButtonDescIllu = document.createElement("a");
createButtonDescIllu.className = "button addbuttonformproduct";
createButtonDescIllu.style.color = "white";
createButtonDescIllu.style.textDecoration = "none";
createButtonDescIllu.style.cursor = "pointer";
createButtonDescIllu.innerHTML = "Ajouter";
formDescIlluContainer.appendChild(fileUploadDescIlluContainer);
formDescIlluContainer.appendChild(createButtonDescIllu);
addEventDescIlluFormContainer.appendChild(formDescIlluContainer);

// envoie du formulaire de creation
createButtonDescIllu.onclick = function () {
  if (designImageData) {
    const json = {
      eventDescriptionIllustration: {
        image: designImageData,
      },
    };

    let urlEventDescriptionIllustration =
      apiUrl + "event-description-illustrations";

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
    xhr.open("POST", urlEventDescriptionIllustration);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    // send rquest with JSON payload
    xhr.send(JSON.stringify(json));

    // reload de la page
    setTimeout(function () {
      location.reload();
    }, 1000);
  }
};

// récupère et affiche les illustrations d'événements
function getEventDescriptionIllustrationData() {
  let request = new XMLHttpRequest();

  // Changer l'endpoint en ajoutant + 'newEndpoint'
  let url = apiUrl.toString() + "event-description-illustrations";

  request.open("GET", url, true);
  request.setRequestHeader("ngrok-skip-browser-warning", 1);

  request.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.eventDescriptionIllustrations;

    if (request.status >= 200 && request.status < 400) {
      const eventDescriptionIllustrationContainer = document.getElementById(
        "eventDescriptionIllustrationContainer"
      );

      Object.values(data).forEach((illustration) => {
        // vérification de si le produit est pas supprimé
        if (illustration.isDeleted === false) {
          const illustrationElement = document.createElement("div");

          illustrationElement.className = "productlistelement";

          const imgContainer = document.createElement("div");
          imgContainer.style.width = "80%";
          const imgLink = document.createElement("a");
          imgLink.href = illustration.image;
          const image = document.createElement("img");
          image.src = illustration.image;
          image.style.width = "150px";
          imgLink.appendChild(image);
          imgContainer.appendChild(imgLink);
          illustrationElement.appendChild(imgContainer);

          const buttonContainer = document.createElement("div");
          buttonContainer.className = "buttonlistcontainereventillustration";

          const modifier = document.createElement("a");
          modifier.innerHTML = "Modifier";
          modifier.className = "button orangebutton w-button";
          modifier.onclick = function () {
            modifierEventDescriptionIllustration(
              illustration._id,
              imgContainer,
              modifier
            );
          };
          buttonContainer.appendChild(modifier);

          const supprimer = document.createElement("a");
          supprimer.innerHTML = "Supprimer";
          supprimer.className = "button redbutton w-button";
          supprimer.onclick = function () {
            supprimerItem(
              "cette illustration",
              "event-description-illustrations/",
              illustration._id
            );
          };
          buttonContainer.appendChild(supprimer);

          illustrationElement.appendChild(buttonContainer);

          eventDescriptionIllustrationContainer.appendChild(
            illustrationElement
          );
        }
      });
    }
  };

  request.send();
}

(function () {
  getEventDescriptionIllustrationData();
})();

// fonction de modification d'une illustration
function modifierEventDescriptionIllustration(
  id,
  imageContainer,
  updateButton
) {
  imageContainer.innerHTML = `<div style="width: 80%;"><div class="text-block-53">Ajouter une image (png/jpeg)</div><input id='updateInput${id}' type="file" accept="image/png, image/jpeg"><div id="errorMsg${id}" style="color: red; display: block;">Mauvais format</div></div>`;

  updateButton.innerHTML = "Valider";

  const input = document.getElementById(`updateInput${id}`);
  const ErrorMsg = document.getElementById(`errorMsg${id}`);
  ErrorMsg.style.display = "none";
  input.onchange = function () {
    const EventImage = input.files[0];
    if (EventImage.type === "image/png" || EventImage.type === "image/jpeg") {
      console.log("bon format");
      ErrorMsg.style.display = "none";
      proccessData(EventImage);
    } else {
      input.value = "";
      ErrorMsg.style.display = "block";
    }
  };

  // envoie de la modification
  updateButton.onclick = function () {
    if (designImageData) {
      // json de la modification
      const json = {
        eventDescriptionIllustration: {
          image: designImageData,
        },
      };

      let urlEventDescriptionIllustration =
        apiUrl + "event-description-illustrations/" + id;

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
      xhr.open("POST", urlEventDescriptionIllustration);

      // set `Content-Type` header
      xhr.setRequestHeader("Content-Type", "application/json");

      // send rquest with JSON payload
      xhr.send(JSON.stringify(json));
    }

    // reload de la page
    setTimeout(function () {
      location.reload();
    }, 1000);
  };
}

// ****************************** //
// *****Exemples de produits***** //
// ****************************** //

const imageExampleProductContainer = document.getElementById(
  "imageExampleProductContainer"
);

const nameExampleProductFormInput = document.getElementById(
  "NameExampleProductInput"
);
const descriptionExampleProductFormInput = document.getElementById(
  "DescriptionExampleProductInput"
);

//Gestion input upload file
const fileUploadExampleProductInput = document.createElement("input");
const fileUploadExampleProductLabel = document.createElement("div");
const fileUploadExampleProductErrorMsg = document.createElement("div");
fileUploadExampleProductErrorMsg.innerHTML = "Mauvais format";
fileUploadExampleProductErrorMsg.style.color = "red";
fileUploadExampleProductErrorMsg.style.display = "none";
fileUploadExampleProductInput.setAttribute("type", "file");
fileUploadExampleProductInput.setAttribute("accept", "image/png, image/jpeg");
// vérification du format du fichier envoyé
fileUploadExampleProductInput.onchange = function () {
  const inputFile = document.querySelector('input[type="file"]');
  const EventImage = inputFile.files[0];
  if (EventImage.type === "image/png" || EventImage.type === "image/jpeg") {
    console.log("bon format");
    fileUploadExampleProductErrorMsg.style.display = "none";
    // readFile(StandImage);
    proccessData(EventImage);
  } else {
    inputFile.value = "";
    fileUploadExampleProductErrorMsg.style.display = "block";
  }
};
fileUploadExampleProductLabel.innerHTML = "Ajouter une image (png/jpeg)";

fileUploadExampleProductLabel.className = "text-block-53";
imageExampleProductContainer.appendChild(fileUploadExampleProductLabel);
imageExampleProductContainer.appendChild(fileUploadExampleProductInput);
imageExampleProductContainer.appendChild(fileUploadExampleProductErrorMsg);

const submitExampleProductButton = document.getElementById(
  "submitExampleProductButton"
);
submitExampleProductButton.onclick = function (e) {
  e.preventDefault();
  var exampleProductName = nameExampleProductFormInput.value;
  var exampleProductDescription = descriptionExampleProductFormInput.value;
  var exampleProductIllustration = designImageData;

  const json = {
    productExample: {
      name: exampleProductName,
      description: exampleProductDescription,
      image: exampleProductIllustration,
    },
  };

  let urlProductExample = apiUrl + "product-examples";

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
  xhr.open("POST", urlProductExample);

  // set `Content-Type` header
  xhr.setRequestHeader("Content-Type", "application/json");

  // send rquest with JSON payload
  xhr.send(JSON.stringify(json));

  // reload de la page
  setTimeout(function () {
    location.reload();
  }, 1000);
};

// récupère et affiche les produits dans la liste
function getExampleProductData() {
  let request = new XMLHttpRequest();

  // Changer l'endpoint en ajoutant + 'newEndpoint'
  let url = apiUrl.toString() + "product-examples";

  request.open("GET", url, true);
  request.setRequestHeader("ngrok-skip-browser-warning", 1);

  request.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.productExamples;

    if (request.status >= 200 && request.status < 400) {
      const productExampleContainer =
        document.getElementById("productExampleList");

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

          const imgContainer = document.createElement("div");
          imgContainer.style.width = "23%";
          const imgLink = document.createElement("a");
          imgLink.href = product.image;
          const image = document.createElement("img");
          image.src = product.image;
          image.style.width = "150px";
          imgLink.appendChild(image);
          imgContainer.appendChild(imgLink);
          productElement.appendChild(imgContainer);

          const buttonContainer = document.createElement("div");
          buttonContainer.className = "buttonlistcontainerproduct";

          const dupliquer = document.createElement("a");
          dupliquer.innerHTML = "Dupliquer";
          dupliquer.className = "button bluebutton w-button";
          dupliquer.onclick = function () {
            dupliquerExampleProduct(
              product.name,
              product.description,
              product.image
            );
          };
          buttonContainer.appendChild(dupliquer);

          const modifier = document.createElement("a");
          modifier.innerHTML = "Modifier";
          modifier.className = "button orangebutton w-button";
          modifier.onclick = function () {
            modifierExampleProduct(
              product._id,
              nom,
              product.name,
              dimensions,
              product.description,
              imgContainer,
              product.image,
              modifier
            );
          };
          buttonContainer.appendChild(modifier);

          const supprimer = document.createElement("a");
          supprimer.innerHTML = "Supprimer";
          supprimer.className = "button redbutton w-button";
          supprimer.onclick = function () {
            supprimerItem(product.name, "product-examples/", product._id);
          };
          buttonContainer.appendChild(supprimer);

          productElement.appendChild(buttonContainer);

          productExampleContainer.appendChild(productElement);
        }
      });
    }
  };

  request.send();
}

(function () {
  getExampleProductData();
})();

// fonction de modification d'un produit
function modifierExampleProduct(
  id,
  nameContainer,
  currentName,
  descriptionContainer,
  currentDescription,
  imageContainer,
  currentImage,
  updateButton
) {
  nameContainer.innerHTML = `<input id="nameInput${id}" type="text" value="${currentName}">`;
  descriptionContainer.innerHTML = `<input id="descriptionInput${id}" type="text" value="${currentDescription}">`;
  imageContainer.innerHTML = `<div style="width: 80%;"><div class="text-block-53">Ajouter une image (png/jpeg)</div><input id='updateInput${id}' type="file" accept="image/png, image/jpeg"><div id="errorMsg${id}" style="color: red; display: block;">Mauvais format</div></div>`;

  updateButton.innerHTML = "Valider";

  designImageData = currentImage;

  const input = document.getElementById(`updateInput${id}`);
  const ErrorMsg = document.getElementById(`errorMsg${id}`);
  ErrorMsg.style.display = "none";
  input.onchange = function () {
    const EventImage = input.files[0];
    if (EventImage.type === "image/png" || EventImage.type === "image/jpeg") {
      console.log("bon format");
      ErrorMsg.style.display = "none";
      proccessData(EventImage);
    } else {
      input.value = "";
      ErrorMsg.style.display = "block";
    }
  };

  // envoie de la modification
  updateButton.onclick = function () {
    // json de la modification
    const json = {
      productExample: {
        name: document.getElementById(`nameInput${id}`).value,
        description: document.getElementById(`descriptionInput${id}`).value,
        image: designImageData,
      },
    };

    let urlExampleProduct = apiUrl + "product-examples/" + id;

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
    xhr.open("POST", urlExampleProduct);

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
function dupliquerExampleProduct(name, description, image) {
  document.getElementById("exampleproductform").style.display = "block";
  nameExampleProductFormInput.value = name;
  descriptionExampleProductFormInput.value = description;
  designImageData = image;
}

// ****************************** //
// **********Produits************ //
// ****************************** //

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

// ****************************** //
// **********Catégories********** //
// ****************************** //

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

var designImageData = "";

// encodage de l'image chargée
function readFile(EventImage) {
  if (!EventImage) return;

  const FR = new FileReader();

  return new Promise((resolve) => {
    FR.onload = (ev) => {
      resolve(ev.target.result);
    };
    FR.readAsDataURL(EventImage);
  });
}

async function proccessData(EventImage) {
  designImageData = await readFile(EventImage);
}
