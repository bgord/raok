const selectAllButton = document.querySelector("#select-all");
const deselectAllButton = document.querySelector("#deselect-all");

selectAllButton?.addEventListener("click", () => {
  const checkboxes = document.querySelectorAll("#urls");

  checkboxes.forEach((node) => {
    node.checked = true;
  });
});

deselectAllButton?.addEventListener("click", () => {
  const checkboxes = document.querySelectorAll("#urls");

  checkboxes.forEach((node) => {
    node.checked = false;
  });
});

const createNewspaperForm = document.querySelector("#create-newspaper");

createNewspaperForm?.addEventListener("submit", async (event) => {
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

  const response = await fetch("/create-newspaper", {
    method: "POST",
    mode: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify({
      _csrf: csrfToken,
      articleIds: selectedArticleIds,
    }),
  });

  if (response.ok) {
    window.location.reload();
  }
});

const timestamps = [...document.querySelectorAll("[data-timestamp]")];

for (const timestamp of timestamps) {
  const placement = timestamp.dataset.placement;

  const formattedDate = new Date(
    Number(timestamp.dataset.timestamp)
  ).toLocaleString();

  if (placement?.includes("title")) {
    timestamp.title = formattedDate;
  }

  if (placement?.includes("inside")) {
    timestamp.innerHTML = formattedDate;
  }
}

const toggleShowButtons = [...document.querySelectorAll("[data-toggle-show]")];

for (const toggleShowButton of toggleShowButtons) {
  toggleShowButton.addEventListener("click", () => {
    const id = toggleShowButton.dataset.toggleShow;

    toggleShowButton.dataset.status = "hidden";

    const toggleHideButton = document.querySelector(
      `[data-toggle-hide="${id}"]`
    );

    if (toggleHideButton) {
      toggleHideButton.dataset.status = "visible";
    }

    const toggleTargetButton = document.querySelector(
      `[data-toggle-target="${id}"]`
    );

    if (toggleTargetButton) {
      toggleTargetButton.dataset.status = "visible";
    }
  });
}

const toggleHideButtons = [...document.querySelectorAll("[data-toggle-hide]")];

for (const toggleHideButton of toggleHideButtons) {
  toggleHideButton.addEventListener("click", () => {
    const id = toggleHideButton.dataset.toggleHide;

    toggleHideButton.dataset.status = "hidden";

    const toggleShowButton = document.querySelector(
      `[data-toggle-show="${id}"]`
    );

    if (toggleShowButton) {
      toggleShowButton.dataset.status = "visible";
    }

    const toggleTargetButton = document.querySelector(
      `[data-toggle-target="${id}"]`
    );

    if (toggleTargetButton) {
      toggleTargetButton.dataset.status = "hidden";
    }
  });
}

const refresh = document.querySelector("[data-reload]");

refresh?.addEventListener("click", () => {
  window.location.reload();
});
