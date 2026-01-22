// différencier les liens prod / staging
let apiUrl = window.location.href.includes("webflow")
  ? new URL("https://staging-imagin-expo-backend-api.apps.imaginexpo.com/api/v1/")
  : new URL("https://api.imaginexpo.com/api/v1/");

// Récupération des emplacements ou seront affiché les infos liées à l'event-request

//infos générales

const HeadingDetailRequest = document.getElementById("HeadingDetailRequest");
const orderNumber = document.getElementById("orderNumber");
const demandeState = document.getElementById("demandeState");
const eventName = document.getElementById("eventName");
const createdAt = document.getElementById("createdAt");
const updatedAt = document.getElementById("updatedAt");
const designUrl = document.getElementById("designUrl");
const refusalReason = document.getElementById("refusalReason");
const refusalReasonComponent = document.getElementById("refusalReasonComponent");
const cancelledAt = document.getElementById("cancelledAt");
const cancelledAtComponent = document.getElementById("cancelledAtComponent");
const CancelDateForm = document.getElementById("CancelDateForm");
const comment = document.getElementById("comment");
const furniture = document.getElementById("furniture");
const hall = document.getElementById("hall");
const standNumber = document.getElementById("standNumber");
const furnitureComponent = document.getElementById("furnitureComponent");
const hallComponent = document.getElementById("hallComponent");
var designImageData = "";
var preUpdateRequestState = "";

//infos du client

const clientLastName = document.getElementById("clientLastName");
const clientFirstName = document.getElementById("clientFirstName");
const clientCivility = document.getElementById("clientCivility");
const clientPhone = document.getElementById("clientPhone");
const clientEmail = document.getElementById("clientEmail");
const clientBillingAddress = document.getElementById("clientBillingAddress");
// const clientAccountantAddress = document.getElementById(
//   "clientAccountantAddress"
// );
const clientAddress = document.getElementById("clientAddress");
const clientCompany = document.getElementById("clientCompany");
const clientNumTVA = document.getElementById("clientNumTVA");

//infos du paiement

const paymentState = document.getElementById("paymentState");
const paymentExpirationDate = document.getElementById("paymentExpirationDate");
const paymentExpirationDateInput = document.getElementById("paymentExpirationDateInput");
paymentExpirationDateInput.classList.remove("w-input");
const ExpirationDateForm = document.getElementById("ExpirationDateForm");
const paymentInvoiceUrl = document.getElementById("paymentInvoiceUrl");
const paymentBrand = document.getElementById("paymentBrand");
const paymentLast4 = document.getElementById("paymentLast4");
const paymentExpMonth = document.getElementById("paymentExpMonth");
const paymentExpYear = document.getElementById("paymentExpYear");
const paymentMethodId = document.getElementById("paymentMethodId");
const paymentIntentId = document.getElementById("paymentIntentId");
const paymentMethod = document.getElementById("paymentMethod");
const paymentDate = document.getElementById("paymentDate");
const paymentOnline = document.getElementById("paymentOnline");
const totalHT = document.getElementById("totalHT");
const taxRate = document.getElementById("taxRate");
const totalTaxAmount = document.getElementById("totalTaxAmount");
const TotalWithTax = document.getElementById("TotalWithTax");
const subjectToTVA = document.getElementById("subjectToTVA");

// paiement components

const paymentMethodComponent = document.getElementById("paymentMethodComponent");
const paymentDateComponent = document.getElementById("paymentDateComponent");
const expirationDateComponent = document.getElementById("expirationDateComponent");
const billingUrlComponent = document.getElementById("billingUrlComponent");
const paymentMethodIdComponent = document.getElementById("paymentMethodIdComponent");
const paymentIntentIdComponent = document.getElementById("paymentIntentIdComponent");

//infos des Items/products

const itemsContainer = document.getElementById("itemsContainer");
var itemsOfRequest = [];
const multipleErrorMsg = document.getElementById("multipleErrorMsg");
const customProductContainer = document.getElementById("customProductContainer");

//Récupération des boutons

const DetailDemandeUpdateButton = document.getElementById("DetailDemandeUpdateButton");
const DetailDemandeDeleteButton = document.getElementById("DetailDemandeDeleteButton");
const DetailDemandeBackButton = document.getElementById("DetailDemandeBackButton");
const DetailDemandeExtractButton = document.getElementById("DetailDemandeExtractButton");
const addCustomProductButton = document.getElementById("addCustomProductButton");

// Fonction pour récuperer l'event_request ciblé par la page
function getData() {
  let request = new XMLHttpRequest();

  let url = apiUrl.toString() + "event-requests/" + location.hash.replace("#", "");

  request.open("GET", url, true);
  request.setRequestHeader("ngrok-skip-browser-warning", 1);

  request.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.eventRequest;

    if (request.status >= 200 && request.status < 400) {
      // appelle la fonction getTheEventData en lui passant la data de l'event-request
      getTheEventData(data);
    }
  };

  request.send();
}

(function () {
  getData();
})();

// Fonction pour récuperer les infos de l'event lié à l'event-request
function getTheEventData(Requestdata) {
  let request = new XMLHttpRequest();

  // Changer l'endpoint en ajoutant + 'newEndpoint'
  let url = apiUrl.toString() + "events/" + Requestdata.event._id;

  request.open("GET", url, true);
  request.setRequestHeader("ngrok-skip-browser-warning", 1);

  request.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.event;

    if (request.status >= 200 && request.status < 400) {
      if (!data.furnitureOption) furnitureComponent.style.display = "none";
      if (!data.hallOption) hallComponent.style.display = "none";

      // met les produits exclus dans une variable
      var excludedProductTable = [];
      Object.values(data.excludedProducts).forEach((excludedProduct) => {
        excludedProductTable.push(excludedProduct._id);
      });

      // boucle pour créer les emplacements des catégories ou seront placés les products
      Object.values(data.categories).forEach((category) => {
        var productFromCategory = [];
        Object.values(category.products).forEach((product) => {
          productFromCategory.push(product);
        });
        const categoryName = document.createElement("div");
        categoryName.className = "text-block-64";
        categoryName.innerHTML = category.name;
        const tableTop = document.createElement("div");
        tableTop.className = "div-block-88";
        tableTop.innerHTML =
          '<div class="text-block-62">Nom</div><div class="text-block-62">Dimensions</div><div class="text-block-62">Quantité</div><div class="text-block-62"> P.U HT</div>';
        const categoryContainer = document.createElement("div");
        categoryContainer.className = "categoryContainer";
        categoryContainer.style.rowGap = "10px";
        // ajout d'un bouton qui permet d'ajouter des products
        const addItemsInCategoryButton = document.createElement("a");
        addItemsInCategoryButton.innerHTML = "Ajouter un produit";
        addItemsInCategoryButton.className = "button addproductbutton";
        addItemsInCategoryButton.style.display = "none";
        var selectId = 0;
        addItemsInCategoryButton.onclick = function () {
          // variable pour créer un id unique à chaque nouveau product affiché
          var selectIdHere = category.name + "Select" + selectId;
          selectId++;

          var allOptions = "<option>Aucun</option>";

          // requete pour récupérer les produits liés aux catégories de l'event
          Object.values(productFromCategory).forEach((product) => {
            let request = new XMLHttpRequest();

            // Changer l'endpoint en ajoutant + 'newEndpoint'
            let url = apiUrl.toString() + "products/" + product;

            request.open("GET", url, true);
            request.setRequestHeader("ngrok-skip-browser-warning", 1);

            request.onload = function () {
              let dataBrut = JSON.parse(this.response);
              let data = dataBrut.product;

              // vérification si le produit n'est pas exclus ou déjà dans l'event-request avant de l'afficher dans le select
              if (request.status >= 200 && request.status < 400) {
                if (!(excludedProductTable.indexOf(product) > -1) && !(itemsOfRequest.indexOf(product) > -1)) {
                  const option = '<option value="' + product + '">' + data.name + "</option>";
                  allOptions += option;
                }
              }
            };

            request.send();
          });

          // création de l'emplacement du nouveau product avec les inputs à remplir
          const productContainer = document.createElement("div");
          productContainer.className = "div-block-89";
          const productName = document.createElement("div");
          productName.className = "text-block-62";
          // select pour les produits disponibles
          SelectNewProduct = document.createElement("select");
          SelectNewProduct.setAttribute("id", selectIdHere);
          SelectNewProduct.onchange = function () {
            changeInputValue();
          };
          setTimeout(function () {
            SelectNewProduct.innerHTML = allOptions;
          }, 1000);
          productName.appendChild(SelectNewProduct);
          const productDescription = document.createElement("div");
          productDescription.className = "text-block-62";
          productDescription.innerHTML = "dimensions...";
          const productQuantity = document.createElement("div");
          productQuantity.className = "text-block-62 itemquantity";
          productQuantity.innerHTML =
            '<input class="quantityInput" style="width: 75%" type="number" value="' + 0 + '">';
          productQuantity.setAttribute("id", "item.product._id" + "quantity");
          const productPrice = document.createElement("div");
          productPrice.className = "text-block-62";
          productPrice.innerHTML = "prix...";
          const deleteItem = document.createElement("div");
          deleteItem.innerHTML = "x";
          deleteItem.className = "deleteitems";
          deleteItem.onclick = function () {
            console.log("delete created item");
            productContainer.parentNode.removeChild(productContainer);
          };

          // injection de ces éléments dans l'emplacement des produits
          productContainer.appendChild(productName);
          productContainer.appendChild(productDescription);
          productContainer.appendChild(productQuantity);
          productContainer.appendChild(productPrice);
          productContainer.appendChild(deleteItem);
          categoryContainer.appendChild(productContainer);

          //fonction qui remet la quantité à 0 lorsque on modifie un product
          function changeInputValue() {
            const selectedProduct = document.getElementById(selectIdHere).value;
            productQuantity.innerHTML =
              '<input id="' +
              selectedProduct +
              'quantityInput" class="quantityInput" style="width: 75%" type="number" value="' +
              0 +
              '">';
          }
        };

        // création de potentiels emplacements pour les produits de la catégorie de l'event
        Object.values(productFromCategory).forEach((product) => {
          if (!(excludedProductTable.indexOf(product._id) > -1)) {
            const potentialProductContainer = document.createElement("div");
            potentialProductContainer.setAttribute("id", product);
            potentialProductContainer.className = "productContainer" + product;
            categoryContainer.appendChild(potentialProductContainer);
          }
        });

        // ajout de tous ces éléments d'une seule catégorie dans le container des items
        itemsContainer.appendChild(categoryName);
        itemsContainer.appendChild(tableTop);
        itemsContainer.appendChild(categoryContainer);
        itemsContainer.appendChild(addItemsInCategoryButton);
      });

      displayAllData(Requestdata);
    }
  };
  request.send();
}

// Fonction qui prépare la data pour ensuite l'extraire en csv
function extractData(data) {
  let status = "";
  switch (data.status) {
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
  if (data.client.civility === 0) {
    civility = "homme";
  } else if (data.client.civility === 1) {
    civility = "femme";
  }

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
    ],
    [
      data.orderNumber ? data.orderNumber : "?",
      status,
      data.event.name ? data.event.name : "?",
      data.createdAt
        ? Intl.DateTimeFormat("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(data.createdAt))
        : "?",
      data.updatedAt
        ? Intl.DateTimeFormat("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(data.updatedAt))
        : "?",
      data.designUrl ? data.designUrl : "Pas de plan",
      data.refusalReason ? data.refusalReason : "Pas de raison specifiée",
      data.cancelledAt
        ? Intl.DateTimeFormat("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(data.cancelledAt))
        : "Pas annulé",
      data.comment ? data.comment : "",
      data.furniture ? "oui" : "non",
      data.hall ? data.hall : "",
      data.standNumber ? data.standNumber : "?",
      data.client.lastName ? data.client.lastName : "?",
      data.client.firstName ? data.client.firstName : "?",
      civility,
      data.client.phone ? data.client.phone : "?",
      data.client.email ? data.client.email : "?",
      data.client.billingAddress ? data.client.billingAddress : "?",
      data.client.address.formattedAddress ? data.client.address.formattedAddress : "?",
      data.client.companyName ? data.client.companyName : "?",
      data.client.numTVA ? data.client.numTVA : "?",
      data.isPaid ? "Paiement effectué" : "Pas payé",
      data.total.totalWithoutTax ? data.total.totalWithoutTax : "?",
      data.total.taxes[0].taxRate + "%",
      data.total.totalWithTax ? data.total.totalWithTax : "?",
    ],
  ];

  data.lineItems.map((item) => {
    rows[0].push(item.product.name);
    rows[1].push(item.quantity);
  });

  let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + rows.map((e) => e.join(";")).join("\r\n");

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Demande de stand ${data.client.firstName} ${data.client.lastName}.csv`);
  document.body.appendChild(link);

  link.click();
}

// Fonction pour afficher toute les données de l'event-request
function displayAllData(data) {
  if (data.status === 25) DetailDemandeUpdateButton.style.display = "none";
  DetailDemandeExtractButton.onclick = () => extractData(data);

  // infos générales
  HeadingDetailRequest.innerHTML = "Détail demande n°" + data.orderNumber;
  orderNumber.innerHTML = data.orderNumber;
  preUpdateRequestState = data.status;
  switch (data.status) {
    case 0:
      demandeState.innerHTML = "Nouveau";
      break;
    case 5:
      demandeState.innerHTML = "En attente du client";
      break;
    case 15:
      demandeState.innerHTML = "Confirmée";
      break;
    case 20:
      demandeState.innerHTML = "Refusée";
      refusalReasonComponent.style.display = "block";
      cancelledAtComponent.style.display = "block";
      break;
    case 25:
      demandeState.innerHTML = "Clôturée";
      break;
    default:
      demandeState.innerHTML = "erreur de statut";
  }
  eventName.innerHTML = data.event.name;
  createdAt.innerHTML = Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(data.createdAt));
  updatedAt.innerHTML = Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(data.updatedAt));
  if (data.designUrl !== "") {
    designUrl.innerHTML =
      "<a class='button retourbutton' href='" + data.designUrl + "' target='_blank'>Voir le plan</a>";
  } else {
    designUrl.innerHTML = "Pas de plan";
  }
  refusalReason.innerHTML = data.refusalReason;
  if (data.cancelledAt !== undefined) {
    cancelledAt.innerHTML = Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(data.cancelledAt));
  } else {
    cancelledAt.innerHTML = "Pas annulé";
  }
  comment.innerHTML = data.comment;
  if (data.furniture) {
    furniture.innerHTML = "Oui";
  } else {
    furniture.innerHTML = "Non";
  }
  hall.innerHTML = data.hall ? data.hall : "Ø";
  standNumber.innerHTML = data.standNumber;

  // infos client

  clientLastName.innerHTML = data.client.lastName;
  clientFirstName.innerHTML = data.client.firstName;
  if (data.client.civility === 0) {
    clientCivility.innerHTML = "homme";
  } else if (data.client.civility === 1) {
    clientCivility.innerHTML = "femme";
  }
  clientPhone.innerHTML = data.client.phone;
  clientEmail.innerHTML = data.client.email;
  clientBillingAddress.innerHTML = data.client.billingAddress;
  // clientAccountantAddress.innerHTML = data.client.accountantAddress;
  clientAddress.innerHTML = data.client.address.formattedAddress;
  clientCompany.innerHTML = data.client.companyName;
  clientNumTVA.innerHTML = data.client.numTVA;

  // infos paiement

  paymentOnline.innerHTML = data.paymentOnline ? "Oui" : "Non";
  paymentMethod.innerHTML = data.paymentMethod ? data.paymentMethod : "Ø";
  paymentDate.innerHTML = data.paymentDate
    ? Intl.DateTimeFormat("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(data.paymentDate))
    : "Ø";
  totalHT.innerHTML = Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(data.total.totalWithoutTax);
  if (data.client.isSubjectToTVA) {
    subjectToTVA.innerHTML = "Oui";
    Object.values(data.total.taxes).forEach((taxe) => {
      taxRate.innerHTML = taxe.taxRate + "%";
    });
    TotalWithTax.innerHTML = Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(data.total.totalWithTax);
  } else {
    subjectToTVA.innerHTML = "Non";
    Object.values(data.total.taxes).forEach((taxe) => {
      taxRate.innerHTML = "0%";
    });
    TotalWithTax.innerHTML = Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(data.total.totalWithoutTax);
  }
  data.paymentOnline ? (paymentMethodComponent.style.display = "none") : null;

  if (data.isPaid) {
    paymentState.innerHTML = "payé";
  } else {
    paymentState.innerHTML = "Non payé";
    paymentDateComponent.style.display = "none";
  }

  // infos Items/products

  Object.values(data.lineItems).forEach((item) => {
    const productContainer = document.createElement("div");
    productContainer.className = "div-block-89";
    productContainer.setAttribute("id", item.product._id + "container");
    const productName = document.createElement("div");
    productName.className = "text-block-62";
    productName.innerHTML = item.product.name;
    productContainer.appendChild(productName);
    const productDescription = document.createElement("div");
    productDescription.className = "text-block-62";
    productDescription.innerHTML = item.product.description;
    productContainer.appendChild(productDescription);
    const productQuantity = document.createElement("div");
    productQuantity.className = "text-block-62 itemquantity quantity" + item.product.name;
    productQuantity.innerHTML = item.quantity;
    productQuantity.setAttribute("id", item.product._id + "quantity");
    productContainer.appendChild(productQuantity);
    const productPrice = document.createElement("div");
    productPrice.className = "text-block-62";
    productPrice.innerHTML = item.product.price.amount;
    productContainer.appendChild(productPrice);
    const deleteItem = document.createElement("div");
    deleteItem.innerHTML = "x";
    deleteItem.className = "deleteitems delete" + item.product._id;
    deleteItem.style.display = "none";
    // fonction pour supprimer le product de l'affichage
    $(document).on("click", ".delete" + item.product._id, function () {
      console.log("delete item " + item.product.name);
      const inputNumber = document.getElementById(item.product._id + "quantityInput");
      inputNumber.value = 0;
      const ContainerItem = document.getElementById(item.product._id + "container");
      ContainerItem.style.display = "none";
      itemsOfRequest = itemsOfRequest.filter((itemOfRequest) => itemOfRequest != item.product._id);
    });
    productContainer.appendChild(deleteItem);

    // const CategoryItemsContainer = document.getElementById(item.product._id);
    const allCatItemsContainers = document.getElementsByClassName("productContainer" + item.product._id);
    // if (CategoryItemsContainer !== null) {
    //   CategoryItemsContainer.appendChild(productContainer.cloneNode(true));
    // }
    if (allCatItemsContainers) {
      Object.values(allCatItemsContainers).forEach((catItemContainer) => {
        if (!catItemContainer.hasChildNodes()) catItemContainer.appendChild(productContainer.cloneNode(true));
      });
    }

    if (!(itemsOfRequest.indexOf(item.product._id) > -1)) {
      itemsOfRequest.push(item.product._id);
    }
  });

  // remplissage des produits personnalisés
  Object.values(data.customLineItems).forEach((item) => {
    const productContainer = document.createElement("div");
    productContainer.className = "div-block-89 customproductcontainer";
    productContainer.setAttribute("id", item._id);
    const productName = document.createElement("div");
    productName.className = "text-block-62 customitemname";
    productName.setAttribute("id", item._id + "customname");
    productName.innerHTML = item.name;
    productContainer.appendChild(productName);
    const productDescription = document.createElement("div");
    productDescription.className = "text-block-62 customitemdescription";
    productDescription.innerHTML = item.size;
    productDescription.setAttribute("id", item._id + "customdescription");
    productContainer.appendChild(productDescription);
    const productQuantity = document.createElement("div");
    productQuantity.className = "text-block-62 customitemquantity quantity" + item.name;
    productQuantity.innerHTML = item.quantity;
    productQuantity.setAttribute("id", item._id + "customquantity");
    productContainer.appendChild(productQuantity);
    const productPrice = document.createElement("div");
    productPrice.className = "text-block-62 customitemprice";
    productPrice.innerHTML = item.price;
    productPrice.setAttribute("id", item._id + "customprice");
    productContainer.appendChild(productPrice);
    const deleteItem = document.createElement("div");
    deleteItem.innerHTML = "x";
    deleteItem.className = "deleteitems delete" + item._id;
    deleteItem.style.display = "none";
    // fonction pour supprimer le product de l'affichage
    $(document).on("click", ".delete" + item._id, function () {
      console.log("delete item " + item.name);
      const inputNumber = document.getElementById(item._id + "customquantityinput");
      inputNumber.value = 0;
      const ContainerItem = document.getElementById(item._id);
      ContainerItem.style.display = "none";
    });
    productContainer.appendChild(deleteItem);
    customProductContainer.appendChild(productContainer);
  });

  // Affectation des fonctions liées aux boutons

  DetailDemandeUpdateButton.onclick = function () {
    (function () {
      updateRequest(data);
    })();
  };
  DetailDemandeDeleteButton.onclick = function () {
    (function () {
      deleteRequest(data.orderNumber, data._id);
    })();
  };
}

// Fonction pour supprimer la requete
function deleteRequest(requestName, idRequest) {
  // affiche et rempli un popup pour confirmer la suppression
  const deleteItemContainer = document.getElementById("DeleteItemContainer");
  deleteItemContainer.style.display = "block";
  const textDeleteVerif = document.getElementById("textDeleteVerif");
  textDeleteVerif.innerHTML = "Êtes-vous sûr de vouloir supprimer la requête n°<strong>" + requestName + "</strong> ?";
  const cancelDeleteItem = document.getElementById("cancelDeleteItem");
  cancelDeleteItem.onclick = function () {
    deleteItemContainer.style.display = "none";
  };
  const deleteButton = document.getElementById("deleteItemButton");
  // requete delete lorsque c'est confirmé
  deleteButton.onclick = function () {
    const xhr = new XMLHttpRequest();

    const url = apiUrl.toString() + "event-requests/" + idRequest;

    // open request
    xhr.open("DELETE", url);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send();

    deleteItemContainer.style.display = "none";
    // revient à la page des demandes après un cours délai
    setTimeout(function () {
      window.location.replace("https://imaginexpo.com/ie-admin/admin-demandes");
    }, 1000);
  };
}

// Fonction pour mofifier la requete
function updateRequest(data) {
  const nameItem = document.querySelectorAll(".nameItem");

  // change les emplacements des infos de la requete par des inputs pour pouvoir les modifier

  // infos générales

  orderNumber.innerHTML = '<input id="inputOrderNumber" value="' + data.orderNumber + '">';
  switch (data.status) {
    case 0:
      demandeState.innerHTML =
        '<select id="inputRequestState"><option selected value="0">Nouveau</option><option value="15">Confirmée</option><option value="20">Refusée</option></select>';
      break;
    case 5:
      demandeState.innerHTML =
        '<select id="inputRequestState"><option selected value="5">En attente du client</option><option value="20">Refusée</option></select>';
      break;
    case 15:
      if (data.isPaid) {
        demandeState.innerHTML =
          '<select id="inputRequestState"><option selected value="15">Confirmée</option><option value="25">Clôturée</option><option value="20">Refusée</option></select>';
      } else {
        demandeState.innerHTML =
          '<select id="inputRequestState"><option selected value="15">Confirmée</option><option value="20">Refusée</option></select>';
      }
      break;
    case 20:
      demandeState.innerHTML =
        '<select id="inputRequestState"><option value="15">Confirmée</option><option selected value="20">Refusée</option></select>';
      break;
    default:
      demandeState.innerHTML = "erreur de modification";
  }
  designUrl.innerHTML =
    "<a class='button retourbutton' href='" +
    data.designUrl +
    "' target='_blank'>Voir le plan</a><input id='inputDesignUrl' value='Changer le plan (png ou jpeg)' accept='image/png, image/jpeg, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document' type='file' />";
  document.getElementById("inputDesignUrl").onchange = function () {
    const inputFile = document.querySelector('input[type="file"]');
    const StandImage = inputFile.files[0];
    if (
      StandImage.type === "image/png" ||
      StandImage.type === "image/jpeg" ||
      StandImage.type === "application/pdf" ||
      StandImage.type === "application/msword" ||
      StandImage.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      console.log("bon format");
      proccessData(StandImage);
    } else {
      inputFile.value = "";
    }
  };
  refusalReason.innerHTML = '<input id="inputRefusalReason" value="' + data.refusalReason + '">';

  comment.innerHTML = '<input id="inputComment" value="' + data.comment + '">';
  if (furniture.innerHTML === "Oui") {
    furniture.innerHTML =
      '<div style="display: flex"><input style="margin-right: 5px" type="checkbox" id="furnitureCheckbox" checked /><label>Intéressé</label></div>';
  } else {
    furniture.innerHTML =
      '<div style="display: flex"><input style="margin-right: 5px" type="checkbox" id="furnitureCheckbox" /><label>Intéressé</label></div>';
  }
  hall.innerHTML = '<input id="inputHall" maxlength="5" value="' + data.hall + '">';
  standNumber.innerHTML = '<input id="inputStandNumber" maxlength="5" value="' + data.standNumber + '">';

  // infos client

  clientLastName.innerHTML = '<input id="inputClientLastName" value="' + data.client.lastName + '">';
  clientFirstName.innerHTML = '<input id="inputClientFirstName" value="' + data.client.firstName + '">';
  if (data.client.civility === 0) {
    clientCivility.innerHTML =
      '<select id="inputClientCivility"><option selected value="0">homme</option><option value="1">femme</option></select>';
  } else if (data.client.civility === 1) {
    clientCivility.innerHTML =
      '<select id="inputClientCivility"><option value="0">homme</option><option selected value="1">femme</option></select>';
  }
  clientPhone.innerHTML = '<input id="inputClientPhone" value="' + data.client.phone + '">';
  clientEmail.innerHTML = '<input id="inputClientEmail" value="' + data.client.email + '">';
  clientBillingAddress.innerHTML = '<input id="inputClientBillingAddress" value="' + data.client.billingAddress + '">';
  // clientAccountantAddress.innerHTML =
  //   '<input id="inputClientAccountantAddress" value="' +
  //   data.client.accountantAddress +
  //   '">';
  clientAddress.innerHTML = '<input id="inputClientAddress" value="' + data.client.address.formattedAddress + '">';
  clientCompany.innerHTML = '<input id="inputClientCompany" value="' + data.client.companyName + '">';
  clientNumTVA.innerHTML = '<input id="inputClientNumTVA" value="' + data.client.numTVA + '">';

  // infos paiement

  if (!data.isPaid) {
    paymentState.innerHTML =
      '<select id="inputIsPaid"><option value="true">Payé</option><option selected value="false">Non Payé</option></select>';
    if (data.paymentOnline) {
      paymentOnline.innerHTML =
        '<select id="inputPaymentOnline" onChange="listenOnlinePayment()"><option selected value="true">Oui</option><option value="false">Non</option></select>';
    } else {
      paymentOnline.innerHTML =
        '<select id="inputPaymentOnline" onChange="listenOnlinePayment()"><option value="true">Oui</option><option selected value="false">Non</option></select>';
      paymentMethod.innerHTML = '<input id="inputPaymentMethod" value="' + data.paymentMethod + '">';
    }
  }
  if (data.client.isSubjectToTVA) {
    subjectToTVA.innerHTML =
      '<div style="display: flex"><input style="margin-right: 5px" type="checkbox" id="isSubjectToTVACheckbox" checked /><label>Oui</label></div>';
  } else {
    subjectToTVA.innerHTML =
      '<div style="display: flex"><input style="margin-right: 5px" type="checkbox" id="isSubjectToTVACheckbox" /><label>Oui</label></div>';
  }

  document.getElementById("inputPaymentOnline")
    ? (document.getElementById("inputPaymentOnline").onchange = () => {
        if (document.getElementById("inputPaymentOnline").value === "true") {
          paymentMethodComponent.style.display = "none";
          paymentMethod.innerHTML = "";
        } else {
          paymentMethodComponent.style.display = "block";
          paymentMethod.innerHTML = '<input id="inputPaymentMethod" value="' + data.paymentMethod + '">';
        }
      })
    : null;

  // infos items

  const allitemquantity = document.querySelectorAll(".itemquantity");
  Object.values(allitemquantity).forEach((quantity) => {
    quantity.innerHTML =
      '<input id="' +
      quantity.id +
      'Input" class="quantityInput" style="width: 75%" type="number" value="' +
      quantity.innerHTML +
      '">';
  });

  //infos custom items

  const allcustomitemquantity = document.querySelectorAll(".customitemquantity");
  const allcustomitemname = document.querySelectorAll(".customitemname");
  const allcustomitemdescription = document.querySelectorAll(".customitemdescription");
  const allcustomitemprice = document.querySelectorAll(".customitemprice");
  Object.values(allcustomitemquantity).forEach((quantity) => {
    quantity.innerHTML =
      '<input id="' +
      quantity.id +
      'input" class="customQuantityInput" style="width: 75%" type="number" value="' +
      quantity.innerHTML +
      '">';
  });
  Object.values(allcustomitemname).forEach((name) => {
    name.innerHTML =
      '<input id="' +
      name.id +
      'input" class="customNameInput" style="width: 75%" type="text" value="' +
      name.innerHTML +
      '">';
  });
  Object.values(allcustomitemdescription).forEach((desc) => {
    desc.innerHTML =
      '<input id="' +
      desc.id +
      'input" class="customDescriptionInput" style="width: 75%" type="text" value="' +
      desc.innerHTML +
      '">';
  });
  Object.values(allcustomitemprice).forEach((price) => {
    price.innerHTML =
      '<input id="' +
      price.id +
      'input" class="customPriceInput" style="width: 75%" type="number" value="' +
      price.innerHTML +
      '">';
  });

  // ajout du bouton d'ajout de nouveau produits dans chaque catégorie

  const allAddItemButton = document.querySelectorAll(".addproductbutton");
  Object.values(allAddItemButton).forEach((button) => {
    button.style.display = "block";
  });

  //affichage du bouton d'ajout de nouveau produit personnalisé
  addCustomProductButton.style.display = "block";
  // Gestion du click sur le bouton d'ajout d'un nouveau produit personnalisé
  let numberNewProduct = 0;
  addCustomProductButton.onclick = function () {
    const productContainer = document.createElement("div");
    productContainer.className = "div-block-89 newcustomproduct";
    const productName = document.createElement("div");
    productName.className = "text-block-62";
    productName.innerHTML =
      '<input id="customNewProductNameInput' + numberNewProduct + '" style="width: 75%" type="text">';
    const productDescription = document.createElement("div");
    productDescription.className = "text-block-62";
    productDescription.innerHTML =
      '<input id="customNewProductDescriptionInput' + numberNewProduct + '" style="width: 75%" type="text">';
    const productQuantity = document.createElement("div");
    productQuantity.className = "text-block-62";
    productQuantity.innerHTML =
      '<input id="customNewProductQuantityInput' + numberNewProduct + '" style="width: 75%" type="number">';
    // productQuantity.setAttribute("id", "item.product._id" + "quantity");
    const productPrice = document.createElement("div");
    productPrice.className = "text-block-62";
    productPrice.innerHTML =
      '<input id="customNewProductPriceInput' + numberNewProduct + '" style="width: 75%" type="number">';
    const deleteItem = document.createElement("div");
    deleteItem.innerHTML = "x";
    deleteItem.className = "deleteitems";
    deleteItem.onclick = function () {
      console.log("delete created item");
      productContainer.parentNode.removeChild(productContainer);
    };

    // injection de ces éléments dans l'emplacement des produits
    productContainer.appendChild(productName);
    productContainer.appendChild(productDescription);
    productContainer.appendChild(productQuantity);
    productContainer.appendChild(productPrice);
    productContainer.appendChild(deleteItem);
    customProductContainer.appendChild(productContainer);
    numberNewProduct++;
  };

  // ajout des boutons de suppression des produits deja affichés
  const allDeleteItemButton = document.querySelectorAll(".deleteitems");
  Object.values(allDeleteItemButton).forEach((button) => {
    button.style.display = "block";
  });

  // bouton delete et retour cachés + boutons "modifer" changé en "valider"
  DetailDemandeDeleteButton.style.display = "none";
  DetailDemandeBackButton.style.display = "none";
  DetailDemandeExtractButton.style.display = "none";
  DetailDemandeUpdateButton.innerHTML = "Valider";
  DetailDemandeUpdateButton.style.background = "#81bd5b";
  DetailDemandeUpdateButton.style.border = "#81bd5b";

  // Quand on clique sur le bouton valider pour l'update :
  DetailDemandeUpdateButton.onclick = function () {
    // const itemInfos = document.querySelectorAll('.div-block-89');
    const itemInfos = document.querySelectorAll(".quantityInput");
    var lineItems = [];
    var verificationMultipleItems = [];
    var isMultiple = false;
    Object.values(itemInfos).forEach((item) => {
      if (item.value > 0) {
        // mettre les infos dans des objets à envoyer ensuite a lineItems
        if (verificationMultipleItems.indexOf(item.id) > -1) {
          isMultiple = true;
        }
        var uniqueItem = {
          product: item.id.replace("quantityInput", ""),
          quantity: item.value,
        };
        verificationMultipleItems.push(item.id);
        if (uniqueItem.quantity > 0) lineItems.push(uniqueItem);
      }
    });

    if (isMultiple) {
      multipleErrorMsg.style.display = "block";
      return;
    }

    var furnitureCheck = false;
    if (document.getElementById("furnitureCheckbox").checked) {
      furnitureCheck = true;
    }

    var customLineItems = [];
    // custom product
    const allCustomProductContainers = document.querySelectorAll(".customproductcontainer");
    let number = 0;
    Object.values(allCustomProductContainers).forEach((container) => {
      const name = document.getElementById(container.id + "customnameinput").value;
      const size = document.getElementById(container.id + "customdescriptioninput").value;
      const price = document.getElementById(container.id + "custompriceinput").value;
      const quantity = document.getElementById(container.id + "customquantityinput").value;

      if (quantity > 0) {
        customLineItems.push({
          _id: number,
          name: name,
          size: size,
          quantity: quantity,
          price: price,
        });
      }

      number++;
    });

    const allNewCustomProductsContainer = document.querySelectorAll(".newcustomproduct");
    let numberNewProduct = 0;
    Object.values(allNewCustomProductsContainer).forEach((container) => {
      if (document.getElementById("customNewProductNameInput" + numberNewProduct)) {
        const name = document.getElementById("customNewProductNameInput" + numberNewProduct).value;
        const price = document.getElementById("customNewProductPriceInput" + numberNewProduct).value;
        const size = document.getElementById("customNewProductDescriptionInput" + numberNewProduct).value;
        const quantity = document.getElementById("customNewProductQuantityInput" + numberNewProduct).value;

        if (quantity > 0) {
          customLineItems.push({
            _id: "1000" + numberNewProduct,
            name: name,
            price: price,
            quantity: quantity,
            size: size,
          });
        }
      }
      numberNewProduct++;
    });

    // json du mail
    var mailJson = {
      to: document.getElementById("inputClientEmail").value,
      subject: "[IMAGIN'EXPO] Votre demande de stand chez Imagin'Expo",
      text:
        "Des modifications ont été faites sur votre demande de stand : https://imaginexpo.com/recapitulatif-demande-de-stand#" +
        data._id,
    };

    let paymentMethod = "";
    if (document.getElementById("inputPaymentMethod")) {
      paymentMethod = document.getElementById("inputPaymentMethod").value;
    }

    // json qui sera envoyé avec les nouvelles infos pour la modification
    var eventRequest = {
      client: {
        firstName: document.getElementById("inputClientFirstName").value,
        lastName: document.getElementById("inputClientLastName").value,
        civility: document.getElementById("inputClientCivility").value,
        email: document.getElementById("inputClientEmail").value,
        billingAddress: document.getElementById("inputClientBillingAddress").value,
        phone: document.getElementById("inputClientPhone").value,
        address: {
          formattedAddress: document.getElementById("inputClientAddress").value,
        },
        companyName: document.getElementById("inputClientCompany").value,
        numTVA: document.getElementById("inputClientNumTVA").value,
        isSubjectToTVA: document.getElementById("isSubjectToTVACheckbox").checked ? true : false,
      },
      status: +document.getElementById("inputRequestState").value,
      lineItems,
      customLineItems,
      designImageData: designImageData ? designImageData : "same",
      orderNumber: document.getElementById("inputOrderNumber").value,
      refusalReason: document.getElementById("inputRefusalReason").value,
      // isPaid: document.getElementById("inputIsPaid").value,
      // paymentOnline: document.getElementById("inputPaymentOnline").value,
      paymentMethod: paymentMethod,
      comment: document.getElementById("inputComment").value,
      furniture: furnitureCheck,
      hall: document.getElementById("inputHall").value,
      standNumber: document.getElementById("inputStandNumber").value,
    };

    if (document.getElementById("inputIsPaid") && document.getElementById("inputPaymentOnline")) {
      eventRequest = {
        ...eventRequest,
        isPaid: document.getElementById("inputIsPaid").value,
        paymentOnline: document.getElementById("inputPaymentOnline").value,
      };
    }

    if (document.getElementById("inputIsPaid") && document.getElementById("inputIsPaid").value && !data.paymentDate) {
      eventRequest = {
        ...eventRequest,
        paymentDate: new Date(),
      };
    }

    // gestion du status
    if (document.getElementById("inputRequestState").value === "20" && preUpdateRequestState !== 20) {
      json = {
        eventRequest: {
          ...eventRequest,
          status: document.getElementById("inputRequestState").value,
          cancelledAt: new Date(),
        },
      };

      mailJson = {
        ...mailJson,
        text: "Refus de votre demande de stand : https://imaginexpo.com/recapitulatif-demande-de-stand#" + data._id,
      };
    } else if (document.getElementById("inputRequestState").value === "20" && preUpdateRequestState === 20) {
      json = {
        eventRequest,
      };
    } else if (document.getElementById("inputRequestState").value === "15" && preUpdateRequestState === 15) {
      json = {
        eventRequest,
      };
    } else if (document.getElementById("inputRequestState").value === "15" && preUpdateRequestState !== 15) {
      json = {
        eventRequest: {
          ...eventRequest,
          status: document.getElementById("inputRequestState").value,
        },
      };

      mailJson = {
        ...mailJson,
        text:
          "Votre demande de stand à été confirmée, vous pouvez procéder au paiement en bas de cette page : https://imaginexpo.com/recapitulatif-demande-de-stand#" +
          data._id,
      };
    } else if (document.getElementById("inputRequestState").value === "25") {
      json = {
        eventRequest: {
          ...eventRequest,
          status: document.getElementById("inputRequestState").value,
        },
      };

      mailJson = {
        ...mailJson,
        text:
          "Votre demande de stand à été clôturée : https://imaginexpo.com/recapitulatif-demande-de-stand#" + data._id,
      };
    } else {
      json = {
        eventRequest,
      };
    }

    let isAnyDataUpdated = isAnyDataUpdatedCheck(data, eventRequest);
    if (!isAnyDataUpdated && eventRequest.status === data.status) {
      location.reload();
      return;
    }

    if (isAnyDataUpdated) {
      json = {
        eventRequest: {
          ...eventRequest,
          status: 5,
        },
      };

      mailJson = {
        ...mailJson,
        text:
          "Des modifications ont été faites sur votre demande de stand : https://imaginexpo.com/recapitulatif-demande-de-stand#" +
          data._id,
      };
    }

    let urlRequest = apiUrl + "event-requests/" + data._id;

    const xhr = new XMLHttpRequest();

    // listen for `load` event
    xhr.onload = () => {
      // print JSON response
      if (xhr.status >= 200 && xhr.status < 300) {
        // parse JSON
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        console.log(eventRequest);
      }
    };

    // open request
    xhr.open("POST", urlRequest);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    // send rquest with JSON payload
    xhr.send(JSON.stringify(json));

    //
    // envoie du mail au client ci-dessous
    //
    let urlmailRequest = apiUrl + "request-mail/";

    const mailxhr = new XMLHttpRequest();

    // listen for `load` event
    mailxhr.onload = () => {
      // print JSON response
      if (mailxhr.status >= 200 && mailxhr.status < 300) {
        // parse JSON
        const response = JSON.parse(mailxhr.responseText);
        console.log(response);
      }
    };

    // open request
    mailxhr.open("POST", urlmailRequest);

    // set `Content-Type` header
    mailxhr.setRequestHeader("Content-Type", "application/json");

    // send rquest with JSON payload
    mailxhr.send(JSON.stringify(mailJson));

    // rechargerment de la page après un cours délais
    setTimeout(function () {
      location.reload();
    }, 1000);
  };
}

// encodage de l'image chargée
function readFile(StandImage) {
  if (!StandImage) return;

  const FR = new FileReader();

  return new Promise((resolve) => {
    FR.onload = (ev) => {
      resolve(ev.target.result);
    };
    FR.readAsDataURL(StandImage);
  });
}

async function proccessData(StandImage) {
  designImageData = await readFile(StandImage);
}

// Fonction pour changer les strings des input en date pour pouvoir les envoyer à la bdd par la suite
function strToDate(dtStr) {
  if (!dtStr) return null;
  let dateParts = dtStr.split("/");
  let timeParts = dateParts[2].split(" ")[1].split(":");
  dateParts[2] = dateParts[2].split(" ")[0];
  // month is 0-based, that's why we need dataParts[1] - 1
  return (dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0], timeParts[0], timeParts[1]));
}

function isAnyDataUpdatedCheck(previousData, updatedData) {
  const isPaidTrue = updatedData.isPaid === "true";
  const isPaymentOnlineTrue = updatedData.paymentOnline === "true";

  let isLineItemsEqual = true;
  previousData.lineItems.map((item, index) => {
    if (
      item.quantity !== +updatedData.lineItems[index]?.quantity ||
      item.product._id !== updatedData.lineItems[index]?.product
    ) {
      isLineItemsEqual = false;
    }
  });

  let isCustomLineItemsEqual = true;
  previousData.customLineItems.map((item, index) => {
    if (
      item.name !== updatedData.customLineItems[index]?.name ||
      item.price !== +updatedData.customLineItems[index]?.price ||
      item.quantity !== +updatedData.customLineItems[index]?.quantity ||
      item.size !== updatedData.customLineItems[index]?.size
    ) {
      isCustomLineItemsEqual = false;
    }
  });

  if (
    // previousData.status === updatedData.status &&
    previousData.standNumber === updatedData.standNumber &&
    previousData.refusalReason === updatedData.refusalReason &&
    previousData.paymentOnline === isPaymentOnlineTrue &&
    previousData.paymentMethod === updatedData.paymentMethod &&
    previousData.orderNumber === updatedData.orderNumber &&
    previousData.lineItems.length === updatedData.lineItems.length &&
    isLineItemsEqual &&
    previousData.isPaid === isPaidTrue &&
    previousData.hall === updatedData.hall &&
    previousData.furniture === updatedData.furniture &&
    updatedData.designImageData === "same" &&
    previousData.customLineItems.length === updatedData.customLineItems.length &&
    isCustomLineItemsEqual &&
    previousData.comment === updatedData.comment &&
    previousData.client.address.formattedAddress === updatedData.client.address.formattedAddress &&
    previousData.client.billingAddress === updatedData.client.billingAddress &&
    previousData.client.civility === +updatedData.client.civility &&
    previousData.client.companyName === updatedData.client.companyName &&
    previousData.client.email === updatedData.client.email &&
    previousData.client.firstName === updatedData.client.firstName &&
    previousData.client.isSubjectToTVA === updatedData.client.isSubjectToTVA &&
    previousData.client.lastName === updatedData.client.lastName &&
    previousData.client.numTVA === updatedData.client.numTVA &&
    previousData.client.phone === updatedData.client.phone
  ) {
    return false;
  }
  return true;
}
