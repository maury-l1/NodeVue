const express = require('express')
const db = require('./db'); // Conexión a SQLite
const authMiddleware = require('./middleware/authMiddleware');
const adminMiddleware = require('./middleware/adminMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express()
app.use(express.json())  // para poder recibir JSON en el body

// Ruta de prueba
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'Hola desde Express 👋' })
})


// ----------- REGISTER ----------- 

app.post('/api/register', async (req, res) => {
  const { nombre, apellido, correo, contraseña, rol } = req.body;

  if (!nombre || !apellido || !correo || !contraseña || !rol) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el correo ya existe
    const existingUser = db.prepare('SELECT id FROM users WHERE correo = ?').get(correo);
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar usuario en la base de datos
    const stmt = db.prepare(`
      INSERT INTO users (nombre, apellido, correo, contraseña, rol)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(nombre, apellido, correo, hashedPassword, rol);

    res.status(201).json({
      id: info.lastInsertRowid,
      nombre,
      apellido,
      correo,
      rol
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});


// ---------- LOGIN ------------

app.post('/api/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    // Buscar usuario por correo
    const user = db.prepare('SELECT * FROM users WHERE correo = ?').get(correo);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Comparar contraseña
    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, rol: user.rol },
      process.env.JWT_SECRET || 'secret_key',  // Cambiar en producción
      { expiresIn: '1h' }
    );

    // Devolver info del usuario y token
    res.json({
      user: { id: user.id, nombre: user.nombre, rol: user.rol },
      token
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});


// ----------------------
// GET /api/tasks
// Devuelve todas las tareas de todos los usuarios
// ----------------------
app.get('/api/tasks', authMiddleware, (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks').all(); // todas las tareas
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// GET /api/tasks/:id
app.get('/api/tasks/:id', authMiddleware, (req, res) => {
  const taskId = req.params.id;

  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(task);

  } catch (err) {
    res.status(500).json({ error: 'Error al obtener la tarea' });
  }
});
// PATCH /api/tasks/:id
app.patch('/api/tasks/:id', authMiddleware, (req, res) => {
  const taskId = req.params.id;
  const { title, description } = req.body;

  if (!title && !description) {
    return res.status(400).json({ error: 'Debes enviar al menos un campo para actualizar' });
  }

  try {
    // Obtener la tarea actual
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

    // Actualizar solo los campos enviados
    const updatedTitle = title ?? task.title;
    const updatedDescription = description ?? task.description;

    const stmt = db.prepare('UPDATE tasks SET title = ?, description = ? WHERE id = ?');
    stmt.run(updatedTitle, updatedDescription, taskId);

    res.json({ id: taskId, title: updatedTitle, description: updatedDescription, user_id: task.user_id });

  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// POST /api/createTask
app.post('/api/createTask', authMiddleware, (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) return res.status(400).json({ error: 'Todos los campos son obligatorios' });

  const stmt = db.prepare('INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)');
  const info = stmt.run(title, description, req.user.id);

  res.status(201).json({ id: info.lastInsertRowid, title, description, user_id: req.user.id });
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', authMiddleware, (req, res) => {
  const taskId = req.params.id;

  try {
    // Verificar si la tarea existe
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

    // Eliminar la tarea
    db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);

    res.json({ mensaje: 'Tarea eliminada correctamente', id: taskId });

  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

// ----------------------
// GET /api/users
// Devuelve todos los usuarios (solo admin)
// ----------------------
app.get('/api/users', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, nombre, apellido, correo, rol 
      FROM users
    `).all();

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// DELETE /api/users/:id
app.delete('/api/users/:id', authMiddleware, adminMiddleware, (req, res) => {
  const userId = req.params.id;

  try {
    // Verificar si el usuario existe
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Evitar que un admin se borre a sí mismo
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
    }

    // Eliminar el usuario
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);

    res.json({ mensaje: 'Usuario eliminado correctamente', id: userId });

  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Levantar servidor
app.listen(3000, () => {
  console.log('Backend en http://localhost:3000')
})
