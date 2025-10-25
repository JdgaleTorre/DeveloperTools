CREATE TABLE "devtools_task_statuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"board_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"color" varchar(20),
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "devtools_tasks" ADD COLUMN "status_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "devtools_task_statuses" ADD CONSTRAINT "devtools_task_statuses_board_id_devtools_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."devtools_boards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devtools_tasks" ADD CONSTRAINT "devtools_tasks_status_id_devtools_task_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."devtools_task_statuses"("id") ON DELETE set null ON UPDATE no action;