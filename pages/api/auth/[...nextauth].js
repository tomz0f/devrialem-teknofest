import NextAuth from "next-auth/next";
import CredentialProvider from "next-auth/providers/credentials";


import { readUser } from "@lib/crud";
import { useRouter } from "next/router";


export default NextAuth({
    providers: [
        CredentialProvider({
            name:"credentials",
            credentials: {
                username: {
                    label: "Kullancı Adı", type: "text", placeholder: "kullanıcıadı"
                },
                password: {
                    label: "Şifre", type: "password", placeholder: "sifre123"
                }
            },
            authorize: async (credentials) => {
                let result = await readUser(credentials.username)
                if (result.user && result.user.password == credentials.password) {
                    let user = result.user;
                    return {
                        id: user._id,
                        name: user.name,
                        surname: user.surname,
                        username: user.username,
                        credit: user.credit,
						reservations: user.reservations,
                        code: user.code
                    };
                }
                return null;
                
                // if (credentials.username === "nfl" && credentials.password === "nfl2021") {
                //     return {
                //         id: 32,
                //         name: "NFL",
                //         credit: 3450
                //     };
                // }

                // return null;
            }
        })
    ],
    callbacks: {
        jwt: ({token, user}) => {
            console.log("jwt callback")
            if (user) {
                token.id = user.id;
                token.user = {...user};
                // token.name = user.name;
                // token.surname = user.surname;
                // token.username = user.username;
                // token.credit = user.credit;
            }

            return token;
        },
        session: ({session, token}) => {
            if (token && token.user) {
                session.id = token.id;
                session.user = {...token.user};
                // session.name = token.name;
                // session.surname = token.surname;
                // session.username = token.username;
                // session.credit = token.credit;
            }

            return session;
        },
        async signIn({ user, account, profile, email, credentials }) {
            let isAllowedToSignIn = true
            if (!user) {
                isAllowedToSignIn = false;
            }
            if (isAllowedToSignIn) {

                console.log("this user is allowed to sign in")

              return true
            } else {
              // Return false to display a default error message
              return false
              // Or you can return a URL to redirect to:
              // return '/unauthorized'
            }
        },
        redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) return url
            // Allows relative callback URLs
            else if (url.startsWith("/")) return new URL(url, baseUrl).toString()
            return baseUrl
        }
    },
    secret: "toosecReT",
    jwt: {
        secret: "toosecReTtoo",
        encryption: true
    },
    pages: {
        signIn: "/auth/giris"
    }
})