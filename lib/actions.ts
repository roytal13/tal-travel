"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  DocumentCategory,
  Expense,
  ExpenseCategory,
  PackingCategory,
  PackingItem,
  TripDocument,
} from "@/lib/types";

/** Toggle a task done/open (persisted; RLS scopes to trip members). */
export async function setTaskDone(taskId: string, done: boolean) {
  const supabase = await createClient();
  await supabase
    .from("tasks")
    .update({
      status: done ? "done" : "open",
      completed_at: done ? new Date().toISOString() : null,
    })
    .eq("id", taskId);
}

/** Edit a task's title and category. */
export async function updateTask(
  taskId: string,
  input: { title: string; category: string | null }
) {
  const supabase = await createClient();
  await supabase
    .from("tasks")
    .update({ title: input.title, category: input.category })
    .eq("id", taskId);
}

/** Delete a task. */
export async function deleteTask(taskId: string) {
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", taskId);
}

/** Edit an expense. */
export async function updateExpense(
  expenseId: string,
  input: {
    category: ExpenseCategory;
    amount: number;
    currency: string;
    amountIls: number;
    description?: string;
  }
) {
  const supabase = await createClient();
  await supabase
    .from("expenses")
    .update({
      category: input.category,
      amount: input.amount,
      currency: input.currency,
      amount_ils: input.amountIls,
      description: input.description ?? null,
    })
    .eq("id", expenseId);
}

/** Delete an expense. */
export async function deleteExpense(expenseId: string) {
  const supabase = await createClient();
  await supabase.from("expenses").delete().eq("id", expenseId);
}

/** Edit a document's category, title, and expiry. */
export async function updateDocument(
  documentId: string,
  input: { category: DocumentCategory; title: string; expiryDate?: string | null }
) {
  const supabase = await createClient();
  await supabase
    .from("documents")
    .update({
      category: input.category,
      title: input.title,
      expiry_date: input.expiryDate ?? null,
    })
    .eq("id", documentId);
}

/** Delete a document (and its Storage file). */
export async function deleteDocument(documentId: string) {
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("documents")
    .select("trip_id, file_path")
    .eq("id", documentId)
    .maybeSingle();
  if (row?.file_path) {
    await supabase.storage.from("trip-documents").remove([row.file_path]);
  }
  await supabase.from("documents").delete().eq("id", documentId);
  if (row?.trip_id) revalidatePath(`/trips/${row.trip_id}/documents`);
}

/** Toggle a packing item packed/unpacked. */
export async function setPacked(itemId: string, packed: boolean) {
  const supabase = await createClient();
  await supabase.from("packing_items").update({ packed }).eq("id", itemId);
}

/** Add a packing item; returns the created row mapped to PackingItem. */
export async function addPackingItem(
  tripId: string,
  category: PackingCategory,
  name: string
): Promise<PackingItem | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("packing_items")
    .insert({ trip_id: tripId, category, name, packed: false })
    .select()
    .single();
  if (!data) return null;
  revalidatePath(`/trips/${tripId}/packing`);
  return {
    id: data.id,
    tripId,
    category: data.category,
    name: data.name,
    quantity: data.quantity ?? undefined,
    packed: data.packed ?? false,
  };
}

/** Add an expense; returns the created row mapped to Expense. */
export async function addExpense(
  tripId: string,
  input: {
    category: ExpenseCategory;
    amount: number;
    currency: string;
    amountIls: number;
    description?: string;
    expenseDate: string;
  }
): Promise<Expense | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("expenses")
    .insert({
      trip_id: tripId,
      category: input.category,
      amount: input.amount,
      currency: input.currency,
      amount_ils: input.amountIls,
      description: input.description ?? null,
      expense_date: input.expenseDate,
    })
    .select()
    .single();
  if (!data) return null;
  revalidatePath(`/trips/${tripId}/expenses`);
  return {
    id: data.id,
    tripId,
    category: data.category,
    amount: data.amount,
    currency: data.currency,
    amountIls: data.amount_ils ?? 0,
    description: data.description ?? undefined,
    expenseDate: data.expense_date,
  };
}

/** Insert a document row after its file is uploaded to Storage. */
export async function addDocument(
  tripId: string,
  input: {
    category: DocumentCategory;
    title: string;
    filePath: string;
    mimeType?: string;
    sizeBytes?: number;
  }
): Promise<TripDocument | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("documents")
    .insert({
      trip_id: tripId,
      uploaded_by: user?.id ?? null,
      category: input.category,
      title: input.title,
      file_path: input.filePath,
      mime_type: input.mimeType ?? null,
      file_size_bytes: input.sizeBytes ?? null,
    })
    .select()
    .single();
  if (!data) return null;
  const { data: signed } = await supabase.storage
    .from("trip-documents")
    .createSignedUrl(input.filePath, 3600);
  revalidatePath(`/trips/${tripId}/documents`);
  return {
    id: data.id,
    tripId,
    category: data.category,
    title: data.title,
    createdAt: data.created_at ?? undefined,
    filePath: input.filePath,
    mimeType: input.mimeType,
    fileUrl: signed?.signedUrl,
  };
}
