const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const router = express.Router();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// Start GitHub OAuth
router.get("/github", (req, res) => {
    const githubAuthUrl =
        "https://github.com/login/oauth/authorize" +
        `?client_id=${GITHUB_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(GITHUB_CALLBACK_URL)}` +
        "&scope=read:user";

    res.redirect(githubAuthUrl);
});

// GitHub OAuth callback
router.get("/github/callback", async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({
                error: "Missing OAuth code"
            });
        }

        // Exchange GitHub authorization code for access token
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: GITHUB_CALLBACK_URL
            },
            {
                headers: {
                    Accept: "application/json"
                }
            }
        );

        const githubAccessToken = tokenResponse.data.access_token;

        if (!githubAccessToken) {
            console.error("GitHub token response:", tokenResponse.data);

            return res.status(401).json({
                error: "Failed to obtain GitHub access token"
            });
        }

        // Get authenticated GitHub user
        const userResponse = await axios.get(
            "https://api.github.com/user",
            {
                headers: {
                    Authorization: `Bearer ${githubAccessToken}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        const githubUser = userResponse.data;

        // Create OUR application JWT
        const applicationToken = jwt.sign(
            {
                userId: String(githubUser.id),
                username: githubUser.login
            },
            JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Store OUR JWT in HttpOnly cookie
       res.cookie("token", applicationToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
});

        // Redirect to dashboard
        res.redirect("/dashboard");

    } catch (error) {
        console.error(
            "GitHub OAuth error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            error: "GitHub authentication failed"
        });
    }
});

module.exports = router;