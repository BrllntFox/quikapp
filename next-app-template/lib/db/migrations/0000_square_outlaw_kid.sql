CREATE TABLE `check_in_sections` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`check_in_at` text NOT NULL,
	`event_id` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_name` text NOT NULL,
	`date` text NOT NULL,
	`location` text,
	`description` text NOT NULL,
	`status` text,
	`organizer_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organizer_id`) REFERENCES `organizers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `group_of_tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`quantity` integer NOT NULL,
	`event_id` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `organizers` (
	`id` text PRIMARY KEY NOT NULL,
	`organizer_name` text NOT NULL,
	`trusted_contact` text NOT NULL,
	`status` text,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_mail` text NOT NULL,
	`status` text,
	`check_in_section_id` text NOT NULL,
	`group_of_ticket_id` text NOT NULL,
	`note` text,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`check_in_section_id`) REFERENCES `check_in_sections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_of_ticket_id`) REFERENCES `group_of_tickets`(`id`) ON UPDATE no action ON DELETE cascade
);
