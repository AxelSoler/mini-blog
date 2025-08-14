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
      },
      comments: {
        take: 3,
        orderBy: { createdAt: 'desc' }, // Get the latest 3 comments
        include: {
          user: {
            select: { username: true }
          },
          reactions: true // Include reactions for each comment
        }
      },
      reactions: {
        include: true // Include reactions for each post
      }
    }
  });

  let postCount = 0;
  if (req.currentUser) {
    postCount = await prisma.post.count({
      where: { userId: req.currentUser.id }
    });
  }

  res.render('index', {
    posts,
    currentUser: req.currentUser,
    postCount,
    maxPosts: 3
  });
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: { select: { username: true } },
      comments: {
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { username: true } }, reactions: true  }
      },
      reactions: {
        include: true
      }
    }
  });

  if (!post) {
    return res.status(404).send('Post not found');
  }

  res.render('post', { post, currentUser: req.currentUser });
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;

  if (!req.currentUser) {
    return res.status(401).send('Unauthorized');
  }

  const postCount = await prisma.post.count({
    where: { userId: req.currentUser.id }
  });

  if (postCount >= 3) {
    return res.status(400).send('You have reached the maximum of 3 posts.');
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
