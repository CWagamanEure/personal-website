window.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("post-content");
  if (!content || !window.renderMathInElement) return;

  window.renderMathInElement(content, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
  });
});
