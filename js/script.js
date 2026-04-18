// PROTECT ADMIN PAGES
const isAdminPage = document.body.classList.contains("protected");


if (isAdminPage) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (!isLoggedIn) {
    alert("Please login first");
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'login.html';
}

console.log("JS Loaded");

// ONLY run gallery code if gallery exists
const gallery = document.querySelector('.gallery');

if (gallery) {
  fetch('http://localhost:5000/projects')
    .then(res => {
      console.log("Response received");
      return res.json();
    })
    .then(data => {
      console.log("DATA:", data);

      if (data.length === 0) {
  gallery.innerHTML = "<p>No projects yet</p>";
  return;
}

      data.forEach(project => {
        const div = document.createElement('div');
       div.classList.add('project-card');

        let html = `
        <img src="http://localhost:5000/uploads/${project.image}" />
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        `;

if (isAdminPage) {
  html += `<button onclick="deleteProject(${project.id})" class="btn">Delete</button>`;
}

div.innerHTML = html;

        gallery.appendChild(div);
      });
    })
    .catch(err => console.error("ERROR:", err));
}

const form = document.getElementById('uploadForm');

if (form) {
  console.log("Form found ✅");

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log("Form submitted 🚀");

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('image', document.getElementById('image').files[0]);

    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      console.log("Uploaded:", data);

      alert("Project Uploaded Successfully ✅");

      form.reset();
    } catch (err) {
      console.error("ERROR:", err);
      alert("Upload failed ❌");
    }
  });
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  console.log("Contact form found ✅");

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log("Contact form submitted 🚀");

    const data = {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      message: document.getElementById('message').value
    };

    try {
      const res = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log("Saved:", result);

      alert("Inquiry Sent Successfully ✅");

      contactForm.reset();
    } catch (err) {
      console.error(err);
      alert("Failed to send ❌");
    }
  });
}
const contactList = document.querySelector('.contact-list');

if (contactList) {
  fetch('http://localhost:5000/contacts')
    .then(res => res.json())
    .then(data => {
      contactList.innerHTML = "";

      data.forEach(c => {
        const div = document.createElement('div');
        div.classList.add('project-card');

        div.innerHTML = `
        <h3>${c.name}</h3>
         <p><strong>📞 Phone:</strong> ${c.phone}</p>
        <p><strong>💬 Message:</strong> ${c.message}</p>
        <p style="font-size:12px; color:gray;">${new Date(c.created_at).toLocaleString()}</p>
        `;

        contactList.appendChild(div);
      });
    })
    .catch(err => console.error(err));
}

const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    };

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'admin-portal-9832.html';
      } else {
        alert("Invalid login ❌");
      }

    } catch (err) {
      console.error(err);
    }
  });
}

// Run on scroll
// window.addEventListener('scroll', showOnScroll);

// Run on page load
// window.addEventListener('load', showOnScroll);

// AUTO IMAGE SLIDER
//* let slides = document.querySelectorAll(".slides img");
// let index = 0;

// function showSlide() {
    //slides.forEach((img) => img.classList.remove("active"));
    //slides[index].classList.add("active");

  //  index = (index + 1) % slides.length;
//}

//setInterval(showSlide, 3000);



function showOnScroll() {
    const elements = document.querySelectorAll('.fade-in');

    elements.forEach(el => {
        const position = el.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        if (position < screenHeight - 100) {
            el.classList.add('show');
        }
    });
}

window.addEventListener('scroll', showOnScroll);
window.addEventListener('load', showOnScroll);

async function deleteProject(id) {
  const confirmDelete = confirm("Are you sure you want to delete this project?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:5000/projects/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    alert(data.message);

    location.reload();
  } catch (err) {
    console.error(err);
    alert("Delete failed ❌");
  }
}
