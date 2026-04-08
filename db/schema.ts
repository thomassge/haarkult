import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const adminRoleEnum = pgEnum("admin_role", ["owner", "manager", "staff"]);

export const availabilityExceptionTypeEnum = pgEnum("availability_exception_type", [
  "vacation",
  "break",
  "blocked",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
]);

export const bookingSourceEnum = pgEnum("booking_source", ["online", "admin"]);

export const bookingEventTypeEnum = pgEnum("booking_event_type", [
  "created",
  "confirmed",
  "cancelled",
  "rescheduled",
  "note_added",
  "status_changed",
]);

export const bookingEventActorTypeEnum = pgEnum("booking_event_actor_type", [
  "system",
  "customer",
  "admin",
]);

export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: adminRoleEnum("role").notNull().default("staff"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("admin_users_email_key").on(table.email)]
);

export const staff = pgTable(
  "staff",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("staff_slug_key").on(table.slug)]
);

export const staffServices = pgTable(
  "staff_services",
  {
    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id, { onDelete: "cascade" }),
    serviceId: text("service_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.staffId, table.serviceId], name: "staff_services_pk" }),
    index("staff_services_service_id_idx").on(table.serviceId),
  ]
);

export const weeklyAvailability = pgTable(
  "weekly_availability",
  {
    id: uuid("id").primaryKey(),
    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id, { onDelete: "cascade" }),
    weekday: integer("weekday").notNull(),
    startMinutes: integer("start_minutes").notNull(),
    endMinutes: integer("end_minutes").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("weekly_availability_staff_id_idx").on(table.staffId),
    index("weekly_availability_staff_day_idx").on(table.staffId, table.weekday),
  ]
);

export const availabilityExceptions = pgTable(
  "availability_exceptions",
  {
    id: uuid("id").primaryKey(),
    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id, { onDelete: "cascade" }),
    type: availabilityExceptionTypeEnum("type").notNull(),
    label: text("label"),
    allDay: boolean("all_day").notNull().default(false),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("availability_exceptions_staff_id_idx").on(table.staffId),
    index("availability_exceptions_staff_window_idx").on(
      table.staffId,
      table.startAt,
      table.endAt
    ),
  ]
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey(),
    status: bookingStatusEnum("status").notNull().default("pending"),
    serviceId: text("service_id").notNull(),
    serviceTitle: text("service_title").notNull(),
    serviceCategory: text("service_category").notNull(),
    serviceDurationMinutes: integer("service_duration_minutes").notNull(),
    servicePriceLabel: text("service_price_label").notNull(),
    staffId: uuid("staff_id").references(() => staff.id, { onDelete: "set null" }),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerNote: text("customer_note"),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    source: bookingSourceEnum("source").notNull().default("online"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("bookings_staff_id_idx").on(table.staffId),
    index("bookings_start_at_idx").on(table.startAt),
    index("bookings_status_start_at_idx").on(table.status, table.startAt),
  ]
);

export const bookingEvents = pgTable(
  "booking_events",
  {
    id: uuid("id").primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    eventType: bookingEventTypeEnum("event_type").notNull(),
    actorType: bookingEventActorTypeEnum("actor_type").notNull(),
    actorId: text("actor_id"),
    actorLabel: text("actor_label"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("booking_events_booking_id_idx").on(table.bookingId, table.createdAt)]
);

export const staffRelations = relations(staff, ({ many }) => ({
  services: many(staffServices),
  weeklyAvailability: many(weeklyAvailability),
  availabilityExceptions: many(availabilityExceptions),
  bookings: many(bookings),
}));

export const staffServicesRelations = relations(staffServices, ({ one }) => ({
  staff: one(staff, {
    fields: [staffServices.staffId],
    references: [staff.id],
  }),
}));

export const weeklyAvailabilityRelations = relations(weeklyAvailability, ({ one }) => ({
  staff: one(staff, {
    fields: [weeklyAvailability.staffId],
    references: [staff.id],
  }),
}));

export const availabilityExceptionsRelations = relations(
  availabilityExceptions,
  ({ one }) => ({
    staff: one(staff, {
      fields: [availabilityExceptions.staffId],
      references: [staff.id],
    }),
  })
);

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  staff: one(staff, {
    fields: [bookings.staffId],
    references: [staff.id],
  }),
  events: many(bookingEvents),
}));

export const bookingEventsRelations = relations(bookingEvents, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingEvents.bookingId],
    references: [bookings.id],
  }),
}));
