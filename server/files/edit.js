function setMovie(movie) {
  for (const element of document.forms[0].elements) {
    const name = element.id;
    const value = movie[name];

    if (name === "Genres") {
      for (let i = 0; i < element.options.length; i++) {
        element.options[i].selected = value.indexOf(element.options[i].value) >= 0;
      }
    } else {
      element.value = value;
    }
  }
}

function getMovie() {
  const movie = {};

  for (const element of document.forms[0].elements) {
    if (!element.id) continue;

    const name = element.id;

    if (name === "Genres") {
      movie[name] = [];
      for (let i = 0; i < element.options.length; i++) {
        if (element.options[i].selected) {
          movie[name].push(element.options[i].value);
        }
      }
    } else if (name === "Runtime" || name === "Metascore" || name === "imdbRating") {
      movie[name] = Number(element.value);
    } else if (name === "Actors" || name === "Directors" || name === "Writers") {
      movie[name] = element.value.split(",").map(function (item) {
        return item.trim();
      });
    } else {
      movie[name] = element.value;
    }
  }

  return movie;
}

function putMovie() {
  const movie = getMovie();

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", "/movies/" + movie.imdbID);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    if (xhr.status === 200 || xhr.status === 201) {
      location.href = "index.html";
    } else {
      alert("Fehler beim Speichern: " + xhr.status);
    }
  };

  xhr.send(JSON.stringify(movie));
}

window.onload = function () {
  const imdbID = new URLSearchParams(window.location.search).get("imdbID");

  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/movies/" + imdbID);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const movie = JSON.parse(xhr.responseText);
      setMovie(movie);
    } else {
      alert("Film nicht gefunden: " + xhr.status);
    }
  };

  xhr.send();
};