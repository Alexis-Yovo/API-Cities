document.addEventListener("DOMContentLoaded", () => {
    const regionsDropdown = document.getElementById("regions");
    const departementsDropdown = document.getElementById("departements");
    const communesTableBody = document.querySelector("#communes-table");
    const showCommunesButton = document.getElementById("show-communes");
    const geolocateButton = document.getElementById("geolocate");
    const myCityDiv = document.getElementById("my-city");

    const apiBase = "https://geo.api.gouv.fr";

    // Charger les régions
    fetch(`${apiBase}/regions`)
        .then(response => response.json())
        .then(regions => {
            regions.forEach(region => {
                const option = document.createElement("option");
                option.value = region.code;
                option.textContent = region.nom;
                regionsDropdown.appendChild(option);
            });
        });

    // Charger les départements lorsque la région change
    regionsDropdown.addEventListener("change", () => {
        const regionCode = regionsDropdown.value;
        departementsDropdown.innerHTML = ""; // Vider le menu
        if (regionCode) {
            fetch(`${apiBase}/regions/${regionCode}/departements`)
                .then(response => response.json())
                .then(departements => {
                    departements.forEach(departement => {
                        const option = document.createElement("option");
                        option.value = departement.code;
                        option.textContent = departement.nom;
                        departementsDropdown.appendChild(option);
                    });
                });
        }
    });

    // Afficher les communes
    showCommunesButton.addEventListener("click", () => {
        const departementCode = departementsDropdown.value;
        console.log(communesTableBody);
        communesTableBody.innerHTML = ""; // Vider le tableau
        if (departementCode) {
            fetch(`${apiBase}/departements/${departementCode}/communes`)
                .then(response => response.json())
                .then(communes => {
                    // Trier les communes par population décroissante
                    communes.sort((a, b) => b.population - a.population);

                    communes.forEach(commune => {
                        const row = document.createElement("tr");
                        row.innerHTML = `<td>${commune.nom}</td><td>${commune.population || "Non renseignée"}</td>`;
                        communesTableBody.appendChild(row);
                    });
                });
        }
    });

    // Géolocalisation et affichage des informations sur la ville actuelle
    geolocateButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetch(`${apiBase}/communes?lat=${latitude}&lon=${longitude}&fields=nom,population,surface,contour`)
                    .then(response => response.json())
                    .then(communes => {
                        if (communes.length > 0) {
                            const commune = communes[0];
                            myCityDiv.innerHTML = `
                                <p><strong>Ville :</strong> ${commune.nom}</p>
                                <p><strong>Population :</strong> ${commune.population || "Non renseignée"}</p>
                                <p><strong>Surface :</strong> ${commune.surface || "Non renseignée"} m²</p>
                            `;
                            // Appeler la fonction de Mapbox pour afficher la carte
                            displayMapWithMapbox(commune.contour.coordinates);
                        } else {
                            myCityDiv.textContent = "Ville non trouvée.";
                        }
                    });
            });
        } else {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
        }
    });
});
