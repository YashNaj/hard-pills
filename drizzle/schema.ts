import {
	pgTable,
	foreignKey,
	pgPolicy,
	uuid,
	timestamp,
	text,
	boolean,
	pgSchema,
	uniqueIndex,
	index,
	jsonb,
	integer,
	bigint,
	unique,
	varchar,
	type AnyPgColumn,
	serial,
	check,
	smallint,
	json,
	bigserial,
	inet,
	primaryKey,
	pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const auth = pgSchema("auth");
export const storage = pgSchema("storage");
export const aalLevelInAuth = auth.enum("aal_level", ["aal1", "aal2", "aal3"]);
export const codeChallengeMethodInAuth = auth.enum("code_challenge_method", [
	"s256",
	"plain",
]);
export const factorStatusInAuth = auth.enum("factor_status", [
	"unverified",
	"verified",
]);
export const factorTypeInAuth = auth.enum("factor_type", [
	"totp",
	"webauthn",
	"phone",
]);
export const oauthRegistrationTypeInAuth = auth.enum(
	"oauth_registration_type",
	["dynamic", "manual"],
);
export const oneTimeTokenTypeInAuth = auth.enum("one_time_token_type", [
	"confirmation_token",
	"reauthentication_token",
	"recovery_token",
	"email_change_token_new",
	"email_change_token_current",
	"phone_change_token",
]);
export const postStatus = pgEnum("post_status", [
	"draft",
	"scheduled",
	"published",
	"archived",
]);
export const buckettypeInStorage = storage.enum("buckettype", [
	"STANDARD",
	"ANALYTICS",
]);

export const notifications = pgTable(
	"notifications",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		userId: uuid("user_id"),
		title: text().notNull(),
		content: text().notNull(),
		read: boolean().default(false),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: "notifications_user_id_fkey",
		}),
		pgPolicy("Users can view their own notifications", {
			as: "permissive",
			for: "select",
			to: ["public"],
			using: sql`((user_id = auth.uid()) OR is_admin())`,
		}),
		pgPolicy("Admins can manage all notifications", {
			as: "permissive",
			for: "all",
			to: ["public"],
		}),
	],
);

export const objectsInStorage = storage.table(
	"objects",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		bucketId: text("bucket_id"),
		name: text(),
		owner: uuid(),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		lastAccessedAt: timestamp("last_accessed_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		metadata: jsonb(),
		pathTokens: text("path_tokens")
			.array()
			.generatedAlwaysAs(sql`string_to_array(name, '/'::text)`),
		version: text(),
		ownerId: text("owner_id"),
		userMetadata: jsonb("user_metadata"),
		level: integer(),
	},
	(table) => [
		uniqueIndex("bucketid_objname").using(
			"btree",
			table.bucketId.asc().nullsLast().op("text_ops"),
			table.name.asc().nullsLast().op("text_ops"),
		),
		uniqueIndex("idx_name_bucket_level_unique").using(
			"btree",
			table.name.asc().nullsLast().op("text_ops"),
			table.bucketId.asc().nullsLast().op("int4_ops"),
			table.level.asc().nullsLast().op("text_ops"),
		),
		index("idx_objects_bucket_id_name").using(
			"btree",
			table.bucketId.asc().nullsLast().op("text_ops"),
			table.name.asc().nullsLast().op("text_ops"),
		),
		index("idx_objects_lower_name").using(
			"btree",
			sql`path_tokens[level]`,
			sql`lower(name)`,
			sql`bucket_id`,
			sql`level`,
		),
		index("name_prefix_search").using(
			"btree",
			table.name.asc().nullsLast().op("text_pattern_ops"),
		),
		uniqueIndex("objects_bucket_id_level_idx").using(
			"btree",
			table.bucketId.asc().nullsLast().op("text_ops"),
			table.level.asc().nullsLast().op("text_ops"),
			table.name.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.bucketId],
			foreignColumns: [bucketsInStorage.id],
			name: "objects_bucketId_fkey",
		}),
		pgPolicy("Give anon users access to JPG images in folder jixmzo_0", {
			as: "permissive",
			for: "select",
			to: ["public"],
			using: sql`((bucket_id = 'Post Images Thumbnail'::text) AND (storage.extension(name) = 'jpg'::text) AND (lower((storage.foldername(name))[1]) = 'public'::text) AND (auth.role() = 'anon'::text))`,
		}),
		pgPolicy("Give anon users access to JPG images in folder 30v6b3_0", {
			as: "permissive",
			for: "select",
			to: ["public"],
		}),
		pgPolicy("Give anon users access to JPG images in folder 1xz1igt_0", {
			as: "permissive",
			for: "select",
			to: ["public"],
		}),
		pgPolicy("Give anon users access to JPG images in folder mv188j_0", {
			as: "permissive",
			for: "select",
			to: ["public"],
		}),
		pgPolicy("Give anon users access to JPG images in folder fupf6h_0", {
			as: "permissive",
			for: "select",
			to: ["public"],
		}),
		pgPolicy("Authenticated users full access to post_images_original", {
			as: "permissive",
			for: "all",
			to: ["authenticated"],
		}),
		pgPolicy("Public read access to post_images_original", {
			as: "permissive",
			for: "select",
			to: ["public"],
		}),
		pgPolicy("Authenticated users full access to post_images_large", {
			as: "permissive",
			for: "all",
			to: ["authenticated"],
		}),
		pgPolicy("Public read access to post_images_large", {
			as: "permissive",
			for: "select",
			to: ["public"],
		}),
		pgPolicy("Authenticated users full access to post_images_medium", {
			as: "permissive",
			for: "all",
			to: ["authenticated"],
		}),
		pgPolicy("Public read access to post_images_medium", {
			as: "permissive",
			for: "select",
			to: ["public"],
		}),
		pgPolicy("Authenticated users full access to post_images_thumbnail", {
			as: "permissive",
			for: "all",
			to: ["authenticated"],
		}),
		pgPolicy("Public read access to post_images_thumbnail", {
			as: "permissive",
			for: "select",
			to: ["public"],
		}),
		pgPolicy("Authenticated users full access to post_images_blur", {
			as: "permissive",
			for: "all",
			to: ["authenticated"],
		}),
		pgPolicy("Public read access to post_images_blur", {
			as: "permissive",
			for: "select",
			to: ["public"],
		}),
	],
);

export const bucketsInStorage = storage.table(
	"buckets",
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		owner: uuid(),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		public: boolean().default(false),
		avifAutodetection: boolean("avif_autodetection").default(false),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		fileSizeLimit: bigint("file_size_limit", { mode: "number" }),
		allowedMimeTypes: text("allowed_mime_types").array(),
		ownerId: text("owner_id"),
		type: buckettypeInStorage().default("STANDARD").notNull(),
	},
	(table) => [
		uniqueIndex("bname").using(
			"btree",
			table.name.asc().nullsLast().op("text_ops"),
		),
	],
);

export const migrationsInStorage = storage.table(
	"migrations",
	{
		id: integer().primaryKey().notNull(),
		name: varchar({ length: 100 }).notNull(),
		hash: varchar({ length: 40 }).notNull(),
		executedAt: timestamp("executed_at", { mode: "string" }).default(
			sql`CURRENT_TIMESTAMP`,
		),
	},
	(table) => [unique("migrations_name_key").on(table.name)],
);

export const postImages = pgTable(
	"post_images",
	{
		id: uuid()
			.default(sql`uuid_generate_v4()`)
			.primaryKey()
			.notNull(),
		postId: uuid("post_id").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		originalFilename: text("original_filename").notNull(),
		altText: text("alt_text"),
		displayOrder: integer("display_order").default(0),
		mimeType: text("mime_type").default("image/webp").notNull(),
		originalPath: text("original_path").notNull(),
		originalWidth: integer("original_width").notNull(),
		originalHeight: integer("original_height").notNull(),
		originalSize: integer("original_size").notNull(),
		largePath: text("large_path"),
		largeWidth: integer("large_width"),
		largeHeight: integer("large_height"),
		largeSize: integer("large_size"),
		mediumPath: text("medium_path"),
		mediumWidth: integer("medium_width"),
		mediumHeight: integer("medium_height"),
		mediumSize: integer("medium_size"),
		thumbnailPath: text("thumbnail_path"),
		thumbnailWidth: integer("thumbnail_width"),
		thumbnailHeight: integer("thumbnail_height"),
		thumbnailSize: integer("thumbnail_size"),
		blurPath: text("blur_path"),
		blurWidth: integer("blur_width"),
		blurHeight: integer("blur_height"),
		blurSize: integer("blur_size"),
		lastModified: timestamp("last_modified", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		paginationCursor: serial("pagination_cursor").notNull(),
	},
	(table) => [
		index("idx_post_images_post_id").using(
			"btree",
			table.postId.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "fk_post",
		}),
		foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "post_images_post_id_fkey",
		}).onDelete("cascade"),
		pgPolicy("Allow anyone to view post_images", {
			as: "permissive",
			for: "select",
			to: ["anon", "authenticated"],
			using: sql`true`,
		}),
		pgPolicy("Allow specific users to manage post_images", {
			as: "permissive",
			for: "all",
			to: ["authenticated"],
		}),
	],
);

export const oauthClientsInAuth = auth.table(
	"oauth_clients",
	{
		id: uuid().primaryKey().notNull(),
		clientId: text("client_id").notNull(),
		clientSecretHash: text("client_secret_hash").notNull(),
		registrationType:
			oauthRegistrationTypeInAuth("registration_type").notNull(),
		redirectUris: text("redirect_uris").notNull(),
		grantTypes: text("grant_types").notNull(),
		clientName: text("client_name"),
		clientUri: text("client_uri"),
		logoUri: text("logo_uri"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
	},
	(table) => [
		index("oauth_clients_client_id_idx").using(
			"btree",
			table.clientId.asc().nullsLast().op("text_ops"),
		),
		index("oauth_clients_deleted_at_idx").using(
			"btree",
			table.deletedAt.asc().nullsLast().op("timestamptz_ops"),
		),
		unique("oauth_clients_client_id_key").on(table.clientId),
		check(
			"oauth_clients_client_name_length",
			sql`char_length(client_name) <= 1024`,
		),
		check(
			"oauth_clients_client_uri_length",
			sql`char_length(client_uri) <= 2048`,
		),
		check("oauth_clients_logo_uri_length", sql`char_length(logo_uri) <= 2048`),
	],
);

export const posts = pgTable(
	"posts",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		title: text().notNull(),
		content: text().notNull(),
		slug: text().notNull(),
		author: uuid().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		submissionId: uuid("submission_id"),
		scheduledAt: timestamp("scheduled_at", {
			withTimezone: true,
			mode: "string",
		}),
		status: postStatus().default("draft").notNull(),
		headerImageId: uuid("header_image_id"),
		featured: boolean().default(false),
	},
	(table) => [
		foreignKey({
			columns: [table.author],
			foreignColumns: [usersInAuth.id],
			name: "posts_author_fkey",
		}),
		foreignKey({
			columns: [table.headerImageId],
			foreignColumns: [postImages.id],
			name: "posts_header_image_id_fkey",
		}),
		foreignKey({
			columns: [table.submissionId],
			foreignColumns: [submissions.id],
			name: "posts_submission_id_fkey",
		}),
		unique("posts_slug_key").on(table.slug),
		pgPolicy("Admins can do everything with posts", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`is_admin()`,
		}),
	],
);

export const bucketsAnalyticsInStorage = storage.table("buckets_analytics", {
	id: text().primaryKey().notNull(),
	type: buckettypeInStorage().default("ANALYTICS").notNull(),
	format: text().default("ICEBERG").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
		.defaultNow()
		.notNull(),
});

export const submissions = pgTable(
	"submissions",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		name: text(),
		email: text(),
		subject: text(),
		content: text().notNull(),
		ipAddress: text("ip_address"),
		status: text().default("pending"),
	},
	(table) => [
		pgPolicy("Anyone can create submissions with rate limit", {
			as: "permissive",
			for: "insert",
			to: ["public"],
			withCheck: sql`check_submission_rate_limit()`,
		}),
		pgPolicy("Admins can manage submissions", {
			as: "permissive",
			for: "all",
			to: ["public"],
		}),
	],
);

export const mailingList = pgTable(
	"mailing_list",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
			name: "mailing_list_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 9223372036854775807,
			cache: 1,
		}),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		email: text().default(""),
	},
	(table) => [
		pgPolicy("Anyone can subscribe to mailing list", {
			as: "permissive",
			for: "insert",
			to: ["public"],
			withCheck: sql`true`,
		}),
		pgPolicy("Admins can manage mailing list", {
			as: "permissive",
			for: "all",
			to: ["public"],
		}),
	],
);

export const ssoProvidersInAuth = auth.table(
	"sso_providers",
	{
		id: uuid().primaryKey().notNull(),
		resourceId: text("resource_id"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		disabled: boolean(),
	},
	(table) => [
		uniqueIndex("sso_providers_resource_id_idx").using(
			"btree",
			sql`lower(resource_id)`,
		),
		index("sso_providers_resource_id_pattern_idx").using(
			"btree",
			table.resourceId.asc().nullsLast().op("text_pattern_ops"),
		),
		check(
			"resource_id not empty",
			sql`(resource_id = NULL::text) OR (char_length(resource_id) > 0)`,
		),
	],
);

export const schemaMigrationsInAuth = auth.table("schema_migrations", {
	version: varchar({ length: 255 }).primaryKey().notNull(),
});

export const instancesInAuth = auth.table("instances", {
	id: uuid().primaryKey().notNull(),
	uuid: uuid(),
	rawBaseConfig: text("raw_base_config"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const usersInAuth = auth.table(
	"users",
	{
		instanceId: uuid("instance_id"),
		id: uuid().primaryKey().notNull(),
		aud: varchar({ length: 255 }),
		role: varchar({ length: 255 }),
		email: varchar({ length: 255 }),
		encryptedPassword: varchar("encrypted_password", { length: 255 }),
		emailConfirmedAt: timestamp("email_confirmed_at", {
			withTimezone: true,
			mode: "string",
		}),
		invitedAt: timestamp("invited_at", { withTimezone: true, mode: "string" }),
		confirmationToken: varchar("confirmation_token", { length: 255 }),
		confirmationSentAt: timestamp("confirmation_sent_at", {
			withTimezone: true,
			mode: "string",
		}),
		recoveryToken: varchar("recovery_token", { length: 255 }),
		recoverySentAt: timestamp("recovery_sent_at", {
			withTimezone: true,
			mode: "string",
		}),
		emailChangeTokenNew: varchar("email_change_token_new", { length: 255 }),
		emailChange: varchar("email_change", { length: 255 }),
		emailChangeSentAt: timestamp("email_change_sent_at", {
			withTimezone: true,
			mode: "string",
		}),
		lastSignInAt: timestamp("last_sign_in_at", {
			withTimezone: true,
			mode: "string",
		}),
		rawAppMetaData: jsonb("raw_app_meta_data"),
		rawUserMetaData: jsonb("raw_user_meta_data"),
		isSuperAdmin: boolean("is_super_admin"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		phone: text().default(sql`NULL`),
		phoneConfirmedAt: timestamp("phone_confirmed_at", {
			withTimezone: true,
			mode: "string",
		}),
		phoneChange: text("phone_change").default(""),
		phoneChangeToken: varchar("phone_change_token", { length: 255 }).default(
			"",
		),
		phoneChangeSentAt: timestamp("phone_change_sent_at", {
			withTimezone: true,
			mode: "string",
		}),
		confirmedAt: timestamp("confirmed_at", {
			withTimezone: true,
			mode: "string",
		}).generatedAlwaysAs(sql`LEAST(email_confirmed_at, phone_confirmed_at)`),
		emailChangeTokenCurrent: varchar("email_change_token_current", {
			length: 255,
		}).default(""),
		emailChangeConfirmStatus: smallint("email_change_confirm_status").default(
			0,
		),
		bannedUntil: timestamp("banned_until", {
			withTimezone: true,
			mode: "string",
		}),
		reauthenticationToken: varchar("reauthentication_token", {
			length: 255,
		}).default(""),
		reauthenticationSentAt: timestamp("reauthentication_sent_at", {
			withTimezone: true,
			mode: "string",
		}),
		isSsoUser: boolean("is_sso_user").default(false).notNull(),
		deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
		isAnonymous: boolean("is_anonymous").default(false).notNull(),
	},
	(table) => [
		uniqueIndex("confirmation_token_idx")
			.using("btree", table.confirmationToken.asc().nullsLast().op("text_ops"))
			.where(sql`((confirmation_token)::text !~ '^[0-9 ]*$'::text)`),
		uniqueIndex("email_change_token_current_idx")
			.using(
				"btree",
				table.emailChangeTokenCurrent.asc().nullsLast().op("text_ops"),
			)
			.where(sql`((email_change_token_current)::text !~ '^[0-9 ]*$'::text)`),
		uniqueIndex("email_change_token_new_idx")
			.using(
				"btree",
				table.emailChangeTokenNew.asc().nullsLast().op("text_ops"),
			)
			.where(sql`((email_change_token_new)::text !~ '^[0-9 ]*$'::text)`),
		uniqueIndex("reauthentication_token_idx")
			.using(
				"btree",
				table.reauthenticationToken.asc().nullsLast().op("text_ops"),
			)
			.where(sql`((reauthentication_token)::text !~ '^[0-9 ]*$'::text)`),
		uniqueIndex("recovery_token_idx")
			.using("btree", table.recoveryToken.asc().nullsLast().op("text_ops"))
			.where(sql`((recovery_token)::text !~ '^[0-9 ]*$'::text)`),
		uniqueIndex("users_email_partial_key")
			.using("btree", table.email.asc().nullsLast().op("text_ops"))
			.where(sql`(is_sso_user = false)`),
		index("users_instance_id_email_idx").using(
			"btree",
			sql`instance_id`,
			sql`null`,
		),
		index("users_instance_id_idx").using(
			"btree",
			table.instanceId.asc().nullsLast().op("uuid_ops"),
		),
		index("users_is_anonymous_idx").using(
			"btree",
			table.isAnonymous.asc().nullsLast().op("bool_ops"),
		),
		unique("users_phone_key").on(table.phone),
		check(
			"users_email_change_confirm_status_check",
			sql`(email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)`,
		),
	],
);

export const auditLogEntriesInAuth = auth.table(
	"audit_log_entries",
	{
		instanceId: uuid("instance_id"),
		id: uuid().primaryKey().notNull(),
		payload: json(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		ipAddress: varchar("ip_address", { length: 64 }).default("").notNull(),
	},
	(table) => [
		index("audit_logs_instance_id_idx").using(
			"btree",
			table.instanceId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const samlRelayStatesInAuth = auth.table(
	"saml_relay_states",
	{
		id: uuid().primaryKey().notNull(),
		ssoProviderId: uuid("sso_provider_id").notNull(),
		requestId: text("request_id").notNull(),
		forEmail: text("for_email"),
		redirectTo: text("redirect_to"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		flowStateId: uuid("flow_state_id"),
	},
	(table) => [
		index("saml_relay_states_created_at_idx").using(
			"btree",
			table.createdAt.desc().nullsFirst().op("timestamptz_ops"),
		),
		index("saml_relay_states_for_email_idx").using(
			"btree",
			table.forEmail.asc().nullsLast().op("text_ops"),
		),
		index("saml_relay_states_sso_provider_id_idx").using(
			"btree",
			table.ssoProviderId.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			columns: [table.flowStateId],
			foreignColumns: [flowStateInAuth.id],
			name: "saml_relay_states_flow_state_id_fkey",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.ssoProviderId],
			foreignColumns: [ssoProvidersInAuth.id],
			name: "saml_relay_states_sso_provider_id_fkey",
		}).onDelete("cascade"),
		check("request_id not empty", sql`char_length(request_id) > 0`),
	],
);

export const refreshTokensInAuth = auth.table(
	"refresh_tokens",
	{
		instanceId: uuid("instance_id"),
		id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
		token: varchar({ length: 255 }),
		userId: varchar("user_id", { length: 255 }),
		revoked: boolean(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		parent: varchar({ length: 255 }),
		sessionId: uuid("session_id"),
	},
	(table) => [
		index("refresh_tokens_instance_id_idx").using(
			"btree",
			table.instanceId.asc().nullsLast().op("uuid_ops"),
		),
		index("refresh_tokens_instance_id_user_id_idx").using(
			"btree",
			table.instanceId.asc().nullsLast().op("text_ops"),
			table.userId.asc().nullsLast().op("text_ops"),
		),
		index("refresh_tokens_parent_idx").using(
			"btree",
			table.parent.asc().nullsLast().op("text_ops"),
		),
		index("refresh_tokens_session_id_revoked_idx").using(
			"btree",
			table.sessionId.asc().nullsLast().op("bool_ops"),
			table.revoked.asc().nullsLast().op("bool_ops"),
		),
		index("refresh_tokens_updated_at_idx").using(
			"btree",
			table.updatedAt.desc().nullsFirst().op("timestamptz_ops"),
		),
		foreignKey({
			columns: [table.sessionId],
			foreignColumns: [sessionsInAuth.id],
			name: "refresh_tokens_session_id_fkey",
		}).onDelete("cascade"),
		unique("refresh_tokens_token_unique").on(table.token),
	],
);

export const sessionsInAuth = auth.table(
	"sessions",
	{
		id: uuid().primaryKey().notNull(),
		userId: uuid("user_id").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		factorId: uuid("factor_id"),
		aal: aalLevelInAuth(),
		notAfter: timestamp("not_after", { withTimezone: true, mode: "string" }),
		refreshedAt: timestamp("refreshed_at", { mode: "string" }),
		userAgent: text("user_agent"),
		ip: inet(),
		tag: text(),
	},
	(table) => [
		index("sessions_not_after_idx").using(
			"btree",
			table.notAfter.desc().nullsFirst().op("timestamptz_ops"),
		),
		index("sessions_user_id_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
		index("user_id_created_at_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
			table.createdAt.asc().nullsLast().op("timestamptz_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: "sessions_user_id_fkey",
		}).onDelete("cascade"),
	],
);

export const ssoDomainsInAuth = auth.table(
	"sso_domains",
	{
		id: uuid().primaryKey().notNull(),
		ssoProviderId: uuid("sso_provider_id").notNull(),
		domain: text().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
	},
	(table) => [
		uniqueIndex("sso_domains_domain_idx").using("btree", sql`lower(domain)`),
		index("sso_domains_sso_provider_id_idx").using(
			"btree",
			table.ssoProviderId.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			columns: [table.ssoProviderId],
			foreignColumns: [ssoProvidersInAuth.id],
			name: "sso_domains_sso_provider_id_fkey",
		}).onDelete("cascade"),
		check("domain not empty", sql`char_length(domain) > 0`),
	],
);

export const mfaAmrClaimsInAuth = auth.table(
	"mfa_amr_claims",
	{
		sessionId: uuid("session_id").notNull(),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		authenticationMethod: text("authentication_method").notNull(),
		id: uuid().primaryKey().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.sessionId],
			foreignColumns: [sessionsInAuth.id],
			name: "mfa_amr_claims_session_id_fkey",
		}).onDelete("cascade"),
		unique("mfa_amr_claims_session_id_authentication_method_pkey").on(
			table.sessionId,
			table.authenticationMethod,
		),
	],
);

export const samlProvidersInAuth = auth.table(
	"saml_providers",
	{
		id: uuid().primaryKey().notNull(),
		ssoProviderId: uuid("sso_provider_id").notNull(),
		entityId: text("entity_id").notNull(),
		metadataXml: text("metadata_xml").notNull(),
		metadataUrl: text("metadata_url"),
		attributeMapping: jsonb("attribute_mapping"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		nameIdFormat: text("name_id_format"),
	},
	(table) => [
		index("saml_providers_sso_provider_id_idx").using(
			"btree",
			table.ssoProviderId.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			columns: [table.ssoProviderId],
			foreignColumns: [ssoProvidersInAuth.id],
			name: "saml_providers_sso_provider_id_fkey",
		}).onDelete("cascade"),
		unique("saml_providers_entity_id_key").on(table.entityId),
		check("entity_id not empty", sql`char_length(entity_id) > 0`),
		check(
			"metadata_url not empty",
			sql`(metadata_url = NULL::text) OR (char_length(metadata_url) > 0)`,
		),
		check("metadata_xml not empty", sql`char_length(metadata_xml) > 0`),
	],
);

export const flowStateInAuth = auth.table(
	"flow_state",
	{
		id: uuid().primaryKey().notNull(),
		userId: uuid("user_id"),
		authCode: text("auth_code").notNull(),
		codeChallengeMethod: codeChallengeMethodInAuth(
			"code_challenge_method",
		).notNull(),
		codeChallenge: text("code_challenge").notNull(),
		providerType: text("provider_type").notNull(),
		providerAccessToken: text("provider_access_token"),
		providerRefreshToken: text("provider_refresh_token"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		authenticationMethod: text("authentication_method").notNull(),
		authCodeIssuedAt: timestamp("auth_code_issued_at", {
			withTimezone: true,
			mode: "string",
		}),
	},
	(table) => [
		index("flow_state_created_at_idx").using(
			"btree",
			table.createdAt.desc().nullsFirst().op("timestamptz_ops"),
		),
		index("idx_auth_code").using(
			"btree",
			table.authCode.asc().nullsLast().op("text_ops"),
		),
		index("idx_user_id_auth_method").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
			table.authenticationMethod.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const identitiesInAuth = auth.table(
	"identities",
	{
		providerId: text("provider_id").notNull(),
		userId: uuid("user_id").notNull(),
		identityData: jsonb("identity_data").notNull(),
		provider: text().notNull(),
		lastSignInAt: timestamp("last_sign_in_at", {
			withTimezone: true,
			mode: "string",
		}),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		email: text().generatedAlwaysAs(
			sql`lower((identity_data ->> 'email'::text))`,
		),
		id: uuid().defaultRandom().primaryKey().notNull(),
	},
	(table) => [
		index("identities_email_idx").using(
			"btree",
			table.email.asc().nullsLast().op("text_pattern_ops"),
		),
		index("identities_user_id_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: "identities_user_id_fkey",
		}).onDelete("cascade"),
		unique("identities_provider_id_provider_unique").on(
			table.providerId,
			table.provider,
		),
	],
);

export const oneTimeTokensInAuth = auth.table(
	"one_time_tokens",
	{
		id: uuid().primaryKey().notNull(),
		userId: uuid("user_id").notNull(),
		tokenType: oneTimeTokenTypeInAuth("token_type").notNull(),
		tokenHash: text("token_hash").notNull(),
		relatesTo: text("relates_to").notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("one_time_tokens_relates_to_hash_idx").using(
			"hash",
			table.relatesTo.asc().nullsLast().op("text_ops"),
		),
		index("one_time_tokens_token_hash_hash_idx").using(
			"hash",
			table.tokenHash.asc().nullsLast().op("text_ops"),
		),
		uniqueIndex("one_time_tokens_user_id_token_type_key").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
			table.tokenType.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: "one_time_tokens_user_id_fkey",
		}).onDelete("cascade"),
		check("one_time_tokens_token_hash_check", sql`char_length(token_hash) > 0`),
	],
);

export const mfaFactorsInAuth = auth.table(
	"mfa_factors",
	{
		id: uuid().primaryKey().notNull(),
		userId: uuid("user_id").notNull(),
		friendlyName: text("friendly_name"),
		factorType: factorTypeInAuth("factor_type").notNull(),
		status: factorStatusInAuth().notNull(),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		secret: text(),
		phone: text(),
		lastChallengedAt: timestamp("last_challenged_at", {
			withTimezone: true,
			mode: "string",
		}),
		webAuthnCredential: jsonb("web_authn_credential"),
		webAuthnAaguid: uuid("web_authn_aaguid"),
	},
	(table) => [
		index("factor_id_created_at_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("timestamptz_ops"),
			table.createdAt.asc().nullsLast().op("uuid_ops"),
		),
		uniqueIndex("mfa_factors_user_friendly_name_unique")
			.using(
				"btree",
				table.friendlyName.asc().nullsLast().op("text_ops"),
				table.userId.asc().nullsLast().op("uuid_ops"),
			)
			.where(sql`(TRIM(BOTH FROM friendly_name) <> ''::text)`),
		index("mfa_factors_user_id_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
		uniqueIndex("unique_phone_factor_per_user").using(
			"btree",
			table.userId.asc().nullsLast().op("text_ops"),
			table.phone.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: "mfa_factors_user_id_fkey",
		}).onDelete("cascade"),
		unique("mfa_factors_last_challenged_at_key").on(table.lastChallengedAt),
	],
);

export const mfaChallengesInAuth = auth.table(
	"mfa_challenges",
	{
		id: uuid().primaryKey().notNull(),
		factorId: uuid("factor_id").notNull(),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		verifiedAt: timestamp("verified_at", {
			withTimezone: true,
			mode: "string",
		}),
		ipAddress: inet("ip_address").notNull(),
		otpCode: text("otp_code"),
		webAuthnSessionData: jsonb("web_authn_session_data"),
	},
	(table) => [
		index("mfa_challenge_created_at_idx").using(
			"btree",
			table.createdAt.desc().nullsFirst().op("timestamptz_ops"),
		),
		foreignKey({
			columns: [table.factorId],
			foreignColumns: [mfaFactorsInAuth.id],
			name: "mfa_challenges_auth_factor_id_fkey",
		}).onDelete("cascade"),
	],
);

export const s3MultipartUploadsInStorage = storage.table(
	"s3_multipart_uploads",
	{
		id: text().primaryKey().notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		inProgressSize: bigint("in_progress_size", { mode: "number" })
			.default(0)
			.notNull(),
		uploadSignature: text("upload_signature").notNull(),
		bucketId: text("bucket_id").notNull(),
		key: text().notNull(),
		version: text().notNull(),
		ownerId: text("owner_id"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		userMetadata: jsonb("user_metadata"),
	},
	(table) => [
		index("idx_multipart_uploads_list").using(
			"btree",
			table.bucketId.asc().nullsLast().op("timestamptz_ops"),
			table.key.asc().nullsLast().op("text_ops"),
			table.createdAt.asc().nullsLast().op("timestamptz_ops"),
		),
		foreignKey({
			columns: [table.bucketId],
			foreignColumns: [bucketsInStorage.id],
			name: "s3_multipart_uploads_bucket_id_fkey",
		}),
	],
);

export const s3MultipartUploadsPartsInStorage = storage.table(
	"s3_multipart_uploads_parts",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		uploadId: text("upload_id").notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		size: bigint({ mode: "number" }).default(0).notNull(),
		partNumber: integer("part_number").notNull(),
		bucketId: text("bucket_id").notNull(),
		key: text().notNull(),
		etag: text().notNull(),
		ownerId: text("owner_id"),
		version: text().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.bucketId],
			foreignColumns: [bucketsInStorage.id],
			name: "s3_multipart_uploads_parts_bucket_id_fkey",
		}),
		foreignKey({
			columns: [table.uploadId],
			foreignColumns: [s3MultipartUploadsInStorage.id],
			name: "s3_multipart_uploads_parts_upload_id_fkey",
		}).onDelete("cascade"),
	],
);

export const prefixesInStorage = storage.table(
	"prefixes",
	{
		bucketId: text("bucket_id").notNull(),
		name: text().notNull(),
		level: integer()
			.notNull()
			.generatedAlwaysAs(sql`storage.get_level(name)`),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
	},
	(table) => [
		index("idx_prefixes_lower_name").using(
			"btree",
			sql`bucket_id`,
			sql`level`,
			sql`lower(name)`,
			sql`null`,
		),
		foreignKey({
			columns: [table.bucketId],
			foreignColumns: [bucketsInStorage.id],
			name: "prefixes_bucketId_fkey",
		}),
		primaryKey({
			columns: [table.bucketId, table.name, table.level],
			name: "prefixes_pkey",
		}),
	],
);
