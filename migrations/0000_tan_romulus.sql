CREATE TABLE `spotifier-web_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `spotifier-web_user_session` (
	`id` text(256) PRIMARY KEY NOT NULL,
	`laravel_session` text(512),
	`xsrf_token` text(512),
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
CREATE INDEX `name_idx` ON `spotifier-web_post` (`name`);