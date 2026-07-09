import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const responseId = Number(id);
  if (!Number.isInteger(responseId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const sql = getSql();
  await sql`DELETE FROM responses WHERE id = ${responseId}`;

  return NextResponse.json({ ok: true });
}
