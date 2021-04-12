"use strict";
// collect viruses in an array,- score when each virus disappears
// collect anti viruses in an array,+ score when you hit an virus
// get elements
let container = document.querySelector("#container");
let pointsDiv = document.querySelector("#pointsDiv");
let injection = document.querySelector("#injection");
let startButton = document.querySelector("#start");
let modalResult = document.querySelector("#result");
startButton.addEventListener("click", function () {
  //!Score
  let score = 0;
  //! lost
  let lost = 0;
  let gameOver = document.querySelector(".modal");
  gameOver.style.display = "none";
  pointsDiv.innerHTML = "Score: " + score + " | Lost: " + lost;

  //? container is our all game
  container.addEventListener("mousemove", function (e) {
    // clientX-Y is for X-Y refer axises
    // console.log(e);
    injection.style.left = e.clientX - 12.5 + "px";
  });

  //? Corona Virus
  // array to save corona viruses
  let coronaArray = [];
  const coronaFlow = setInterval(() => {
    // containerWidth = width of container
    let containerWidth = container.offsetWidth;
    //---------------------
    const coronaDiv = document.createElement("div");
    coronaDiv.classList.add("corona");
    let coronaLeft = Math.floor(Math.random() * containerWidth) - 10;
    coronaDiv.style.left = `${coronaLeft}px`;
    coronaDiv.style.top = `-100px`;
    container.append(coronaDiv);
    // create object
    let coronaVirusesObject = {
      coronaElement: coronaDiv,
      top: 0,
      left: coronaLeft,
    };
    // add the coronaVirusesObject to array
    coronaArray.push(coronaVirusesObject);
  }, 1000);

  // create interval for pull viruses down
  setInterval(() => {
    let containerHeight = container.offsetHeight;
    coronaArray.forEach((element, idx) => {
      if (element.top > containerHeight) {
        container.removeChild(element.coronaElement);
        coronaArray.splice(idx, 1);
        lost++;
        pointsDiv.innerHTML = "Score: " + score + " | Lost: " + lost;

        if (lost == 20) {
          modalResult.textContent = "Score: " + score + " | Lost: " + lost;
          gameOver.style.display = "block";
          clearInterval(coronaFlow);
        }
      } else {
        element.top += 10;
        element.coronaElement.style.top = element.top + "px";
      }
    });
  }, 50);

  // Bullet sound
  let bulletSound = document.createElement("audio");
  bulletSound.src = "../sounds/bullet.wav";
  bulletSound.setAttribute("controls", "non");
  bulletSound.setAttribute("preload", "auto");
  bulletSound.style.display = "none";
  container.append(bulletSound);
  // Game music
  let gameSound = document.createElement("audio");
  gameSound.src = "../sounds/gameSound.mp3";
  gameSound.setAttribute("controls", "non");
  gameSound.setAttribute("preload", "auto");
  gameSound.style.display = "none";
  container.append(gameSound);

  //? Anti Virus
  let antiVirusArray = [];
  container.addEventListener("click", function (e) {
    gameSound.play();
    //play bullet sound
    bulletSound.play();
    bulletSound.volume = 0.1;
    // create anti virus
    let antiVirus = document.createElement("div");
    antiVirus.classList.add("antivirus");
    container.append(antiVirus);
    antiVirus.style.left = e.clientX - 35 + "px";
    //set initial bottom value for increase
    let bottom = 100;
    let containerHeight = container.offsetHeight;
    const interval = setInterval(() => {
      if (bottom > containerHeight) {
        antiVirus.remove();
        clearInterval(interval);
      } else {
        bottom += 10;
        antiVirus.style.bottom = bottom + "px";
        // call explode function to detect if Virus and Anti crash
        explosion(antiVirus, interval);
      }
    }, 20);
  });

  // Explosion sound
  let explosionSound = document.createElement("audio");
  explosionSound.src = "../sounds/explosion.wav";
  explosionSound.setAttribute("controls", "non");
  explosionSound.setAttribute("preload", "auto");
  explosionSound.style.display = "none";
  container.append(explosionSound);
  // Explosion Function
  function explosion(antVirus, interval) {
    coronaArray.forEach((corona, index) => {
      // check if corona element is in the same area with antivirus
      if (is_colliding(antVirus, corona.coronaElement)) {
        clearInterval(interval);
        explosionSound.play();
        explosionSound.volume = 0.9;
        score++;
        pointsDiv.textContent = "score: " + score + " | Lost: " + lost;
        container.removeChild(antVirus);
        coronaArray.splice(index, 1);
        container.removeChild(corona.coronaElement);
      }
    });
  }

  //! function for hit the surface,can be found in internet
  var is_colliding = function ($div1, $div2) {
    // Div 1 data
    //var d1_offset             = $div1.offset();
    var d1_height = $div1.offsetHeight;
    var d1_width = $div1.offsetWidth;
    var d1_distance_from_top = $div1.offsettop + d1_height;
    var d1_distance_from_left = $div1.offsetLeft + d1_width;
    // Div 2 data
    //var d2_offset             = $div2.offset();
    var d2_height = $div2.offsetHeight;
    var d2_width = $div2.offsetWidth;
    var d2_distance_from_top = $div2.offsetTop + d2_height;
    var d2_distance_from_left = $div2.offsetLeft + d2_width;
    var not_colliding =
      d1_distance_from_top < $div2.offsetTop ||
      $div1.offsetTop > d2_distance_from_top ||
      d1_distance_from_left < $div2.offsetLeft ||
      $div1.offsetLeft > d2_distance_from_left;
    // Return whether it IS colliding
    return !not_colliding;
  };
});
