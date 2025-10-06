;(() => {
  try {
    const primaryCta = document.getElementById("primaryCta")
    const currentUser = localStorage.getItem("currentUser")
    const firstName = localStorage.getItem("firstName")

    if (currentUser) {
      // User sudah login → arahkan langsung ke recipes
      if (primaryCta) {
        primaryCta.textContent = firstName ? `Continue as ${firstName}` : "Continue"
        primaryCta.setAttribute("href", "recipes.html")
      }
    } else {
      // Belum login → tetap menuju ke index.html (login/register)
      if (primaryCta) {
        primaryCta.textContent = "Get Started"
        primaryCta.setAttribute("href", "index.html")
      }
    }
  } catch (e) {
    // aman diam, tidak mengganggu UI
  }
})()