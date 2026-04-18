fetch('http://localhost:5000/projects')
  .then(res => res.json())
  .then(data => {
    const gallery = document.querySelector('.gallery');

    data.forEach(project => {
      const div = document.createElement('div');
      div.classList.add('project-card');

      div.innerHTML = `
        <img src="http://localhost:5000/uploads/${project.image}" />
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      `;

      gallery.appendChild(div);
    });
  })
  .catch(err => console.error(err));