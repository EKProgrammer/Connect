const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const rootElement = document.documentElement;

function handleScroll() {
    if (rootElement.scrollTop > 500) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

function scrollToTop() {
    rootElement.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.addEventListener("scroll", handleScroll);
scrollToTopBtn.addEventListener("click", scrollToTop);
