const signupForm = document.getElementById("form");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupConfirm = document.getElementById("signupConfirm");

if (signupForm && signupName && signupEmail && signupPassword && signupConfirm) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = getAuthenticatedUser();

    if (existingUser) {
        window.location.href = "index.html";
    }

    function showError(input, message) {
        const parent = input.parentElement;
        let errorEl = parent.querySelector(".error");
        if (!errorEl) {
            errorEl = document.createElement("p");
            errorEl.className = "error";
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

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isStrongPassword(value) {
        const trimmed = value.trim();
        if (trimmed.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(trimmed) || !/[a-z]/.test(trimmed) || !/[0-9]/.test(trimmed)) {
            return "Use upper, lower, and a number.";
        }
        return "";
    }

    function emailTaken(value) {
        return users.some(u => u.email === value);
    }

    function validateForm() {
        let ok = true;
        const nameVal = signupName.value.trim();
        const emailVal = signupEmail.value.trim();
        const passVal = signupPassword.value.trim();
        const confirmVal = signupConfirm.value.trim();

        if (nameVal.length < 3) {
            showError(signupName, "Enter at least 3 characters.");
            ok = false;
        } else {
            clearError(signupName);
        }

        if (!isValidEmail(emailVal)) {
            showError(signupEmail, "Enter a valid email.");
            ok = false;
        } else if (emailTaken(emailVal)) {
            showError(signupEmail, "This email is already registered.");
            ok = false;
        } else {
            clearError(signupEmail);
        }

        const passwordMsg = isStrongPassword(passVal);
        if (passwordMsg) {
            showError(signupPassword, passwordMsg);
            ok = false;
        } else {
            clearError(signupPassword);
        }

        if (!confirmVal || confirmVal !== passVal) {
            showError(signupConfirm, "Passwords must match.");
            ok = false;
        } else {
            clearError(signupConfirm);
        }

        return ok;
    }

    function saveUser(user) {
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateForm()) return;

        const newUser = {
            fullname: signupName.value.trim(),
            email: signupEmail.value.trim(),
            password: signupPassword.value.trim(),
            role: "user"
        };

        saveUser(newUser);
        window.location.href = "login.html";
    });
}
