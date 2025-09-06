import { relations } from "drizzle-orm/relations";
import { usersInAuth, notifications, bucketsInStorage, objectsInStorage, posts, postImages, submissions, flowStateInAuth, samlRelayStatesInAuth, ssoProvidersInAuth, sessionsInAuth, refreshTokensInAuth, ssoDomainsInAuth, mfaAmrClaimsInAuth, samlProvidersInAuth, identitiesInAuth, oneTimeTokensInAuth, mfaFactorsInAuth, mfaChallengesInAuth, s3MultipartUploadsInStorage, s3MultipartUploadsPartsInStorage, prefixesInStorage } from "./schema";

export const notificationsRelations = relations(notifications, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [notifications.userId],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	notifications: many(notifications),
	posts: many(posts),
	sessionsInAuths: many(sessionsInAuth),
	identitiesInAuths: many(identitiesInAuth),
	oneTimeTokensInAuths: many(oneTimeTokensInAuth),
	mfaFactorsInAuths: many(mfaFactorsInAuth),
}));

export const objectsInStorageRelations = relations(objectsInStorage, ({one}) => ({
	bucketsInStorage: one(bucketsInStorage, {
		fields: [objectsInStorage.bucketId],
		references: [bucketsInStorage.id]
	}),
}));

export const bucketsInStorageRelations = relations(bucketsInStorage, ({many}) => ({
	objectsInStorages: many(objectsInStorage),
	s3MultipartUploadsInStorages: many(s3MultipartUploadsInStorage),
	s3MultipartUploadsPartsInStorages: many(s3MultipartUploadsPartsInStorage),
	prefixesInStorages: many(prefixesInStorage),
}));

export const postImagesRelations = relations(postImages, ({one, many}) => ({
	post_postId: one(posts, {
		fields: [postImages.postId],
		references: [posts.id],
		relationName: "postImages_postId_posts_id"
	}),
	post_postId: one(posts, {
		fields: [postImages.postId],
		references: [posts.id],
		relationName: "postImages_postId_posts_id"
	}),
	posts: many(posts, {
		relationName: "posts_headerImageId_postImages_id"
	}),
}));

export const postsRelations = relations(posts, ({one, many}) => ({
	postImages_postId: many(postImages, {
		relationName: "postImages_postId_posts_id"
	}),
	postImages_postId: many(postImages, {
		relationName: "postImages_postId_posts_id"
	}),
	usersInAuth: one(usersInAuth, {
		fields: [posts.author],
		references: [usersInAuth.id]
	}),
	postImage: one(postImages, {
		fields: [posts.headerImageId],
		references: [postImages.id],
		relationName: "posts_headerImageId_postImages_id"
	}),
	submission: one(submissions, {
		fields: [posts.submissionId],
		references: [submissions.id]
	}),
}));

export const submissionsRelations = relations(submissions, ({many}) => ({
	posts: many(posts),
}));

export const samlRelayStatesInAuthRelations = relations(samlRelayStatesInAuth, ({one}) => ({
	flowStateInAuth: one(flowStateInAuth, {
		fields: [samlRelayStatesInAuth.flowStateId],
		references: [flowStateInAuth.id]
	}),
	ssoProvidersInAuth: one(ssoProvidersInAuth, {
		fields: [samlRelayStatesInAuth.ssoProviderId],
		references: [ssoProvidersInAuth.id]
	}),
}));

export const flowStateInAuthRelations = relations(flowStateInAuth, ({many}) => ({
	samlRelayStatesInAuths: many(samlRelayStatesInAuth),
}));

export const ssoProvidersInAuthRelations = relations(ssoProvidersInAuth, ({many}) => ({
	samlRelayStatesInAuths: many(samlRelayStatesInAuth),
	ssoDomainsInAuths: many(ssoDomainsInAuth),
	samlProvidersInAuths: many(samlProvidersInAuth),
}));

export const refreshTokensInAuthRelations = relations(refreshTokensInAuth, ({one}) => ({
	sessionsInAuth: one(sessionsInAuth, {
		fields: [refreshTokensInAuth.sessionId],
		references: [sessionsInAuth.id]
	}),
}));

export const sessionsInAuthRelations = relations(sessionsInAuth, ({one, many}) => ({
	refreshTokensInAuths: many(refreshTokensInAuth),
	usersInAuth: one(usersInAuth, {
		fields: [sessionsInAuth.userId],
		references: [usersInAuth.id]
	}),
	mfaAmrClaimsInAuths: many(mfaAmrClaimsInAuth),
}));

export const ssoDomainsInAuthRelations = relations(ssoDomainsInAuth, ({one}) => ({
	ssoProvidersInAuth: one(ssoProvidersInAuth, {
		fields: [ssoDomainsInAuth.ssoProviderId],
		references: [ssoProvidersInAuth.id]
	}),
}));

export const mfaAmrClaimsInAuthRelations = relations(mfaAmrClaimsInAuth, ({one}) => ({
	sessionsInAuth: one(sessionsInAuth, {
		fields: [mfaAmrClaimsInAuth.sessionId],
		references: [sessionsInAuth.id]
	}),
}));

export const samlProvidersInAuthRelations = relations(samlProvidersInAuth, ({one}) => ({
	ssoProvidersInAuth: one(ssoProvidersInAuth, {
		fields: [samlProvidersInAuth.ssoProviderId],
		references: [ssoProvidersInAuth.id]
	}),
}));

export const identitiesInAuthRelations = relations(identitiesInAuth, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [identitiesInAuth.userId],
		references: [usersInAuth.id]
	}),
}));

export const oneTimeTokensInAuthRelations = relations(oneTimeTokensInAuth, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [oneTimeTokensInAuth.userId],
		references: [usersInAuth.id]
	}),
}));

export const mfaFactorsInAuthRelations = relations(mfaFactorsInAuth, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [mfaFactorsInAuth.userId],
		references: [usersInAuth.id]
	}),
	mfaChallengesInAuths: many(mfaChallengesInAuth),
}));

export const mfaChallengesInAuthRelations = relations(mfaChallengesInAuth, ({one}) => ({
	mfaFactorsInAuth: one(mfaFactorsInAuth, {
		fields: [mfaChallengesInAuth.factorId],
		references: [mfaFactorsInAuth.id]
	}),
}));

export const s3MultipartUploadsInStorageRelations = relations(s3MultipartUploadsInStorage, ({one, many}) => ({
	bucketsInStorage: one(bucketsInStorage, {
		fields: [s3MultipartUploadsInStorage.bucketId],
		references: [bucketsInStorage.id]
	}),
	s3MultipartUploadsPartsInStorages: many(s3MultipartUploadsPartsInStorage),
}));

export const s3MultipartUploadsPartsInStorageRelations = relations(s3MultipartUploadsPartsInStorage, ({one}) => ({
	bucketsInStorage: one(bucketsInStorage, {
		fields: [s3MultipartUploadsPartsInStorage.bucketId],
		references: [bucketsInStorage.id]
	}),
	s3MultipartUploadsInStorage: one(s3MultipartUploadsInStorage, {
		fields: [s3MultipartUploadsPartsInStorage.uploadId],
		references: [s3MultipartUploadsInStorage.id]
	}),
}));

export const prefixesInStorageRelations = relations(prefixesInStorage, ({one}) => ({
	bucketsInStorage: one(bucketsInStorage, {
		fields: [prefixesInStorage.bucketId],
		references: [bucketsInStorage.id]
	}),
}));