const createStars = () => {
    const starsContainer = document.querySelector(".stars-container");
  
    for (let i = 0; i < 200; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.width = Math.random() * 2 + "px";
      star.style.height = star.style.width;
      star.style.top = Math.random() * 10 + "vh"; // Change 100 to 50 for 50% height
      star.style.left = Math.random() * 100 + "vw";
      star.style.animationName = "lightspeed";
      star.style.animationDuration = (Math.random() * 1 + 0.5) + "s";
      star.style.animationDelay = Math.random() * 2 + "s";
      starsContainer.appendChild(star);
    }
  };
  
  createStars();
  