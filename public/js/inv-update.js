const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector(".btn-main")
      updateBtn.removeAttribute("disabled")
    })