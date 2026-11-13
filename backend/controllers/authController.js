
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/"
};

export async function googleLogin(req, res) {
  try {
    const { credential } = req.body ?? {};

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required"
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const p = ticket.getPayload();

    if (!p?.sub || !p.email || !p.email_verified) {
      return res.status(401).json({
        message: "Google account could not be verified"
      });
    }

    let user = await User.findOne({ googleId: p.sub });

    if (!user) {
      const existingEmail = await User.findOne({
        email: p.email.toLowerCase()
      });

      if (existingEmail) {
        return res.status(409).json({
          message: "An account with this email already exists using another sign-in method."
        });
      }

      user = await User.create({
        googleId: p.sub,
        name: p.name || p.email.split("@")[0],
        email: p.email.toLowerCase(),
        picture: p.picture || ""
      });
    } else {
      user.name = p.name || user.name;
      user.picture = p.picture || user.picture;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("session", token, cookieOptions);

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });

  } catch (error) {
    console.error("Google login:", error.message);

    return res.status(401).json({
      message: "Google sign-in verification failed"
    });
  }
}

export async function getMe(req, res) {
  return res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      picture: req.user.picture
    }
  });
}

export function logout(req, res) {
  res.clearCookie("session", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/"
  });

  return res.json({ message: "Signed out" });
}
