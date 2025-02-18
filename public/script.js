// script.js
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("shop-now").addEventListener("click", () => {
        window.location.href = "shop.html";
    });

    document.querySelectorAll(".service-btn").forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("onclick").match(/'([^']+)'/)[1];
            window.location.href = page;
        });
    });
});
document.getElementById("login-btn").addEventListener("click", () => {
    window.location.href = "/login"; // Redirects to the login page
});

function openPage(page) {
    window.location.href = page;
}
