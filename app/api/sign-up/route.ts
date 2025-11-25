import { signUp } from "@/lib/actions/auth.actions";

export async function POST(req: Request) {
  const data = await req.json();
  const result = await signUp(data);
  return Response.json(result);
}
