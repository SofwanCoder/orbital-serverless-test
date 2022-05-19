import {EventBridgeEvent, APIGatewayProxyResult} from "aws-lambda";

import { DynamoDB } from "aws-sdk";
import {TDetail, PaymentSource} from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

export const handleVendorPaymentProcessing = async (
  event: EventBridgeEvent<string, TDetail>
): Promise<APIGatewayProxyResult> => {
  const {
    detail: payment,
  } = event;


  await savePayment(payment, "vendor");

  return {
    statusCode: 200,
    body: JSON.stringify(payment)
  };
};


export const handleClientPaymentProcessing = async (
  event: EventBridgeEvent<string, TDetail>
): Promise<APIGatewayProxyResult> => {

  const {
    detail: payment,
  } = event;

  await savePayment(payment, "client");

  return {
    statusCode: 200,
    body: JSON.stringify(payment)
  };
};


async function savePayment(payment: TDetail, processedBy: PaymentSource) {
  await dynamoDb.put({
    TableName: "payment-api-table",
    Item: {
      id: payment.id,
      source: payment.paymentSource,
      destination: payment.destination,
      currency: payment.currency,
      amount: payment.amount,
      processedBy: `${processedBy}Handler`
    }
  }).promise()
}
