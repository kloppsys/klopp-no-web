(function () {
    "use strict";

    var GA_MEASUREMENT_ID = "G-3GRXLWE4Y0";

    function getCookie(name) {
        var m = document.cookie.match("(?:^|; )" + name + "=([^;]*)");
        return m ? decodeURIComponent(m[1]) : null;
    }

    function setCookie(name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + value + "; expires=" + d.toUTCString() + "; path=/; SameSite=Lax; Secure";
    }

    function loadGoogleAnalytics() {
        if (window.gtag) return;
        var s = document.createElement("script");
        s.async = true;
        s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { dataLayer.push(arguments); };
        gtag("js", new Date());
        gtag("config", GA_MEASUREMENT_ID);
    }

    document.addEventListener("DOMContentLoaded", function () {
        var accepted = getCookie("cookie_notice_accepted");

        if (accepted === "true") {
            loadGoogleAnalytics();
            return;
        }

        if (accepted === null) {
            var banner = document.getElementById("klopp-consent-banner");
            if (!banner) return;
            banner.hidden = false;

            document.getElementById("klopp-consent-accept").addEventListener("click", function () {
                setCookie("cookie_notice_accepted", "true", 365);
                banner.hidden = true;
                loadGoogleAnalytics();
            });
            document.getElementById("klopp-consent-refuse").addEventListener("click", function () {
                setCookie("cookie_notice_accepted", "false", 365);
                banner.hidden = true;
            });
        }
    });
})();
