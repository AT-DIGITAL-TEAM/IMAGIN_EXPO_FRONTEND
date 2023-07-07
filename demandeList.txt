let apiUrl = new URL(
  "https://imagin-expo-backend-api.int.at-digital.fr/api/v1/"
);

let currentPage = 1;
let currentRequestLength = 0;

let currentPageRequestOver = 1;
let currentRequestLengthRequestOver = 0;

const requestContainer = document.getElementById("requestContainer");
const PageNumberIndicator = document.getElementById("pageNumber");

const requestOverContainer = document.getElementById("requestOverContainer");
const RequestOverPageNumberIndicator = document.getElementById(
  "RequestOverPageNumber"
);

PageNumberIndicator.innerHTML = "Page " + currentPage;
RequestOverPageNumberIndicator.innerHTML = "Page " + currentPageRequestOver;

function getData(page) {
  while (requestContainer.firstChild) {
    requestContainer.firstChild.remove();
  }

  let request = new XMLHttpRequest();

  let url = apiUrl.toString() + "event-requests" + page;

  request.open("GET", url, true);
  request.setRequestHeader("ngrok-skip-browser-warning", 1);

  request.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.eventRequests;

    currentRequestLength = data.length;
    if (request.status >= 200 && request.status < 400) {
      // Manipuler les données reçues ici en fonction des ID du site

      Object.values(data).forEach((eventRequests) => {
        const standRequest = document.createElement("div");

        standRequest.className = "demandelignesstyle";

        const demandeId = document.createElement("p");
        demandeId.innerHTML = eventRequests.orderNumber;
        demandeId.style.marginBottom = "0px";
        demandeId.style.width = "15%";
        standRequest.appendChild(demandeId);
        const nom = document.createElement("p");
        nom.innerHTML =
          eventRequests.client.lastName + " " + eventRequests.client.firstName;
        nom.style.marginBottom = "0px";
        nom.style.width = "15%";
        standRequest.appendChild(nom);
        const event = document.createElement("p");
        event.innerHTML = eventRequests.event.name;
        event.style.marginBottom = "0px";
        event.style.width = "15%";
        standRequest.appendChild(event);
        const paiement = document.createElement("p");
        if (eventRequests.isPaid) {
          paiement.innerHTML = "Payé";
        } else {
          paiement.innerHTML = "Non payé";
        }
        paiement.style.marginBottom = "0px";
        paiement.style.width = "15%";
        standRequest.appendChild(paiement);
        const prix = document.createElement("p");
        prix.innerHTML = Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(eventRequests.total.totalWithoutTax);
        prix.style.marginBottom = "0px";
        prix.style.width = "15%";
        standRequest.appendChild(prix);
        const demande = document.createElement("p");
        switch (eventRequests.status) {
          case 0:
            demande.innerHTML = "Nouveau";
            demande.className = "demandestatenouveau";
            break;
          case 5:
            demande.innerHTML = "En Attente";
            demande.className = "demandestateattente";
            break;
          case 15:
            demande.innerHTML = "Confirmée";
            demande.className = "demandestateconfirme";
            break;
          case 20:
            demande.innerHTML = "Refusée";
            demande.className = "demandestaterejete";
            break;
          default:
            demande.innerHTML = "error";
        }
        demande.style.marginBottom = "0px";
        demande.style.width = "15%";
        demande.style.textAlign = "center";
        standRequest.appendChild(demande);
        const detailButton = document.createElement("a");
        detailButton.innerHTML = "Détails";
        detailButton.setAttribute(
          "href",
          "/admin/admin-detail-demande#" + eventRequests._id
        );
        detailButton.style.marginBottom = "0px";
        detailButton.style.width = "15%";
        standRequest.appendChild(detailButton);

        requestContainer.appendChild(standRequest);
      });
    }
  };

  request.send();
}

function getDataRequestOver(page) {
  while (requestOverContainer.firstChild) {
    requestOverContainer.firstChild.remove();
  }

  let request = new XMLHttpRequest();

  let url = apiUrl.toString() + "event-requests-over" + page;

  request.open("GET", url, true);
  request.setRequestHeader("ngrok-skip-browser-warning", 1);

  request.onload = function () {
    let dataBrut = JSON.parse(this.response);
    let data = dataBrut.eventRequests;

    currentRequestLength = data.length;
    if (request.status >= 200 && request.status < 400) {
      // Manipuler les données reçues ici en fonction des ID du site

      Object.values(data).forEach((eventRequests) => {
        console.log(eventRequests);
        const standRequest = document.createElement("div");

        standRequest.className = "demandelignesstyle";

        const demandeId = document.createElement("p");
        demandeId.innerHTML = eventRequests.orderNumber;
        demandeId.style.marginBottom = "0px";
        demandeId.style.width = "15%";
        standRequest.appendChild(demandeId);
        const nom = document.createElement("p");
        nom.innerHTML =
          eventRequests.client.lastName + " " + eventRequests.client.firstName;
        nom.style.marginBottom = "0px";
        nom.style.width = "15%";
        standRequest.appendChild(nom);
        const event = document.createElement("p");
        event.innerHTML = eventRequests.event.name;
        event.style.marginBottom = "0px";
        event.style.width = "15%";
        standRequest.appendChild(event);
        const paiement = document.createElement("p");
        if (eventRequests.isPaid) {
          paiement.innerHTML = "Payé";
        } else {
          paiement.innerHTML = "Non payé";
        }
        paiement.style.marginBottom = "0px";
        paiement.style.width = "15%";
        standRequest.appendChild(paiement);
        const prix = document.createElement("p");
        prix.innerHTML = Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(eventRequests.total.totalWithoutTax);
        prix.style.marginBottom = "0px";
        prix.style.width = "15%";
        standRequest.appendChild(prix);
        const demande = document.createElement("p");
        switch (eventRequests.status) {
          case 0:
            demande.innerHTML = "Nouveau";
            demande.className = "demandestatenouveau";
            break;
          case 5:
            demande.innerHTML = "En Attente";
            demande.className = "demandestateattente";
            break;
          case 15:
            demande.innerHTML = "Confirmée";
            demande.className = "demandestateconfirme";
            break;
          case 20:
            demande.innerHTML = "Refusée";
            demande.className = "demandestaterejete";
            break;
          case 25:
            demande.innerHTML = "Clôturée";
            demande.className = "demandestateconfirme";
            break;
          default:
            demande.innerHTML = "error";
        }
        demande.style.marginBottom = "0px";
        demande.style.width = "15%";
        demande.style.textAlign = "center";
        standRequest.appendChild(demande);
        const detailButton = document.createElement("a");
        detailButton.innerHTML = "Détails";
        detailButton.setAttribute(
          "href",
          "/admin/admin-detail-demande#" + eventRequests._id
        );
        detailButton.style.marginBottom = "0px";
        detailButton.style.width = "15%";
        standRequest.appendChild(detailButton);

        requestOverContainer.appendChild(standRequest);
      });
    }
  };

  request.send();
}

(function () {
  getData("?p=1");
  getDataRequestOver("?p=1");
})();

// configuration des boutons pour changer de pages dans les demandes de stands
const NextButton = document.getElementById("nextPageRequest");
const PreviousButton = document.getElementById("previousPageRequest");

const NextButtonRequestOver = document.getElementById("nextPageRequestOver");
const PreviousButtonRequestOver = document.getElementById(
  "previousPageRequestOver"
);

NextButton.onclick = function () {
  if (currentRequestLength === 10) {
    currentPage = currentPage + 1;
    PageNumberIndicator.innerHTML = "Page " + currentPage;
    getData("?p=" + currentPage);
  }
};

PreviousButton.onclick = function () {
  if (currentPage != 1) {
    currentPage = currentPage - 1;
    PageNumberIndicator.innerHTML = "Page " + currentPage;
    getData("?p=" + currentPage);
  }
};

NextButtonRequestOver.onclick = function () {
  if (currentRequestLengthRequestOver === 10) {
    currentPageRequestOver = currentPageRequestOver + 1;
    RequestOverPageNumberIndicator.innerHTML = "Page " + currentPageRequestOver;
    getData("?p=" + currentPageRequestOver);
  }
};

PreviousButtonRequestOver.onclick = function () {
  if (currentPageRequestOver != 1) {
    currentPageRequestOver = currentPageRequestOver - 1;
    RequestOverPageNumberIndicator.innerHTML = "Page " + currentPageRequestOver;
    getData("?p=" + currentPageRequestOver);
  }
};
