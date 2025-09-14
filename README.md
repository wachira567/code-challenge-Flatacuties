// Flatacuties App - Animal Voting System
// This app lets users view, add, and vote for their favorite animals

// Configuration
const API_BASE = "http://localhost:3000";
let selectedAnimal = null;

// Wait for DOM to load before initializing
document.addEventListener("DOMContentLoaded", function () {
  console.log("Flatacuties app initializing...");
  initApp();
});

// Main initialization function
function initApp() {
  // Get DOM elements
  const animalList = document.getElementById("addAnimalList");
  const detailsSection = document.getElementById("addAnimalDetails");
  const animalForm = document.getElementById("addAnimalForm");

  // Check if elements exist
  if (!animalList || !detailsSection || !animalForm) {
    console.error("Required DOM elements not found");
    return;
  }

  // Set up event listeners
  animalForm.addEventListener("submit", handleFormSubmit);

  // Load animals from server
  loadAnimals();
}

// Load all animals from the server
async function loadAnimals() {
  try {
    console.log("Fetching animals from server...");
    const response = await fetch(`${API_BASE}/characters`);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const animals = await response.json();
    displayAnimals(animals);
  } catch (error) {
    console.error("Could not load animals:", error);
    showError("Failed to load animals. Please try again later.");
  }
}

// Display the list of animals
function displayAnimals(animals) {
  const animalList = document.getElementById("addAnimalList");

  // Clear current list
  animalList.innerHTML = "";

  if (animals.length === 0) {
    animalList.innerHTML =
      "<li>No animals found. Add some using the form below!</li>";
    return;
  }

  // Create list items for each animal
  animals.forEach((animal) => {
    const listItem = document.createElement("li");
    listItem.textContent = animal.name;
    listItem.classList.add("animal-item");

    // Add click event to show details
    listItem.addEventListener("click", () => {
      showAnimalDetails(animal);
    });

    animalList.appendChild(listItem);
  });
}

// Show detailed view of a specific animal
function showAnimalDetails(animal) {
  selectedAnimal = animal;
  const detailsContainer = document.getElementById("addAnimalDetails");

  detailsContainer.innerHTML = `
    <div class="animal-detail-card">
      <h3>${animal.name}</h3>
      <img src="${animal.image}" alt="${animal.name}" class="animal-image">
      <div class="vote-section">
        <p class="vote-count">Current votes: <span id="voteDisplay">${animal.votes}</span></p>
        <div class="vote-controls">
          <button type="button" class="vote-btn upvote" onclick="handleVote(1)"> Upvote</button>
          <button type="button" class="vote-btn downvote" onclick="handleVote(-1)"> Downvote</button>
          <button type="button" class="vote-btn reset" onclick="resetVotes()">Reset Votes</button>
        </div>
      </div>
    </div>
  `;
}

// Handle voting for an animal
async function handleVote(voteChange) {
  if (!selectedAnimal) {
    alert("Please select an animal first");
    return;
  }

  try {
    // Calculate new vote count
    const newVotes = selectedAnimal.votes + voteChange;

    // Update on server
    const response = await fetch(
      `${API_BASE}/characters/${selectedAnimal.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ votes: newVotes }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update votes");
    }

    // Update local data and UI
    selectedAnimal.votes = newVotes;
    document.getElementById("voteDisplay").textContent = newVotes;
  } catch (error) {
    console.error("Error updating votes:", error);
    alert("Sorry, could not update votes. Please try again.");
  }
}

// Reset votes for the selected animal
async function resetVotes() {
  if (!selectedAnimal) return;

  try {
    const response = await fetch(
      `${API_BASE}/characters/${selectedAnimal.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ votes: 0 }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to reset votes");
    }

    // Update local data and UI
    selectedAnimal.votes = 0;
    document.getElementById("voteDisplay").textContent = 0;
  } catch (error) {
    console.error("Error resetting votes:", error);
    alert("Sorry, could not reset votes. Please try again.");
  }
}

// Handle form submission for adding new animals
async function handleFormSubmit(event) {
  event.preventDefault();

  // Get form values
  const nameInput = document.getElementById("nameAnimal");
  const imageInput = document.getElementById("imageAnimal");

  const name = nameInput.value.trim();
  const imageUrl = imageInput.value.trim();

  // Basic validation
  if (!name) {
    alert("Please enter an animal name");
    return;
  }

  if (!imageUrl) {
    alert("Please enter an image URL");
    return;
  }

  try {
    // Send POST request to add new animal
    const response = await fetch(`${API_BASE}/characters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        image: imageUrl,
        votes: 0,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add animal");
    }

    // Reset form and reload animals
    event.target.reset();
    loadAnimals();

    // Show success message
    alert(`Successfully added ${name}!`);
  } catch (error) {
    console.error("Error adding animal:", error);
    alert("Sorry, could not add the animal. Please try again.");
  }
}

// Show error message to user
function showError(message) {
  const detailsContainer = document.getElementById("addAnimalDetails");
  detailsContainer.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
    </div>
  `;
}
