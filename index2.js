// Dashboard JavaScript

function logout() {
    const confirmed = confirm("Are you sure you want to logout?");

    if (confirmed) {
        // Later we will connect this to your Node.js logout route
        window.location.href = "/login.html";
    }
}


function openPage(page) {

    switch (page) {

        case "students":
            window.location.href = "/students.html";
            break;

        case "teachers":
            window.location.href = "/teachers.html";
            break;

        case "classes":
            window.location.href = "/classes.html";
            break;

        case "reports":
            window.location.href = "/reports.html";
            break;

        default:
            console.log("Page not found");
    }
}