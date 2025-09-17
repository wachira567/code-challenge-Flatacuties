const API_URL = "http://localhost:3000";

let selectedAnimal = null;

document.addEventListener("DOMContentLoaded", () => {
  console.log("Flatacuties is up and running...");
  setupApp();
});

function setupApp() {
  const listArea = document.getElementById("addAnimalList");
  const detailsArea = document.getElementById("addAnimalDetails");
  const form = document.getElementById("addAnimalForm");

  // stop here if page pieces are missing
  if (!listArea || !detailsArea || !form) {
    console.error("Page setup looks incomplete. Check your HTML.");
    return;
  }

  // stop form from refreshing the page
  form.addEventListener("submit", handleFormSubmit);

  // load animals when app starts
  loadAnimals();
}

async function loadAnimals() {
  try {
    const response = await fetch(`${API_URL}/characters`);
    if (!response.ok)
      throw new Error(`Problem with server: ${response.status}`);

    const animals = await response.json();
    displayAnimalList(animals);
  } catch (error) {
    console.error("Couldn't fetch animals:", error);
    showError(
      "Sorry, animals couldn't be loaded. Try refreshing the page later."
    );
  }
}

function displayAnimalList(animals) {
  const list = document.getElementById("addAnimalList");
  list.innerHTML = "";

  if (animals.length === 0) {
    list.innerHTML = "<li>No animals yet. Add one below!</li>";
    return;
  }

  // show all animals in the left list
  animals.forEach((animal) => {
    const listItem = document.createElement("li");
    listItem.textContent = animal.name;
    listItem.classList.add("animal-item");

    listItem.addEventListener("click", () => {
      displayAnimalDetails(animal);
    });

    list.appendChild(listItem);
  });
}

function displayAnimalDetails(animal) {
  selectedAnimal = animal;
  const details = document.getElementById("addAnimalDetails");

  // main card for one animal
  details.innerHTML = `
    <div class="animal-detail-card">
      <h3>${animal.name}</h3>
      <img src="${animal.image}" alt="${animal.name}" class="animal-image">
      <div class="vote-section">
        <p>Votes: <span id="voteCount">${animal.votes}</span></p>
        <div class="vote-controls">
          <button id="upvoteBtn" type="button">Upvote</button>
          <button id="downvoteBtn" type="button">Downvote</button>
          <button id="resetBtn" type="button">Reset</button>
        </div>
      </div>
    </div>
  `;

  // hook up buttons
  document
    .getElementById("upvoteBtn")
    .addEventListener("click", () => changeVotes(1));
  document
    .getElementById("downvoteBtn")
    .addEventListener("click", () => changeVotes(-1));
  document.getElementById("resetBtn").addEventListener("click", resetVotes);
}

async function changeVotes(amount) {
  if (!selectedAnimal) {
    alert("Pick an animal first before voting.");
    return;
  }

  const updatedVotes = selectedAnimal.votes + amount;

  try {
    const response = await fetch(`${API_URL}/characters/${selectedAnimal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votes: updatedVotes }),
    });

    if (!response.ok) throw new Error("Couldn't update votes on the server");

    // update page with new vote count
    selectedAnimal.votes = updatedVotes;
    document.getElementById("voteCount").textContent = updatedVotes;
  } catch (error) {
    console.error("Updating votes didn't work:", error);
    alert("Couldn't save your vote. Please try again in a bit.");
  }
}

async function resetVotes() {
  if (!selectedAnimal) return;

  try {
    const response = await fetch(`${API_URL}/characters/${selectedAnimal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votes: 0 }),
    });

    if (!response.ok) throw new Error("Couldn't reset votes on the server");

    // reset count back to zero
    selectedAnimal.votes = 0;
    document.getElementById("voteCount").textContent = 0;
  } catch (error) {
    console.error("Reset didn't work:", error);
    alert("Couldn't reset the votes right now. Try again later.");
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("nameAnimal").value.trim();
  const image = document.getElementById("imageAnimal").value.trim();

  if (!name) {
    alert("Please give your animal a name.");
    return;
  }

  if (!image) {
    alert("Please provide a picture URL.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/characters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image, votes: 0 }),
    });

    if (!response.ok) throw new Error("Couldn't add the animal on the server");

    event.target.reset();
    loadAnimals();
    alert(`${name} has been added successfully.`);
  } catch (error) {
    console.error("Adding a new animal didn't work:", error);
    alert("Couldn't add the animal. Please try again later.");
  }
}

function showError(message) {
  const details = document.getElementById("addAnimalDetails");
  details.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
    </div>
  `;
}
