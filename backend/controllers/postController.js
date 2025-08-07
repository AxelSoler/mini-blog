const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllPosts = async (req, res) => {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  res.render('index', { posts });
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  await prisma.post.create({ data: { title, content } });
  res.redirect('/');
};

exports.editPost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  await prisma.post.update({
    where: { id: parseInt(id) },
    data: { title, content }
  });
  res.redirect('/');
}

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  await prisma.post.delete({ where: { id: parseInt(id) } });
  res.redirect('/');
}
