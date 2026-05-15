export default async function TestPage() {
  // تأخیر مصنوعی برای تست Skeleton
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="text-xl font-bold text-emerald-600">
      صفحه تست لود شد ✔️
    </div>
  );
}
