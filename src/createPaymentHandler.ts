import {
  APIGatewayEventRequestContextV2, APIGatewayProxyResult, APIGatewayEvent}
  from "aws-lambda";

import { EventBridge } from "aws-sdk";

const eventBridge = new EventBridge();

export const handlePaymentCreation = async (
  event: APIGatewayEvent,
  context: APIGatewayEventRequestContextV2
): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body || "{}");

  const ev = await eventBridge.putEvents({
    Entries: [
      {
        Detail: JSON.stringify({...body, id: context.requestId, requestId: context.requestId}),
        EventBusName: "payments",
        DetailType: "PaymentCreated",
        Source: body.source === "client" ? "app-payment-client" : "app-payment-vendor",
      },
    ],
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Payment created",
      event: ev,
    }),
  };
};
