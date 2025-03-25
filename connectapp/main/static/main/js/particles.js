AOS.init({
    duration: 800,
    once: true
});
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#6a11cb" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#6a11cb", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
    const buttons = document.querySelectorAll('.subscribe-button');
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const x = e.pageX - button.getBoundingClientRect().left;
            const y = e.pageY - button.getBoundingClientRect().top;
            
            button.querySelector('.button-hover').style.transform = `translate(${x - 50}px, ${y - 50}px)`;
        });
    });
});