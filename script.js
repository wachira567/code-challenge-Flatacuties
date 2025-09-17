// Base address for the server
const API_URL = "http://localhost:3000";

// Keep track of the animal the user is currently viewing
let selectedAnimal = null;

// When the page is fully loaded, start the app
document.addEventListener("DOMContentLoaded", () => {
  console.log("Flatacuties app is starting...");
  setupApp();
});

// Main setup function
function setupApp() {
  const listArea = document.getElementById("addAnimalList");
  const detailsArea = document.getElementById("addAnimalDetails");
  const form = document.getElementById("addAnimalForm");

  // If the HTML elements we need are not found, stop here
  if (!listArea || !detailsArea || !form) {
    console.error(
      "Missing required parts of the page (list, details, or form)."
    );
    return;
  }

  // Make sure the form does not refresh the page
  form.addEventListener("submit", handleFormSubmit);

  // Load the first set of animals
  loadAnimals();
}

// Get animals from the server
async function loadAnimals() {
  try {
    const response = await fetch(`${API_URL}/characters`);
    if (!response.ok) throw new Error(`Server problem: ${response.status}`);

    const animals = await response.json();
    displayAnimalList(animals);
  } catch (error) {
    console.error("Could not load animals:", error);
    showError(
      "Animals could not be loaded. Please refresh or try again later."
    );
  }
}

// Show all animals in the list
function displayAnimalList(animals) {
  const list = document.getElementById("addAnimalList");
  list.innerHTML = "";

  if (animals.length === 0) {
    list.innerHTML = "<li>No animals yet. Add one below!</li>";
    return;
  }

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

// Show details of a single animal
function displayAnimalDetails(animal) {
  selectedAnimal = animal;
  const details = document.getElementById("addAnimalDetails");

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

  // Add button events
  document
    .getElementById("upvoteBtn")
    .addEventListener("click", () => changeVotes(1));
  document
    .getElementById("downvoteBtn")
    .addEventListener("click", () => changeVotes(-1));
  document.getElementById("resetBtn").addEventListener("click", resetVotes);
}

// Change the vote count
async function changeVotes(amount) {
  if (!selectedAnimal) {
    alert("Please pick an animal first.");
    return;
  }

  const updatedVotes = selectedAnimal.votes + amount;

  try {
    const response = await fetch(`${API_URL}/characters/${selectedAnimal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votes: updatedVotes }),
    });

    if (!response.ok) throw new Error("Server failed to update votes");

    selectedAnimal.votes = updatedVotes;
    document.getElementById("voteCount").textContent = updatedVotes;
  } catch (error) {
    console.error("Vote update failed:", error);
    alert("Could not update votes. Try again later.");
  }
}

// Reset votes back to zero
async function resetVotes() {
  if (!selectedAnimal) return;

  try {
    const response = await fetch(`${API_URL}/characters/${selectedAnimal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votes: 0 }),
    });

    if (!response.ok) throw new Error("Server failed to reset votes");

    selectedAnimal.votes = 0;
    document.getElementById("voteCount").textContent = 0;
  } catch (error) {
    console.error("Reset failed:", error);
    alert("Could not reset votes. Try again later.");
  }
}

// Add a new animal
async function handleFormSubmit(event) {
  event.preventDefault(); // stop form from refreshing the page

  const name = document.getElementById("nameAnimal").value.trim();
  const image = document.getElementById("imageAnimal").value.trim();

  if (!name) {
    alert("Please enter a name for the animal.");
    return;
  }

  if (!image) {
    alert("Please enter a picture URL.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/characters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image, votes: 0 }),
    });

    if (!response.ok) throw new Error("Server failed to add animal");

    event.target.reset(); // clear the form
    loadAnimals(); // reload the list
    alert(`${name} was added successfully!`);
  } catch (error) {
    console.error("Adding animal failed:", error);
    alert("Could not add the animal. Please try again later.");
  }
}

// Show error messages on the page
function showError(message) {
  const details = document.getElementById("addAnimalDetails");
  details.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
    </div>
  `;
}
