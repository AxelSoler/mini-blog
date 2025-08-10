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
