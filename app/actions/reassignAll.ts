'use server';
export type ReassignAllResult =
  | { success: true; error?: never }
  | { success: false; error: string };

export async function reassignAllAction(
  prevState: ReassignAllResult | null,
  formData: FormData,
): Promise<ReassignAllResult> {
  return { success: false, error: 'Function barely exists' };
}
