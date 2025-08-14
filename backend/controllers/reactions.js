const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.toggleReaction = async (req, res) => {
  const { postId, commentId } = req.body;
  const { emoji } = req.body;
  const userId = req.session.userId;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  let where = { userId, emoji };
  if (postId) where.postId = Number(postId);
  if (commentId) where.commentId = Number(commentId);

  // Search for existing reaction
  const existing = await prisma.reaction.findFirst({ where });

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
    return res.json({ removed: true });
  } else {
    await prisma.reaction.create({
      data: {
        userId,
        emoji,
        postId: postId ? Number(postId) : undefined,
        commentId: commentId ? Number(commentId) : undefined,
      },
    });
    return res.json({ added: true });
  }
};