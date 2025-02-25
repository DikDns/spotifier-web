CREATE TABLE `spotifier-web_user_session` (
	`id` text(256) PRIMARY KEY NOT NULL,
	`laravel_session` text(512),
	`xsrf_token` text(512),
	`cas_auth` text(512),
	`user_id` text(256) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `spotifier-web_user` (
	`id` text(256) PRIMARY KEY NOT NULL,
	`name` text(256),
	`nim` text(256),
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `spotifier-web_user_session` (`user_id`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `spotifier-web_user` (`name`);--> statement-breakpoint
CREATE INDEX `nim_idx` ON `spotifier-web_user` (`nim`);