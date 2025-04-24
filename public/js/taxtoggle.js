let taxToggle = document.getElementById("switchCheckDefault");
taxToggle.addEventListener("click", () => {
  let taxes = document.getElementsByClassName("tax");
  for (let tax of taxes) {
    if (tax.style.display != "inline") {
      tax.style.display = "inline";
    } else {
      tax.style.display = "none";
    }
  }
});
