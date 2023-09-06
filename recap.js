// différencier les liens prod / staging
let apiUrl = window.location.href.includes("webflow")
  ? new URL("https://imagin-expo-backend-api.int.at-digital.fr/api/v1/")
  : new URL("https://api.imaginexpo.com/api/v1/");

// Récupération des emplacements ou seront affiché les infos liées à l'event-request

//infos générales

const eventNameSubTitle = document.getElementById("eventNameSubTitle");
const contactSubTitle = document.getElementById("contactSubTitle");

const HeadingDetailRequest = document.getElementById("HeadingDetailRequest");
const orderNumber = document.getElementById("orderNumber");
const demandeState = document.getElementById("demandeState");
const eventName = document.getElementById("eventName");
const createdAt = document.getElementById("createdAt");
const updatedAt = document.getElementById("updatedAt");
const designUrl = document.getElementById("designUrl");
const refusalReason = document.getElementById("refusalReason");
const cancelledAt = document.getElementById("cancelledAt");
const comment = document.getElementById("comment");
const furniture = document.getElementById("furniture");
const hall = document.getElementById("hall");
const standNumber = document.getElementById("standNumber");
const hallComponent = document.getElementById("hallComponent");
const furnitureComponent = document.getElementById("furnitureComponent");
var designImageData = "";

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

const ExpirationDateForm = document.getElementById("ExpirationDateForm");
const totalHT = document.getElementById("totalHT");
const taxRate = document.getElementById("taxRate");
const totalTaxAmount = document.getElementById("totalTaxAmount");
const TotalWithTax = document.getElementById("TotalWithTax");
const PaymentButton = document.getElementById("PaymentButton");

//infos des Items/products

const itemsContainer = document.getElementById("itemsContainer");
var itemsOfRequest = [];
const customProductContainer = document.getElementById(
  "customProductContainer"
);

// boutons de validation et de refus
const RefusUpdateButton = document.getElementById("RefusUpdateButton");
const RefusUpdateButtonToConfirm = document.getElementById(
  "RefusUpdateButtonToConfirm"
);
const ValidationUpdateButton = document.getElementById(
  "ValidationUpdateButton"
);
const refusalReasonInput = document.getElementById("refusalReasonInput");

// Pop ups de post-paiement
const paymentLandingCancel = document.getElementById("paymentLandingCancel");
const paymentLandingSuccess = document.getElementById("paymentLandingSuccess");

// Fonction pour récuperer l'event_request ciblé par la page
function getData() {
  if (location.hash.replace("#", "") === "") {
    location.replace("/");
  }

  let request = new XMLHttpRequest();

  let url =
    apiUrl.toString() +
    "event-requests/" +
    location.hash.replace("#", "").split("/")[0];

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
      eventNameSubTitle.innerHTML = data.name;
      contactSubTitle.innerHTML = data.phoneNumber + " | " + data.emails;

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
          '<div class="text-block-62">Nom</div><div class="text-block-62">Dimensions</div><div class="text-block-62">Quantité</div><div class="text-block-62">P.U HT</div>';
        const categoryContainer = document.createElement("div");
        categoryContainer.style.rowGap = "10px";
        // ajout d'un bouton qui permet d'ajouter des products
        const addItemsInCategoryButton = document.createElement("a");
        addItemsInCategoryButton.innerHTML = "Ajouter un produit";
        addItemsInCategoryButton.className = "button addproductbutton";
        addItemsInCategoryButton.style.display = "none";
        var selectId = 0;
        addItemsInCategoryButton.onclick = function () {
          // variable pour créer un id unique à chaque nouveau product affiché
          var selectIdHere = selectId;
          selectIdHere++;

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
                console.log(excludedProductTable);
                if (
                  !(excludedProductTable.indexOf(product) > -1) &&
                  !(itemsOfRequest.indexOf(product) > -1)
                ) {
                  const option =
                    '<option value="' +
                    product +
                    '">' +
                    data.name +
                    "</option>";
                  allOptions += option;
                  console.log(allOptions);
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
          SelectNewProduct.setAttribute("id", "select" + selectIdHere);
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
            '<input class="quantityInput" type="number" value="' + 0 + '">';
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
            const selectedProduct = document.getElementById(
              "select" + selectIdHere
            ).value;
            productQuantity.innerHTML =
              '<input id="' +
              selectedProduct +
              'quantityInput" class="quantityInput" type="number" value="' +
              0 +
              '">';
            if (!(itemsOfRequest.indexOf(selectedProduct) > -1)) {
              itemsOfRequest.push(selectedProduct);
            }
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

// Fonction pour afficher toute les données de l'event-request
function displayAllData(data) {
  ValidationUpdateButton.onclick = () => validateUpdate(data);
  RefusUpdateButton.onclick = () => rejectUpdate(data);
  if (data.isPaid) RefusUpdateButtonToConfirm.style.display = "none";
  if (location.href.split("/payment=")[1] === "success")
    paymentLandingSuccess.style.display = "block";
  if (location.href.split("/payment=")[1] === "cancel")
    paymentLandingCancel.style.display = "block";

  // infos générales
  orderNumber.innerHTML = data.orderNumber;
  switch (data.status) {
    case 0:
      demandeState.innerHTML = "Nouveau";
      break;
    case 5:
      demandeState.innerHTML = "En attente de votre validation";
      ValidationUpdateButton.style.display = "flex";
      break;
    case 15:
      demandeState.innerHTML = "Confirmée";
      break;
    case 20:
      demandeState.innerHTML = "Refusée";
      RefusUpdateButtonToConfirm.style.display = "none";
      break;
    case 25:
      demandeState.innerHTML = "Clôturée";
      break;
    default:
      demandeState.innerHTML = "erreur de status";
  }
  createdAt.innerHTML = Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(data.createdAt));
  designImageData = data.designUrl;
  if (data.designUrl !== "") {
    designUrl.innerHTML =
      "<a class='button retourbutton' href='" +
      data.designUrl +
      "' target='_blank'>Voir le plan</a>";
  } else {
    designUrl.innerHTML = "Pas de plan";
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
  clientPhone.innerHTML = data.client.phone;
  clientEmail.innerHTML = data.client.email;
  clientBillingAddress.innerHTML = data.client.billingAddress;
  // clientAccountantAddress.innerHTML = data.client.accountantAddress;
  clientAddress.innerHTML = data.client.address.formattedAddress;
  clientCompany.innerHTML = data.client.companyName;
  clientNumTVA.innerHTML = "TVA : " + data.client.numTVA;

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
    Object.values(data.total.taxes).forEach((taxe) => {
      taxRate.innerHTML = taxe.taxRate + "%";
    });
    TotalWithTax.innerHTML = Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(data.total.totalWithTax);
  } else {
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

  // Bouton de paiement
  if (
    data.status === 15 &&
    !data.isPaid &&
    data.paymentOnline &&
    data.stripePaymentStatus !== 0
  ) {
    PaymentButton.style.display = "block";
  }
  PaymentButton.onclick = () => {
    let urlRequest = apiUrl + "create-checkout-session/" + data._id;

    const xhr = new XMLHttpRequest();

    // listen for `load` event
    xhr.onload = () => {
      // print JSON response
      if (xhr.status >= 200 && xhr.status < 300) {
        // parse JSON
        // const response = JSON.parse(xhr.responseText);
        window.location.replace(xhr.responseText);
      }
    };

    // open request
    xhr.open("POST", urlRequest);

    // set `Content-Type` header
    xhr.setRequestHeader("Content-Type", "application/json");

    // send rquest with JSON payload
    xhr.send();
  };

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
    productQuantity.className =
      "text-block-62 itemquantity quantity" + item.product.name;
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
      console.log("delete item " + item.product._id);
      const inputNumber = document.getElementById(
        item.product._id + "quantityInput"
      );
      inputNumber.value = 0;
      const ContainerItem = document.getElementById(
        item.product._id + "container"
      );
      ContainerItem.style.display = "none";
      console.log(ContainerItem);
      itemsOfRequest = itemsOfRequest.filter(
        (itemOfRequest) => itemOfRequest != item.product._id
      );
    });
    productContainer.appendChild(deleteItem);

    // const CategoryItemsContainer = document.getElementById(item.product._id);
    const allCatItemsContainers = document.getElementsByClassName(
      "productContainer" + item.product._id
    );
    // if (CategoryItemsContainer != null) {
    //   CategoryItemsContainer.appendChild(productContainer.cloneNode(true));
    // }
    if (allCatItemsContainers) {
      Object.values(allCatItemsContainers).forEach((catItemContainer) => {
        if (!catItemContainer.hasChildNodes())
          catItemContainer.appendChild(productContainer.cloneNode(true));
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
    productQuantity.className =
      "text-block-62 customitemquantity quantity" + item.name;
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
      const inputNumber = document.getElementById(
        item._id + "customquantityinput"
      );
      inputNumber.value = 0;
      const ContainerItem = document.getElementById(item._id);
      ContainerItem.style.display = "none";
    });
    productContainer.appendChild(deleteItem);
    customProductContainer.appendChild(productContainer);
  });
}

// fonction de validation des modifications
function validateUpdate(data) {
  let urlRequest = apiUrl + "validate-event-requests/" + data._id;

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
  xhr.open("POST", urlRequest);

  // set `Content-Type` header
  xhr.setRequestHeader("Content-Type", "application/json");

  // send rquest with JSON payload
  xhr.send();

  // envoie du mail au client ci-dessous
  sendMail(1, data);

  // rechargerment de la page après un cours délais
  setTimeout(function () {
    location.reload();
  }, 1000);
}

// fonction de refus des modifications
function rejectUpdate(data) {
  let urlRequest = apiUrl + "refuse-event-requests/" + data._id;

  const xhr = new XMLHttpRequest();

  const refusalReason = refusalReasonInput.value
    ? refusalReasonInput.value
    : "";

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
  xhr.open("POST", urlRequest);

  // set `Content-Type` header
  xhr.setRequestHeader("Content-Type", "application/json");

  // send rquest with JSON payload
  xhr.send(JSON.stringify({ refusalReason: refusalReason }));

  // envoie du mail au client ci-dessous
  sendMail(0, data);

  // rechargerment de la page après un cours délais
  setTimeout(function () {
    location.reload();
  }, 1000);
}

function sendMail(requestState, requestData) {
  let urlmailRequest = apiUrl + "request-mail/";

  const emails = requestData.event.emails.split(",").map((mail) => mail.trim());
  emails.map((email) => {
    var mailJson = {
      to: email,
      subject:
        "[VALIDATION] Demande de stand validée par " +
        requestData.client.firstName +
        " " +
        requestData.client.lastName +
        " de " +
        requestData.client.companyName,
      text:
        "Le client a validé la demande : https://imaginexpo.com/ie-admin/admin-detail-demande#" +
        requestData._id,
    };

    if (requestState === 0) {
      mailJson = {
        ...mailJson,
        subject:
          "[ANNULATION] Demande de stand annulée par " +
          requestData.client.firstName +
          " " +
          requestData.client.lastName +
          " de " +
          requestData.client.companyName,
        text:
          "Le client a annulé la demande : https://imaginexpo.com/ie-admin/admin-detail-demande#" +
          requestData._id,
      };
    }

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
  });
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
  document.getElementById("designUrlImg").setAttribute("src", designImageData);
}
