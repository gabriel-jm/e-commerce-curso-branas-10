import { Checkout } from "./checkout.ts";

Deno.serve(async (req: Request) => {
  const body = await req.json()

  try {
    const checkout = new Checkout()
    const result = await checkout.execute(body)
    const responseBody = JSON.stringify(result)

    return new Response(responseBody, {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    })
  } catch (error) {
    const responseBody = JSON.stringify({
      message: error.message
    })
    return new Response(responseBody, {
      status: 400,
      headers: {
        'content-type': 'application/json'
      }
    })
  }
})
