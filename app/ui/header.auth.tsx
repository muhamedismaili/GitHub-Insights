import { auth, signIn, signOut } from "@/auth";

export default async function HeaderAuth() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("github");
          
        }}
        className="m-0"
      >
        <button
          type="submit"
          className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white"
        >
          Sign in
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <img
        src={session.user.image ?? ""}
        alt={session.user.name ?? "User"}
        className="h-7 w-7 rounded-full"
      />
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}