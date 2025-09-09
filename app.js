document.addEventListener("DOMContentLoaded", () => {
  // ======== Seleção do formulário e botões ========
  const form = document.querySelector("[data-form]");
  if (!form) return;

  const inputs = form.querySelectorAll("input[required], textarea[required]");
  const button = form.querySelector("[data-button]");

  // ======== Função para habilitar/desabilitar botão ========
  function checkFields() {
    if (!button) return;
    const allFilled = Array.from(inputs).every(input => input.value.trim() !== "");
    button.disabled = !allFilled;
  }

  inputs.forEach(input => input.addEventListener("input", checkFields));
  checkFields();

const phoneInput = document.getElementById("phone");

if (phoneInput) {
  phoneInput.addEventListener("input", () => {
    // Remove tudo que não seja número
    let numbers = phoneInput.value.replace(/\D/g, "");

    // Limita a quantidade máxima de números
    numbers = numbers.substring(0, 11);

    // Aplica máscara
    let formatted = "";
    if (numbers.length > 0) {
      formatted += "(" + numbers.substring(0, 2);
    }
    if (numbers.length >= 3) {
      formatted += ") " + numbers.substring(2, 7);
    }
    if (numbers.length >= 8) {
      formatted += "-" + numbers.substring(7, 11);
    }

    phoneInput.value = formatted;
  });
}



  // ======== Classe de envio do formulário ========
  class FormSubmit {
    constructor(settings) {
      this.settings = settings;
      this.form = document.querySelector(settings.form);
      this.formButton = document.querySelector(settings.button);
      if (this.form) this.url = this.form.getAttribute("action");
      this.sendForm = this.sendForm.bind(this);
    }

    displaySuccess() {
      if (this.formButton) {
        this.formButton.innerText = this.settings.success;
        this.formButton.disabled = true; 
        this.formButton.classList.add("success");
      }
    }

    displayError() {
      if (this.formButton) {
        this.formButton.innerText = this.settings.error;
        this.formButton.disabled = false; 
        this.formButton.classList.add("error");
      }
    }

    getFormObject() {
      const formObject = {};
      const fields = this.form.querySelectorAll("[name]");
      fields.forEach(field => {
        formObject[field.getAttribute("name")] = field.value;
      });
      return formObject;
    }

    onSubmission(event) {
      event.preventDefault();
      if (this.formButton) {
        this.formButton.disabled = true;
        this.formButton.innerText = "Enviando...";
      }
    }

    async sendForm(event) {
      try {
        this.onSubmission(event);
        const res = await fetch(this.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(this.getFormObject()),
        });
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        this.displaySuccess();
      } catch (error) {
        console.error(error);
        this.displayError();
      }
    }

    init() {
      if (this.form) this.form.addEventListener("submit", this.sendForm);
      return this;
    }
  }

  const formSubmit = new FormSubmit({
    form: "[data-form]",
    button: "[data-button]",
    success: "Mensagem enviada!",
    error: "Tente Novamente!",
  });

  formSubmit.init();
});
