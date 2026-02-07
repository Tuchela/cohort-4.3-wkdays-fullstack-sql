import { verifyToken } from "../utils/utilities.js";
import { pool } from "../database/connection.js";
import { findPost } from "../database/queries/sql.js";

/**
 * verify the authorization header and decode token
 */

const verifyAuthHeader = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return { error: "auth" };

  const token = authHeader.split(" ")[1];
  const payLoad = verifyToken(token);

  if (!payLoad) return { error: "token" };

  return payLoad;
};

/**
 * middleware: verify user token
 */

export const verifyUserToken = async (req, res, next) => {
  const payLoad = await verifyAuthHeader(req);

  if (payLoad?.error === "auth") {
    return res.status(401).json({
      status: 401,
      error: "The provided token cannot be authenticated",
    });
  }

  req.user = payLoad;
  next();
};

/**
 * middleware: verify admin role
 */

export const isAdmin = async (req, res, next) => {
  const payLoad = await verifyAuthHeader(req);

  if (payLoad?.error === "token") {
    return res.status(401).json({
      status: 401,
      error: "Token provided cannot be authenticated",
    });
  }

  if (payLoad.role !== "admin") {
    return res.status(403).json({
      status: 403,
      error: "Only admin can view all users or delete user account",
    });
  }

  req.user = payLoad;
  next();
};

/**
 * middleware: verify post owner
 */

export const isOwner = async (req, res, next) => {
  const userId = req.user.id;
  const postId = Number(req.params.id);

  try {
    const { rows, rowCount } = await pool.query(findPost, [postId]);

    if (rowCount === 0) {
      return res.status(404).json({
        status: 404,
        error: "Post not found",
      });
    }

    if (userId !== rows[0].post_owner_id) {
      return res.status(401).json({
        status: 401,
        error: "You cannot access, modify or delete this post",
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Middleware: Verify Article Owner
 */
// export const isArticleOwner = async (req, res, next) => {
//   const userId = req.user.id;
//   const articleId = Number(req.params.articleId);

//   try {
//     const { rows, rowCount } = await pool.query(findAnArticle, [articleId]);
//     if (rowCount === 0) {
//       return res.status(404).json({
//         status: 404,
//         error: "Article not found.",
//       });
//     }

//     if (userId !== rows[0].authorid) {
//       return res.status(401).json({
//         status: 401,
//         error: "You cannot modify or delete this article.",
//       });
//     }

//     next();
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
