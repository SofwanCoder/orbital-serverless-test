import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda/trigger/api-gateway-proxy";

import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handleVendorPaymentProcessing = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const {
    body
  } = event;

  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing body"
      })
    };
  }

  const payment = JSON.parse(body);

  await savePayment(payment, "vendor");

  return {
    statusCode: 200,
    body: JSON.stringify(payment)
  };
};


export const handleClientPaymentProcessing = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const {
    body
  } = event;

  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing body"
      })
    };
  }

  const payment = JSON.parse(body);

  await savePayment(payment, "client");

  return {
    statusCode: 200,
    body: JSON.stringify(payment)
  };
};


async function savePayment(payment: Record<string, string>, processedBy: "vendor" | "client") {
  await dynamoDb.put({
    TableName: "payment-api-test",
    Item: {
      id: payment.id,
      paymentSource: payment.source,
      destination: payment.destination,
      currency: payment.currency,
      amount: payment.amount,
      requestId: payment.id,
      processedBy: `${processedBy}Handler`
    }
  }).promise()
}
