# Customer Support Chat System

A modern, real-time customer support chat application built with Next.js 15 and Supabase.

## Features

### Customer Features
- **Ticket Creation**: Create support tickets with subject, priority, and initial message
- **Real-time Chat**: Chat with support agents in real-time
- **Ticket History**: View all your support tickets and their status
- **Status Tracking**: Track ticket progress (open, in_progress, resolved, closed)

### Agent Features
- **Agent Dashboard**: Comprehensive ticket queue management
- **Ticket Assignment**: Assign tickets to yourself or view assigned tickets
- **Multi-ticket Management**: Handle multiple customer conversations
- **Ticket Status Management**: Update ticket status and close resolved issues
- **Real-time Messaging**: Instant messaging with customers

### Technical Features
- **Real-time Communication**: Powered by Supabase Realtime
- **Role-based Access Control**: Customer and agent roles with appropriate permissions
- **Responsive Design**: Works on desktop and mobile devices
- **Authentication**: Secure user authentication with Supabase Auth
- **Database Security**: Row Level Security (RLS) policies for data protection

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database by running the SQL schema in your Supabase project:
   ```bash
   # Copy the contents of supabase_schema.sql and run it in your Supabase SQL editor
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The application uses the following main tables:

- **user_profiles**: Extended user information with roles
- **support_tickets**: Customer support tickets
- **chat_messages**: Real-time chat messages

## User Roles

### Customer
- Can create support tickets
- Can chat with assigned agents
- Can view their own ticket history

### Agent
- Can view and manage all tickets
- Can assign tickets to themselves
- Can chat with customers
- Can update ticket status
- Can access agent dashboard

### Admin
- Same permissions as agents
- Can be extended for additional administrative features

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Real-time**: Supabase Realtime subscriptions

## Development

To run the application in development mode:

```bash
npm run dev
```

To build for production:

```bash
npm run build
npm start
```

## Features in Detail

### Real-time Messaging
Messages are delivered instantly using Supabase's real-time subscriptions. The chat interface automatically scrolls to new messages and shows typing indicators.

### Role-based Access
The application automatically routes users based on their role:
- Customers are directed to their support dashboard
- Agents are directed to the agent dashboard
- Cross-role navigation is available via the header

### Ticket Management
Tickets progress through states:
1. **Open**: New ticket awaiting assignment
2. **In Progress**: Agent assigned and actively working
3. **Resolved**: Issue resolved, pending customer confirmation
4. **Closed**: Ticket completed and archived

## Security

- Row Level Security (RLS) ensures users can only access their own data
- Agents can access tickets assigned to them or unassigned tickets
- All database operations are secured with appropriate policies
- Authentication is handled by Supabase Auth with secure session management