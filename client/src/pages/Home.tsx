import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertUserSchema } from "@shared/schema";
import { Database, Archive, FileText, User, Search, Settings, CheckCircle, AlertCircle, Download, Wrench } from "lucide-react";

// Extended schema for front-end validation
const userFormSchema = insertUserSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Extended schema for notes
const noteFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(1, "Content is required"),
  isImportant: z.boolean().default(false),
});

type UserFormValues = z.infer<typeof userFormSchema>;
type NoteFormValues = z.infer<typeof noteFormSchema>;

export default function Home() {
  const [activeTab, setActiveTab] = useState("introduction");

  // Form for creating users
  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Form for creating notes
  const noteForm = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
      isImportant: false,
    },
  });

  // Fetch users
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/users"],
  });

  // Fetch notes
  const { data: notes = [], isLoading: isLoadingNotes } = useQuery({
    queryKey: ["/api/notes"],
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormValues) => {
      return apiRequest("POST", "/api/users", data);
    },
    onSuccess: () => {
      toast({
        title: "User created",
        description: "The user has been created successfully.",
      });
      userForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error) => {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (data: NoteFormValues) => {
      return apiRequest("POST", "/api/notes", data);
    },
    onSuccess: () => {
      toast({
        title: "Note created",
        description: "The note has been created successfully.",
      });
      noteForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
    onError: (error) => {
      toast({
        title: "Error creating note",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle user form submission
  const onUserSubmit = (data: UserFormValues) => {
    createUserMutation.mutate(data);
  };

  // Handle note form submission
  const onNoteSubmit = (data: NoteFormValues) => {
    createNoteMutation.mutate(data);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="text-primary h-6 w-6" />
            <h1 className="text-xl font-semibold">Drizzle ORM with SQLite Guide</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#introduction" className="text-gray-600 hover:text-primary">Documentation</a>
            <a href="https://github.com/drizzle-team/drizzle-orm" className="text-gray-600 hover:text-primary" target="_blank" rel="noopener noreferrer">GitHub</a>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0 md:sticky md:top-24 h-full">
          <nav className="mb-8 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Contents</h2>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#introduction" 
                  className={`flex items-center ${activeTab === "introduction" ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
                  onClick={() => setActiveTab("introduction")}
                >
                  <span className="material-icons text-sm mr-2">arrow_right</span>
                  Introduction
                </a>
              </li>
              <li>
                <a 
                  href="#installation" 
                  className={`flex items-center ${activeTab === "installation" ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
                  onClick={() => setActiveTab("installation")}
                >
                  <span className="material-icons text-sm mr-2">arrow_right</span>
                  Installation
                </a>
              </li>
              <li>
                <a 
                  href="#database-setup" 
                  className={`flex items-center ${activeTab === "database-setup" ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
                  onClick={() => setActiveTab("database-setup")}
                >
                  <span className="material-icons text-sm mr-2">arrow_right</span>
                  Database Setup
                </a>
              </li>
              <li>
                <a 
                  href="#schema-definition" 
                  className={`flex items-center ${activeTab === "schema-definition" ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
                  onClick={() => setActiveTab("schema-definition")}
                >
                  <span className="material-icons text-sm mr-2">arrow_right</span>
                  Schema Definition
                </a>
              </li>
              <li>
                <a 
                  href="#migrations" 
                  className={`flex items-center ${activeTab === "migrations" ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
                  onClick={() => setActiveTab("migrations")}
                >
                  <span className="material-icons text-sm mr-2">arrow_right</span>
                  Migrations
                </a>
              </li>
              <li>
                <a 
                  href="#crud-operations" 
                  className={`flex items-center ${activeTab === "crud-operations" ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
                  onClick={() => setActiveTab("crud-operations")}
                >
                  <span className="material-icons text-sm mr-2">arrow_right</span>
                  CRUD Operations
                </a>
              </li>
              <li>
                <a 
                  href="#querying" 
                  className={`flex items-center ${activeTab === "querying" ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
                  onClick={() => setActiveTab("querying")}
                >
                  <span className="material-icons text-sm mr-2">arrow_right</span>
                  Querying Data
                </a>
              </li>
              <li>
                <a 
                  href="#error-handling" 
                  className={`flex items-center ${activeTab === "error-handling" ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
                  onClick={() => setActiveTab("error-handling")}
                >
                  <span className="material-icons text-sm mr-2">arrow_right</span>
                  Error Handling
                </a>
              </li>
            </ul>
          </nav>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://orm.drizzle.team/docs/overview" className="flex items-center text-gray-600 hover:text-primary" target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  Drizzle Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/drizzle-team/drizzle-orm" className="flex items-center text-gray-600 hover:text-primary" target="_blank" rel="noopener noreferrer">
                  <Archive className="h-4 w-4 mr-2" />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://discord.com/invite/z7yA6SSC7a" className="flex items-center text-gray-600 hover:text-primary" target="_blank" rel="noopener noreferrer">
                  <User className="h-4 w-4 mr-2" />
                  Community Discord
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-8">
          {/* Introduction Section */}
          <section id="introduction" className="mb-12">
            <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-lg text-white mb-6">
              <h2 className="text-2xl font-bold mb-4">Getting Started with Drizzle ORM and SQLite</h2>
              <p className="text-white/90 mb-6">
                Drizzle ORM is a TypeScript ORM for SQL databases designed with maximum type safety in mind. This guide will walk you through setting up Drizzle with SQLite and implementing basic database operations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">Start Tutorial</Button>
                <Button variant="outline" className="bg-white/20 text-white hover:bg-white/30">View on GitHub</Button>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Why Drizzle ORM?</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <CheckCircle className="text-primary h-5 w-5" />
                    <h4 className="font-medium mt-2 mb-1">Type Safety</h4>
                    <p className="text-sm text-gray-600">End-to-end type safety with no code generation needed</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <Settings className="text-primary h-5 w-5" />
                    <h4 className="font-medium mt-2 mb-1">Performance</h4>
                    <p className="text-sm text-gray-600">Lightweight with minimal overhead compared to other ORMs</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <FileText className="text-primary h-5 w-5" />
                    <h4 className="font-medium mt-2 mb-1">SQL-like Syntax</h4>
                    <p className="text-sm text-gray-600">Query builder with syntax similar to SQL for familiarity</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Drizzle ORM provides a balance between type safety and developer experience. It works with various SQL databases, including SQLite, which makes it perfect for both development and production environments.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Installation Section */}
          <section id="installation" className="mb-12">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Download className="text-primary mr-2 h-5 w-5" />
                  Installation
                </h2>
                
                <p className="mb-4">To get started with Drizzle ORM and SQLite, you'll need to install the required dependencies:</p>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm mb-4">
                  <pre>npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3</pre>
                </div>

                <div className="bg-blue-50 border-l-4 border-primary p-4 my-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="text-primary h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-primary">Note</h3>
                      <div className="text-sm text-blue-700">
                        <p><code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800">drizzle-orm</code> is the core ORM package, while <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800">better-sqlite3</code> is a SQLite driver. <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800">drizzle-kit</code> provides migration tools.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mb-4">Create a basic project structure to organize your database code:</p>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm">
                  <pre>mkdir -p src/db
touch src/db/index.ts
touch src/db/schema.ts
touch drizzle.config.ts</pre>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Database Setup Section */}
          <section id="database-setup" className="mb-12">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Wrench className="text-primary mr-2 h-5 w-5" />
                  Database Setup
                </h2>
                
                <p className="mb-4">First, let's create a database connection in <code className="bg-gray-100 px-1 py-0.5 rounded">src/db/index.ts</code>:</p>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm mb-4">
                  <pre>{`import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Initialize SQLite database
const sqlite = new Database('sqlite.db');

// Initialize Drizzle ORM
export const db = drizzle(sqlite, { schema });

// Export for use in other files
export default db;`}</pre>
                </div>

                <div className="bg-yellow-50 border-l-4 border-warning p-4 my-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="text-yellow-500 h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-700">Important</h3>
                      <div className="text-sm text-yellow-700">
                        <p>Make sure the database file path is accessible and your application has write permissions to the location. For production, consider using environment variables for the database path.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mb-4">Next, let's set up the Drizzle configuration file in <code className="bg-gray-100 px-1 py-0.5 rounded">drizzle.config.ts</code> for migrations:</p>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm mb-4">
                  <pre>{`import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: 'sqlite.db',
  },
} satisfies Config;`}</pre>
                </div>

                <p className="mb-4">Add scripts to your <code className="bg-gray-100 px-1 py-0.5 rounded">package.json</code> file:</p>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm">
                  <pre>{`{
  "scripts": {
    "db:generate": "drizzle-kit generate:sqlite",
    "db:migrate": "node -r ts-node/register src/db/migrate.ts",
    "db:studio": "drizzle-kit studio"
  }
}`}</pre>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Schema Definition Section */}
          <section id="schema-definition" className="mb-12">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Database className="text-primary mr-2 h-5 w-5" />
                  Schema Definition
                </h2>
                
                <p className="mb-4">Now, let's define our database schema:</p>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm mb-4">
                  <pre>{`import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Define a users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
});

// Define a notes table with a relation to users
export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  isImportant: integer('is_important', { mode: 'boolean' }).notNull().default(false),
  userId: integer('user_id').notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Define types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;`}</pre>
                </div>

                <div className="bg-blue-50 border-l-4 border-primary p-4 my-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="text-primary h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-primary">Type Safety</h3>
                      <div className="text-sm text-blue-700">
                        <p>Drizzle provides type inference with <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800">$inferSelect</code> and <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800">$inferInsert</code> utilities. These give you type-safe access to your database schema throughout your application.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CRUD Operations Section */}
          <section id="crud-operations" className="mb-12">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Settings className="text-primary mr-2 h-5 w-5" />
                  CRUD Operations
                </h2>

                <Tabs defaultValue="create">
                  <TabsList className="mb-4">
                    <TabsTrigger value="create">Create</TabsTrigger>
                    <TabsTrigger value="read">Read</TabsTrigger>
                    <TabsTrigger value="update">Update</TabsTrigger>
                    <TabsTrigger value="delete">Delete</TabsTrigger>
                  </TabsList>

                  <TabsContent value="create" className="mt-4">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-4">Create a User</h3>
                      <Form {...userForm}>
                        <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                          <FormField
                            control={userForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={userForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Enter password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={createUserMutation.isPending}>
                            {createUserMutation.isPending ? "Creating..." : "Create User"}
                          </Button>
                        </form>
                      </Form>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Create a Note</h3>
                      <Form {...noteForm}>
                        <form onSubmit={noteForm.handleSubmit(onNoteSubmit)} className="space-y-4">
                          <FormField
                            control={noteForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter note title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={noteForm.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Enter note content" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={noteForm.control}
                            name="isImportant"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Mark as important</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={createNoteMutation.isPending}>
                            {createNoteMutation.isPending ? "Creating..." : "Create Note"}
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </TabsContent>

                  <TabsContent value="read">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-4">Users</h3>
                      {isLoadingUsers ? (
                        <p>Loading users...</p>
                      ) : users.length > 0 ? (
                        <div className="border rounded-md overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {users.map((user: any) => (
                                <tr key={user.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p>No users found. Create one above.</p>
                      )}
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Notes</h3>
                      {isLoadingNotes ? (
                        <p>Loading notes...</p>
                      ) : notes.length > 0 ? (
                        <div className="grid gap-4">
                          {notes.map((note: any) => (
                            <Card key={note.id}>
                              <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-lg font-medium">{note.title}</h4>
                                    <p className="text-sm text-gray-600">By User ID: {note.userId}</p>
                                  </div>
                                  {note.isImportant && (
                                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Important</Badge>
                                  )}
                                </div>
                                <p className="mt-2">{note.content}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  Created at: {new Date(note.createdAt).toLocaleString()}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p>No notes found. Create one above.</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="update">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">Update Operations</h3>
                      <p>Example code for updating a user:</p>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm my-4">
                        <pre>{`// Update user
export async function updateUser(id: number, data: Partial<Omit<typeof users.$inferInsert, 'id'>>) {
  return await db.update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
}

// Example usage
const updatedUser = await updateUser(1, { username: 'newUsername' });`}</pre>
                      </div>

                      <p>Example code for updating a note:</p>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm my-4">
                        <pre>{`// Update note
export async function updateNote(id: number, data: Partial<Omit<typeof notes.$inferInsert, 'id'>>) {
  return await db.update(notes)
    .set(data)
    .where(eq(notes.id, id))
    .returning();
}

// Example usage
const updatedNote = await updateNote(1, { 
  title: 'Updated Note Title',
  content: 'This note has been updated...',
  isImportant: true
});`}</pre>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="delete">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">Delete Operations</h3>
                      <p>Example code for deleting a user:</p>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm my-4">
                        <pre>{`// Delete a user
export async function deleteUser(id: number) {
  return await db.delete(users)
    .where(eq(users.id, id))
    .returning();
}

// Example usage
const deletedUser = await deleteUser(1);`}</pre>
                      </div>

                      <p>Example code for deleting a note:</p>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm my-4">
                        <pre>{`// Delete a note
export async function deleteNote(id: number) {
  return await db.delete(notes)
    .where(eq(notes.id, id))
    .returning();
}

// Delete all notes by a user
export async function deleteUserNotes(userId: number) {
  return await db.delete(notes)
    .where(eq(notes.userId, userId));
}

// Example usage
const deletedNote = await deleteNote(1);
const deletedUserNotes = await deleteUserNotes(1);`}</pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Querying Data Section */}
          <section id="querying" className="mb-12">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Search className="text-primary mr-2 h-5 w-5" />
                  Querying Data
                </h2>
                
                <p className="mb-4">Drizzle ORM provides a powerful and type-safe query builder:</p>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm mb-4">
                  <pre>{`// Filter notes by title and importance
export async function searchNotes(titleQuery: string, importantOnly: boolean = false) {
  let query = db.select().from(notes);
  
  // Add conditions
  const conditions = [];
  
  if (titleQuery) {
    conditions.push(like(notes.title, \`%\${titleQuery}%\`));
  }
  
  if (importantOnly) {
    conditions.push(eq(notes.isImportant, true));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  // Order by creation date, newest first
  query = query.orderBy(desc(notes.createdAt));
  
  return await query;
}

// Pagination example
export async function getPaginatedNotes(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;
  
  // Get notes with pagination
  const paginatedNotes = await db.select()
    .from(notes)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(notes.createdAt));
  
  // Get total count for pagination info
  const countResult = await db.select({ count: sql<number>\`count(*)\` })
    .from(notes);
  
  const total = countResult[0].count;
  
  return {
    data: paginatedNotes,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

// Join example - get notes with author info
export async function getNotesWithUsers() {
  return await db.select({
    note: {
      id: notes.id,
      title: notes.title,
      content: notes.content,
      isImportant: notes.isImportant,
      createdAt: notes.createdAt
    },
    user: {
      id: users.id,
      username: users.username
    }
  })
  .from(notes)
  .innerJoin(users, eq(notes.userId, users.id))
  .orderBy(desc(notes.createdAt));
}`}</pre>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Performance Tip</h3>
                      <div className="text-sm text-green-700">
                        <p>Always include the necessary conditions in your queries to limit the result set. For large datasets, consider implementing pagination and proper indexing in your schema.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Error Handling Section */}
          <section id="error-handling" className="mb-12">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertCircle className="text-primary mr-2 h-5 w-5" />
                  Error Handling
                </h2>
                
                <p className="mb-4">Proper error handling is essential when working with databases:</p>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm mb-4">
                  <pre>{`// Custom error classes
export class DatabaseError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends DatabaseError {
  constructor(resource: string, id: number | string) {
    super(\`\${resource} with ID \${id} not found\`);
    this.name = 'NotFoundError';
  }
}

export class UniqueConstraintError extends DatabaseError {
  constructor(field: string) {
    super(\`Value for \${field} already exists\`);
    this.name = 'UniqueConstraintError';
  }
}

// Safe wrapper for database operations
export async function tryCatch<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    // Handle SQLite-specific errors
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      if (message.includes('unique constraint')) {
        // Extract field name from error message
        const field = message.includes('username') ? 'username' : 'unknown field';
        throw new UniqueConstraintError(field);
      }
      
      throw new DatabaseError('Database operation failed', error);
    }
    
    throw new DatabaseError('Unknown database error', error);
  }
}

// Example usage with error handling
export async function safeGetUserById(id: number) {
  return await tryCatch(async () => {
    const result = await db.select().from(users).where(eq(users.id, id));
    const user = result[0];
    
    if (!user) {
      throw new NotFoundError('User', id);
    }
    
    return user;
  });
}`}</pre>
                </div>

                <div className="bg-blue-50 border-l-4 border-primary p-4 my-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="text-primary h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-primary">Best Practice</h3>
                      <div className="text-sm text-blue-700">
                        <p>Create a centralized error handling system that logs errors properly, translates database errors into user-friendly messages, and maintains consistent error responses across your application.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Next Steps */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
              
              <p className="mb-4">Now that you've set up Drizzle ORM with SQLite, you can:</p>
              
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Expand your schema with more tables and relationships</li>
                <li>Implement more complex queries with joins and subqueries</li>
                <li>Add indexes to optimize query performance</li>
                <li>Integrate with your web framework of choice (Express, Next.js, etc.)</li>
                <li>Implement proper authentication and authorization</li>
              </ul>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-primary text-white">Drizzle Documentation</Button>
                <Button variant="outline" className="bg-white text-primary border-primary hover:bg-blue-50">Example Repository</Button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Drizzle ORM</h3>
              <p className="text-gray-300">A TypeScript ORM for SQL databases with a focus on type safety and developer experience.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="https://orm.drizzle.team/docs/overview" className="text-gray-300 hover:text-white">Documentation</a></li>
                <li><a href="https://github.com/drizzle-team/drizzle-orm" className="text-gray-300 hover:text-white">GitHub</a></li>
                <li><a href="https://discord.com/invite/z7yA6SSC7a" className="text-gray-300 hover:text-white">Discord Community</a></li>
                <li><a href="https://orm.drizzle.team/blog" className="text-gray-300 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates.</p>
              <div className="flex">
                <Input type="email" placeholder="Your email" className="rounded-l-md rounded-r-none" />
                <Button className="rounded-l-none">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>© 2023 Drizzle ORM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
