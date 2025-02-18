document.getElementById("registerForm")?.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const userData = {
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        gender: document.getElementById("gender").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    };

    const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (data.success) {
        window.location.href = "success.html";
    } else {
        alert(data.message);
    }
});

document.getElementById("loginForm")?.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const credentials = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    };

    const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });

    const data = await response.json();
    if (data.success) {
        window.location.href = "/home";
    } else {
        alert(data.message);
    }
});
