const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('auth/signup', { error: 'Error creating user' });
  }
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.render('auth/login', { error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render('auth/login', { error: 'Invalid credentials' });

    req.session.userId = user.id;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Error logging in' });
  }
}

exports.logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
}