(function () {
    var saved = localStorage.getItem("klopp-theme");
    document.documentElement.setAttribute(
        "data-theme",
        saved === "light" || saved === "dark" ? saved : "light"
    );
})();
