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
