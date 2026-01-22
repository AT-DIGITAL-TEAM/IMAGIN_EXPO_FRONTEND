// différencier les liens prod / staging
let apiLink = window.location.href.includes("webflow")
  ? new URL("https://staging-imagin-expo-backend-api.apps.imaginexpo.com/api/v1/")
  : new URL("https://api.imaginexpo.com/api/v1/");

const PresentationForm = document.getElementById("dlPresentationForm");
PresentationForm.addEventListener("submit", downloadPresentation);

const CatalogForm = document.getElementById("dlCatalogForm");
CatalogForm.addEventListener("submit", downloadCatalog);

function downloadCatalog(event) {
  event.preventDefault();
  const json = {
    content: "Catalogue Partenaire Mobilier",
    name: document.getElementById("dlCatalogName").value,
    email: document.getElementById("dlCatalogEmail").value,
    phone: document.getElementById("dlCatalogPhone").value,
    company: document.getElementById("dlCatalogCompany").value,
  };

  let urlrequest = apiLink.toString() + "downloadCatalog";

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
  xhr.open("POST", urlrequest);

  // set `Content-Type` header
  xhr.setRequestHeader("Content-Type", "application/json");

  // send rquest with JSON payload
  xhr.send(JSON.stringify(json));

  var link = document.createElement("a");
  link.setAttribute("download", "Catalogue Partenaire Mobilier");
  link.setAttribute("target", "_blank");
  link.href = "http://pfjr1545.odns.fr/imaginexpo/catalogue-aliance-mobilier.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadPresentation(event) {
  event.preventDefault();
  const json = {
    content: "Présentation IMAGIN'EXPO",
    name: document.getElementById("dlPresentationName").value,
    email: document.getElementById("dlPresentationEmail").value,
    phone: document.getElementById("dlPresentationPhone").value,
    company: document.getElementById("dlPresentationCompany").value,
  };

  let urlrequest = apiLink.toString() + "downloadCatalog";

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
  xhr.open("POST", urlrequest);

  // set `Content-Type` header
  xhr.setRequestHeader("Content-Type", "application/json");

  // send rquest with JSON payload
  xhr.send(JSON.stringify(json));

  var link = document.createElement("a");
  link.setAttribute("download", "Présentation Imagin Expo");
  link.setAttribute("target", "_blank");
  link.href =
    "https://uploads-ssl.webflow.com/63283f6411576d62955e222e/6446763c5329956f2699a131_Plaquette%20IG%20IE.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
