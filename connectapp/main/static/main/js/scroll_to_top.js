const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const rootElement = document.documentElement;

function handleScroll() {
    if (rootElement.scrollTop > 500) {
        scrollToTopBtn.classList.add("visible");
    } else {
        scrollToTopBtn.classList.remove("visible");
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
