import { redirect } from "next/navigation";

/** Сканирование только по `/scanning/[id]` после создания записи в БД. */
export default function ScanningLegacyPage() {
  redirect("/");
}
