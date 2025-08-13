const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!req.currentUser) {
    return res.status(401).send('Unauthorized');
  }

  // Verifify only one comment per user per post
  const existing = await prisma.comment.findUnique({
    where: {
      userId_postId: {
        userId: req.currentUser.id,
        postId: parseInt(postId),
      }
    }
  });

  if (existing) {
    return res.status(400).send('You have already commented on this post.');
  }

  await prisma.comment.create({
    data: {
      content,
      user: { connect: { id: req.currentUser.id } },
      post: { connect: { id: parseInt(postId) } }
    }
  });

  res.redirect(`/posts/${postId}`);
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;

  const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });

  if (!comment || comment.userId !== req.currentUser?.id) {
    return res.status(403).send('Forbidden');
  }

  await prisma.comment.delete({ where: { id: parseInt(id) } });

  res.redirect(`/posts/${comment.postId}`);
};

