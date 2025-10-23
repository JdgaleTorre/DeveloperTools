ALTER TABLE "account" RENAME TO "devtools_account";--> statement-breakpoint
ALTER TABLE "authenticator" RENAME TO "devtools_authenticator";--> statement-breakpoint
ALTER TABLE "session" RENAME TO "devtools_session";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "devtools_user";--> statement-breakpoint
ALTER TABLE "verificationToken" RENAME TO "devtools_verificationToken";--> statement-breakpoint
ALTER TABLE "devtools_authenticator" DROP CONSTRAINT "authenticator_credentialID_unique";--> statement-breakpoint
ALTER TABLE "devtools_user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "devtools_account" DROP CONSTRAINT "account_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "devtools_authenticator" DROP CONSTRAINT "authenticator_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "devtools_session" DROP CONSTRAINT "session_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "devtools_account" ADD CONSTRAINT "devtools_account_userId_devtools_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."devtools_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devtools_authenticator" ADD CONSTRAINT "devtools_authenticator_userId_devtools_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."devtools_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devtools_session" ADD CONSTRAINT "devtools_session_userId_devtools_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."devtools_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devtools_authenticator" ADD CONSTRAINT "devtools_authenticator_credentialID_unique" UNIQUE("credentialID");--> statement-breakpoint
ALTER TABLE "devtools_user" ADD CONSTRAINT "devtools_user_email_unique" UNIQUE("email");