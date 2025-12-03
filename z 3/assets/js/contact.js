function handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const subjectError = document.getElementById("subjectError");
    const messageError = document.getElementById("messageError");

    const successMessage = document.getElementById("successMessage");

    nameError.textContent = "";
    emailError.textContent = "";
    subjectError.textContent = "";
    messageError.textContent = "";
    successMessage.style.display = "none";
    successMessage.textContent = "";

    let valid = true;

    if (name.value.trim().length < 3) {
        nameError.textContent = "Name must be at least 3 characters.";
        valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        emailError.textContent = "Enter a valid email address.";
        valid = false;
    }

    if (subject.value.trim().length < 3) {
        subjectError.textContent = "Subject must be at least 3 characters.";
        valid = false;
    }

    if (message.value.trim().length < 10) {
        messageError.textContent = "Message must be at least 10 characters.";
        valid = false;
    }

    if (!valid) return;

    successMessage.textContent = "Your message has been sent successfully!";
    successMessage.style.display = "block";

    e.target.reset();

    setTimeout(() => {
        successMessage.style.display = "none";
    }, 4000);
}
