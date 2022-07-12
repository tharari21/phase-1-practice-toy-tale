let addToy = false;
const toyCollection = document.querySelector("#toy-collection");
const createToyForm = document.querySelector(".add-toy-form");
let toys;
const fetchToys = async () => {
  // Gets list of toys
  const req = await fetch("http://localhost:3000/toys");
  const res = await req.json();
  toys = [...res];
  return res;
};
const createToy = async (body) => {
  // Creates a new toy using the body parameter
  const req = await fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const res = await req.json();
  toys.push(res);
  return res;
};
const updateToy = async (toyId, body) => {
  // Updates toy with id = toyId
  const req = await fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const res = await req.json();

  return res;
};

const renderToy = (toyContainer, toy) => {
  const toyName = document.createElement("h2");
  const toyImage = document.createElement("img");
  const toyLikes = document.createElement("p");
  const toyLikeButton = document.createElement("button");
  toyName.textContent = toy.name;
  toyImage.src = toy.image;
  toyImage.className = "toy-avatar";
  toyLikes.textContent = `${toy.likes} Likes`;
  toyLikeButton.textContent = "Like ❤️";
  toyLikeButton.className = "like-btn";
  toyLikeButton.id = toy.id;

  const incrementLikes = async (e) => {
    const likes = toy.likes + 1;
    toys[toy.id - 1].likes += 1;
    const res = await updateToy(e.target.id, { likes: likes });
    toyLikes.textContent = `${res.likes} Likes`;
  };

  toyLikeButton.addEventListener("click", incrementLikes);

  toyContainer.append(toyName, toyImage, toyLikes, toyLikeButton);
};

const renderToys = (toys) => {
  toys.forEach((toy) => {
    const toyDiv = document.createElement("div");
    toyDiv.className = "card";
    renderToy(toyDiv, toy);
    toyCollection.append(toyDiv);
  });
};
const createToyHandler = async (e) => {
  e.preventDefault();
  const newToy = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0,
  };
  await createToy(newToy);
  renderToys([newToy]);
};

document.addEventListener("DOMContentLoaded", async () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  createToyForm.addEventListener("submit", createToyHandler);

  const toys = await fetchToys();
  renderToys(toys);
});
