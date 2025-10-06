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
      // Belum login → arahkan ke login.html
      if (primaryCta) {
        primaryCta.textContent = "Get Started"
        primaryCta.setAttribute("href", "login.html") // Diubah dari index.html
      }
    }
  } catch (e) {
    // aman diam, tidak mengganggu UI
  }
})()