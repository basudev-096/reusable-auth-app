import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { emailOTP } from "better-auth/plugins"
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
        autoSignIn: false
    },

    // emailVerification: {
    //     sendOnSignUp: true,
    //     sendVerificationEmail: async ({ user, url, token }) => {
    //         await transporter.sendMail({
    //             from: process.env.GOOGLE_USER,
    //             to: user.email,
    //             subject: "Verify your email address",
    //             html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
    //         });
    //     },
    // },

    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "sign-in") {
                    // Send the OTP for sign in
                } else if (type === "email-verification") {
                    await transporter.sendMail({
                        from: process.env.GOOGLE_USER,
                        to: email,
                        subject: "Your Verification Code",
                        html: `<p>Your code is: <b>${otp}</b></p>`,
                    });
                } else if (type === "forget-password") {
                    await transporter.sendMail({
                        from: process.env.GOOGLE_USER,
                        to: email,
                        subject: "Reset your password",
                        html: `<p>Your password reset code is: <b>${otp}</b></p>`,
                    });
                }
            },
        })
    ],

    // socialProviders: {
    //     github: {
    //         clientId: process.env.GITHUB_CLIENT_ID as string,
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    //     },
    // },

    origin: process.env.NEXT_PUBLIC_SITE_URL

});