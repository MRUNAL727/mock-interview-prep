export async function POST(req: Request) {
  const { username, userId } = await req.json();

  const response = await fetch("https://api.vapi.ai/call/web", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN}`, // Use your PRIVATE key here
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, // Explicitly use workflowId
      assistantOverrides: {
        variableValues: {
          username: username,
          userid: userId,
        },
      },
      // ... other parameters like phoneNumberId if applicable
    }),
  });

  if (response.ok) {
    const call = await response.json();
    //   res.status(200).json({ call });
    return Response.json(call);
  } else {
    // Handle Vapi API error responses
    const errorData = await response.json();
    return Response.json(
      { message: "Failed to start call with Vapi API", error: errorData },
      { status: response.status },
    );
    //   res.status(response.status).json({ message: 'Failed to start call with Vapi API' });
  }
}
