;(() => {
  try {
    const primaryCta = document.getElementById("primaryCta");
    if (!primaryCta) {
      console.error("Primary CTA element not found");
      return;
    }
    const currentUser = localStorage.getItem("currentUser");
    const firstName = localStorage.getItem("firstName");

    if (currentUser) {
      primaryCta.textContent = firstName ? `Continue as ${firstName}` : "Continue";
      primaryCta.setAttribute("href", "../recipes/recipes.html");
      primaryCta.setAttribute("aria-label", firstName ? `Continue as ${firstName} to recipes` : "Continue to recipes");
    } else {
      primaryCta.textContent = "Get Started";
      primaryCta.setAttribute("href", "../login/login.html");
      primaryCta.setAttribute("aria-label", "Get started with login");
    }
  } catch (e) {
    console.error("Error in navigation script:", e);
  }
})();