CREATE TABLE "devtools_boards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devtools_custom_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"board_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"options" jsonb,
	"required" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devtools_task_custom_field_values" (
	"task_id" uuid NOT NULL,
	"field_id" uuid NOT NULL,
	"value" jsonb NOT NULL,
	CONSTRAINT "devtools_task_custom_field_values_task_id_field_id_pk" PRIMARY KEY("task_id","field_id")
);
--> statement-breakpoint
CREATE TABLE "devtools_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"board_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "devtools_boards" ADD CONSTRAINT "devtools_boards_owner_id_devtools_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."devtools_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devtools_custom_fields" ADD CONSTRAINT "devtools_custom_fields_board_id_devtools_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."devtools_boards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devtools_task_custom_field_values" ADD CONSTRAINT "devtools_task_custom_field_values_task_id_devtools_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."devtools_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devtools_task_custom_field_values" ADD CONSTRAINT "devtools_task_custom_field_values_field_id_devtools_custom_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."devtools_custom_fields"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devtools_tasks" ADD CONSTRAINT "devtools_tasks_board_id_devtools_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."devtools_boards"("id") ON DELETE cascade ON UPDATE no action;