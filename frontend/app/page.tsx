"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Todo = {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const statusLabels: Record<"all" | "open" | "done", string> = {
  all: "All",
  open: "Open",
  done: "Done",
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredTodos = useMemo(() => {
    if (filter === "open") {
      return todos.filter((todo) => !todo.completed);
    }
    if (filter === "done") {
      return todos.filter((todo) => todo.completed);
    }
    return todos;
  }, [filter, todos]);

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((todo) => todo.completed).length;
    return {
      total,
      done,
      open: Math.max(total - done, 0),
    };
  }, [todos]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/todos`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load todos.");
      }
      const data = (await res.json()) as Todo[];
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const createTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Please enter a title.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmed,
          description: description.trim() || null,
          completed: false,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to create todo.");
      }
      const created = (await res.json()) as Todo;
      setTodos((prev) => [created, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      setBusyId(todo.id);
      setError(null);
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to update todo.");
      }
      const updated = (await res.json()) as Todo;
      setTodos((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteTodo = async (todo: Todo) => {
    try {
      setBusyId(todo.id);
      setError(null);
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete todo.");
      }
      setTodos((prev) => prev.filter((item) => item.id !== todo.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff4df_0%,#f6f2ea_45%,#f0e7dc_100%)] px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-6 rounded-3xl border border-black/10 bg-[linear-gradient(135deg,#1d1a16,#3a2c23)] p-8 text-white shadow-[0_20px_60px_rgba(24,19,14,0.2)]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <Image
                src="/image.png"
                alt="Todo Tracker logo"
                width={60}
                height={60}
              />
              <span className="text-xs uppercase tracking-[0.4em] text-[#f6d1a5]">
                Todo Tracker
              </span>
              <h1 className="font-[--font-display)] text-4xl leading-tight md:text-5xl">
                Keep work moving,
                <br />
                one honest task at a time.
              </h1>
              <p className="max-w-xl text-sm text-[#f0e7dc] md:text-base">
                Fast, minimal, and anchored to a real API. Add a task, track its
                progress, and close the loop in seconds.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-[#f6d1a5]">
                Today
              </p>
              <p className="text-3xl font-semibold">{stats.open}</p>
              <p className="text-xs text-[#f0e7dc]">open tasks</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {(["all", "open", "done"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  filter === key
                    ? "border-[#f45d48] bg-[#f45d48] text-white"
                    : "border-white/20 text-white/80 hover:border-white/60 hover:text-white"
                }`}
              >
                {statusLabels[key]}
              </button>
            ))}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <form
            onSubmit={createTodo}
            className="rounded-3xl border border-black/10 bg-[--surface)] p-6 shadow-[0_18px_40px_rgba(24,19,14,0.08)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-[--font-display)] text-2xl">
                Add a new task
              </h2>
              <span className="rounded-full bg-[#f45d48]/10 px-3 py-1 text-xs font-semibold text-[#c63a28]">
                API connected
              </span>
            </div>
            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-[--ink-muted)]">
                Title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Draft quarterly roadmap"
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-[--foreground)] shadow-[0_10px_24px_rgba(24,19,14,0.08)] focus:border-[#f45d48] focus:outline-none focus:ring-2 focus:ring-[#f45d48]/30"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-[--ink-muted)]">
                Details
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  placeholder="Align key milestones with engineering."
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-[--foreground)] shadow-[0_10px_24px_rgba(24,19,14,0.08)] focus:border-[#f45d48] focus:outline-none focus:ring-2 focus:ring-[#f45d48]/30"
                />
              </label>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[--ink-muted)]">
                {stats.done} done · {stats.open} open
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-[#f45d48] px-6 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(244,93,72,0.4)] transition hover:-translate-y-0.5 hover:bg-[#c63a28] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Add todo"}
              </button>
            </div>
            {error ? (
              <p className="mt-4 rounded-2xl border border-[#f45d48]/30 bg-[#f45d48]/10 px-4 py-3 text-sm text-[#c63a28]">
                {error}
              </p>
            ) : null}
          </form>

          <aside className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-[0_18px_40px_rgba(24,19,14,0.08)] backdrop-blur">
            <h3 className="font-[--font-display)] text-xl">
              System status
            </h3>
            <div className="mt-4 grid gap-4">
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(24,19,14,0.06)]">
                <p className="text-xs uppercase tracking-[0.3em] text-[--ink-muted)]">
                  Backend API
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {loading ? "Syncing..." : "Connected"}
                </p>
                <p className="text-xs text-[--ink-muted)]">
                  {API_URL}/todos
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#1d1a16] px-4 py-4 text-white shadow-[0_12px_30px_rgba(24,19,14,0.25)]">
                <p className="text-xs uppercase tracking-[0.3em] text-[#f6d1a5]">
                  Output
                </p>
                <p className="mt-2 text-3xl font-semibold">{stats.total}</p>
                <p className="text-xs text-[#f0e7dc]">total tasks</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(24,19,14,0.06)]">
                <p className="text-xs uppercase tracking-[0.3em] text-[--ink-muted)]">
                  Completed
                </p>
                <p className="mt-2 text-lg font-semibold">{stats.done}</p>
                <p className="text-xs text-[--ink-muted)]">
                  tasks closed
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(24,19,14,0.1)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-[--font-display)] text-2xl">
              Task board
            </h2>
            <div className="text-sm text-[--ink-muted)]">
              {filter === "all"
                ? "All tasks"
                : filter === "open"
                  ? "Only open tasks"
                  : "Only completed tasks"}
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-black/20 bg-white px-6 py-10 text-center text-sm text-[--ink-muted)]">
                Loading todos…
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/20 bg-white px-6 py-10 text-center text-sm text-[--ink-muted)]">
                No tasks here yet. Add one to get moving.
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <article
                  key={todo.id}
                  className={`flex flex-col gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-[0_12px_30px_rgba(24,19,14,0.06)] transition ${
                    todo.completed ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleTodo(todo)}
                          disabled={busyId === todo.id}
                          className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${
                            todo.completed
                              ? "border-[#1d1a16] bg-[#1d1a16] text-white"
                              : "border-black/15 bg-white text-[#1d1a16] hover:border-[#f45d48] hover:text-[#f45d48]"
                          }`}
                        >
                          {todo.completed ? "✓" : "○"}
                        </button>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {todo.title}
                          </h3>
                          {todo.description ? (
                            <p className="text-sm text-[--ink-muted)]">
                              {todo.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[--ink-muted)]">
                        {todo.completed ? "Completed" : "In progress"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteTodo(todo)}
                      disabled={busyId === todo.id}
                      className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[--ink-muted)] transition hover:border-[#f45d48] hover:text-[#f45d48] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
