const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const cors = require('cors');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve images

// POSTGRESQL CONNECTION
const pool = new Pool({
    user: 'ln_admin',
    host: 'localhost',
    database: 'lncraftsman',
    password: 'ln_admin_12#',
    port: 5444,
});

// FILE UPLOAD SETUP
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });


// ==========================
// 🚀 UPLOAD PROJECT API
// ==========================
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file.filename;

        await pool.query(
            'INSERT INTO projects (title, description, image) VALUES ($1, $2, $3)',
            [title, description, image]
        );

        res.json({ message: 'Project Uploaded' }); // ✅ FIXED
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error uploading project' });
    }
});


// ==========================
// 📥 GET PROJECTS API
// ==========================
app.get('/projects', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM projects ORDER BY id DESC'
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching data' });
    }
});


// ==========================
// 📞 CONTACT FORM API
// ==========================
app.post('/contact', async (req, res) => {
    try {
        const { name, phone, message } = req.body;

        await pool.query(
            'INSERT INTO contacts (name, phone, message) VALUES ($1, $2, $3)',
            [name, phone, message]
        );

        res.json({ message: 'Contact Saved' }); // ✅ FIXED
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error saving contact' });
    }
});


// ==========================
// 🚀 SERVER START
// ==========================
app.listen(5000, () => {
    console.log('🚀 Server running on http://localhost:5000');
});

app.get('/contacts', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM contacts ORDER BY id DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching contacts' });
    }
});

// DELETE PROJECT
app.delete('/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;

        await pool.query('DELETE FROM projects WHERE id = $1', [id]);

        res.json({ message: 'Project Deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting project' });
    }
});

// LOGIN API
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // simple hardcoded login (we can upgrade later)
    if (username === 'ln_admin' && password === 'ln_admin_12#') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});