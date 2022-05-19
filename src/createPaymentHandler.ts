import {
  APIGatewayEventRequestContextV2, APIGatewayProxyResult, APIGatewayEvent}
  from "aws-lambda";

import { EventBridge } from "aws-sdk";

import {CreatePaymentRequest} from "./types";

const eventBridge = new EventBridge();

export const handlePaymentCreation = async (
  event: APIGatewayEvent,
  context: APIGatewayEventRequestContextV2
): Promise<APIGatewayProxyResult> => {

  const body: CreatePaymentRequest = JSON.parse(event.body || "{}");

  //TODO form validation on body

  const detail = {...body, id: context.requestId};

  const ev = await eventBridge.putEvents({
    Entries: [
      {
        Detail: JSON.stringify(detail),
        EventBusName: "payment-api-events",
        DetailType: "PaymentCreated",
        Source: body.paymentSource === "client" ? "app-payment-client" : "app-payment-vendor",
      },
    ],
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Payment created",
      event: ev,
      payment: detail,
    }),
  };
};
