const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          username: true
        }
      }
    }
  });

  res.render('index', { posts });
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;

  if (!req.currentUser) {
    return res.status(401).send('Unauthorized');
  }

  await prisma.post.create({
    data: {
      title,
      content,
      user: {
        connect: { id: req.currentUser.id }
      }
    }
  });

  res.redirect('/');
};

exports.editPost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });

  if (!post || post.userId !== req.currentUser?.id) {
    return res.status(403).send('Forbidden');
  }

  await prisma.post.update({
    where: { id: parseInt(id) },
    data: { title, content }
  });

  res.redirect('/');
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });

  if (!post || post.userId !== req.currentUser?.id) {
    return res.status(403).send('Forbidden');
  }

  await prisma.post.delete({ where: { id: parseInt(id) } });

  res.redirect('/');
};
