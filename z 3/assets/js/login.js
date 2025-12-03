const loginForm = document.getElementById("form");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const remember = document.querySelector("input[name='remember']");

const adminEmail = "admin@zayshop.com";
const adminPassword = "Admin123!";

const users = JSON.parse(localStorage.getItem("users")) || [];

const user = getAuthenticatedUser();

if (user) {
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

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (email === adminEmail) {
        if (password !== adminPassword) {
            showError(loginPassword, "Incorrect password.");
            return;
        }

        const adminUser = {
            fullname: "Admin",
            email: adminEmail,
            role: "admin",
        };
        if (remember.checked) {
            localStorage.setItem("loggedInUser", JSON.stringify(adminUser));
        } else {
            sessionStorage.setItem("loggedInUser", JSON.stringify(adminUser));
        }
        window.location.href = "dashboard.html";
        return;
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
        showError(loginEmail, "No account found with that email.");
        return;
    }

    if (user.password !== password) {
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
