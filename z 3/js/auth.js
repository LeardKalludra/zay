function getAuthenticatedUser() {
    const userFromLocal = localStorage.getItem("loggedInUser");
    const userFromSession = sessionStorage.getItem("loggedInUser");

    if (userFromLocal) {
        return JSON.parse(userFromLocal);
    }

    if (userFromSession) {
        return JSON.parse(userFromSession);
    }

    return null;
}

function logout() {
    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "login.html"; 
}
