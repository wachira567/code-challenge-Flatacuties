const serverUrl = "http://localhost:3000";
let currentAnimal = null;

document.addEventListener("DOMContentLoaded", function () {
  loadAnimals();
});

// Get animals from server
async function loadAnimals() {
  try {
    const response = await fetch(`${serverUrl}/characters`);
    const animalData = await response.json();
    showAnimalList(animalData);
  } catch (error) {
    console.log("Oops, couldn't load animals", error);
  }
}

// Put animals in the list
function showAnimalList(animals) {
  const listElement = document.getElementById("addAnimalList");
  listElement.innerHTML = "";

  animals.forEach((animal) => {
    const item = document.createElement("li");
    item.textContent = animal.name;

    item.addEventListener("click", function () {
      showAnimal(animal);
    });

    listElement.appendChild(item);
  });
}

// Show animal details when clicked
function showAnimal(animal) {
  currentAnimal = animal;
  const detailsBox = document.getElementById("addAnimalDetails");

  detailsBox.innerHTML = `
    <div>
      <h3>${animal.name}</h3>
      <img src="${animal.image}" alt="${animal.name}" width="200">
      <p>Votes: <span class="vote-number">${animal.votes}</span></p>
      <div>
        <button onclick="addVote(1)"> Vote Up</button>
        <button onclick="addVote(-1)"> Vote Down</button>
      </div>
    </div>
  `;
}

// Handle voting buttons
async function addVote(change) {
  if (!currentAnimal) return;

  try {
    const newVoteCount = currentAnimal.votes + change;

    // Update server
    await fetch(`${serverUrl}/characters/${currentAnimal.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ votes: newVoteCount }),
    });

    currentAnimal.votes = newVoteCount;
    document.querySelector(".vote-number").textContent = newVoteCount;
  } catch (error) {
    console.log("Couldn't update votes", error);
  }
}
