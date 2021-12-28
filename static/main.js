const selectAllButton = document.querySelector("#select-all");
const deselectAllButton = document.querySelector("#deselect-all");

selectAllButton.addEventListener("click", () => {
  const checkboxes = document.querySelectorAll("#urls");

  checkboxes.forEach((node) => {
    node.checked = true;
  });
});

deselectAllButton.addEventListener("click", () => {
  const checkboxes = document.querySelectorAll("#urls");

  checkboxes.forEach((node) => {
    node.checked = false;
  });
});

const createNewspaperForm = document.querySelector("#create-newspaper");

createNewspaperForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedArticleIds = Array.from(document.querySelectorAll("#urls"))
    .filter((node) => node.checked)
    .map((node) => node.name);

  if (selectedArticleIds.length === 0) {
    return;
  }

  const csrfToken = document.querySelector(
    'form#create-newspaper > input[name="_csrf"]'
  )?.value;

  return fetch("/create-newspaper", {
    method: "POST",
    body: JSON.stringify({
      _csrf: csrfToken,
      articleIds: selectedArticleIds,
    }),
  });
});
