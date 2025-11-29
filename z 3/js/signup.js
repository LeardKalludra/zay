const form = document.getElementById("form");
const fullname = document.getElementById("signupName");
const email = document.getElementById("signupEmail");
const password = document.getElementById("signupPassword");
const confirmPassword = document.getElementById("signupConfirm");

const users = JSON.parse(localStorage.getItem("users")) || [];

const user = getAuthenticatedUser();

if(user) {
    window.location.href = "index.html"
}

function setError(input, message) {
    const parent = input.parentElement;
    parent.querySelector(".error").textContent = message;
    input.classList.add("error-input");
}

function setSuccess(input) {
    const parent = input.parentElement;
    parent.querySelector(".error").textContent = "";
    input.classList.remove("error-input");
}

function validateEmail(emailValue) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(emailValue);
}


form.addEventListener("submit",(e) => {
    e.preventDefault();

    let valid = true;

    if(fullname.value.trim().length < 3) {
        setError(fullname,"Enter at least 3 characters.");
        valid = false;
    }else {
        setSuccess(fullname)
    }

    
    if(!validateEmail(email.value.trim())) {
        setError(email,"Enter a valid email");
        valid = false;
    }else {
        setSuccess(email);
    }

    
    if(password.value.trim().length < 6) {
        setError(password,"Password must be 6+ characters");
        valid = false;
    }else {
        setSuccess(password);
    }


    if(confirmPassword.value.trim() !== password.value.trim()) {
        setError(confirmPassword,"Password do not match");
        valid = false;
    }else {
        setSuccess(confirmPassword);
    }

    const emailExists = users.some(user => user.email === email.value.trim());
    if (emailExists) {
        setError(email, "This email is already registered.");
        valid = false;
    }


    if(valid) {
        users.push({
            fullname: fullname.value,
            email: email.value,
            password: password.value,
    })
    window.location.href = "login.html"

    }

    localStorage.setItem("users",JSON.stringify(users))

})