// différencier les liens prod / staging
let apiUrl = window.location.href.includes("webflow")
  ? new URL("https://imagin-expo-backend-api.int.at-digital.fr/api/v1/")
  : new URL("https://api.imaginexpo.com/api/v1/");

// variables qui seront remplies en fonction de l'event sélectionné
const EventCategories = [];
const ExcludedEventProducts = [];

// emplacement des prix de la requete et de la description de l'event
const RequestTotalHT = document.getElementById("RequestTotalHT");
const RequestTVA = document.getElementById("RequestTVA");
const RequestTotalTTC = document.getElementById("RequestTotalTTC");
const EventDescriptionContent = document.getElementById(
  "EventDescriptionContent"
);
const EventIllustrationContainer = document.getElementById(
  "eventIllustrationContainer"
);
const EventDescriptionImageContainer = document.getElementById(
  "EventDescriptionImageContainer"
);
const ExampleProductsListContainer = document.getElementById(
  "ExampleProductsContainer"
);
const EventContactContent = document.getElementById("EventContactContent");
const TVACheckBox = document.getElementById("TVACheckbox");
const TVAAmountText = document.getElementById("TVAAmountText");

// Container ou recuperer les infos à post
var EventID = "";
let AdminsMails = [];
const ClientLastName = document.getElementById("ClientLastName");
const ClientFirstName = document.getElementById("ClientFirstName");
const ClientEmail = document.getElementById("ClientEmail");
const ClientPhone = document.getElementById("ClientPhone");
const ClientAddress = document.getElementById("ClientAddress");
const ClientCompany = document.getElementById("ClientCompany");
const ClientNumTVA = document.getElementById("ClientNumTVA");
const ClientCivility = document.getElementById("ClientCivility");
const ClientBillingAddress = document.getElementById("ClientBillingAddress");
const ClientAccountantAddress = document.getElementById(
  "ClientAccountantAddress"
);
const RequestComment = document.getElementById("RequestComment");
const RequestHall = document.getElementById("RequestHall");
const RequestStandNumber = document.getElementById("RequestStandNumber");
const FurnitureCheckbox = document.getElementById("FurnitureCheckbox");
const emailIsSameCheckbox = document.getElementById("emailIsSame");

let isHallOptionTrue = true;
let defaultPaymentMethod = "";

const hallContainer = document.getElementById("hallContainer");
const furnitureCheckBoxContainer = document.getElementById(
  "furnitureCheckBoxContainer"
);

// dropdown des langues
const dropdownFR = document.getElementById("dropdownFR");
const dropdownEN = document.getElementById("dropdownEN");
let englishMode = false;
if (location.href.includes("creation-demande-en")) englishMode = true;

//Gestion input upload file
const fileUploadContainer = document.getElementById("fileUploadContainer");
const fileUploadInput = document.createElement("input");
const fileUploadLabel = document.createElement("div");
const fileUploadErrorMsg = document.createElement("div");
fileUploadErrorMsg.innerHTML = "Mauvais format";
fileUploadErrorMsg.style.color = "red";
fileUploadErrorMsg.style.display = "none";
fileUploadInput.setAttribute("type", "file");
fileUploadInput.setAttribute(
  "accept",
  "image/png, image/jpeg, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
);
// vérification du format du fichier envoyé
fileUploadInput.onchange = function () {
  const inputFile = document.querySelector('input[type="file"]');
  const StandImage = inputFile.files[0];
  if (
    StandImage.type === "image/png" ||
    StandImage.type === "image/jpeg" ||
    StandImage.type === "application/pdf" ||
    StandImage.type === "application/msword" ||
    StandImage.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    console.log("bon format");
    fileUploadErrorMsg.style.display = "none";
    // readFile(StandImage);
    proccessData(StandImage);
  } else {
    inputFile.value = "";
    fileUploadErrorMsg.style.display = "block";
  }
};
if (englishMode) {
  fileUploadLabel.innerHTML =
    "Add a plan of the stand (pdf/png/jpeg/word): </br><a href='https://uploads-ssl.webflow.com/63283f6411576d62955e222e/6447e9ae2f20206b5edfec44_Template%20plan%20de%20stand.pdf' target='_blank' style='color: grey; font-size: 14px'>Download a plan template</a>";
} else {
  fileUploadLabel.innerHTML =
    "Ajouter un plan du stand (pdf/png/jpeg/word): </br><a href='https://uploads-ssl.webflow.com/63283f6411576d62955e222e/6447e9ae2f20206b5edfec44_Template%20plan%20de%20stand.pdf' target='_blank' style='color: grey; font-size: 14px'>Télécharger un template de plan</a>";
}
fileUploadLabel.className = "text-block-53";
fileUploadContainer.appendChild(fileUploadLabel);
fileUploadContainer.appendChild(fileUploadInput);
fileUploadContainer.appendChild(fileUploadErrorMsg);

var lineItems = [];

//gestion de la tva
TVACheckBox.onchange = () => {
  if (TVACheckBox.checked) {
    TVAAmountText.innerHTML =
      TVAAmountText.innerHTML.substring(0, 3) === "TVA"
        ? "TVA À 20%"
        : "20% VAT";
    calculateTotal();
  } else {
    TVAAmountText.innerHTML =
      TVAAmountText.innerHTML.substring(0, 3) === "TVA" ? "TVA À 0%" : "0% VAT";
    calculateTotal();
  }
};

// email de facturation et comptable identiques traitements
ClientBillingAddress.style.display = "none";
emailIsSameCheckbox.onchange = () => {
  if (emailIsSameCheckbox.checked) {
    ClientBillingAddress.style.display = "none";
  } else {
    ClientBillingAddress.style.display = "block";
  }
};

// fonction qui récupère la data de l'event
function getEventData() {
  let requestEvent = new XMLHttpRequest();

  if (location.hash.replace("#", "") === "top") {
    location.replace("/services");
  }

  // Changer l'endpoint en ajoutant + 'newEndpoint'
  let urlEvent = apiUrl.toString() + "events/" + location.hash.replace("#", "");

  requestEvent.open("GET", urlEvent, true);
  requestEvent.setRequestHeader("ngrok-skip-browser-warning", 1);

  requestEvent.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.event;

    if (requestEvent.status >= 200 && requestEvent.status < 400) {
      EventID = data._id;
      AdminsMails = data.emails.split(",").map((email) => email.trim());
      defaultPaymentMethod = data.defaultPaymentMethod;
      EventDescriptionContent.innerHTML = data.description;
      if (englishMode) {
        EventContactContent.innerHTML =
          "<strong>Event contacts :</strong> </br><ul><li>Emails : " +
          data.emails +
          "</li><li>Phone number : " +
          data.phoneNumber +
          "</li></ul>";
      } else {
        EventContactContent.innerHTML =
          "<strong>Contacts de l'événement :</strong> </br><ul><li>Mails : " +
          data.emails +
          "</li><li>Téléphone : " +
          data.phoneNumber +
          "</li></ul>";
      }
      if (!data.furnitureOption) {
        furnitureCheckBoxContainer.style.display = "none";
      }
      if (!data.hallOption) {
        hallContainer.style.display = "none";
        isHallOptionTrue = false;
      }
      dropdownFR.onclick = () =>
        location.replace("/creation-demande#" + data._id);
      dropdownEN.onclick = () =>
        location.replace("/creation-demande-en#" + data._id);

      if (data.illustration)
        EventIllustrationContainer.innerHTML = `<img style="width: 100%" src="${data.illustration.image}">`;

      if (data.descriptionIllustration)
        EventDescriptionImageContainer.innerHTML = `<img style="width: 100%" src="${data.descriptionIllustration.image}">`;

      if (data.productExamples.length !== 0) {
        Object.values(data.productExamples).forEach((product) => {
          const exampleProductContainer = document.createElement("div");
          exampleProductContainer.className = "exempleproductcontainer";
          const titleAndImageContainer = document.createElement("div");
          titleAndImageContainer.className = "div-block-95";
          const title = document.createElement("div");
          title.className = "text-block-70";
          title.innerHTML = product.name;
          const image = document.createElement("img");
          image.src = product.image;
          titleAndImageContainer.appendChild(title);
          titleAndImageContainer.appendChild(image);
          const descriptionContainer = document.createElement("div");
          descriptionContainer.className = "div-block-96";
          const descriptionTitle = document.createElement("div");
          descriptionTitle.className = "text-block-71";
          descriptionTitle.innerHTML = "Dimensions et tarif";
          const description = document.createElement("div");
          description.innerHTML = product.description;
          descriptionContainer.appendChild(descriptionTitle);
          descriptionContainer.appendChild(description);
          exampleProductContainer.appendChild(titleAndImageContainer);
          exampleProductContainer.appendChild(descriptionContainer);

          ExampleProductsListContainer.appendChild(exampleProductContainer);
        });
      } else {
        englishMode
          ? (ExampleProductsListContainer.innerHTML =
              "No product examples available...")
          : (ExampleProductsListContainer.innerHTML =
              "Pas d'exemples de produits disponibles...");
      }

      // lister les produits exclus
      Object.values(data.excludedProducts).forEach((product) => {
        ExcludedEventProducts.push(product._id);
      });

      // lister les catégories de l'event
      Object.values(data.categories).forEach((category) => {
        EventCategories.push(category._id);
      });

      getCatData();
    }
  };
  requestEvent.send();
}

(function () {
  getEventData();
})();

// fonction qui récupère les catégories liées à l'event
function getCatData() {
  let requestCat = new XMLHttpRequest();

  // Changer l'endpoint en ajoutant + 'newEndpoint'
  let urlCat = apiUrl.toString() + "categories";

  requestCat.open("GET", urlCat, true);
  requestCat.setRequestHeader("ngrok-skip-browser-warning", 1);

  requestCat.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.categories;

    if (requestCat.status >= 200 && requestCat.status < 400) {
      const AllCatContainer = document.getElementById("AllCatContainer");

      Object.values(data).forEach((category) => {
        // vérification de si la catégorie est bien dans l'event (pas exclue)
        if (EventCategories.indexOf(category._id) > -1) {
          // haut du tableau d'une catégorie
          const TableTop = document.createElement("div");
          TableTop.className = "div-block-38";

          // partie infos catégorie du haut du tableau
          const CatLine = document.createElement("div");
          CatLine.className = "div-block-37";
          const CatName = document.createElement("p");
          CatName.style.margin = "0px";
          CatName.className = "text-block-17";
          CatName.innerHTML = category.name;
          const CatTotal = document.createElement("p");
          CatTotal.style.margin = "0px";
          CatTotal.className = "text-block-18";
          CatTotal.innerHTML = "Total";

          // parties prix du haut du tableau
          const Puht = document.createElement("p");
          Puht.style.margin = "0px";
          Puht.className = "text-block-19";
          if (englishMode) {
            Puht.innerHTML = "Unit price excl tax";
          } else {
            Puht.innerHTML = "P.U. HT";
          }
          const Ptht = document.createElement("p");
          Ptht.style.margin = "0px";
          Ptht.className = "text-block-19";
          if (englishMode) {
            Ptht.innerHTML = "total price excl tax";
          } else {
            Ptht.innerHTML = "P.T. HT";
          }

          // tous les appendChild
          CatLine.appendChild(CatName);
          CatLine.appendChild(CatTotal);
          TableTop.appendChild(CatLine);
          TableTop.appendChild(Puht);
          TableTop.appendChild(Ptht);
          AllCatContainer.appendChild(TableTop);

          // création des lignes product qui seront mises dans les catégories
          const TableBottom = document.createElement("div");
          TableBottom.style.display = "flex";
          TableBottom.style.flexDirection = "column";
          TableBottom.style.rowGap = "10px";
          Object.values(category.products).forEach((product) => {
            // vérification de si le produits n'est pas exclus
            if (!(ExcludedEventProducts.indexOf(product._id) > -1)) {
              // Ligne d'un produit
              const GlobalLine = document.createElement("div");
              GlobalLine.style.display = "flex";
              GlobalLine.style.justifyContent = "space-between";
              GlobalLine.style.alignItems = "center";

              // Div contenant les infos du produit
              const ProductLine = document.createElement("div");
              ProductLine.className = "div-block-41";
              const ProductName = document.createElement("p");
              ProductName.style.margin = "0px";
              ProductName.className = "text-block-23";
              ProductName.innerHTML = product.name;
              const ProductDescription = document.createElement("p");
              ProductDescription.style.margin = "0px";
              ProductDescription.className = "text-block-26";
              ProductDescription.innerHTML = product.description;
              const NumberInput = document.createElement("input");
              // number input pour pouvoir modifier la quantité du produit
              NumberInput.className = "text-field-6 w-input";
              NumberInput.style.width = "10%";
              NumberInput.setAttribute("type", "number");
              NumberInput.setAttribute("min", "0");
              NumberInput.value = 0;
              NumberInput.onchange = function () {
                // modification des infos des produits qui seront envoyés à la bdd
                updateEventRequest(
                  category._id,
                  product._id,
                  NumberInput.value,
                  product.price.amount
                );
                // modification du prix en fonction de la nouvelle valeur
                updatePrice(NumberInput.value);
              };

              // infos du prix du produit
              const productPrice = document.createElement("p");
              productPrice.style.margin = "0px";
              productPrice.className = "prices";
              productPrice.innerHTML = Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(product.price.amount);
              const productTotalPrice = document.createElement("p");
              productTotalPrice.style.margin = "0px";
              productTotalPrice.className = "totalprices";
              productTotalPrice.innerHTML = "0,00 €";

              // les appendchilds
              ProductLine.appendChild(ProductName);
              ProductLine.appendChild(ProductDescription);
              ProductLine.appendChild(NumberInput);
              GlobalLine.appendChild(ProductLine);
              GlobalLine.appendChild(productPrice);
              GlobalLine.appendChild(productTotalPrice);
              TableBottom.appendChild(GlobalLine);
              AllCatContainer.appendChild(TableBottom);

              // fonction qui modifie le prix en fonction de la quantité mise dans l'input number
              function updatePrice(nb) {
                productTotalPrice.innerHTML = Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(product.price.amount * nb);
                // appel de la fonction permettant de modifier les prix affiché en bas de la création de la requete
                (function () {
                  calculateTotal();
                })();
              }
            }
          });
        }
      });

      // appel de la fonction permettant de modifier les prix affiché en bas de la création de la requete
      (function () {
        calculateTotal();
      })();
    }
  };
  requestCat.send();
}

// Mise à jour de la variable des infos des produits qui seront envoyé à la bdd
async function updateEventRequest(categoryId, productId, qty, price) {
  const uniqueId = `${categoryId}-${productId}`;

  const isItemAlreadySelected = lineItems.find(
    (item) => item.uniqueId === uniqueId
  );
  const quantity = +qty;

  // vérification de si le produits est pas déjà présent dans la variable lineItems
  if (isItemAlreadySelected) {
    if (quantity < 1) {
      lineItems = lineItems.filter((item) => item.uniqueId !== uniqueId);
    } else {
      lineItems = lineItems.map((item) => {
        if (item.uniqueId === uniqueId) {
          item.quantity = quantity;
        }

        return item;
      });
    }
  } else {
    if (quantity < 1) return;
    lineItems.push({
      uniqueId,
      product: productId,
      quantity: quantity,
      price,
    });
  }
}

// fonction permettant d'afficher les prix de la requette entière en fonction des produits et de leur quantité
function calculateTotal() {
  var globalTotalPrice = 0;

  lineItems.map((item) => {
    globalTotalPrice += item.price * item.quantity;
  });

  let TVA = globalTotalPrice * 0.2;
  if (!TVACheckBox.checked) TVA = 0;
  RequestTotalHT.innerHTML = Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(globalTotalPrice);
  RequestTVA.innerHTML = Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(TVA);
  RequestTotalTTC.innerHTML = Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(TVA + globalTotalPrice);
}

var designImageData = "";

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

// fonction d'envoie de la requete
const ButtonSendRequest = document.getElementById("ButtonSendRequest");
ButtonSendRequest.onclick = function (event) {
  event.preventDefault();

  if (
    !ClientCivility.value ||
    !ClientFirstName.value ||
    !ClientLastName.value ||
    !ClientEmail.value ||
    !ClientPhone.value ||
    !ClientAddress.value ||
    !ClientCompany.value ||
    !ClientNumTVA.value
  ) {
    document.getElementById("ErrorSentForm").style.display = "block";
    englishMode
      ? (document.getElementById("ErrorSentForm").innerHTML =
          "A field is empty")
      : (document.getElementById("ErrorSentForm").innerHTML =
          "Un champ est vide");
    return;
  }

  const RegexTVA = /^[a-zA-Z0-9\s]{9,20}$/;
  if (!RegexTVA.test(ClientNumTVA.value)) {
    document.getElementById("ErrorSentForm").style.display = "block";
    englishMode
      ? (document.getElementById("ErrorSentForm").innerHTML =
          "VAT number is incorrect")
      : (document.getElementById("ErrorSentForm").innerHTML =
          "Le numéro de TVA n'est pas bon");
    return;
  }

  var furniture = false;
  if (FurnitureCheckbox.checked) {
    furniture = true;
  }

  let billingAddress = ClientBillingAddress.value;
  if (emailIsSameCheckbox.checked || !ClientBillingAddress.value)
    billingAddress = ClientEmail.value;

  // json qui sera envoyé avec les infos de la requete
  const json = {
    eventRequest: {
      event: EventID,
      client: {
        civility: ClientCivility.value,
        firstName: ClientFirstName.value,
        lastName: ClientLastName.value,
        email: ClientEmail.value,
        phone: ClientPhone.value,
        billingAddress: billingAddress,
        // accountantAddress: accountantAddress,
        address: {
          formattedAddress: ClientAddress.value,
        },
        companyName: ClientCompany.value,
        numTVA: ClientNumTVA.value,
        isSubjectToTVA: TVACheckBox.checked ? true : false,
      },
      designImageData: designImageData,
      furniture: furniture,
      hall: RequestHall.value,
      standNumber: RequestStandNumber.value,
      paymentOnline: defaultPaymentMethod === "online" ? true : false,
      lineItems,
      paymentExpirationDate: new Date(),
      comment: RequestComment.value,
    },
  };

  let urlrequest = apiUrl.toString() + "event-requests";

  const xhr = new XMLHttpRequest();

  // listen for `load` event
  xhr.onload = () => {
    // print JSON response
    if (xhr.status >= 200 && xhr.status < 300) {
      // parse JSON
      const response = JSON.parse(xhr.responseText);
      console.log(response);
      document.getElementById("SuccessFormMessage").style.display = "flex";
      document.getElementById("sendStandRequestForm").style.display = "none";
      document.getElementById("ErrorSentForm").style.display = "none";
      document.getElementById("closeFormCross").style.display = "none";
      sendRequestRecapMail(response);
      sendRequestMailToAdmins(response);
    } else {
      document.getElementById("ErrorSentForm").style.display = "block";
      englishMode
        ? (document.getElementById("ErrorSentForm").innerHTML =
            "Incorrect e-mail addresses or phone number")
        : (document.getElementById("ErrorSentForm").innerHTML =
            "Les addresses mail ou le numéro de téléphone sont incorrects");
    }
  };

  // open request
  xhr.open("POST", urlrequest);

  // set `Content-Type` header
  xhr.setRequestHeader("Content-Type", "application/json");

  // send rquest with JSON payload
  xhr.send(JSON.stringify(json));
};

// fonction d'envoie du mail de récapitulatif
function sendRequestRecapMail(response) {
  const json = {
    to: response.eventRequest.client.email,
    text:
      "Voici votre récapitulatif de demande de stand chez IMAGIN'EXPO : https://imaginexpo.com/recapitulatif-demande-de-stand#" +
      response.eventRequest._id,
    subject: "[IMAGIN'EXPO] Récapitulatif de stand",
  };

  let urlMailRequest = apiUrl.toString() + "request-mail";

  const mailHttpRequest = new XMLHttpRequest();

  // listen for `load` event
  mailHttpRequest.onload = () => {
    // print JSON response
    if (mailHttpRequest.status >= 200 && mailHttpRequest.status < 300) {
      // parse JSON
      const responsemail = JSON.parse(mailHttpRequest.responseText);
      console.log(responsemail);
    }
  };

  // open request
  mailHttpRequest.open("POST", urlMailRequest);

  // set `Content-Type` header
  mailHttpRequest.setRequestHeader("Content-Type", "application/json");

  // send rquest with JSON payload
  mailHttpRequest.send(JSON.stringify(json));
}

// fonction d'envoie du mail de récapitulatif
function sendRequestMailToAdmins(response) {
  AdminsMails.map((admin) => {
    const json = {
      to: admin,
      text:
        "Une nouvelle demande de stand IMAGIN'EXPO est disponible : https://imaginexpo.com/ie-admin/admin-detail-demande#" +
        response.eventRequest._id,
      subject: "Nouvelle demande de stand",
    };

    let urlMailRequest = apiUrl.toString() + "request-mail";

    const mailHttpRequest = new XMLHttpRequest();

    // listen for `load` event
    mailHttpRequest.onload = () => {
      // print JSON response
      if (mailHttpRequest.status >= 200 && mailHttpRequest.status < 300) {
        // parse JSON
        const responsemail = JSON.parse(mailHttpRequest.responseText);
        console.log(responsemail);
      }
    };

    // open request
    mailHttpRequest.open("POST", urlMailRequest);

    // set `Content-Type` header
    mailHttpRequest.setRequestHeader("Content-Type", "application/json");

    // send rquest with JSON payload
    mailHttpRequest.send(JSON.stringify(json));
  });
}

// affichage du formulaire d'infos client quand les produits ont étés bien remplis
const getInfoClientContainer = document.getElementById(
  "getInfoClientContainer"
);
const NextStepButton = document.getElementById("NextStepButton");
const errorRequestFirstPart = document.getElementById("errorRequestFirstPart");
const errorRequestNoItem = document.getElementById("errorRequestNoItem");
NextStepButton.onclick = function () {
  if (RequestStandNumber.value === "") {
    errorRequestFirstPart.style.display = "block";
  } else if (lineItems.length < 1) {
    errorRequestNoItem.style.display = "block";
  } else {
    getInfoClientContainer.style.display = "block";
    errorRequestFirstPart.style.display = "none";
    errorRequestNoItem.style.display = "none";
  }
};
