const filterButtons = document.querySelectorAll(".filter-btn");
const posts = document.querySelectorAll("#post-grid .entry");

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));

  button.addEventListener("click", () => {
    const selectedTag = button.dataset.filter;

    filterButtons.forEach((candidate) => {
      const isActive = candidate === button;
      candidate.classList.toggle("active", isActive);
      candidate.setAttribute("aria-pressed", String(isActive));
    });

    posts.forEach((post) => {
      const tags = (post.dataset.tags || "").split(" ").filter(Boolean);
      post.hidden = selectedTag !== "all" && !tags.includes(selectedTag);
    });
  });
});
