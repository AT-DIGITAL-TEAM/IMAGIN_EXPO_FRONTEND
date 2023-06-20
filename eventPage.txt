let apiUrl = new URL(
  "https://imagin-expo-backend-api.int.at-digital.fr/api/v1/"
);

// Recuperation des containers où mettre les infos détaillées de l'event
const HeadingEvent = document.getElementById("HeadingEvent");
const eventCode = document.getElementById("eventCode");
const eventDescription = document.getElementById("eventDescription");
const eventDateDebut = document.getElementById("eventDateDebut");
const eventDateFin = document.getElementById("eventDateFin");
const eventLocation = document.getElementById("eventLocation");
const eventEmails = document.getElementById("eventEmails");
const eventPhone = document.getElementById("eventPhone");
const eventCategories = document.getElementById("eventCategories");
const eventExcludedProducts = document.getElementById("eventExcludedProducts");
const eventOrderLimit = document.getElementById("eventOrderLimit");
const eventFurnitureOption = document.getElementById("eventFurnitureOption");
const eventHallOption = document.getElementById("eventHallOption");
const eventPaymentMethod = document.getElementById("eventPaymentMethod");
const eventButtonModifier = document.getElementById("ModifButtonEvent");
const eventButtonDelete = document.getElementById("DeleteButtonEvent");
const eventButtonExtract = document.getElementById("ExtractButtonEvent");
const eventButtonDuplicate = document.getElementById("DuplicateButtonEvent");
const cancelCheckProductsItem = document.getElementById(
  "cancelCheckProductsItem"
);
var categoriesSelected = [];
var excludedProductSelected = [];

// Récupération des containers du popup d'ajout ou de modif de l'event
const AddEventGlobalButton = document.getElementById("AddEventGlobalButton");
const CatExcludedContainer = document.getElementById("CatExcludedContainer");
const CatChoosedContainer = document.getElementById("CatChoosedContainer");
const textTopAddEventContainer = document.getElementById(
  "textTopAddEventContainer"
);
const ProdExcludedContainer = document.getElementById("ProdExcludedContainer");
const ProdChoosedContainer = document.getElementById("ProdChoosedContainer");
const ChooseProductContainerGlobal = document.getElementById(
  "ChooseProductContainer"
);
var ExcludedProducts = Object;

const AddEventButton = document.getElementById("AddEventButton");
const PopUpEventName = document.getElementById("PopUpEventName");
const PopUpEventCode = document.getElementById("PopUpEventCode");
const PopUpEventDescription = document.getElementById("PopUpEventDescription");
const PopUpEventStart = document.getElementById("PopUpEventStart");
const PopUpEventEnd = document.getElementById("PopUpEventEnd");
const PopUpEventLocation = document.getElementById("PopUpEventLocation");
const PopUpEventEmail = document.getElementById("PopUpEventEmail");
const PopUpEventPhone = document.getElementById("PopUpEventPhone");
const PopUpEventOrderLimit = document.getElementById("PopUpEventOrderLimit");
const PopUpEventFurnitureOption = document.getElementById(
  "PopUpEventFurnitureOption"
);
const PopUpEventHallOption = document.getElementById("PopUpEventHallOption");
const PopUpDefaultPaymentMethod = document.getElementById(
  "PopUpDefaultPaymentMethod"
);

let eventSelected = "";

// const AllCatChoosed = CatChoosedContainer.children;
// const AllCatExcluded = CatExcludedContainer.children;

// fonction qui renvoie la liste des events
function getData() {
  let request = new XMLHttpRequest();

  // Changer l'endpoint en ajoutant + 'newEndpoint'
  let url = apiUrl.toString() + "events";

  request.open("GET", url, true);
  request.setRequestHeader("ngrok-skip-browser-warning", 1);

  request.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.events;

    if (request.status >= 200 && request.status < 400) {
      const eventContainer = document.getElementById("eventListContainer");

      // affichage de tous les events dans un div cliquable avec quelques infos importantes
      Object.values(data).forEach((event) => {
        // vérification de si l'event n'est pas supprimé
        if (event.isDeleted === false) {
          const eventElement = document.createElement("div");

          eventElement.className = "eventresume";

          const nom = document.createElement("p");
          nom.innerHTML = "<strong>" + event.name;
          +"</strong>";
          nom.style.marginBottom = "0px";
          eventElement.appendChild(nom);
          const codeEvent = document.createElement("p");
          codeEvent.innerHTML = "<u>Code :</u> " + event.eventCode;
          codeEvent.style.marginBottom = "0px";
          eventElement.appendChild(codeEvent);
          const date = document.createElement("p");
          date.innerHTML =
            "<u>Date :</u> " +
            Intl.DateTimeFormat("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(event.beginAt));
          date.style.marginBottom = "0px";
          eventElement.appendChild(date);
          const locationEvent = document.createElement("p");
          locationEvent.innerHTML =
            "<u>Lieu :</u> " + event.location.formattedAddress;
          locationEvent.style.marginBottom = "0px";
          eventElement.appendChild(locationEvent);

          const Allevents = document.getElementsByClassName("eventresume");

          // Fonction de display du détail de l'event séléctionné dans les containers
          eventElement.onclick = function () {
            eventSelected = event.name;
            eventCategories.innerHTML = "";
            eventExcludedProducts.innerHTML = "";
            HeadingEvent.innerHTML = event.name;
            eventCode.innerHTML = event.eventCode;
            eventEmails.innerHTML = event.emails;
            eventPhone.innerHTML = event.phoneNumber;
            eventDescription.innerHTML = event.description;
            eventFurnitureOption.innerHTML = event.furnitureOption
              ? "Activée"
              : "Désactivée";
            eventHallOption.innerHTML = event.hallOption
              ? "Activée"
              : "Désactivée";
            event.defaultPaymentMethod === "online"
              ? (eventPaymentMethod.innerHTML = "Oui")
              : (eventPaymentMethod.innerHTML = "Non");
            eventDateDebut.innerHTML = Intl.DateTimeFormat("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(event.beginAt));
            eventDateFin.innerHTML = Intl.DateTimeFormat("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(event.endAt));
            eventLocation.innerHTML = event.location.formattedAddress;
            eventOrderLimit.innerHTML = Intl.DateTimeFormat("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(event.standOrderExpirationDate));
            Object.values(Allevents).forEach((event) => {
              event.style.background = "#f2f2f2";
            });
            eventElement.style.background = "#e3e3e3";
            Object.values(event.categories).forEach((category) => {
              eventCategories.innerHTML += category.name + ", ";
            });
            Object.values(event.excludedProducts).forEach((excludedProduct) => {
              eventExcludedProducts.innerHTML += excludedProduct.name + ", ";
            });
            eventButtonDelete.onclick = function () {
              supprimerevent(event.name, event._id);
            };
            eventButtonModifier.onclick = function () {
              modifierevent(
                event._id,
                event.name,
                event.eventCode,
                event.description,
                event.beginAt,
                event.endAt,
                event.emails,
                event.phoneNumber,
                event.location.formattedAddress,
                event.standOrderExpirationDate,
                event.categories,
                event.excludedProducts,
                event.furnitureOption,
                event.hallOption,
                event.defaultPaymentMethod
              );
            };
            eventButtonDuplicate.onclick = function () {
              console.log("clicked");
              dupliquerevent(
                event.name,
                event.eventCode,
                event.description,
                event.beginAt,
                event.endAt,
                event.emails,
                event.phoneNumber,
                event.location.formattedAddress,
                event.standOrderExpirationDate,
                event.categories,
                event.excludedProducts,
                event.furnitureOption,
                event.hallOption,
                event.defaultPaymentMethod
              );
            };
            // fonction d'extraction des demandes liées à un événement
            eventButtonExtract.onclick = () => {
              let request = new XMLHttpRequest();

              // Changer l'endpoint en ajoutant + 'newEndpoint'
              let url =
                apiUrl.toString() + "/event-requests-from-event/" + event._id;

              request.open("GET", url, true);
              request.setRequestHeader("ngrok-skip-browser-warning", 1);

              request.onload = function () {
                let dataBrut = JSON.parse(this.response);
                let data = dataBrut.eventRequest;

                if (request.status >= 200 && request.status < 400) {
                  extractData(data);
                }
              };
              request.send();
            };
          };

          // ajout de ces éléments du plus récent au plus ancien
          eventContainer.insertBefore(eventElement, eventContainer.firstChild);
        }
      });
    }
  };
  request.send();
}

// fonction qui ajoute toute les catégories dans le popup des catégrories
function getCatData() {
  AddEventButton.value = "Ajouter";

  let request = new XMLHttpRequest();

  // Changer l'endpoint en ajoutant + 'newEndpoint'
  let url = apiUrl.toString() + "categories";

  request.open("GET", url, true);
  request.setRequestHeader("ngrok-skip-browser-warning", 1);

  request.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.categories;

    if (request.status >= 200 && request.status < 400) {
      Object.values(data).forEach((category) => {
        if (!category.isDeleted) {
          // Display catégories exclues
          const categorySelect = document.createElement("div");
          categorySelect.setAttribute("id", category._id + "excluded");
          categorySelect.style.display = "none";
          categorySelect.style.justifyContent = "space-between";
          const categoryName = document.createElement("p");
          categoryName.innerHTML = category.name;
          categoryName.className = "catbutton";
          // bouton permettant de faire passer la catégorie de exclue à choisie
          const AddCat = document.createElement("p");
          AddCat.innerHTML = "+";
          AddCat.className = "plusbutton";
          AddCat.onclick = function () {
            categorySelect.style.display = "none";
            categoryChoosed.style.display = "flex";
            if (!(categoriesSelected.indexOf(category._id) > -1)) {
              categoriesSelected.push(category._id);
            }
          };
          categorySelect.appendChild(categoryName);
          categorySelect.appendChild(AddCat);
          CatExcludedContainer.appendChild(categorySelect);

          // Display catégories choisies
          const categoryChoosed = document.createElement("div");
          categoryChoosed.setAttribute("id", category._id + "choosed");
          categoryChoosed.style.display = "flex";
          categoryChoosed.style.justifyContent = "space-between";
          const categroyChoosedTextDiv = document.createElement("div");
          categroyChoosedTextDiv.className = "categroychoosedtextdiv";
          const categoryChoosedName = document.createElement("p");
          categoryChoosedName.innerHTML = category.name;
          categoryChoosedName.className = "catchoosedname";
          const categoryChoosedV = document.createElement("p");
          categoryChoosedV.innerHTML = "V";
          categoryChoosedV.className = "categoryv";
          categoryChoosedV.onclick = function () {
            (function () {
              getProductFromCategoryData(category.products, ExcludedProducts);
            })();
          };
          categroyChoosedTextDiv.appendChild(categoryChoosedName);
          categroyChoosedTextDiv.appendChild(categoryChoosedV);
          // bouton permettant de faire passer la catégorie de choisie à exclue
          const removeCat = document.createElement("p");
          removeCat.innerHTML = "-";
          removeCat.className = "minusbutton";
          removeCat.onclick = function () {
            categoryChoosed.style.display = "none";
            categorySelect.style.display = "flex";
            if (categoriesSelected.indexOf(category._id) > -1) {
              categoriesSelected = categoriesSelected.filter(
                (categorySelected) => categorySelected != category._id
              );
            }
          };
          categoryChoosed.appendChild(categroyChoosedTextDiv);
          categoryChoosed.appendChild(removeCat);
          CatChoosedContainer.appendChild(categoryChoosed);
          if (!(categoriesSelected.indexOf(category._id) > -1)) {
            categoriesSelected.push(category._id);
          }
        }
      });
    }
  };
  request.send();
}

// affiche le popup des produits de la catégorie séléctionnée
function getProductFromCategoryData(listProducts, excludedProducts) {
  // affichage du popup
  ChooseProductContainerGlobal.style.display = "block";
  // vidage des listes des produits exclus et choisis
  Object.values(listProducts).forEach((product) => {
    cancelCheckProductsItem.onclick = function () {
      ProdExcludedContainer.innerHTML = "";
      ProdChoosedContainer.innerHTML = "";
    };

    // Display des produits choisis
    const ProductSelect = document.createElement("div");
    ProductSelect.setAttribute("id", product._id + "choosedProd");
    ProductSelect.style.display = "flex";
    ProductSelect.style.justifyContent = "space-between";
    const ProductName = document.createElement("p");
    ProductName.innerHTML = product.name;
    ProductName.className = "catbutton";
    const RemoveProd = document.createElement("p");
    RemoveProd.innerHTML = "-";
    RemoveProd.className = "minusbutton";
    RemoveProd.onclick = function () {
      ProductSelect.style.display = "none";
      ProductExcludedSelect.style.display = "flex";
      if (!(excludedProductSelected.indexOf(product._id) > -1)) {
        excludedProductSelected.push(product._id);
      }
    };
    ProductSelect.appendChild(ProductName);
    ProductSelect.appendChild(RemoveProd);
    ProdChoosedContainer.appendChild(ProductSelect);

    // Display des produits exclus
    const ProductExcludedSelect = document.createElement("div");
    ProductExcludedSelect.setAttribute("id", product._id + "excludedProd");
    ProductExcludedSelect.style.display = "none";
    ProductExcludedSelect.style.justifyContent = "space-between";
    const ProductExcludedName = document.createElement("p");
    ProductExcludedName.innerHTML = product.name;
    ProductExcludedName.className = "catbutton";
    const AddProd = document.createElement("p");
    AddProd.innerHTML = "+";
    AddProd.className = "plusbutton";
    AddProd.onclick = function () {
      ProductExcludedSelect.style.display = "none";
      ProductSelect.style.display = "flex";
      if (excludedProductSelected.indexOf(product._id) > -1) {
        excludedProductSelected = excludedProductSelected.filter(
          (prod) => prod != product._id
        );
      }
    };
    ProductExcludedSelect.appendChild(ProductExcludedName);
    ProductExcludedSelect.appendChild(AddProd);
    ProdExcludedContainer.appendChild(ProductExcludedSelect);
  });

  // Modification de l'affichage du dessus si c'est un event qui possède déjà des produits exclus
  // va passer certains produits en exclus et d'autres en choisis
  if (excludedProducts) {
    const alreadycheckedProdChoosed = [];
    const alreadycheckedProdExcluded = [];
    Object.values(excludedProducts).forEach((product) => {
      Object.values(ProdChoosedContainer.children).forEach((child) => {
        if (
          child.id != product._id + "choosedProd" &&
          alreadycheckedProdChoosed.includes(child) == false
        ) {
          child.style.display = "flex";
        } else {
          child.style.display = "none";
          if (!(alreadycheckedProdChoosed.indexOf(child) > -1)) {
            alreadycheckedProdChoosed.push(child);
          }
        }
      });
      Object.values(ProdExcludedContainer.children).forEach((child) => {
        if (
          child.id != product._id + "excludedProd" &&
          alreadycheckedProdExcluded.includes(child) == false
        ) {
          child.style.display = "none";
        } else {
          child.style.display = "flex";
          if (!(excludedProductSelected.indexOf(product._id) > -1)) {
            excludedProductSelected.push(product._id);
          }
          console.log(excludedProductSelected);
          if (!(alreadycheckedProdExcluded.indexOf(child) > -1)) {
            alreadycheckedProdExcluded.push(child);
          }
        }
      });
    });
  }
}

(function () {
  getCatData();
})();

// fonction de suppression de l'event
function supprimerevent(element, idEvent) {
  // affiche le popup pour confirmer la suppression
  const deleteItemContainer = document.getElementById("DeleteItemContainer");
  deleteItemContainer.style.display = "block";
  const textDeleteVerif = document.getElementById("textDeleteVerif");
  textDeleteVerif.innerHTML =
    "Êtes-vous sûr de vouloir supprimer <strong>" + element + "</strong> ?";
  document.getElementById("cancelDeleteItem").onclick = function () {
    deleteItemContainer.style.display = "none";
  };
  const deleteButton = document.getElementById("deleteItemButton");
  // si confirmation : envoie de la requete delete
  deleteButton.onclick = function () {
    const xhr = new XMLHttpRequest();

    const url = apiUrl.toString() + "events/" + idEvent;
    console.log(url);

    // open request
    xhr.open("DELETE", url);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send();

    deleteItemContainer.style.display = "none";
    // rechargement de la page après un cours délai
    setTimeout(function () {
      location.reload();
    }, 1000);
  };
}

// fonction qui change les string en date
function strToDate(dtStr) {
  if (!dtStr) return null;
  let dateParts = dtStr.split("/");
  let timeParts = dateParts[2].split(" ")[1].split(":");
  dateParts[2] = dateParts[2].split(" ")[0];
  // month is 0-based, that's why we need dataParts[1] - 1
  return (dateObject = new Date(
    +dateParts[2],
    dateParts[1] - 1,
    +dateParts[0],
    timeParts[0],
    timeParts[1]
  ));
}

// fonction de modification de l'event
function modifierevent(
  id,
  nom,
  code,
  description,
  debut,
  fin,
  email,
  phone,
  lieu,
  OrderLimit,
  categories,
  excludedProducts,
  furnitureOption,
  hallOption,
  defaultPaymentMethod
) {
  ExcludedProducts = excludedProducts;
  excludedProductSelected = [];
  Object.values(excludedProducts).forEach((product) => {
    excludedProductSelected.push(product._id);
  });

  // rempli le popup de modification avec les valeur de l'event
  AddEventButton.value = "Modifier";
  PopUpEventName.value = nom;
  PopUpEventCode.value = code;
  PopUpEventEmail.value = email;
  PopUpEventPhone.value = phone;
  PopUpEventFurnitureOption.checked = furnitureOption;
  PopUpEventHallOption.checked = hallOption;
  tinyMCE.activeEditor.setContent(description);
  PopUpEventStart.value = Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(debut));
  PopUpEventEnd.value = Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(fin));
  PopUpEventLocation.value = lieu;
  PopUpEventOrderLimit.value = Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(OrderLimit));
  PopUpDefaultPaymentMethod.value = defaultPaymentMethod;
  textTopAddEventContainer.innerHTML = "Modification de l'événement " + nom;

  const alreadycheckedCatChoosed = [];
  const alreadycheckedCatExcluded = [];

  // affiche les catégories en fonction du fait qu'elles soient exclues ou choisies
  Object.values(categories).forEach((category) => {
    Object.values(CatChoosedContainer.children).forEach((child) => {
      if (
        child.id != category._id + "choosed" &&
        alreadycheckedCatChoosed.includes(child) == false
      ) {
        child.style.display = "none";
        if (categoriesSelected.indexOf(child.id.replace("choosed", "")) > -1) {
          categoriesSelected = categoriesSelected.filter(
            (categorySelected) =>
              categorySelected != child.id.replace("choosed", "")
          );
        }
      } else {
        child.style.display = "flex";
        if (
          !(categoriesSelected.indexOf(child.id.replace("choosed", "")) > -1)
        ) {
          categoriesSelected.push(child.id.replace("choosed", ""));
        }
        if (!(alreadycheckedCatChoosed.indexOf(child) > -1)) {
          alreadycheckedCatChoosed.push(child);
        }
      }
    });
    Object.values(CatExcludedContainer.children).forEach((child) => {
      if (
        child.id != category._id + "excluded" &&
        alreadycheckedCatExcluded.includes(child) == false
      ) {
        child.style.display = "flex";
      } else {
        child.style.display = "none";
        if (!(alreadycheckedCatExcluded.indexOf(child) > -1)) {
          alreadycheckedCatExcluded.push(child);
        }
      }
    });
  });

  // Fonction pour parametrer le bouton d'envoie du formulaire DE MODIFICATION
  AddEventButton.onclick = function (e) {
    e.preventDefault();

    //vérification du codeEvent
    let pattern = /\d\d\d\d-[a-zA-Z]+-[a-zA-Z]+/i;
    if (!pattern.test(PopUpEventCode.value)) {
      document.getElementById("ErrorSentForm").style.display = "block";
      document.getElementById("ErrorSentForm").innerHTML =
        "Le code doit être au format 0000-MANIFESTATION-VILLE";
      return;
    }

    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isEmailValid = true;
    const emails = PopUpEventEmail.value.split(",").map((mail) => mail.trim());
    emails.map((email) => {
      if (!emailPattern.test(email)) {
        document.getElementById("ErrorSentForm").style.display = "block";
        document.getElementById("ErrorSentForm").innerHTML =
          "Les emails doivent être corrects et séparés par une virgule";
        isEmailValid = false;
        return;
      }
    });

    if (!isEmailValid) return;

    // json avec le contenu à envoyer en post
    const json = {
      event: {
        name: PopUpEventName.value,
        eventCode: PopUpEventCode.value,
        description: tinyMCE.get("PopUpEventDescription").getContent(),
        standOrderExpirationDate: strToDate(
          PopUpEventOrderLimit.value.replace("@", " ")
        ),
        beginAt: strToDate(PopUpEventStart.value.replace("@", " ")),
        endAt: strToDate(PopUpEventEnd.value.replace("@", " ")),
        location: {
          formattedAddress: PopUpEventLocation.value,
        },
        categories: categoriesSelected,
        excludedProducts: excludedProductSelected,
        emails: PopUpEventEmail.value,
        phoneNumber: PopUpEventPhone.value,
        furnitureOption: PopUpEventFurnitureOption.checked,
        hallOption: PopUpEventHallOption.checked,
        defaultPaymentMethod: PopUpDefaultPaymentMethod.value,
      },
    };

    let urlEvent = apiUrl + "events/" + id;

    const xhr = new XMLHttpRequest();

    // listen for `load` event
    xhr.onload = () => {
      // print JSON response
      if (xhr.status >= 200 && xhr.status < 300) {
        // parse JSON
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        // reload de la page
        setTimeout(function () {
          location.reload();
        }, 1000);
      } else {
        document.getElementById("ErrorSentForm").style.display = "block";
        document.getElementById("ErrorSentForm").innerHTML =
          "Veuillez correctement remplir le formulaire";
      }
    };

    // open request
    xhr.open("POST", urlEvent);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    console.log(JSON.stringify(json));

    // send rquest with JSON payload
    xhr.send(JSON.stringify(json));
  };
}

// fonction de duplication de l'event
function dupliquerevent(
  nom,
  code,
  description,
  debut,
  fin,
  email,
  phone,
  lieu,
  OrderLimit,
  categories,
  excludedProducts,
  furnitureOption,
  hallOption,
  defaultPaymentMethod
) {
  console.log("clicked2");
  ExcludedProducts = excludedProducts;
  excludedProductSelected = [];
  Object.values(excludedProducts).forEach((product) => {
    excludedProductSelected.push(product._id);
  });

  // rempli le popup de création d'un nouvel event avec les infos de l'event à dupliquer
  AddEventButton.value = "Dupliquer";
  PopUpEventCode.value = code;
  PopUpEventEmail.value = email;
  PopUpEventPhone.value = phone;
  PopUpEventFurnitureOption.checked = furnitureOption;
  PopUpEventHallOption.checked = hallOption;
  tinyMCE.activeEditor.setContent(description);
  PopUpEventStart.value = Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(debut));
  PopUpEventEnd.value = Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(fin));
  PopUpEventLocation.value = lieu;
  PopUpEventOrderLimit.value = Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(OrderLimit));
  PopUpDefaultPaymentMethod.value = defaultPaymentMethod;
  textTopAddEventContainer.innerHTML = "Duplication de l'événement " + nom;

  const alreadycheckedCatChoosed = [];
  const alreadycheckedCatExcluded = [];

  // affiche les catégories en fonction du fait qu'elles soient exclues ou choisies à partir de l'event dupliqué
  Object.values(categories).forEach((category) => {
    Object.values(CatChoosedContainer.children).forEach((child) => {
      if (
        child.id != category._id + "choosed" &&
        alreadycheckedCatChoosed.includes(child) == false
      ) {
        child.style.display = "none";
        if (categoriesSelected.indexOf(child.id.replace("choosed", "")) > -1) {
          categoriesSelected = categoriesSelected.filter(
            (categorySelected) =>
              categorySelected != child.id.replace("choosed", "")
          );
        }
      } else {
        child.style.display = "flex";
        if (
          !(categoriesSelected.indexOf(child.id.replace("choosed", "")) > -1)
        ) {
          categoriesSelected.push(child.id.replace("choosed", ""));
        }
        if (!(alreadycheckedCatChoosed.indexOf(child) > -1)) {
          alreadycheckedCatChoosed.push(child);
        }
      }
    });
    Object.values(CatExcludedContainer.children).forEach((child) => {
      if (
        child.id != category._id + "excluded" &&
        alreadycheckedCatExcluded.includes(child) == false
      ) {
        child.style.display = "flex";
      } else {
        child.style.display = "none";
        if (!(alreadycheckedCatExcluded.indexOf(child) > -1)) {
          alreadycheckedCatExcluded.push(child);
        }
      }
    });
  });

  // Fonction pour parametrer le bouton d'envoie du formulaire DE DUPLICATION
  AddEventButton.onclick = function () {
    const json = {
      event: {
        name: PopUpEventName.value,
        eventCode: PopUpEventCode.value,
        description: tinyMCE.get("PopUpEventDescription").getContent(),
        standOrderExpirationDate: strToDate(
          PopUpEventOrderLimit.value.replace("@", " ")
        ),
        beginAt: strToDate(PopUpEventStart.value.replace("@", " ")),
        endAt: strToDate(PopUpEventEnd.value.replace("@", " ")),
        location: {
          formattedAddress: PopUpEventLocation.value,
        },
        categories: categoriesSelected,
        excludedProducts: excludedProductSelected,
        emails: PopUpEventEmail.value,
        phoneNumber: PopUpEventPhone.value,
        furnitureOption: PopUpEventFurnitureOption.checked,
        hallOption: PopUpEventHallOption.checked,
        defaultPaymentMethod: PopUpDefaultPaymentMethod.value,
      },
    };

    let urlEvent = apiUrl + "events/";

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
    xhr.open("POST", urlEvent);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    console.log(JSON.stringify(json));

    // send rquest with JSON payload
    xhr.send(JSON.stringify(json));
    // reload de la page
    setTimeout(function () {
      location.reload();
    }, 1000);
  };
}

(function () {
  getData();
})();

// Fonction pour parametrer le bouton d'ajout d'un nouvel event
(function () {
  // vide le popup d'ajout d'un nouvel event
  AddEventGlobalButton.onclick = function () {
    AddEventButton.value = "Ajouter";
    PopUpEventName.value = "";
    PopUpEventCode.value = "";
    PopUpEventEmail.value = "";
    PopUpEventPhone.value = "";
    tinyMCE.activeEditor.setContent("");
    PopUpEventStart.value = "";
    PopUpEventEnd.value = "";
    PopUpEventLocation.value = "";
    PopUpEventOrderLimit.value = "";
    PopUpEventHallOption.checked = false;
    PopUpEventFurnitureOption.checked = false;
    PopUpDefaultPaymentMethod.value = "";
    textTopAddEventContainer.innerHTML = "Nouvel événement";

    ExcludedProducts = "";

    // affiche toute les catégories en choisies par défaut
    Object.values(CatChoosedContainer.children).forEach((child) => {
      child.style.display = "flex";
      if (!(categoriesSelected.indexOf(child.id.replace("choosed", "")) > -1)) {
        categoriesSelected.push(child.id.replace("choosed", ""));
      }
    });
    Object.values(CatExcludedContainer.children).forEach((child) => {
      child.style.display = "none";
      if (categoriesSelected.indexOf(child.id.replace("choosed", "")) > -1) {
        categoriesSelected = categoriesSelected.filter(
          (categorySelected) =>
            categorySelected != child.id.replace("choosed", "")
        );
      }
    });
  };
})();

// Fonction pour parametrer le bouton d'envoie du formulaire de base
AddEventButton.onclick = function (e) {
  e.preventDefault();

  //vérification du codeEvent
  let pattern = /\d\d\d\d-[a-zA-Z]+-[a-zA-Z]+/i;
  if (!pattern.test(PopUpEventCode.value)) {
    document.getElementById("ErrorSentForm").style.display = "block";
    document.getElementById("ErrorSentForm").innerHTML =
      "Le code doit être au format 0000-MANIFESTATION-VILLE";
    return;
  }

  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let isEmailValid = true;
  const emails = PopUpEventEmail.value.split(",").map((mail) => mail.trim());
  emails.map((email) => {
    if (!emailPattern.test(email)) {
      document.getElementById("ErrorSentForm").style.display = "block";
      document.getElementById("ErrorSentForm").innerHTML =
        "Les emails doivent être corrects et séparés par une virgule";
      isEmailValid = false;
      return;
    }
  });

  if (!isEmailValid) return;

  // json qui sera envoyé
  const json = {
    event: {
      name: PopUpEventName.value,
      description: tinyMCE.get("PopUpEventDescription").getContent(),
      eventCode: PopUpEventCode.value,
      standOrderExpirationDate: strToDate(
        PopUpEventOrderLimit.value.replace("@", " ")
      ),
      beginAt: strToDate(PopUpEventStart.value.replace("@", " ")),
      endAt: strToDate(PopUpEventEnd.value.replace("@", " ")),
      location: {
        formattedAddress: PopUpEventLocation.value,
      },
      categories: categoriesSelected,
      excludedProducts: excludedProductSelected,
      emails: PopUpEventEmail.value,
      phoneNumber: PopUpEventPhone.value,
      hallOption: PopUpEventHallOption.checked ? true : false,
      furnitureOption: PopUpEventFurnitureOption.checked ? true : false,
      defaultPaymentMethod: PopUpDefaultPaymentMethod.value,
    },
  };

  let urlEvent = apiUrl + "events";

  const xhr = new XMLHttpRequest();

  // listen for `load` event
  xhr.onload = () => {
    // print JSON response
    if (xhr.status >= 200 && xhr.status < 300) {
      // parse JSON
      const response = JSON.parse(xhr.responseText);
      console.log(response);
      // reload de la page
      setTimeout(function () {
        location.reload();
      }, 1000);
    } else {
      document.getElementById("ErrorSentForm").style.display = "block";
      document.getElementById("ErrorSentForm").innerHTML =
        "Veuillez correctement remplir le formulaire";
    }
  };

  // open request
  xhr.open("POST", urlEvent);

  // set `Content-Type` header
  xhr.setRequestHeader("Content-Type", "application/json");

  // send rquest with JSON payload
  xhr.send(JSON.stringify(json));
};

// Fonction qui prépare la data pour ensuite l'extraire en csv
function extractData(data) {
  const rows = [
    [
      "Numéro de commande",
      "État de la demande",
      "Événement",
      "Date de creation de la demande",
      "Date de modification de la demande",
      "Url du design",
      "Raison du refus",
      "Date d'annulation",
      "Commentaire",
      "Interessé par du mobilier",
      "hall",
      "Numéro de stand",
      "Nom du client",
      "Prénom du client",
      "Genre",
      "Téléphone",
      "Adresse mail",
      "E-mail de facturation",
      "Adresse",
      "Entreprise",
      "Numéro de TVA",
      "État du paiement",
      "Total H.T.",
      "Taux taxes",
      "Total",
      "Produits",
    ],
  ];

  data.map((request) => {
    let status = "";
    switch (request.status) {
      case 0:
        status = "Nouveau";
        break;
      case 5:
        status = "En attente du client";
        break;
      case 15:
        status = "Confirmée";
        break;
      case 20:
        status = "Refusée";
        break;
      case 25:
        status = "Clôturée";
        break;
      default:
        status = "erreur de statut";
    }

    let civility = "";
    if (request.client.civility === 0) {
      civility = "homme";
    } else if (request.client.civility === 1) {
      civility = "femme";
    }

    let products = [];
    request.lineItems.map((item) => {
      products.push(`${item.product.name} x${item.quantity}`);
    });

    const requetRow = [
      request.orderNumber ? request.orderNumber : "?",
      status,
      request.event.name ? request.event.name : "?",
      request.createdAt
        ? Intl.DateTimeFormat("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(request.createdAt))
        : "?",
      request.updatedAt
        ? Intl.DateTimeFormat("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(request.updatedAt))
        : "?",
      request.designUrl ? request.designUrl : "Pas de plan",
      request.refusalReason ? request.refusalReason : "Pas de raison specifiée",
      request.cancelledAt
        ? Intl.DateTimeFormat("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(request.cancelledAt))
        : "Pas annulé",
      request.comment ? request.comment : "",
      request.furniture ? "oui" : "non",
      request.hall ? request.hall : "",
      request.standNumber ? request.standNumber : "?",
      request.client.lastName ? request.client.lastName : "?",
      request.client.firstName ? request.client.firstName : "?",
      civility,
      request.client.phone ? request.client.phone : "?",
      request.client.email ? request.client.email : "?",
      request.client.billingAddress ? request.client.billingAddress : "?",
      request.client.address.formattedAddress
        ? request.client.address.formattedAddress
        : "?",
      request.client.companyName ? request.client.companyName : "?",
      request.client.numTVA ? request.client.numTVA : "?",
      request.isPaid ? "Paiement effectué" : "Pas payé",
      request.total.totalWithoutTax ? request.total.totalWithoutTax : "?",
      request.total.taxes[0] ? request.total.taxes[0].taxRate + "%" : "?",
      request.total.totalWithTax ? request.total.totalWithTax : "?",
      request.lineItems ? products.join(", ") : "Aucun produit",
    ];

    rows.push(requetRow);
  });

  let csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    rows.map((e) => e.map((value) => `"${value}"`).join(";")).join("\r\n");

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `Demandes de stand de l'événement ${eventSelected}.csv`
  );
  document.body.appendChild(link);

  link.click();
}
