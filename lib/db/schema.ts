// export const tweets = pgTable("tweets", {
//     id: uuid("id").primaryKey().defaultRandom(),
//     text: text("text").notNull(),
//     profileId: uuid("profile_id")
//       .notNull()
//       .references(() => profiles.id),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//     updatedAt: timestamp("updated_at").defaultNow().notNull(),
//     isReply: boolean("is_reply").notNull().default(false),
//     replyId: uuid("reply_id").references((): AnyPgColumn => tweets.id),
//   });