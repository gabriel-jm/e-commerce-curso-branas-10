import { createOrder } from "./create-order.ts";

Deno.serve(async (req: Request) => {
  const body = await req.json()

  try {
    const finalPrice = createOrder(body)
    const responseBody = JSON.stringify({
      total: finalPrice
    })

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
