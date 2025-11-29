const loginForm = document.getElementById("form");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const remember = document.querySelector("input[name='remember']");

const users = JSON.parse(localStorage.getItem("users")) || [];

const user = getAuthenticatedUser();

if(user) {
    window.location.href = "index.html"
}

function showError(input, message) {
    const parent = input.parentElement;
    let errorEl = parent.querySelector(".error");

    if (!errorEl) {
        errorEl = document.createElement("p");
        errorEl.classList.add("error");
        parent.appendChild(errorEl);
    }

    errorEl.textContent = message;
    input.classList.add("error-input");
}

function clearError(input) {
    const parent = input.parentElement;
    const errorEl = parent.querySelector(".error");
    if (errorEl) errorEl.textContent = "";
    input.classList.remove("error-input");
}

function validateEmail(emailValue) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(emailValue);
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    if (!validateEmail(loginEmail.value.trim())) {
        showError(loginEmail, "Enter a valid email.");
        valid = false;
    } else {
        clearError(loginEmail);
    }

    if (loginPassword.value.trim() === "") {
        showError(loginPassword, "Password is required.");
        valid = false;
    } else {
        clearError(loginPassword);
    }

    if (!valid) return;

    const user = users.find((u) => u.email === loginEmail.value.trim());

    if (!user) {
        showError(loginEmail, "No account found with that email.");
        return;
    }

    if (user.password !== loginPassword.value.trim()) {
        showError(loginPassword, "Incorrect password.");
        return;
    }

    const loggedInUser = {
        fullname: user.fullname,
        email: user.email,
    };

    if (remember.checked) {
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    } else {
        sessionStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    }

    window.location.href = "index.html";
});
