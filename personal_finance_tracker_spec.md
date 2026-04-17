# Personal Finance Tracker — Implementation Spec for Gemini CLI

## Purpose

Build a simple personal finance app for a single user that tracks manually entered income and expenses. The app must support both one-time transactions and fixed recurring monthly transactions. Recurring monthly items such as salary, rent, and bills should be entered once and then automatically appear in every applicable month without requiring re-entry.

---

## Product Goal

Create a lightweight, clean, local-first finance tracker that helps a user:

- record one-time income and expenses
- save recurring monthly income and expenses once
- view monthly totals and balances
- manage transaction history with minimal effort

---

## Core Requirements

### 1. Transaction Types

The app must support two transaction modes:

#### A. One-time transactions
Used for entries such as:
- groceries
- transport
- gifts
- side income
- medical expenses
- school fees

#### B. Recurring monthly transactions
Used for entries such as:
- salary
- rent
- electricity bill
- water bill
- internet bill
- subscriptions

Recurring monthly items must be entered once and automatically included in future month views.

---

## Core Features

### 2. Add Transaction

The user must be able to add a transaction with:

- `title`
- `type` (`income` or `expense`)
- `amount`
- `category`
- `notes` (optional)
- `entryMode` (`one_time` or `recurring_monthly`)

#### For one-time transactions:
- include a full `date`

#### For recurring monthly transactions:
- include `startMonth`
- include optional `endMonth`
- include `isActive`

---

### 3. Monthly Dashboard

The app must provide a monthly dashboard that shows:

- selected month
- total income
- total expenses
- net balance
- list of all transactions for that month
- category totals or breakdown

The monthly dashboard must combine:

- one-time transactions created in that month
- recurring monthly transactions active in that month

Formula:

- `netBalance = totalIncome - totalExpenses`

---

### 4. Recurring Transaction Logic

Recurring monthly items must **not** be duplicated into the database each month for MVP.

Instead, the app should:

- store recurring rules once
- dynamically include matching recurring rules when calculating a month view

A recurring rule is active for a given month if:

- `isActive = true`
- the selected month is on or after `startMonth`
- the selected month is on or before `endMonth` if `endMonth` exists

Example:
- salary starting January 2026 with no end month appears every month from January 2026 onward
- rent starting March 2026 and ending December 2026 appears only from March to December 2026

---

### 5. Edit and Delete Rules

The user must be able to:

#### One-time entries
- edit
- delete

#### Recurring entries
- edit
- deactivate
- delete

Default rule for recurring edits:
- edits should affect future months only
- past months should remain historically accurate in reporting logic where possible

For MVP, if historical versioning is too complex, document the limitation clearly and implement the simplest stable version.

---

### 6. Categories

Provide default categories and allow custom categories later if easy.

#### Default income categories
- Salary
- Business
- Freelance
- Gift
- Other Income

#### Default expense categories
- Rent
- Bills
- Food
- Transport
- Airtime/Internet
- Health
- Education
- Entertainment
- Savings
- Other Expense

---

### 7. Search and Filtering

The user must be able to:

- filter by month
- filter by transaction type
- filter by category
- search by title or notes

---

## MVP Scope

The MVP must include:

- add one-time income
- add one-time expense
- add recurring monthly income
- add recurring monthly expense
- monthly dashboard
- transaction list by month
- recurring entries management screen
- edit/delete one-time entries
- edit/deactivate/delete recurring entries
- local data storage
- basic search/filter
- clean and responsive UI

---

## Out of Scope for MVP

Do not build these in version 1:

- bank integrations
- mobile money integrations
- SMS parsing
- multi-user accounts
- cloud sync
- advanced budgeting
- AI forecasting
- tax reporting
- currency conversion
- authentication

---

## Recommended Tech Stack

Use the following stack unless there is a strong reason to simplify:

- **Frontend:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite
- **ORM:** Prisma

This should be a local-first app suitable for development and personal use.

If Gemini CLI prefers a lighter stack, use:
- React
- TypeScript
- SQLite
- Prisma or better-sqlite3

---

## Suggested App Structure

```text
app/
  page.tsx                      # dashboard
  transactions/
    page.tsx                    # monthly transactions list
    new/
      page.tsx                  # add transaction form
  recurring/
    page.tsx                    # manage recurring entries
  categories/
    page.tsx                    # optional future page

components/
  DashboardSummary.tsx
  TransactionList.tsx
  TransactionForm.tsx
  RecurringList.tsx
  MonthSelector.tsx
  FiltersBar.tsx

lib/
  db.ts
  finance.ts
  date.ts
  validation.ts

prisma/
  schema.prisma
```

---

## Data Model

### Transaction
Use for one-time transactions only in MVP.

Fields:

- `id`
- `title`
- `type` (`income` | `expense`)
- `amount`
- `category`
- `date`
- `notes` (optional)
- `createdAt`
- `updatedAt`

### RecurringRule
Use for monthly recurring items.

Fields:

- `id`
- `title`
- `type` (`income` | `expense`)
- `amount`
- `category`
- `startMonth` (format: `YYYY-MM`)
- `endMonth` (nullable, format: `YYYY-MM`)
- `notes` (optional)
- `isActive`
- `createdAt`
- `updatedAt`

### Category
Optional for MVP if using seeded defaults only.

Fields:

- `id`
- `name`
- `type` (`income` | `expense` | `both`)
- `isDefault`

---

## Prisma Schema Guidance

Implement a schema equivalent to:

```prisma
model Transaction {
  id        String   @id @default(cuid())
  title     String
  type      TransactionType
  amount    Decimal
  category  String
  date      DateTime
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model RecurringRule {
  id         String   @id @default(cuid())
  title      String
  type       TransactionType
  amount     Decimal
  category   String
  startMonth String
  endMonth   String?
  notes      String?
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum TransactionType {
  income
  expense
}
```

Use SQLite-compatible Prisma configuration.

---

## Business Logic Rules

### Monthly aggregation
When rendering any selected month:

1. fetch all one-time transactions where `date` falls within the month
2. fetch all recurring rules active for the month
3. convert recurring rules into display-ready virtual transaction rows
4. combine one-time and virtual recurring entries
5. calculate totals

### Active recurring rule condition
A recurring rule is active for a month if:

```ts
rule.isActive &&
selectedMonth >= rule.startMonth &&
(rule.endMonth === null || selectedMonth <= rule.endMonth)
```

### Virtual recurring display object
When showing recurring entries in a month view, represent them like regular transactions in the UI, but mark them with metadata such as:

- `source: "recurring"`
- `recurringRuleId`
- `isVirtual: true`

---

## Validation Rules

The app must validate:

- title is required
- amount must be greater than 0
- type must be `income` or `expense`
- category is required
- date is required for one-time entries
- startMonth is required for recurring entries
- endMonth cannot be before startMonth

Show clear inline validation messages in forms.

---

## UX Requirements

The app should feel:

- simple
- fast
- uncluttered
- easy to understand

### UX expectations
- current month visible on first load
- quick way to switch months
- obvious distinction between one-time and recurring entries
- totals visible above transaction list
- add transaction flow should require minimal clicks
- confirm before delete
- use badges or labels for `income`, `expense`, and `recurring`

---

## Required Screens

### 1. Dashboard
Show:
- current or selected month
- total income
- total expenses
- net balance
- recent or monthly transactions
- button to add transaction
- link to recurring entries management

### 2. Add Transaction Screen
Form fields:
- title
- type
- amount
- category
- notes
- entry mode toggle: one-time / recurring monthly

If one-time:
- show date field

If recurring:
- show startMonth
- show endMonth optional
- show active toggle

### 3. Transactions Screen
Show:
- all transactions for selected month
- filters
- search
- edit/delete actions

### 4. Recurring Entries Screen
Show:
- all recurring income rules
- all recurring expense rules
- edit/deactivate/delete actions

---

## Seed Data

Seed the app with default categories listed earlier.

Optional:
- provide sample demo data behind a toggle or seed script

---

## Error Handling

Handle gracefully:

- empty state with no transactions
- invalid form submissions
- database failures
- bad month parsing
- delete/edit failures

Show user-friendly error messages.

---

## Testing Expectations

At minimum, verify:

1. one-time income can be added and appears in the correct month
2. one-time expense can be added and appears in the correct month
3. recurring salary entered once appears in future month views
4. recurring rent entered once appears in future month views
5. inactive recurring rules no longer appear
6. month totals are correct
7. net balance is correct
8. filtering by category works
9. searching by title works
10. editing transactions updates the displayed results

If possible, create:
- unit tests for finance aggregation logic
- basic integration tests for form submission and month rendering

---

## Developer Guidance for Gemini CLI

Please generate:

1. a clean Next.js + TypeScript project
2. Prisma setup with SQLite
3. database schema and migration
4. seeded categories
5. reusable UI components
6. month aggregation utility functions
7. form validation
8. CRUD operations for transactions and recurring rules
9. polished but simple UI using Tailwind

Prefer maintainable, readable code over overengineering.

---

## Implementation Priorities

### Phase 1
- project scaffold
- database setup
- transaction and recurring rule models
- add transaction form
- monthly dashboard
- recurring logic

### Phase 2
- edit/delete actions
- recurring management page
- search and filters
- validation polish

### Phase 3
- tests
- empty states
- UI refinement
- seed/demo data

---

## Acceptance Criteria

The build is acceptable if:

- the user can create one-time income and expense entries
- the user can create recurring monthly income and expense rules
- recurring rules appear automatically in the correct months
- the user can view totals for any month
- the user can edit and delete entries
- the user can deactivate recurring rules
- data persists locally between app restarts
- the interface is easy to use and visually clean

---

## Final Build Instruction for Gemini CLI

Use this specification to generate a local-first personal finance tracker app with manual entry only. Focus on a stable MVP with recurring monthly transaction support handled dynamically at runtime rather than by duplicating monthly rows in the database.
